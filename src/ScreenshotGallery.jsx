import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Maximize2, X } from 'lucide-react';
import { freshAssetUrl } from './freshAssetUrl';
import { usePreferences } from './Preferences';

const files = ['home.png', 'discover.png', 'library.png'];
const imageUrl = file => freshAssetUrl(`${import.meta.env.BASE_URL}screenshots/${file}`);

export default function ScreenshotGallery() {
  const { copy, t } = usePreferences();
  const gallery = copy.gallery;
  const [selected, setSelected] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const dialogRef = useRef(null);
  const previewRef = useRef(null);
  const current = gallery.screens[selected];
  const changeSlide = offset => setSelected(index => (index + offset + files.length) % files.length);

  useEffect(() => {
    if (!isExpanded) return;
    const dialog = dialogRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialog.showModal();
    return () => { dialog.close(); document.body.style.overflow = previousOverflow; previewRef.current?.focus(); };
  }, [isExpanded]);
  function handleKeys(event) {
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); changeSlide(event.key === 'ArrowRight' ? 1 : -1); }
  }

  return <section aria-label={gallery.label} className="pb-16" onKeyDown={handleKeys}>
    <div className="flex flex-wrap items-end justify-between gap-4 mb-6"><div><p className="gallery-eyebrow text-sm uppercase tracking-widest mb-2">{gallery.eyebrow}</p><h2 className="text-3xl font-bold">{gallery.heading}</h2></div><p className="gallery-helper text-sm">{gallery.helper}</p></div>
    <div className="gallery-shell rounded-2xl border overflow-hidden">
      <button ref={previewRef} type="button" onClick={() => setIsExpanded(true)} className="gallery-preview block w-full relative group" aria-label={t('gallery.enlarge', { name: current.title })} aria-haspopup="dialog">
        <div className="aspect-video overflow-hidden"><AnimatePresence mode="wait" initial={false}><motion.img key={files[selected]} src={imageUrl(files[selected])} alt={current.alt} className="w-full h-full object-contain" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }} /></AnimatePresence></div>
        <span className="gallery-expand absolute bottom-4 right-4 rounded-lg px-4 py-2 text-sm">{gallery.expand}<Maximize2 size={15} /></span>
      </button>
      <div className="gallery-controls flex items-center justify-between gap-4 p-5 border-t">
        <div aria-live="polite" aria-atomic="true"><h3 className="font-semibold">{current.title}<span className="gallery-helper ml-2 text-sm">{selected + 1} / 3</span></h3><p className="gallery-helper text-sm mt-1">{current.description}</p></div>
        <div className="flex gap-2"><button type="button" className="gallery-arrow" aria-label={gallery.previous} onClick={() => changeSlide(-1)}><ArrowLeft size={17} /></button><button type="button" className="gallery-arrow" aria-label={gallery.next} onClick={() => changeSlide(1)}><ArrowRight size={17} /></button></div>
      </div>
    </div>
    <div className="gallery-thumb-grid gap-3 mt-4" role="group" aria-label={gallery.choose}>{gallery.screens.map((screen, index) => <button type="button" key={files[index]} onClick={() => setSelected(index)} aria-pressed={selected === index} className="gallery-thumb p-2 rounded-xl border text-left"><img src={imageUrl(files[index])} alt="" loading="lazy" className="w-full aspect-video object-contain rounded-md" /><span className="block text-sm px-2 py-2">{screen.title}</span></button>)}</div>
    <dialog ref={dialogRef} className="gallery-dialog" aria-labelledby="expanded-title" onCancel={event => { event.preventDefault(); setIsExpanded(false); }} onClick={event => { if (event.target === event.currentTarget) setIsExpanded(false); }}>
      <div className="flex items-center justify-between gap-4 mb-4"><h2 id="expanded-title" className="text-lg font-semibold">{current.title} · {selected + 1} / 3</h2><button type="button" autoFocus className="gallery-arrow" aria-label={gallery.close} onClick={() => setIsExpanded(false)}><X size={18} /></button></div>
      <img src={imageUrl(files[selected])} alt={current.alt} className="w-full" />
      <div className="flex justify-between items-center gap-3 mt-4"><button type="button" className="gallery-arrow" aria-label={gallery.previousFull} onClick={() => changeSlide(-1)}><ArrowLeft size={17} />{gallery.previousText}</button><button type="button" className="gallery-arrow" aria-label={gallery.nextFull} onClick={() => changeSlide(1)}>{gallery.nextText}<ArrowRight size={17} /></button></div>
    </dialog>
  </section>;
}
