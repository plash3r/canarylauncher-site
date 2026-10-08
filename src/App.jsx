import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowDown, ArrowDownToLine, ArrowLeft, ArrowRight, Check, ChevronDown, Layers3, Library, Package, Search, Settings2, ShieldCheck, Sparkles, Zap } from 'lucide-react';
import ScreenshotGallery from './ScreenshotGallery';
import { windowsRelease } from './release';

const asset = (path) => `${import.meta.env.BASE_URL}${path}`;
const readPage = () => ['home', 'about', 'download'].includes(window.location.hash.slice(1)) ? window.location.hash.slice(1) : 'home';
const features = [
  { icon: Zap, title: 'Fast & lightweight', description: 'Less waiting. More playing.', detail: 'A focused interface that keeps your instances, versions and favourite modpacks within reach.' },
  { icon: Package, title: 'Made for modpacks', description: 'Find your next way to play.', detail: 'Explore community projects on Modrinth, from a few quality-of-life mods to a whole new adventure.' },
  { icon: Settings2, title: 'Everything in its place', description: 'Your Minecraft, organised.', detail: 'Create separate instances for different versions and loaders, and keep your collection together in one library.' },
];

function Background() {
  return <div className="ambient" aria-hidden="true"><div className="ambient-glow" /><div className="ambient-grid" />{Array.from({ length: 14 }, (_, index) => <span key={index} className="particle" style={{ left: `${(index * 37 + 9) % 100}%`, top: `${(index * 23 + 11) % 100}%`, animationDelay: `${index * -.9}s`, animationDuration: `${18 + index % 6}s` }} />)}</div>;
}

function Navigation({ currentPage }) {
  return <header className="site-header"><nav className="container header-inner" aria-label="Main navigation">
    <a className="brand-link" href="#home" aria-label="Canary — Home"><img src={asset('brand/canary-bird-white.png')} alt="" width="48" height="48" /></a>
    <a className="button button-small button-primary" href="#download" aria-current={currentPage === 'download' ? 'page' : undefined}><ArrowDownToLine size={16} /><span>Download</span><ArrowRight size={16} /></a>
  </nav></header>;
}

function FeatureCards() {
  const [expanded, setExpanded] = useState(null);
  return <div className="feature-grid">{features.map((feature, index) => <article className={`feature-card ${expanded === index ? 'is-expanded' : ''}`} key={feature.title}>
    <button className="feature-toggle" aria-expanded={expanded === index} aria-controls={`feature-${index}`} onClick={() => setExpanded(expanded === index ? null : index)}>
      <span className="icon-tile"><feature.icon size={25} strokeWidth={1.6} /></span><span className="feature-text"><span className="feature-title">{feature.title}</span><span className="feature-description">{feature.description}</span></span><ChevronDown size={17} className="feature-chevron" />
    </button>
    <div id={`feature-${index}`} className="feature-detail" hidden={expanded !== index}><p>{feature.detail}</p></div>
  </article>)}</div>;
}

function HomePage() {
  return <>
    <section className="hero container">
      <span className="eyebrow"><span className="status-dot" /> YOUR NEXT ADVENTURE STARTS HERE</span>
      <h1 className="hero-logo"><span className="sr-only">Canary Minecraft Launcher</span><img src={asset('brand/canary-white.png')} alt="" width="2172" height="724" fetchPriority="high" /></h1>
      <h2>A calmer way to <span className="amber-text">discover Minecraft.</span></h2>
      <p className="hero-description">Explore modpacks, mods and new ways to play.<br className="desktop-break" /> Built for players who value simplicity and performance.</p>
      <div className="hero-actions"><a href="#download" className="button button-primary"><ArrowDownToLine size={19} />Download Canary<ArrowRight size={18} /></a><a href="#about" className="button button-secondary">Explore the launcher<ArrowRight size={18} /></a></div>
      <p className="hero-meta"><span><ShieldCheck size={14} /> Your game. Your way.</span><span className="meta-divider" /><span>Windows · v{windowsRelease.version}</span></p>
      <a className="scroll-link" href="#inside" onClick={(event) => { event.preventDefault(); document.getElementById('inside')?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' }); }}><span>Take a closer look</span><ArrowDown size={16} /></a>
    </section>
    <section className="container features-section" aria-label="Launcher features"><FeatureCards /></section>
    <div id="inside" className="container gallery-section"><ScreenshotGallery /></div>
    <section className="container bottom-cta"><div><p className="eyebrow">LESS FRICTION. MORE MINECRAFT.</p><h2>Make room for your next adventure.</h2></div><a className="button button-primary" href="#download">Get Canary<ArrowRight size={18} /></a></section>
  </>;
}

function AboutPage() {
  return <div className="container content-page">
    <a href="#home" className="back-link"><ArrowLeft size={16} />Back to home</a>
    <div className="page-heading"><span className="eyebrow">BUILT AROUND YOUR GAME</span><h1>A little less setup.<br /><span className="amber-text">A lot more possibility.</span></h1><p>Canary brings discovery and instance management into one clean, focused Minecraft launcher.</p></div>
    <div className="about-grid">{[
      { icon: Search, title: 'Discover', description: 'Browse community modpacks, mods and resource packs. Find a familiar favourite or something completely new.' },
      { icon: Library, title: 'Your library', description: 'Keep all your Minecraft instances together. Create a new instance, choose a version and organise your collection.' },
      { icon: Layers3, title: 'Your own setup', description: 'Give different modpacks, game versions and loaders a space of their own.' },
      { icon: Sparkles, title: 'A calmer experience', description: 'A thoughtful interface, clear controls and fewer distractions between you and the game.' },
    ].map(({ icon: Icon, title, description }) => <article key={title} className="about-card"><span className="icon-tile"><Icon size={25} strokeWidth={1.6} /></span><h2>{title}</h2><p>{description}</p></article>)}</div>
    <section className="about-availability"><ShieldCheck size={26} /><div><h2>Start on Windows</h2><p>Linux and macOS installation is temporarily unavailable. See the download page for current platform availability.</p></div><a className="button button-secondary" href="#download">View downloads<ArrowRight size={18} /></a></section>
  </div>;
}

function DownloadPage() {
  const [selected, setSelected] = useState('windows');
  const [downloadStarted, setDownloadStarted] = useState(false);
  const platforms = [
    { id: 'windows', name: 'Windows', logo: 'windows.svg', subtitle: '64-bit installer', note: `Version ${windowsRelease.version} · .exe installer`, available: true },
    { id: 'linux', name: 'Linux', logo: 'linux.svg', subtitle: 'For your favourite distro', note: 'Installation is temporarily unavailable.', available: false },
    { id: 'macos', name: 'macOS', logo: 'apple.svg', subtitle: 'For your Mac', note: 'Installation is temporarily unavailable.', available: false },
  ];
  const current = platforms.find(platform => platform.id === selected);
  return <div className="container content-page download-page">
    <a href="#home" className="back-link"><ArrowLeft size={16} />Back to home</a>
    <div className="page-heading centered"><span className="eyebrow"><span className="status-dot" /> MAKE YOURSELF AT HOME</span><h1>Your next adventure.<br /><span className="amber-text">One download away.</span></h1><p>Choose your platform and make Minecraft your own.</p></div>
    <div className="platform-grid" role="group" aria-label="Choose your operating system">{platforms.map(platform => <button key={platform.id} className={`platform-card ${selected === platform.id ? 'is-selected' : ''}`} aria-pressed={selected === platform.id} aria-controls="installation-panel" onClick={() => { setSelected(platform.id); setDownloadStarted(false); }}>
      <span className={`platform-status ${platform.available ? 'available' : ''}`}>{platform.available ? 'Windows build' : 'Temporarily unavailable'}</span>
      <img className={`platform-logo ${platform.id === 'macos' ? 'apple-logo' : ''}`} src={asset(`platforms/${platform.logo}`)} width="50" height="50" alt="" />
      <span className="platform-name">{platform.name}</span><span className="platform-subtitle">{platform.subtitle}</span><span className="platform-note">{platform.note}</span>
      <span className="platform-selection">{selected === platform.id ? <><Check size={16} />Selected</> : <>View details<ArrowRight size={16} /></>}</span>
    </button>)}</div>
    <section className="installation-panel" id="installation-panel" aria-labelledby="installation-title">
      <div className="installation-intro"><span className="icon-tile"><ArrowDownToLine size={24} /></span><div><h2 id="installation-title">{current.available ? 'Canary for Windows' : `${current.name} is on the horizon`}</h2><p>{current.available ? `Version ${windowsRelease.version} · Windows x64` : `${current.name} installation is temporarily unavailable.`}</p></div></div>
      {current.available ? <>
        <ol className="installation-steps"><li><span>01</span><div><strong>Download the installer</strong><p>Save the Windows installer to your computer.</p></div></li><li><span>02</span><div><strong>Install Canary</strong><p>Open the .exe file and follow the installation steps.</p></div></li><li><span>03</span><div><strong>Make it yours</strong><p>Open Canary and create your first Minecraft instance.</p></div></li></ol>
        <div className="download-action"><a className="button button-primary" href={windowsRelease.url} download={windowsRelease.filename} onClick={() => setDownloadStarted(true)}><ArrowDownToLine size={19} />Download for Windows<ArrowRight size={18} /></a><span className="download-filename">{windowsRelease.filename}</span></div>
        <p className="download-feedback" role="status">{downloadStarted ? 'Download requested. If it did not start, try the button again.' : 'A fresh start for your Minecraft library.'}</p>
      </> : <div className="unavailable-panel"><p>There is no installer for {current.name} at the moment. You can explore the launcher or choose the Windows build above.</p><button className="button button-unavailable" disabled><ArrowDownToLine size={18} />Temporarily unavailable</button></div>}
    </section>
    <section className="faq" aria-labelledby="faq-title"><h2 id="faq-title">A few things to know</h2>{[
      { question: 'Which Windows installer should I use?', answer: `The current build is Canary ${windowsRelease.version} for 64-bit Windows. Use the Download for Windows button above.` },
      { question: 'Can I install Canary on Linux or macOS?', answer: 'Linux and macOS installation is temporarily unavailable. There are no download files for those platforms yet.' },
      { question: 'Where can I see the launcher before downloading?', answer: 'The home page includes an interactive gallery. Choose a screenshot and open the preview to see it in full size.' },
    ].map(item => <details key={item.question}><summary>{item.question}<ChevronDown size={18} /></summary><p>{item.answer}</p></details>)}</section>
  </div>;
}

export default function App() {
  const [currentPage, setCurrentPage] = useState(readPage);
  const mainRef = useRef(null);
  useEffect(() => {
    const navigate = () => { setCurrentPage(readPage()); window.scrollTo(0, 0); requestAnimationFrame(() => mainRef.current?.focus({ preventScroll: true })); };
    window.addEventListener('hashchange', navigate);
    return () => window.removeEventListener('hashchange', navigate);
  }, []);
  useEffect(() => { document.title = `${currentPage === 'home' ? 'Canary' : currentPage === 'about' ? 'About Canary' : 'Download Canary'} — Minecraft Launcher`; }, [currentPage]);
  return <div className="site-shell"><a href="#main" className="skip-link" onClick={(event) => { event.preventDefault(); mainRef.current?.focus(); }}>Skip to content</a><Background /><Navigation currentPage={currentPage} />
    <main id="main" ref={mainRef} tabIndex={-1}><AnimatePresence mode="wait" initial={false}><motion.div key={currentPage} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: .2 }}>{currentPage === 'home' ? <HomePage /> : currentPage === 'about' ? <AboutPage /> : <DownloadPage />}</motion.div></AnimatePresence></main>
    <footer className="container site-footer"><a href="#home" className="footer-brand"><img src={asset('brand/canary-bird-white.png')} width="25" height="25" alt="" />Canary<span>Minecraft, a little calmer.</span></a><nav aria-label="Footer navigation"><a href="#home" aria-current={currentPage === 'home' ? 'page' : undefined}>Home</a><a href="#about" aria-current={currentPage === 'about' ? 'page' : undefined}>About</a><a href="#download" aria-current={currentPage === 'download' ? 'page' : undefined}>Download</a></nav></footer>
  </div>;
}
