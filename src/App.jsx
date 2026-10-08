import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowDown, ArrowDownToLine, ArrowLeft, ArrowRight, Check, ChevronDown, Layers3, Library, Package, Search, Settings2, ShieldCheck, Sparkles, Zap, Sun, Moon, Languages } from 'lucide-react';
import ScreenshotGallery from './ScreenshotGallery';
import { windowsRelease } from './release';
import { freshAssetUrl } from './freshAssetUrl';
import DiscordIcon from './DiscordIcon';
import { usePreferences } from './Preferences';

const asset = path => `${import.meta.env.BASE_URL}${path}`;
const readPage = () => ['home', 'about', 'download'].includes(window.location.hash.slice(1)) ? window.location.hash.slice(1) : 'home';
const featureIcons = [Zap, Package, Settings2];
const aboutIcons = [Search, Library, Layers3, Sparkles];

function Background() {
  return <div className="ambient" aria-hidden="true"><div className="ambient-glow" /><div className="ambient-grid" />{Array.from({ length: 14 }, (_, index) => <span key={index} className="particle" style={{ left: `${(index * 37 + 9) % 100}%`, top: `${(index * 23 + 11) % 100}%`, animationDelay: `${index * -.9}s`, animationDuration: `${18 + index % 6}s` }} />)}</div>;
}

function Navigation({ currentPage }) {
  const { copy, language, theme, toggleTheme, toggleLanguage, changingTheme } = usePreferences();
  const themeLabel = theme === 'dark' ? copy.settings.light : copy.settings.dark;
  return <header className="site-header"><nav className="container header-inner" aria-label={copy.common.nav}>
    <a className="brand-link" href="#home" aria-label={copy.common.brand}><img src={asset('brand/canary-bird-white.png')} alt="" width="48" height="48" /></a>
    <div className="header-actions">
      <button type="button" className="header-tool theme-toggle" onClick={toggleTheme} disabled={changingTheme} aria-label={themeLabel} title={themeLabel} aria-pressed={theme === 'light'}>{theme === 'dark' ? <Sun size={19} /> : <Moon size={19} />}</button>
      <button type="button" className="header-tool language-toggle" onClick={toggleLanguage} aria-label={copy.settings.language} title={copy.settings.language}><Languages size={17} /><span aria-hidden="true">{language.toUpperCase()}</span></button>
      <a className="button button-small button-primary header-download" href="#download" aria-current={currentPage === 'download' ? 'page' : undefined}><ArrowDownToLine size={16} /><span>{copy.common.download}</span><ArrowRight size={16} /></a>
    </div>
  </nav></header>;
}

function FeatureCards() {
  const [expanded, setExpanded] = useState(null);
  const { copy } = usePreferences();
  return <div className="feature-grid">{copy.features.map((feature, index) => { const Icon = featureIcons[index]; return <article className={`feature-card ${expanded === index ? 'is-expanded' : ''}`} key={index}>
    <button className="feature-toggle" aria-expanded={expanded === index} aria-controls={`feature-${index}`} onClick={() => setExpanded(expanded === index ? null : index)}>
      <span className="icon-tile"><Icon size={25} strokeWidth={1.6} /></span><span className="feature-text"><span className="feature-title">{feature.title}</span><span className="feature-description">{feature.description}</span></span><ChevronDown size={17} className="feature-chevron" />
    </button>
    <div id={`feature-${index}`} className="feature-detail" hidden={expanded !== index}><p>{feature.detail}</p></div>
  </article>; })}</div>;
}

function HomePage() {
  const { copy } = usePreferences();
  const hero = copy.hero;
  return <>
    <section className="hero container">
      <span className="eyebrow"><span className="status-dot" />{hero.eyebrow}</span>
      <h1 className="hero-logo"><span className="sr-only">{hero.name}</span><img src={asset('brand/canary-white.png')} alt="" width="2172" height="724" fetchPriority="high" /></h1>
      <h2>{hero.heading} <span className="amber-text">{hero.accent}</span></h2>
      <p className="hero-description">{hero.description}<br className="desktop-break" />{hero.descriptionSecond}</p>
      <div className="hero-actions"><a href="#download" className="button button-primary"><ArrowDownToLine size={19} />{hero.download}<ArrowRight size={18} /></a><a href="#about" className="button button-secondary">{hero.explore}<ArrowRight size={18} /></a></div>
      <p className="hero-meta"><span><ShieldCheck size={14} />{hero.tagline}</span><span className="meta-divider" /><span>Windows · v{windowsRelease.version}</span></p>
      <a className="scroll-link" href="#inside" onClick={event => { event.preventDefault(); document.getElementById('inside')?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' }); }}><span>{hero.closer}</span><ArrowDown size={16} /></a>
    </section>
    <section className="container features-section" aria-label={hero.features}><FeatureCards /></section>
    <div id="inside" className="container gallery-section"><ScreenshotGallery /></div>
    <section className="container bottom-cta"><div><p className="eyebrow">{hero.ctaEyebrow}</p><h2>{hero.cta}</h2></div><a className="button button-primary" href="#download">{hero.get}<ArrowRight size={18} /></a></section>
  </>;
}

function AboutPage() {
  const { copy } = usePreferences();
  const about = copy.about;
  return <div className="container content-page">
    <a href="#home" className="back-link"><ArrowLeft size={16} />{copy.common.back}</a>
    <div className="page-heading"><span className="eyebrow">{about.eyebrow}</span><h1>{about.heading}<br /><span className="amber-text">{about.accent}</span></h1><p>{about.description}</p></div>
    <div className="about-grid">{about.cards.map((card, index) => { const Icon = aboutIcons[index]; return <article key={index} className="about-card"><span className="icon-tile"><Icon size={25} strokeWidth={1.6} /></span><h2>{card.title}</h2><p>{card.description}</p></article>; })}</div>
    <section className="about-availability"><ShieldCheck size={26} /><div><h2>{about.availability}</h2><p>{about.availabilityText}</p></div><a className="button button-secondary" href="#download">{about.downloads}<ArrowRight size={18} /></a></section>
  </div>;
}

function DownloadPage() {
  const { copy, t } = usePreferences();
  const download = copy.download;
  const [selected, setSelected] = useState('windows');
  const [downloadStarted, setDownloadStarted] = useState(false);
  const platforms = [
    { id: 'windows', name: 'Windows', logo: 'windows.svg', subtitle: download.windowsSubtitle, note: t('download.note', { version: windowsRelease.version }), available: true },
    { id: 'linux', name: 'Linux', logo: 'linux.svg', subtitle: download.linuxSubtitle, note: download.unavailableNote, available: false },
    { id: 'macos', name: 'macOS', logo: 'apple.svg', subtitle: download.macSubtitle, note: download.unavailableNote, available: false },
  ];
  const current = platforms.find(platform => platform.id === selected);
  return <div className="container content-page download-page">
    <a href="#home" className="back-link"><ArrowLeft size={16} />{copy.common.back}</a>
    <div className="page-heading centered"><span className="eyebrow"><span className="status-dot" />{download.eyebrow}</span><h1>{download.heading}<br /><span className="amber-text">{download.accent}</span></h1><p>{download.description}</p></div>
    <div className="platform-grid" role="group" aria-label={download.choose}>{platforms.map(platform => <button key={platform.id} className={`platform-card ${selected === platform.id ? 'is-selected' : ''}`} aria-pressed={selected === platform.id} aria-controls="installation-panel" onClick={() => { setSelected(platform.id); setDownloadStarted(false); }}>
      <span className={`platform-status ${platform.available ? 'available' : ''}`}>{platform.available ? download.windowsBuild : copy.common.unavailable}</span>
      <img className={`platform-logo ${platform.id === 'macos' ? 'apple-logo' : ''}`} src={asset(`platforms/${platform.logo}`)} width="50" height="50" alt="" />
      <span className="platform-name">{platform.name}</span><span className="platform-subtitle">{platform.subtitle}</span><span className="platform-note">{platform.note}</span>
      <span className="platform-selection">{selected === platform.id ? <><Check size={16} />{copy.common.selected}</> : <>{copy.common.details}<ArrowRight size={16} /></>}</span>
    </button>)}</div>
    <section className="installation-panel" id="installation-panel" aria-labelledby="installation-title">
      <div className="installation-intro"><span className="icon-tile"><ArrowDownToLine size={24} /></span><div><h2 id="installation-title">{current.available ? download.windowsTitle : t('download.horizon', { platform: current.name })}</h2><p>{current.available ? t('download.version', { version: windowsRelease.version }) : t('download.unavailablePlatform', { platform: current.name })}</p></div></div>
      {current.available ? <>
        <ol className="installation-steps">{download.steps.map((step, index) => <li key={index}><span>0{index + 1}</span><div><strong>{step.title}</strong><p>{step.description}</p></div></li>)}</ol>
        <div className="download-action"><a className="button button-primary" href={freshAssetUrl(windowsRelease.url)} download={windowsRelease.filename} onClick={() => setDownloadStarted(true)}><ArrowDownToLine size={19} />{download.button}<ArrowRight size={18} /></a><span className="download-filename">{windowsRelease.filename}</span></div>
        <p className="download-feedback" role="status">{downloadStarted ? download.feedback : download.idle}</p>
      </> : <div className="unavailable-panel"><p>{t('download.unavailableText', { platform: current.name })}</p><button className="button button-unavailable" disabled><ArrowDownToLine size={18} />{copy.common.unavailable}</button></div>}
    </section>
    <section className="faq" aria-labelledby="faq-title"><h2 id="faq-title">{download.faqTitle}</h2>{download.faq.map((item, index) => <details key={index}><summary>{item.question}<ChevronDown size={18} /></summary><p>{item.answer.replace('{version}', windowsRelease.version)}</p></details>)}</section>
  </div>;
}

export default function App() {
  const { copy, language } = usePreferences();
  const [currentPage, setCurrentPage] = useState(readPage);
  const mainRef = useRef(null);
  useEffect(() => {
    const navigate = () => { setCurrentPage(readPage()); window.scrollTo(0, 0); requestAnimationFrame(() => mainRef.current?.focus({ preventScroll: true })); };
    window.addEventListener('hashchange', navigate);
    return () => window.removeEventListener('hashchange', navigate);
  }, []);
  useEffect(() => {
    document.title = copy.titles[currentPage];
    document.querySelector('meta[name="description"]')?.setAttribute('content', copy.titles.description);
  }, [currentPage, language, copy]);
  return <div className="site-shell"><a href="#main" className="skip-link" onClick={event => { event.preventDefault(); mainRef.current?.focus(); }}>{copy.common.skip}</a><Background /><Navigation currentPage={currentPage} />
    <main id="main" ref={mainRef} tabIndex={-1}><AnimatePresence mode="wait" initial={false}><motion.div key={currentPage} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: .2 }}>{currentPage === 'home' ? <HomePage /> : currentPage === 'about' ? <AboutPage /> : <DownloadPage />}</motion.div></AnimatePresence></main>
    <footer className="container site-footer"><a href="#home" className="footer-brand"><img src={asset('brand/canary-bird-white.png')} width="25" height="25" alt="" />Canary<span>{copy.common.footerTagline}</span></a><div className="footer-actions"><nav aria-label={copy.common.footerNav}><a href="#home" aria-current={currentPage === 'home' ? 'page' : undefined}>{copy.common.home}</a><a href="#about" aria-current={currentPage === 'about' ? 'page' : undefined}>{copy.common.about}</a><a href="#download" aria-current={currentPage === 'download' ? 'page' : undefined}>{copy.common.download}</a></nav><a className="discord-link" href="https://discord.gg/kYh5TnA48j" target="_blank" rel="noopener noreferrer" aria-label={copy.common.discord} title={copy.common.discordTitle}><DiscordIcon /></a></div></footer>
  </div>;
}
