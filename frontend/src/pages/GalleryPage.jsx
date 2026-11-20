import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Images, FolderOpen } from 'lucide-react';
import { API } from '../data/constants';

// ── Lightbox ──────────────────────────────────────────────────────────────────
function Lightbox({ images, startIndex, onClose }) {
  const [idx, setIdx] = useState(startIndex);
  const img = images[idx];

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') setIdx(i => (i + 1) % images.length);
      if (e.key === 'ArrowLeft') setIdx(i => (i - 1 + images.length) % images.length);
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [images.length, onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
      >
        <X size={20} />
      </button>

      {/* Prev */}
      {images.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); setIdx(i => (i - 1 + images.length) % images.length); }}
          className="absolute left-4 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
      )}

      {/* Image */}
      <motion.div
        key={idx}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        className="relative max-w-5xl max-h-[90vh] mx-16 flex flex-col items-center"
        onClick={e => e.stopPropagation()}
      >
        <img
          src={img.url.startsWith('http') ? img.url : `${API.replace('/api', '')}${img.url}`}
          alt={img.heading || img.caption || 'Gallery image'}
          className="max-h-[80vh] max-w-full object-contain rounded-xl shadow-2xl"
          loading="lazy"
        />
        {(img.heading || img.caption) && (
          <div className="mt-4 text-center max-w-xl px-4">
            {img.heading && <p className="text-white font-bold text-lg mb-1">{img.heading}</p>}
            {img.caption && <p className="text-white/70 text-sm">{img.caption}</p>}
          </div>
        )}
        <p className="text-white/40 text-xs mt-3">{idx + 1} / {images.length}</p>
      </motion.div>

      {/* Next */}
      {images.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); setIdx(i => (i + 1) % images.length); }}
          className="absolute right-4 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
        >
          <ChevronRight size={24} />
        </button>
      )}
    </motion.div>
  );
}

// ── Image Card ────────────────────────────────────────────────────────────────
function ImageCard({ image, onClick, index }) {
  const BASE = API.replace('/api', '');
  const src = image.url.startsWith('http') ? image.url : `${BASE}${image.url}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: (index % 12) * 0.04 }}
      className="relative group cursor-pointer overflow-hidden rounded-[22px] bg-[#141418] border border-[#c9a96e]/15 hover:border-[#c9a96e]/50 aspect-[4/3] shadow-[0_8px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_16px_40px_rgba(201,169,110,0.2)] transition-all duration-300"
      onClick={onClick}
    >
      <img
        src={src}
        alt={image.heading || image.caption || 'Gallery photo'}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
        loading="lazy"
      />
      {/* Dark Ambient Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
        {image.heading && (
          <h4 className="text-white font-display font-bold text-base leading-snug mb-1 drop-shadow-md">
            {image.heading}
          </h4>
        )}
        {image.caption && (
          <p className="text-[#f5efe6]/90 text-[13px] leading-relaxed line-clamp-2">
            {image.caption}
          </p>
        )}
        <div className="mt-2.5 flex items-center gap-1 text-[11px] font-bold text-[#c9a96e] uppercase tracking-wider">
          <span>Click to View Full Size</span>
          <span>→</span>
        </div>
      </div>

      {/* Persistent subtle caption bar when heading exists */}
      {image.heading && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent px-4 py-2.5 group-hover:opacity-0 transition-opacity duration-300">
          <p className="text-[#f5efe6] font-semibold text-[12.5px] leading-tight truncate drop-shadow-sm">
            {image.heading}
          </p>
        </div>
      )}
    </motion.div>
  );
}

// ── Folder Card ───────────────────────────────────────────────────────────────
function FolderCard({ folder, onClick }) {
  const BASE = API.replace('/api', '');
  const cover = folder.coverImage
    ? (folder.coverImage.startsWith('http') ? folder.coverImage : `${BASE}${folder.coverImage}`)
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="group cursor-pointer"
      onClick={onClick}
    >
      <div className="relative overflow-hidden rounded-[28px] aspect-[16/11] bg-[#141418] border border-[#c9a96e]/20 hover:border-[#c9a96e]/60 shadow-[0_12px_40px_rgba(0,0,0,0.6)] hover:shadow-[0_20px_50px_rgba(201,169,110,0.22)] transition-all duration-500">
        {cover ? (
          <img
            src={cover}
            alt={folder.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-106"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#1a1a24] to-[#0e0e13]">
            <FolderOpen size={56} className="text-[#c9a96e]/30" />
          </div>
        )}

        {/* Ambient Top Shadow */}
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-black/70 to-transparent pointer-events-none" />

        {/* Top Badges Bar */}
        <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between gap-2 pointer-events-none">
          {folder.imageType ? (
            <span className="px-3.5 py-1 rounded-full text-[11px] font-extrabold tracking-wider uppercase text-[#f5efe6] bg-[#0a0a0b]/80 backdrop-blur-md border border-[#c9a96e]/30 shadow-md">
              {folder.imageType}
            </span>
          ) : <span />}

          <span className="px-3 py-1 rounded-full text-[11px] font-bold text-white bg-black/70 backdrop-blur-md border border-white/10 shadow-md flex items-center gap-1.5">
            <Images size={12} className="text-[#c9a96e]" />
            <span>{folder.imageCount || 0} Photos</span>
          </span>
        </div>

        {/* Dark Deep Gradient Overlay at Bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-transparent pointer-events-none" />

        {/* Folder Info at Bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 z-10">
          <h3 className="text-xl sm:text-2xl font-display font-bold text-white leading-snug mb-1.5 group-hover:text-[#c9a96e] transition-colors drop-shadow-md">
            {folder.name}
          </h3>
          {folder.description && (
            <p className="text-slate-300 text-xs sm:text-[13px] line-clamp-2 leading-relaxed mb-3">
              {folder.description}
            </p>
          )}

          <div className="flex items-center gap-1 text-[12px] font-bold text-[#c9a96e] group-hover:translate-x-1 transition-transform">
            <span>Explore Album</span>
            <span>→</span>
          </div>
        </div>

        {/* Hover Border Glow */}
        <div className="absolute inset-0 rounded-[28px] border-2 border-[#c9a96e]/0 group-hover:border-[#c9a96e]/40 transition-colors duration-300 pointer-events-none" />
      </div>
    </motion.div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// MAIN GALLERY PAGE
// ═════════════════════════════════════════════════════════════════════════════
export default function GalleryPage() {
  const [folders, setFolders] = useState([]);
  const [activeFolder, setActiveFolder] = useState(null); // null = show folders grid
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingImages, setLoadingImages] = useState(false);
  const [lightbox, setLightbox] = useState(null); // { index }

  const BASE = API.replace('/api', '');

  const fetchFolders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/gallery/folders`);
      const data = await res.json();
      if (data.success) setFolders(data.data);
    } catch (err) {
      console.error('Gallery folders fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFolders();
    // Scroll to top
    window.scrollTo(0, 0);
  }, [fetchFolders]);

  const openFolder = async (folder) => {
    setActiveFolder(folder);
    setLoadingImages(true);
    try {
      const res = await fetch(`${API}/gallery/images?folder=${folder._id}`);
      const data = await res.json();
      if (data.success) setImages(data.data);
    } catch (err) {
      console.error('Gallery images fetch error:', err);
    } finally {
      setLoadingImages(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0b] pt-24 pb-20">
      {/* ── Hero Header ── */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <span className="inline-block text-[11px] font-bold tracking-[0.3em] uppercase text-[#c9a96e] mb-4 opacity-80">
            Our Memories
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
            Travel{' '}
            <span className="bg-gradient-to-r from-[#c9a96e] via-[#e0b870] to-[#e07b39] bg-clip-text text-transparent">
              Gallery
            </span>
          </h1>
          <p className="text-[#8a837c] text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Moments captured on our tours across India — scenic landscapes, happy travellers, and memories that last a lifetime.
          </p>
        </motion.div>

        {/* Decorative line */}
        <div className="flex items-center gap-4 mt-8 justify-center">
          <div className="h-px flex-1 max-w-24 bg-gradient-to-r from-transparent to-[#c9a96e]/30" />
          <div className="w-1.5 h-1.5 rounded-full bg-[#c9a96e]/60" />
          <div className="h-px flex-1 max-w-24 bg-gradient-to-l from-transparent to-[#c9a96e]/30" />
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Back button when inside a folder ── */}
        <AnimatePresence>
          {activeFolder && (
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              className="mb-8"
            >
              <div className="flex items-center justify-between mb-6 flex-wrap gap-4 pb-5 border-b border-white/10">
                <button
                  onClick={() => { setActiveFolder(null); setImages([]); }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#16161c] hover:bg-[#c9a96e]/15 border border-white/10 hover:border-[#c9a96e]/40 text-[#c9a96e] hover:text-white transition-all text-sm font-bold group shadow-sm cursor-pointer"
                >
                  <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                  <span>Back to All Albums</span>
                </button>

                <div className="flex items-center gap-2">
                  <span className="px-3.5 py-1.5 rounded-full text-xs font-bold text-slate-300 bg-[#16161c] border border-white/10 flex items-center gap-1.5">
                    <Images size={13} className="text-[#c9a96e]" />
                    <span>{images.length} Photos</span>
                  </span>
                </div>
              </div>

              <div className="mt-2">
                <div className="flex items-center gap-3 flex-wrap mb-2">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-white">{activeFolder.name}</h2>
                  {activeFolder.imageType && (
                    <span className="text-[11px] font-extrabold tracking-wider uppercase px-3 py-1 rounded-full bg-[#c9a96e]/20 text-[#f5efe6] border border-[#c9a96e]/40">
                      {activeFolder.imageType}
                    </span>
                  )}
                </div>
                {activeFolder.description && (
                  <p className="text-slate-300 text-sm sm:text-base max-w-3xl leading-relaxed">{activeFolder.description}</p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── LOADING ── */}
        {(loading || loadingImages) && (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-4">
              <div className="w-10 h-10 rounded-full border-2 border-[#c9a96e]/30 border-t-[#c9a96e] animate-spin" />
              <p className="text-[#8a837c] text-sm">Loading gallery...</p>
            </div>
          </div>
        )}

        {/* ── FOLDER GRID ── */}
        {!loading && !activeFolder && (
          <>
            {folders.length === 0 ? (
              <div className="text-center py-24 bg-[#141418]/60 rounded-3xl border border-white/5 p-8 max-w-lg mx-auto">
                <Images size={48} className="text-[#c9a96e]/40 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-white mb-1">Gallery coming soon</h3>
                <p className="text-slate-400 text-sm">Check back later or visit our destinations to explore our tours.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 md:gap-8">
                {folders.map(folder => (
                  <FolderCard key={folder._id} folder={folder} onClick={() => openFolder(folder)} />
                ))}
              </div>
            )}
          </>
        )}

        {/* ── IMAGES GRID (inside folder) ── */}
        {!loadingImages && activeFolder && (
          <>
            {images.length === 0 ? (
              <div className="text-center py-24 bg-[#141418]/60 rounded-3xl border border-white/5 p-8 max-w-lg mx-auto">
                <Images size={48} className="text-[#c9a96e]/40 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-white mb-1">No photos in this album yet</h3>
                <p className="text-slate-400 text-sm">Photos will appear here once uploaded from the admin panel.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-7">
                {images.map((img, i) => (
                  <ImageCard
                    key={img._id}
                    image={img}
                    index={i}
                    onClick={() => setLightbox({ index: i })}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Lightbox ── */}
      <AnimatePresence>
        {lightbox && (
          <Lightbox
            images={images}
            startIndex={lightbox.index}
            onClose={() => setLightbox(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
