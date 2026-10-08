import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Maximize2, X } from 'lucide-react';

const screenshots = [
  { file: 'home.png', title: 'Home', description: 'Your next Minecraft adventure starts here.', alt: 'Canary home screen with a featured adventure and popular modpacks' },
  { file: 'discover.png', title: 'Discover', description: 'Find modpacks, mods and new ways to play.', alt: 'Canary Discover screen with search, filters and community modpacks' },
  { file: 'library.png', title: 'Library', description: 'Create an instance and let Canary prepare your game.', alt: 'Canary Library with the new instance dialog and asset download progress' },
];
const imageUrl = (file) => `${import.meta.env.BASE_URL}screenshots/${file}`;

export default function ScreenshotGallery() {
  const [selected, setSelected] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const dialogRef = useRef(null);
  const previewRef = useRef(null);
  const current = screenshots[selected];
  const changeSlide = (offset) => setSelected((index) => (index + offset + screenshots.length) % screenshots.length);

  useEffect(() => {
    if (!isExpanded) return;
    const dialog = dialogRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialog.showModal();
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
      previewRef.current?.focus();
    };
  }, [isExpanded]);

  function handleKeys(event) {
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();
      changeSlide(event.key === 'ArrowRight' ? 1 : -1);
    }
  }
  const arrowClass = 'inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-white/15 bg-white/5 hover:bg-white/15 transition-colors';

  return (
    <section aria-label="Canary screenshots" className="pb-16" onKeyDown={handleKeys}>
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div>
          <p className="text-amber-400 text-sm uppercase tracking-widest mb-2">Inside Canary</p>
          <h2 className="text-white text-3xl font-bold">Find your next story.</h2>
        </div>
        <p className="text-white/50 text-sm">Select a screen. Click the preview to explore.</p>
      </div>
      <div className="gallery-shell rounded-2xl border border-white/10 bg-black/40 overflow-hidden">
        <button ref={previewRef} type="button" onClick={() => setIsExpanded(true)} className="gallery-preview block w-full relative group" aria-label={`Enlarge ${current.title} screenshot`} aria-haspopup="dialog">
          <div className="aspect-video overflow-hidden">
            <AnimatePresence mode="wait" initial={false}>
              <motion.img key={current.file} src={imageUrl(current.file)} alt={current.alt} className="w-full h-full object-contain" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }} />
            </AnimatePresence>
          </div>
          <span className="gallery-expand absolute bottom-4 right-4 rounded-lg border border-white/20 bg-black/70 px-4 py-2 text-white text-sm group-hover:bg-amber-600">Expand <Maximize2 size={15} /></span>
        </button>
        <div className="gallery-controls flex items-center justify-between gap-4 p-5 border-t border-white/10">
          <div aria-live="polite" aria-atomic="true"><h3 className="text-white font-semibold">{current.title} <span className="ml-2 text-white/40 text-sm">{selected + 1} / 3</span></h3><p className="text-white/60 text-sm mt-1">{current.description}</p></div>
          <div className="flex gap-2"><button type="button" className={arrowClass} aria-label="Previous screenshot" onClick={() => changeSlide(-1)}><ArrowLeft size={17} /></button><button type="button" className={arrowClass} aria-label="Next screenshot" onClick={() => changeSlide(1)}><ArrowRight size={17} /></button></div>
        </div>
      </div>
      <div className="gallery-thumb-grid gap-3 mt-4" role="group" aria-label="Choose screenshot">
        {screenshots.map((screen, index) => (
          <button type="button" key={screen.file} onClick={() => setSelected(index)} aria-pressed={selected === index} className={`gallery-thumb p-2 rounded-xl border text-left transition-colors ${selected === index ? 'border-amber-500 bg-amber-500/10' : 'border-white/10 bg-white/5 hover:border-white/30'}`}>
            <img src={imageUrl(screen.file)} alt="" loading="lazy" className="w-full aspect-video object-contain rounded-md" />
            <span className="block text-white text-sm px-2 py-2">{screen.title}</span>
          </button>
        ))}
      </div>
      <dialog ref={dialogRef} className="gallery-dialog" aria-labelledby="expanded-title" onCancel={(event) => { event.preventDefault(); setIsExpanded(false); }} onClick={(event) => { if (event.target === event.currentTarget) setIsExpanded(false); }}>
        <div className="flex items-center justify-between gap-4 mb-4"><h2 id="expanded-title" className="text-lg font-semibold">{current.title} · {selected + 1} / 3</h2><button type="button" autoFocus className={arrowClass} aria-label="Close screenshot viewer" onClick={() => setIsExpanded(false)}><X size={18} /></button></div>
        <img src={imageUrl(current.file)} alt={current.alt} className="w-full" />
        <div className="flex justify-between items-center gap-3 mt-4"><button type="button" className={arrowClass} aria-label="Previous enlarged screenshot" onClick={() => changeSlide(-1)}><ArrowLeft size={17} />Previous</button><button type="button" className={arrowClass} aria-label="Next enlarged screenshot" onClick={() => changeSlide(1)}>Next<ArrowRight size={17} /></button></div>
      </dialog>
    </section>
  );
}
