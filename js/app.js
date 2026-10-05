/* ================================================================
   CANARY LAUNCHER — интерактив
   ================================================================ */
(() => {
"use strict";

const $  = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const isFinePointer = matchMedia("(pointer: fine)").matches;
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ================= ПРЕЛОАДЕР ================= */
window.addEventListener("load", () => {
  setTimeout(() => $("#loader")?.classList.add("done"), 900);
});
// страховка, если load уже прошёл
setTimeout(() => $("#loader")?.classList.add("done"), 2600);

/* ================= КАСТОМНЫЙ КУРСОР ================= */
if (isFinePointer && !reducedMotion) {
  const dot = $("#cursorDot"), ring = $("#cursorRing"), label = $(".cursor-label");
  let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my;

  addEventListener("mousemove", e => { mx = e.clientX; my = e.clientY; });
  addEventListener("mousedown", () => { dot.classList.add("click"); ring.classList.add("down-cursor"); });
  addEventListener("mouseup",   () => { dot.classList.remove("click"); ring.classList.remove("down-cursor"); });
  addEventListener("mouseleave",() => { dot.style.opacity = ring.style.opacity = 0; });
  addEventListener("mouseenter",() => { dot.style.opacity = ring.style.opacity = 1; });

  const CURSOR_TEXT = { hover: "клик", pointer: "→", download: "скачать", play: "играть", view: "осмотр", grab: "крути", up: "↑" };

  const loop = () => {
    rx += (mx - rx) * 0.16; ry += (my - ry) * 0.16;
    dot.style.left = mx + "px";  dot.style.top = my + "px";
    ring.style.left = rx + "px"; ring.style.top = ry + "px";
    requestAnimationFrame(loop);
  };
  loop();

  // реакции на элементы
  $$("[data-cursor]").forEach(el => {
    const type = el.dataset.cursor;
    el.addEventListener("mouseenter", () => {
      if (type === "hover") ring.classList.add("hover-cursor");
      if (CURSOR_TEXT[type]) { ring.classList.add("has-label"); label.textContent = CURSOR_TEXT[type]; }
    });
    el.addEventListener("mouseleave", () => {
      ring.classList.remove("hover-cursor", "has-label"); label.textContent = "";
    });
  });

  /* --- шлейф из «пиксельных искр» за курсором --- */
  const trailHost = $("#cursorTrail");
  const COLORS = ["#ffd54f", "#7ce04a", "#2fbf71", "#4dd0e1"];
  let lastSpawn = 0;
  addEventListener("mousemove", e => {
    const now = performance.now();
    if (now - lastSpawn < 38) return; // троттлинг
    lastSpawn = now;
    const p = document.createElement("i");
    p.className = "trail-particle";
    const size = 3 + Math.random() * 6;
    p.style.width = p.style.height = size + "px";
    p.style.background = COLORS[(Math.random() * COLORS.length) | 0];
    p.style.left = e.clientX + "px"; p.style.top = e.clientY + "px";
    trailHost.appendChild(p);
    const ang = Math.random() * Math.PI * 2, dist = 14 + Math.random() * 26;
    p.animate([
      { transform: `translate(-50%,-50%) scale(1) rotate(${Math.random()*360}deg)`, opacity: .9 },
      { transform: `translate(calc(-50% + ${Math.cos(ang)*dist}px), calc(-50% + ${Math.sin(ang)*dist + 18}px)) scale(.2) rotate(180deg)`, opacity: 0 }
    ], { duration: 600 + Math.random() * 500, easing: "cubic-bezier(.2,.6,.3,1)" })
     .onfinish = () => p.remove();
  });
}

/* ================= ФОНОВЫЕ ЧАСТИЦЫ (canvas) ================= */
{
  const cv = $("#particles"), ctx = cv.getContext("2d");
  let W, H, parts = [];
  const mouse = { x: -9999, y: -9999 };
  addEventListener("mousemove", e => { mouse.x = e.clientX; mouse.y = e.clientY; });

  const PALETTE = ["255,213,79", "124,224,74", "47,191,113", "77,208,225"];

  function resize() {
    W = cv.width = innerWidth; H = cv.height = innerHeight;
    const n = Math.min(90, Math.floor(W * H / 22000));
    parts = Array.from({ length: n }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      s: 2 + Math.random() * 4,               // пиксельный размер
      vx: (Math.random() - .5) * .25, vy: (Math.random() - .5) * .25,
      c: PALETTE[(Math.random() * PALETTE.length) | 0],
      a: .1 + Math.random() * .35, ph: Math.random() * Math.PI * 2
    }));
  }
  resize(); addEventListener("resize", resize);

  let t = 0;
  (function draw() {
    t += .016;
    ctx.clearRect(0, 0, W, H);
    for (const p of parts) {
      p.x += p.vx; p.y += p.vy;
      if (p.x < -10) p.x = W + 10; if (p.x > W + 10) p.x = -10;
      if (p.y < -10) p.y = H + 10; if (p.y > H + 10) p.y = -10;

      // отталкивание от мыши
      const dx = p.x - mouse.x, dy = p.y - mouse.y, d2 = dx * dx + dy * dy;
      let pushX = 0, pushY = 0;
      if (d2 < 130 * 130) { const d = Math.sqrt(d2) || 1; const f = (130 - d) / 130 * 22; pushX = dx / d * f; pushY = dy / d * f; }

      const glow = .5 + .5 * Math.sin(t * 2 + p.ph);
      ctx.fillStyle = `rgba(${p.c}, ${p.a * glow})`;
      ctx.fillRect(p.x + pushX, p.y + pushY, p.s, p.s); // квадрат = minecraft-стиль
    }
    if (!reducedMotion) requestAnimationFrame(draw);
  })();
}

/* ================= СПОТЛАЙТ ЗА МЫШЬЮ ================= */
{
  const sp = $("#spotlight");
  let tx = 50, ty = 30, cx = 50, cy = 30;
  addEventListener("mousemove", e => { tx = e.clientX / innerWidth * 100; ty = e.clientY / innerHeight * 100; });
  (function smooth() {
    cx += (tx - cx) * .08; cy += (ty - cy) * .08;
    sp.style.setProperty("--mx", cx + "%");
    sp.style.setProperty("--my", cy + "%");
    requestAnimationFrame(smooth);
  })();
}

/* ================= SCROLL-РЕВИЛЫ ================= */
{
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
    });
  }, { threshold: .12 });
  $$(".reveal").forEach(el => io.observe(el));
}

/* ================= МАГНИТНЫЕ ЭЛЕМЕНТЫ ================= */
if (isFinePointer && !reducedMotion) {
  $$(".magnetic").forEach(el => {
    el.addEventListener("mousemove", e => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width / 2) * .3;
      const y = (e.clientY - r.top - r.height / 2) * .4;
      el.style.transform = `translate(${x}px, ${y}px)`;
    });
    el.addEventListener("mouseleave", () => { el.style.transform = ""; });
  });
}

/* ================= 3D TILT ================= */
if (isFinePointer && !reducedMotion) {
  $$(".tilt").forEach(el => {
    el.addEventListener("mousemove", e => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - .5;
      const py = (e.clientY - r.top) / r.height - .5;
      el.style.setProperty("--cx", ((px + .5) * 100) + "%");
      el.style.setProperty("--cy", ((py + .5) * 100) + "%");
      el.style.transform = `perspective(800px) rotateY(${px * 12}deg) rotateX(${-py * 12}deg) translateZ(6px)`;
    });
    el.addEventListener("mouseleave", () => {
      el.style.transition = "transform .6s cubic-bezier(.22,1,.36,1)";
      el.style.transform = "";
      setTimeout(() => el.style.transition = "", 600);
    });
  });
}

/* ================= RIPPLE НА КНОПКАХ ================= */
$$(".ripple, .btn, .lw-play").forEach(btn => {
  btn.addEventListener("click", e => {
    const r = btn.getBoundingClientRect();
    const rip = document.createElement("span");
    rip.className = "ripple-el";
    const size = Math.max(r.width, r.height);
    rip.style.width = rip.style.height = size + "px";
    rip.style.left = (e.clientX - r.left - size / 2) + "px";
    rip.style.top = (e.clientY - r.top - size / 2) + "px";
    if (getComputedStyle(btn).position === "static") btn.style.position = "relative";
    btn.appendChild(rip);
    setTimeout(() => rip.remove(), 650);
  });
});

/* ================= PARALLAX ПО МЫШИ (герой) ================= */
if (isFinePointer && !reducedMotion) {
  const hero = $("#hero");
  hero.addEventListener("mousemove", e => {
    const r = hero.getBoundingClientRect();
    const nx = (e.clientX - r.left) / r.width - .5;
    const ny = (e.clientY - r.top) / r.height - .5;
    $$(".parallax", hero).forEach(el => {
      const d = parseFloat(el.dataset.depth || .5);
      el.style.translate = `${nx * 40 * d}px ${ny * 30 * d}px`;
    });
  });
}

/* ================= СЧЁТЧИКИ ================= */
{
  const io = new IntersectionObserver(es => es.forEach(en => {
    if (!en.isIntersecting) return;
    io.unobserve(en.target);
    const el = en.target, target = +el.dataset.count, dur = 1400, t0 = performance.now();
    (function tick(now) {
      const k = Math.min(1, (now - t0) / dur);
      el.textContent = Math.round(target * (1 - Math.pow(1 - k, 3)));
      if (k < 1) requestAnimationFrame(tick);
    })(t0);
  }), { threshold: .6 });
  $$(".counter").forEach(c => io.observe(c));
}

/* ================= NAV SCROLL STATE ================= */
addEventListener("scroll", () => {
  $("#nav").classList.toggle("scrolled", scrollY > 30);
}, { passive: true });

/* ================= БУРГЕР ================= */
{
  const b = $("#burger"), m = $("#mobileMenu");
  b.addEventListener("click", () => { b.classList.toggle("open"); m.classList.toggle("open"); });
  $$("a", m).forEach(a => a.addEventListener("click", () => { b.classList.remove("open"); m.classList.remove("open"); }));
}

/* ================= SCRAMBLE-ЗАГОЛОВОК ================= */
{
  const el = $("#scrambleGrad");
  if (el) {
    const words = ["MINECRAFT", "CRAFT", "CANARY", "SKY", "MINECRAFT"];
    const CHARS = "!<>-_\\/[]{}—=+*^?#ABCDEFKMNRCST";
    let idx = 0;
    function scramble(next) {
      const from = el.textContent, len = Math.max(from.length, next.length);
      const queue = [];
      for (let i = 0; i < len; i++) {
        queue.push({
          from: from[i] || "", to: next[i] || "",
          start: Math.floor(Math.random() * 18), end: Math.floor(Math.random() * 18) + 18
        });
      }
      let frame = 0;
      (function upd() {
        let out = "", done = 0;
        for (const q of queue) {
          if (frame >= q.end) { done++; out += q.to; }
          else if (frame >= q.start) {
            if (!q.char || Math.random() < .3) q.char = CHARS[(Math.random() * CHARS.length) | 0];
            out += `<span style="opacity:.5">${q.char}</span>`;
          } else out += q.from;
        }
        el.innerHTML = out;
        if (done < queue.length) { frame++; requestAnimationFrame(upd); }
      })();
    }
    setInterval(() => { if (document.hidden) return; idx = (idx + 1) % words.length; scramble(words[idx]); }, 3200);
  }
}

/* ================= ОКНО ЛАУНЧЕРА: ЖИВОЙ ЛОГ + ВЕРСИИ ================= */
{
  const logEl = $("#lwLogLine");
  const lines = [
    "> загружаю ассеты… 812 файлов",
    "> проверяю целостность jar ✓",
    "> java 21 обнаружена (temurin)",
    "> подключение к серверу…",
    "> скачиваю библиотеки [###---] 62%",
    "> скины обновлены ✦",
    "> мир «house» загружен",
    "> готово — можно летать! 🐦"
  ];
  let li = 0;
  if (logEl && !reducedMotion) setInterval(() => { li = (li + 1) % lines.length; logEl.textContent = lines[li]; }, 2400);

  const verEl = $("#lwVer");
  const vers = ["1.21.4", "1.21", "24w44a", "1.20.6", "1.19.4", "1.16.5", "1.8.9"];
  let vi = 0;
  if (verEl) setInterval(() => {
    vi = (vi + 1) % vers.length;
    verEl.style.opacity = 0;
    setTimeout(() => { verEl.textContent = vers[vi]; verEl.style.opacity = 1; }, 200);
  }, 3600);
  if (verEl) verEl.style.transition = "opacity .2s";

  // кнопка ИГРАТЬ в макете — конфетти-импульс
  const playBtn = $(".lw-play");
  playBtn?.addEventListener("click", () => {
    const txt = $(".lw-play-text", playBtn);
    txt.textContent = "ЗАПУСК…";
    burstConfetti(playBtn);
    setTimeout(() => txt.textContent = "ИГРАТЬ", 1600);
  });
}

function burstConfetti(host) {
  const r = host.getBoundingClientRect();
  for (let i = 0; i < 26; i++) {
    const p = document.createElement("i");
    p.className = "trail-particle";
    const size = 4 + Math.random() * 7;
    p.style.width = p.style.height = size + "px";
    p.style.background = ["#ffd54f", "#7ce04a", "#4dd0e1", "#ff5f57", "#fff"][(Math.random() * 5) | 0];
    p.style.left = (r.left + r.width / 2) + "px"; p.style.top = (r.top + r.height / 2) + "px";
    $("#cursorTrail").appendChild(p);
    const ang = Math.random() * Math.PI * 2, dist = 50 + Math.random() * 130;
    p.animate([
      { transform: "translate(-50%,-50%) scale(1)", opacity: 1 },
      { transform: `translate(calc(-50% + ${Math.cos(ang) * dist}px), calc(-50% + ${Math.sin(ang) * dist}px)) scale(0) rotate(${Math.random() * 540}deg)`, opacity: 0 }
    ], { duration: 700 + Math.random() * 500, easing: "cubic-bezier(.1,.7,.3,1)" }).onfinish = () => p.remove();
  }
}

/* ================= СЕКЦИЯ ВЕРСИЙ ================= */
{
  const data = [
    { name: "Minecraft 1.21.4", tag: "release",  year: "2024", pop: 96 },
    { name: "Snapshot 24w44a",  tag: "snapshot", year: "2024", pop: 61 },
    { name: "Minecraft 1.20.6", tag: "release",  year: "2024", pop: 84 },
    { name: "Minecraft 1.19.4", tag: "release",  year: "2023", pop: 72 },
    { name: "Minecraft 1.18.2", tag: "release",  year: "2022", pop: 66 },
    { name: "Minecraft 1.16.5", tag: "legacy",   year: "2020", pop: 88 },
    { name: "Minecraft 1.12.2", tag: "legacy",   year: "2017", pop: 54 },
    { name: "Minecraft 1.8.9",  tag: "legacy",   year: "2015", pop: 92 },
    { name: "Beta 1.7.3",       tag: "legacy",   year: "2011", pop: 38 },
    { name: "Classic 0.30c",    tag: "legacy",   year: "2009", pop: 25 },
  ];
  const list = $("#versionsList");
  data.forEach(v => {
    const row = document.createElement("div");
    row.className = "ver-row";
    row.style.setProperty("--pop", v.pop + "%");
    row.innerHTML = `
      <span class="ver-name">${v.name}</span>
      <span class="ver-meta">
        <span class="ver-bar"><i></i></span>
        <span class="ver-tag ${v.tag}">${v.tag === "release" ? "релиз" : v.tag === "snapshot" ? "снапшот" : "легаси"}</span>
        <span class="ver-year">${v.year}</span>
      </span>`;
    list.appendChild(row);
  });
  const io = new IntersectionObserver(es => es.forEach(en => {
    if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
  }), { threshold: .3 });
  $$(".ver-row").forEach((r, i) => { r.style.transitionDelay = (i % 5) * 70 + "ms"; io.observe(r); });
}

/* ================= 3D ИГРОКИ (CSS-кубы) ================= */
{
  // цвета граней: [лицо, затылок, левая, правая, верх, низ]
  const SKINS = {
    "rig-a": { // STEVE
      head:  { face: "#b5836c", side: "#7a5a44", top: "#4a2f1d", back: "#4a2f1d" },
      torso: { front: "#00afaf", side: "#009a9a", back: "#00afaf" },
      arm:   { front: "#00afaf", hand: "#b5836c", side: "#009a9a" },
      leg:   { front: "#3c3c8c", side: "#333377", back: "#3c3c8c", boot: "#2b2b2b" },
    },
    "rig-b": { // ALEX — рыжая, зелёная футболка
      head:  { face: "#e0b089", side: "#c77b3f", top: "#c77b3f", back: "#c77b3f" },
      torso: { front: "#5a8a3c", side: "#4c7633", back: "#5a8a3c" },
      arm:   { front: "#5a8a3c", hand: "#e0b089", side: "#4c7633" },
      leg:   { front: "#7a6a55", side: "#685a48", back: "#7a6a55", boot: "#4a4034" },
    },
    "rig-c": { // CANARY exclusive — жёлто-чёрный
      head:  { face: "#ffd54f", side: "#e0b93a", top: "#222", back: "#222" },
      torso: { front: "#222", side: "#1a1a1a", back: "#ffd54f" },
      arm:   { front: "#222", hand: "#ffd54f", side: "#1a1a1a" },
      leg:   { front: "#2fbf71", side: "#28a563", back: "#2fbf71", boot: "#111" },
    }
  };

  function box(w, h, d, colors, cls) {
    // возвращает HTML куба w×h×d (в px), colors: {front,back,left,right,top,bottom}
    const half = { x: w / 2, y: h / 2, z: d / 2 };
    const faces = [
      { t: `translateZ(${half.z}px)`,             bg: colors.front, w, h },
      { t: `rotateY(180deg) translateZ(${half.z}px)`, bg: colors.back ?? colors.front, w, h },
      { t: `rotateY(90deg) translateZ(${half.x}px)`,  bg: colors.right ?? colors.side ?? colors.front, w: d, h },
      { t: `rotateY(-90deg) translateZ(${half.x}px)`, bg: colors.left ?? colors.side ?? colors.front, w: d, h },
      { t: `rotateX(90deg) translateZ(${half.y}px)`,  bg: colors.top ?? colors.side ?? colors.front, w, h: d },
      { t: `rotateX(-90deg) translateZ(${half.y}px)`, bg: colors.bottom ?? colors.top ?? colors.side ?? colors.front, w, h: d },
    ];
    return `<div class="p-part ${cls}" style="width:${w}px;height:${h}px">` +
      faces.map(f => `<span class="p-face" style="width:${f.w}px;height:${f.h}px;left:${(w-f.w)/2}px;top:${(h-f.h)/2}px;background:${f.bg};transform:${f.t}"></span>`).join("") +
      `</div>`;
  }

  function buildPlayer(id, skin) {
    const host = $("#" + id);
    if (!host) return;
    const S = skin;
    // голова с лицом (глаза/рот пикселями через градиенты)
    const eyeL = "radial-gradient(circle at 30% 45%, #20154a 0 6%, transparent 7%), radial-gradient(circle at 30% 45%, #fff 0 9%, transparent 10%)";
    const eyeR = "radial-gradient(circle at 70% 45%, #20154a 0 6%, transparent 7%), radial-gradient(circle at 70% 45%, #fff 0 9%, transparent 10%)";
    const headFace = box(32, 32, 32, {
      front: `${eyeL}, ${eyeR}, ${S.head.face}`, back: S.head.back,
      left: S.head.side, right: S.head.side, top: S.head.top, bottom: S.head.top
    }, "head");
    host.innerHTML =
      headFace +
      box(32, 48, 16, { front: S.torso.front, back: S.torso.back, left: S.torso.side, right: S.torso.side, top: "#8a8a8a", bottom: "#8a8a8a" }, "torso") +
      box(16, 48, 16, { front: S.arm.hand, back: S.arm.hand, left: S.arm.side, right: S.arm.side, top: S.arm.front, bottom: S.arm.hand }, "arm-l") +
      box(16, 48, 16, { front: S.arm.hand, back: S.arm.hand, left: S.arm.side, right: S.arm.side, top: S.arm.front, bottom: S.arm.hand }, "arm-r") +
      box(16, 48, 16, { front: S.leg.boot, back: S.leg.boot, left: S.leg.side, right: S.leg.side, top: S.leg.front, bottom: "#111" }, "leg-l") +
      box(16, 48, 16, { front: S.leg.boot, back: S.leg.boot, left: S.leg.side, right: S.leg.side, top: S.leg.front, bottom: "#111" }, "leg-r");

    // сместить origin рук/ног — грани уже центрированы внутри блока; повороты идут через CSS-анимации
    initDragRotate(host);
  }

  Object.entries(SKINS).forEach(([cls, skin]) => {
    const host = $(`.${cls}`);
    if (host) buildPlayer(host.id, skin);
  });

  /* перетаскивание для вращения + автопокой */
  function initDragRotate(player) {
    player.classList.add("idle");
    let rotY = -25, rotX = 4, vel = 0.25, dragging = false, lastX = 0, spin = null;
    const scene = player.parentElement;

    function apply() { player.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`; }
    apply();

    function autoSpin() {
      if (!dragging) { rotY += vel; apply(); }
      spin = requestAnimationFrame(autoSpin);
    }
    if (!reducedMotion) autoSpin();

    const down = x => { dragging = true; lastX = x; player.classList.remove("idle"); player.classList.add("walk"); scene.style.cursor = "grabbing"; };
    const move  = x => { if (!dragging) return; rotY += (x - lastX) * 0.55; lastX = x; apply(); };
    const up    = () => { dragging = false; scene.style.cursor = ""; };

    scene.addEventListener("pointerdown", e => { down(e.clientX); scene.setPointerCapture(e.pointerId); });
    scene.addEventListener("pointermove", e => move(e.clientX));
    scene.addEventListener("pointerup", up);
    scene.addEventListener("pointercancel", up);

    // при наведении — оживает сильнее
    scene.addEventListener("mouseenter", () => { vel = 0.7; });
    scene.addEventListener("mouseleave", () => { vel = 0.25; });
  }
}

/* ================= ТЕРМИНАЛ УСТАНОВКИ ================= */
{
  const OS = {
    win: {
      title: "Windows 10 / 11",
      desc: "Установщик .exe с автообновлением. Canary обновляется сам — просто нажми «Играй».",
      file: "Canary-Setup.exe", size: "~68 МБ", sha: "sha256 · stable",
      dl: "Скачать для Windows", cmd: "start /wait Canary-Setup.exe",
      out: [
        ["warn", ">>> Canary Installer v2.4.1"],
        ["ok",   "[1/4] Проверяю систему… Windows 11 Pro ✓"],
        ["hl",   "[2/4] Устанавливаю Java 21 (Temurin)…"],
        ["ok",   "[3/4] Распаковываю ядро лаунчера…"],
        ["ok",   "[4/4] Готово! Canary добавлен в «Пуск» 🐦"],
        ["",     "$ _"],
      ]
    },
    mac: {
      title: "macOS 12+ (Apple Silicon / Intel)",
      desc: "DMG-образ с подписью и notarization. Нативные билды под arm64 и x86_64 в одном файле.",
      file: "Canary.dmg", size: "~74 МБ", sha: "sha256 · notarized",
      dl: "Скачать для macOS", cmd: "hdiutil attach Canary.dmg && cp -R Canary.app /Applications",
      out: [
        ["warn", ">>> Canary Installer v2.4.1 (universal)"],
        ["ok",   "[1/4] Gatekeeper: подпись валидна ✓"],
        ["hl",   "[2/4] Определяю архитектуру… arm64 ✓"],
        ["ok",   "[3/4] Копирую в /Applications…"],
        ["ok",   "[4/4] Запускаю Canary из Launchpad 🐦"],
        ["",     "$ _"],
      ]
    },
    linux: {
      title: "Linux (deb / rpm / AppImage)",
      desc: "Один AppImage без зависимостей или репозиторий с автообновлением через пакетный менеджер.",
      file: "canary.AppImage", size: "~65 МБ", sha: "sha256 · signed",
      dl: "Скачать для Linux", cmd: "curl -fsSL https://get.canary.dev | sh",
      out: [
        ["warn", ">>> Canary Installer v2.4.1"],
        ["ok",   "[1/4] Дистрибутив: Ubuntu 24.04 ✓"],
        ["hl",   "[2/4] Скачиваю canary.AppImage… 100%"],
        ["ok",   "[3/4] chmod +x и создаю .desktop ярлык"],
        ["ok",   "[4/4] Готово — запускай из меню! 🐦"],
        ["",     "$ _"],
      ]
    }
  };

  const tabs = $$(".ptab");
  const termOut = $("#termOut"), termCmd = $("#termCmd");
  let typeTimer = null;

  function renderTerm(os) {
    const d = OS[os];
    $("#osTitle").textContent = d.title;
    $("#osDesc").textContent = d.desc;
    $("#osFile").textContent = d.file;
    $("#osSize").textContent = d.size;
    $("#osSha").textContent = d.sha;
    $("#dlBtnText").textContent = d.dl;

    // печатаем команду посимвольно
    clearInterval(typeTimer);
    termCmd.textContent = "";
    termOut.innerHTML = "";
    let i = 0;
    typeTimer = setInterval(() => {
      termCmd.textContent = d.cmd.slice(0, ++i);
      if (i >= d.cmd.length) { clearInterval(typeTimer); printOut(d.out); }
    }, 26);
  }

  function printOut(lines) {
    let i = 0;
    const iv = setInterval(() => {
      if (i >= lines.length) { clearInterval(iv); return; }
      const [cls, text] = lines[i++];
      const div = document.createElement("div");
      div.className = cls;
      div.textContent = text;
      div.style.opacity = 0;
      termOut.appendChild(div);
      div.animate([{ opacity: 0, transform: "translateY(6px)" }, { opacity: 1, transform: "none" }],
        { duration: 300, easing: "ease-out" });
    }, 320);
  }

  tabs.forEach(t => t.addEventListener("click", () => {
    tabs.forEach(x => x.classList.remove("active"));
    t.classList.add("active");
    renderTerm(t.dataset.os);
  }));

  // автовыбор по системе юзера
  const ua = navigator.userAgent;
  const guess = ua.includes("Win") ? "win" : ua.includes("Mac") ? "mac" : "linux";
  tabs.forEach(x => x.classList.toggle("active", x.dataset.os === guess));
  renderTerm(guess);
}

/* ================= АККОРДЕОН FAQ ================= */
$$(".acc-item").forEach(item => {
  const q = $(".acc-q", item), a = $(".acc-a", item);
  q.addEventListener("click", () => {
    const open = item.classList.contains("open");
    $$(".acc-item.open").forEach(o => { o.classList.remove("open"); $(".acc-a", o).style.maxHeight = 0; });
    if (!open) { item.classList.add("open"); a.style.maxHeight = a.scrollHeight + "px"; }
  });
});

/* ================= НАВЕРХ ================= */
$("#toTop")?.addEventListener("click", () => scrollTo({ top: 0, behavior: "smooth" }));

/* ================= ПЛАВНЫЙ ЯКОРЯ ================= */
$$('a[href^="#"]').forEach(a => a.addEventListener("click", e => {
  const id = a.getAttribute("href");
  if (id.length > 1) {
    const t = $(id);
    if (t) { e.preventDefault(); t.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" }); }
  }
}));

/* ================= GH STARS (косметика) ================= */
{
  fetch("https://api.github.com/repos/ccardcat/canary")
    .then(r => r.ok ? r.json() : null)
    .then(d => { if (d && d.stargazers_count != null) $("#ghStars").textContent = "★ " + d.stargazers_count; })
    .catch(() => {});
}


/* ================= LIVE-ДЕМО: @trycanary/wisp ================= */
{
  const boot = $("#canaryBoot"), host = $("#canaryHost"), txt = $("#bootText");
  if (boot && host) {
    const setStatus = t => { if (txt) txt.textContent = t; };
    let settled = false;
    const fail = msg => {
      if (settled) return; settled = true;
      boot.classList.add("failed");
      setStatus(msg || "демо недоступно в этой сети");
      setTimeout(() => { boot.style.display = "none"; }, 1400);
    };
    const ok = () => {
      if (settled) return; settled = true;
      boot.classList.add("done");
      setTimeout(() => { boot.style.display = "none"; }, 600);
    };
    // страховка на случай зависшей загрузки модуля
    setTimeout(() => fail(), 9000);
    import("@trycanary/wisp")
      .then(mod => {
        if (settled) return;
        let el = null;
        try { el = mod.launch?.("#canaryHost", { theme: "dark" }) ?? mod.mount?.("#canaryHost") ?? null; }
        catch (e) { console.warn("wisp launch error", e); }
        if (!el) {
          const tag = customElements.get("canary-launcher") ? "canary-launcher" : null;
          if (tag) { host.innerHTML = `<${tag} theme="dark"></${tag}>`; }
        }
        // ждём поднятия shadow DOM / первого рендера
        const check = setInterval(() => {
          const c = host.firstElementChild;
          if (c && (c.shadowRoot || c.children.length)) { clearInterval(check); ok(); }
        }, 300);
        setTimeout(() => { clearInterval(check); if (!settled) fail(); }, 8000);
      })
      .catch(() => fail());
  }
}

})();
