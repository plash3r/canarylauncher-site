import React, { createContext, useContext, useLayoutEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { translations } from './translations';

const PreferencesContext = createContext(null);
const readSaved = (key, valid, fallback) => {
  try { const saved = localStorage.getItem(key); return valid.includes(saved) ? saved : fallback; } catch { return fallback; }
};
const save = (key, value) => { try { localStorage.setItem(key, value); } catch { /* Preferences still work when storage is unavailable. */ } };
const interpolate = (value, params = {}) => value.replace(/\{(\w+)\}/g, (match, key) => params[key] ?? match);

// On browsers without View Transitions, preserve the old appearance in an inert
// overlay and grow a circular opening through it. No focusable duplicate UI.
function makeSnapshot() {
  const source = document.querySelector('.site-shell');
  const clone = source.cloneNode(true);
  const properties = ['color', 'background-color', 'background-image', 'border-color', 'box-shadow', 'filter', 'fill', 'stroke'];
  const originals = [source, ...source.querySelectorAll('*')];
  const copies = [clone, ...clone.querySelectorAll('*')];
  originals.forEach((element, index) => {
    const computed = getComputedStyle(element);
    properties.forEach(property => copies[index].style.setProperty(property, computed.getPropertyValue(property)));
    copies[index].style.setProperty('transition', 'none');
    copies[index].style.setProperty('animation', 'none');
    copies[index].removeAttribute('id');
    if (copies[index].tagName === 'BUTTON') copies[index].disabled = true;
  });
  clone.style.position = 'relative';
  clone.style.transform = `translateY(-${window.scrollY}px)`;
  const header = clone.querySelector('.site-header');
  const spacer = document.createElement('div');
  spacer.style.height = `${source.querySelector('.site-header').getBoundingClientRect().height}px`;
  header.after(spacer);
  Object.assign(header.style, { position: 'absolute', top: `${window.scrollY}px`, left: '0', right: '0' });
  const overlay = document.createElement('div');
  overlay.className = 'theme-snapshot';
  overlay.setAttribute('aria-hidden', 'true');
  overlay.inert = true;
  overlay.append(clone);
  document.body.append(overlay);
  return overlay;
}

export function PreferencesProvider({ children }) {
  const [theme, setTheme] = useState(() => readSaved('canary-theme', ['dark', 'light'], 'dark'));
  const [language, setLanguage] = useState(() => readSaved('canary-language', ['ru', 'en'], navigator.language?.toLowerCase().startsWith('ru') ? 'ru' : 'en'));
  const [changingTheme, setChangingTheme] = useState(false);
  const transitionLock = useRef(false);
  const copy = translations[language];
  const t = (key, params) => interpolate(key.split('.').reduce((value, part) => value[part], copy), params);

  useLayoutEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#06080d' : '#fbf8f2');
    save('canary-theme', theme);
  }, [theme]);
  useLayoutEffect(() => { document.documentElement.lang = language; save('canary-language', language); }, [language]);

  async function toggleTheme(event) {
    if (transitionLock.current) return;
    transitionLock.current = true;
    const trigger = event.currentTarget;
    const restoreFocus = document.activeElement === trigger;
    setChangingTheme(true);
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    const rect = trigger.getBoundingClientRect();
    const x = event.detail ? event.clientX : rect.left + rect.width / 2;
    const y = event.detail ? event.clientY : rect.top + rect.height / 2;
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    let snapshot;
    try {
      if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
        setTheme(nextTheme);
      } else if (typeof document.startViewTransition === 'function') {
        const transition = document.startViewTransition(() => flushSync(() => setTheme(nextTheme)));
        await transition.ready;
        const animation = document.documentElement.animate({ clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] }, { duration: 620, easing: 'cubic-bezier(.22,.8,.25,1)', pseudoElement: '::view-transition-new(root)' });
        await animation.finished;
        await transition.finished;
      } else {
        snapshot = makeSnapshot();
        flushSync(() => setTheme(nextTheme));
        await new Promise(resolve => {
          const start = performance.now();
          const frame = now => {
            const progress = Math.min((now - start) / 620, 1);
            const currentRadius = radius * (1 - Math.pow(1 - progress, 3));
            const mask = `radial-gradient(circle at ${x}px ${y}px, transparent ${currentRadius}px, black ${currentRadius + 1}px)`;
            snapshot.style.maskImage = mask;
            snapshot.style.webkitMaskImage = mask;
            if (progress < 1) requestAnimationFrame(frame); else resolve();
          };
          requestAnimationFrame(frame);
        });
      }
    } catch {
      setTheme(nextTheme);
    } finally {
      snapshot?.remove();
      transitionLock.current = false;
      setChangingTheme(false);
      if (restoreFocus) requestAnimationFrame(() => {
        if (trigger.isConnected && (document.activeElement === document.body || document.activeElement === trigger)) trigger.focus({ preventScroll: true });
      });
    }
  }

  return <PreferencesContext.Provider value={{ theme, language, copy, t, changingTheme, toggleTheme, toggleLanguage: () => setLanguage(value => value === 'ru' ? 'en' : 'ru') }}>{children}</PreferencesContext.Provider>;
}

export const usePreferences = () => useContext(PreferencesContext);
