import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ScreenshotGallery from './ScreenshotGallery';

// Custom Cursor Component
const CustomCursor = () => {
  const cursorRef = useRef({ x: 0, y: 0 });
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      cursorRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseOver = (e) => {
      if (e.target.tagName === 'BUTTON' || e.target.tagName === 'A' || e.target.closest('button') || e.target.closest('a')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    let rafId;
    const animationFrame = () => {
      setCursorPos({ ...cursorRef.current });
      rafId = requestAnimationFrame(animationFrame);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);
    rafId = requestAnimationFrame(animationFrame);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      <motion.div
        className="custom-cursor fixed pointer-events-none z-[9999] mix-blend-difference"
        animate={{
          x: cursorPos.x - 20,
          y: cursorPos.y - 20,
          scale: isHovering ? 1.5 : 1,
        }}
        transition={{ type: "spring", stiffness: 500, damping: 28 }}
      >
        <div className="w-10 h-10 rounded-full border-2 border-white/80" />
      </motion.div>
      <motion.div
        className="custom-cursor fixed pointer-events-none z-[9999] mix-blend-difference"
        animate={{
          x: cursorPos.x - 3,
          y: cursorPos.y - 3,
        }}
        transition={{ type: "spring", stiffness: 1000, damping: 30 }}
      >
        <div className="w-1.5 h-1.5 rounded-full bg-white" />
      </motion.div>
    </>
  );
};

// Floating Particles Background
const ParticleBackground = () => {
  const [particles] = useState(() => Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 2,
    duration: Math.random() * 20 + 15,
    delay: Math.random() * 10,
    drift: Math.random() * 50 - 25,
  })));

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            background: 'radial-gradient(circle, rgba(180, 140, 80, 0.6) 0%, rgba(180, 140, 80, 0) 70%)',
          }}
          animate={{
            y: [0, -100, 0],
            x: [0, particle.drift, 0],
            opacity: [0, 0.8, 0],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

// Navigation
const Navigation = ({ currentPage, setCurrentPage }) => {
  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'download', label: 'Download' },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-black/30 border-b border-white/5"
    >
      <div className="max-w-7xl mx-auto px-8 py-6 flex items-center justify-between">
        <motion.div
          className="flex items-center gap-3"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-amber-600">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor"/>
          </svg>
          <span className="text-white text-xl font-semibold tracking-tight">Canary</span>
        </motion.div>

        <div className="flex items-center gap-2">
          {navItems.map((item) => (
            <motion.button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all relative overflow-hidden ${
                currentPage === item.id
                  ? 'text-white'
                  : 'text-white/60 hover:text-white'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {currentPage === item.id && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute inset-0 bg-white/10 rounded-lg"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <span className="relative z-10">{item.label}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </motion.nav>
  );
};

// Home Page
const HomePage = ({ setCurrentPage }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen pt-32 px-8"
    >
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-20"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-amber-600" />
            <span className="text-white/60 text-sm tracking-widest uppercase">Canary Launcher</span>
          </div>
          <h1 className="text-7xl font-bold text-white mb-6 leading-tight">
            A calmer way to<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">
              discover Minecraft.
            </span>
          </h1>
          <p className="text-white/60 text-xl max-w-2xl mb-10">
            Explore modpacks, mods and new ways to play. Built for players who value simplicity and performance.
          </p>
          <div className="flex gap-4">
            <motion.button
              onClick={() => setCurrentPage('download')}
              className="px-8 py-4 bg-white text-black rounded-lg font-medium text-lg relative overflow-hidden group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10">Download Now</span>
              <motion.div
                className="absolute inset-0 bg-amber-400"
                initial={{ x: '-100%' }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3 }}
              />
            </motion.button>
            <motion.button
              onClick={() => setCurrentPage('about')}
              className="px-8 py-4 border border-white/20 text-white rounded-lg font-medium text-lg hover:bg-white/5 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Learn More
            </motion.button>
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-3 gap-6 mb-20"
        >
          {[
            { icon: '⚡', title: 'Fast & Lightweight', desc: 'Optimized for performance with minimal resource usage' },
            { icon: '🎮', title: 'Modpack Support', desc: 'Discover and install thousands of community modpacks' },
            { icon: '🔧', title: 'Easy Management', desc: 'Manage instances, versions and loaders effortlessly' },
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              className="p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all cursor-pointer group"
              whileHover={{ y: -10 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{feature.icon}</div>
              <h3 className="text-white text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-white/60">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        <ScreenshotGallery />
      </div>
    </motion.div>
  );
};

// About Page
const AboutPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen pt-32 px-8"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <h1 className="text-6xl font-bold text-white mb-6">About Canary</h1>
          <p className="text-white/60 text-xl max-w-3xl">
            Canary is a modern Minecraft launcher designed for players who want a clean, 
            efficient way to discover and manage their Minecraft experience.
          </p>
        </motion.div>

        {/* Features Detail */}
        <div className="space-y-8 mb-20">
          {[
            {
              title: 'Discover',
              desc: 'Browse thousands of modpacks, mods, resource packs, and more from the community. Find exactly what you\'re looking for with powerful search and filtering.',
              icon: '🔍',
            },
            {
              title: 'Library',
              desc: 'Manage all your Minecraft instances in one place. Create new instances, import modpacks, and organize your collection with ease.',
              icon: '📚',
            },
            {
              title: 'Modpacks',
              desc: 'Install and play modpacks from popular platforms like Modrinth. From performance optimizations to complete overhauls, find your perfect setup.',
              icon: '📦',
            },
            {
              title: 'Performance',
              desc: 'Built with performance in mind. Lightweight, fast, and designed to get you into the game quickly without unnecessary bloat.',
              icon: '⚡',
            },
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="flex gap-8 p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group"
              whileHover={{ x: 10 }}
            >
              <div className="text-5xl group-hover:scale-110 transition-transform">{feature.icon}</div>
              <div>
                <h3 className="text-white text-2xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-white/60 text-lg">{feature.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tech Stack */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="p-12 rounded-2xl bg-gradient-to-br from-amber-900/20 to-black border border-amber-600/20"
        >
          <h2 className="text-3xl font-bold text-white mb-6">Built with Modern Technology</h2>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h4 className="text-amber-400 font-semibold mb-2">Cross-Platform</h4>
              <p className="text-white/60">Available on Windows, macOS, and Linux</p>
            </div>
            <div>
              <h4 className="text-amber-400 font-semibold mb-2">Open Source</h4>
              <p className="text-white/60">Transparent development, community-driven</p>
            </div>
            <div>
              <h4 className="text-amber-400 font-semibold mb-2">Regular Updates</h4>
              <p className="text-white/60">Always up to date with latest Minecraft versions</p>
            </div>
            <div>
              <h4 className="text-amber-400 font-semibold mb-2">Community First</h4>
              <p className="text-white/60">Built by players, for players</p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

// Download Page
const DownloadPage = () => {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen pt-32 px-8 flex items-center justify-center"
    >
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-600/20 border border-amber-600/30 mb-8"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="w-2 h-2 rounded-full bg-amber-600 animate-pulse" />
            <span className="text-amber-400 text-sm font-medium">In Active Development</span>
          </motion.div>

          <h1 className="text-6xl font-bold text-white mb-6">Coming Soon</h1>
          <p className="text-white/60 text-xl mb-12 max-w-2xl mx-auto">
            Canary is currently in active development. We're working hard to bring you 
            the best Minecraft launcher experience. Release coming soon!
          </p>

          <motion.div
            className="inline-block p-12 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm mb-12"
            whileHover={{ scale: 1.02 }}
            onHoverStart={() => setIsHovering(true)}
            onHoverEnd={() => setIsHovering(false)}
          >
            <div className="text-8xl mb-6"></div>
            <h3 className="text-white text-2xl font-semibold mb-3">Release Status</h3>
            <p className="text-white/60">Beta testing phase</p>
            
            <motion.div
              className="mt-8 h-2 bg-white/10 rounded-full overflow-hidden"
              animate={{ opacity: isHovering ? 1 : 0.7 }}
            >
              <motion.div
                className="h-full bg-gradient-to-r from-amber-600 to-amber-400 rounded-full"
                initial={{ width: '0%' }}
                animate={{ width: '65%' }}
                transition={{ duration: 2, ease: "easeOut" }}
              />
            </motion.div>
            <p className="text-white/40 text-sm mt-3">65% Complete</p>
          </motion.div>

          <div className="space-y-4">
            <motion.button
              disabled
              className="px-12 py-5 bg-white/20 text-white/40 rounded-lg font-medium text-lg cursor-not-allowed relative overflow-hidden"
            >
              <span className="relative z-10">Download (Coming Soon)</span>
            </motion.button>
            
            <p className="text-white/40 text-sm">
              Be the first to know when Canary launches. Join our community for updates.
            </p>
          </div>

          {/* Platform Icons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-16 flex justify-center gap-8"
          >
            {['Windows', 'macOS', 'Linux'].map((platform, idx) => (
              <motion.div
                key={platform}
                className="flex flex-col items-center gap-2"
                whileHover={{ y: -5 }}
              >
                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl">
                  {platform === 'Windows' && '🪟'}
                  {platform === 'macOS' && '🍎'}
                  {platform === 'Linux' && '🐧'}
                </div>
                <span className="text-white/60 text-sm">{platform}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

// Main App
export default function App() {
  const [currentPage, setCurrentPage] = useState('home');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-950 relative overflow-hidden">
      <CustomCursor />
      <ParticleBackground />
      <Navigation currentPage={currentPage} setCurrentPage={setCurrentPage} />
      
      <AnimatePresence mode="wait">
        {currentPage === 'home' && <HomePage key="home" setCurrentPage={setCurrentPage} />}
        {currentPage === 'about' && <AboutPage key="about" />}
        {currentPage === 'download' && <DownloadPage key="download" />}
      </AnimatePresence>
    </div>
  );
}
