import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import {
  MapPin, ArrowRight, X, Calendar, Clock, MessageCircle,
  CheckCircle, CheckCircle2, XCircle, Info, Phone, Users,
  Sparkles, Tag, AlertCircle, Flame
} from 'lucide-react';
import { BRAND, API } from '../data/constants';

// Helper to normalize category, experiences, highlights, inclusions, exclusions
const normalizeList = (val) => {
  if (!val) return [];
  if (Array.isArray(val)) {
    return val.flatMap(c => {
      if (typeof c !== 'string') return [c];
      try {
        const parsed = JSON.parse(c);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) { }
      if (c.startsWith('"') && c.endsWith('"')) return [c.slice(1, -1)];
      if (c.includes('\n')) return c.split('\n').map(s => s.trim()).filter(Boolean);
      return [c.trim()];
    }).filter(Boolean);
  }
  if (typeof val === 'string') {
    try {
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed)) return normalizeList(parsed);
    } catch (e) { }
    if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
    return val.split('\n').map(s => s.trim()).filter(Boolean);
  }
};

// Helper to generate personalized WhatsApp booking URL with tour package details
export const generateWhatsAppBookingUrl = (dest) => {
  const agencyPhone = '918918106326';
  if (!dest) {
    return `https://wa.me/${agencyPhone}?text=${encodeURIComponent('Hello Bangalir Berano! 👋 I would like to enquire about your tour packages.')}`;
  }

  const lines = [
    'Hello Bangalir Berano!',
    '',
    'I would like to enquire / book the following tour package:',
    '',
    ` *Package:* ${dest.name || 'Tour Package'}`
  ];

  if (dest.date) {
    lines.push(` *Date:* ${dest.date}`);
  }
  if (dest.duration) {
    lines.push(` *Duration:* ${dest.duration}`);
  }
  if (dest.price) {
    lines.push(` *Package Cost:* ${dest.price}${dest.priceNote ? ` (${dest.priceNote})` : ''}`);
  }
  if (dest.route) {
    lines.push(` *Route:* ${dest.route}`);
  }
  if (dest.seatsLeft != null && dest.seatsLeft !== '') {
    lines.push(` *Seats Available:* ${dest.seatsLeft}`);
  }

  lines.push('');
  lines.push('Please let me know about seat availability and booking details. Thank you!');

  return `https://wa.me/${agencyPhone}?text=${encodeURIComponent(lines.join('\n'))}`;
};

export function DestinationCard({ dest, index, onOpenDetails, onOpenBook }) {
  const categoriesList = normalizeList(dest.category);
  const experiencesList = normalizeList(dest.experiences);
  const primaryTag = dest.tag || categoriesList[0] || experiencesList[0] || 'Tour';

  return (
    <motion.article
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min((index || 0) * 0.04, 0.2) }}
      className="destination-card group relative overflow-hidden rounded-[28px] bg-[#16161a] border border-white/5 will-change-transform shadow-[0_8px_30px_rgba(0,0,0,0.4)] hover:border-[#c9a96e]/30 transition-all flex flex-col justify-between"
      aria-label={`${dest.name}, ${dest.route || dest.region || ''}`}
    >
      <div>
        {/* Poster / Cover Image */}
        <div
          onClick={() => onOpenDetails && onOpenDetails(dest)}
          className="relative aspect-[16/10] sm:aspect-[16/11] md:aspect-[4/5] overflow-hidden rounded-t-[28px] cursor-pointer bg-black/40"
        >
          <img
            src={dest.image}
            alt={dest.name}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.2s] group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#16161a] via-transparent to-transparent opacity-80" />

          {/* Top Badges Bar */}
          <div className="absolute top-4 left-4 right-4 z-10 flex items-start justify-between gap-2 pointer-events-none">
            <div className="flex flex-wrap gap-1.5 max-w-[65%] pointer-events-auto">
              <span className="px-3 py-1 rounded-full text-[10.5px] font-bold tracking-wider uppercase text-[#c9a96e] bg-[#0a0a0b]/75 backdrop-blur-md border border-[#c9a96e]/25 shadow-md shrink-0">
                {dest.status || primaryTag}
              </span>
              {dest.tag && dest.status && (
                <span className="hidden sm:inline-block px-2.5 py-1 rounded-full text-[10px] font-semibold text-white/80 bg-black/60 backdrop-blur-md border border-white/10 truncate max-w-[120px]">
                  {dest.tag}
                </span>
              )}
            </div>

            {/* Top Right: Seats Left Badge (Flashing / Glowing when < 15) */}
            {dest.seatsLeft != null && dest.seatsLeft !== '' && (() => {
              const s = Number(dest.seatsLeft);
              const isUrgent = !isNaN(s) && s < 15 && s > 0;
              const isSoldOut = !isNaN(s) && s === 0;

              if (isSoldOut) {
                return (
                  <div className="shrink-0 pointer-events-auto">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase text-red-300 bg-red-950/85 backdrop-blur-md border border-red-500/40 flex items-center gap-1 shadow-md">
                      <AlertCircle size={11} className="text-red-400" /> Sold Out
                    </span>
                  </div>
                );
              }

              if (isUrgent) {
                return (
                  <div className="shrink-0 pointer-events-auto">
                    <span className="urgent-seats-badge px-3 py-1 rounded-full text-[10.5px] font-extrabold tracking-wider uppercase text-white bg-gradient-to-r from-red-600/90 via-orange-600/90 to-amber-500/90 backdrop-blur-md border border-amber-300 flex items-center gap-1.5 shadow-[0_0_15px_rgba(245,158,11,0.6)] select-none">
                      <Flame size={12} className="text-yellow-200 fill-yellow-300 animate-pulse shrink-0" />
                      <span className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">Hurry! Only {s} Left!</span>
                    </span>
                  </div>
                );
              }

              return (
                <div className="shrink-0 pointer-events-auto">
                  <span className="px-3 py-1 rounded-full text-[10.5px] font-bold tracking-wider uppercase text-amber-300 bg-amber-950/80 backdrop-blur-md border border-amber-500/30 flex items-center gap-1 shadow-md">
                    <Users size={11} className="text-amber-400" /> {dest.seatsLeft} Seats
                  </span>
                </div>
              );
            })()}
          </div>

          {/* Hover Hint */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <span className="px-4 py-2 rounded-full bg-[#0a0a0b]/80 backdrop-blur-md text-white text-xs font-bold border border-white/20 flex items-center gap-1.5 shadow-xl transform translate-y-2 group-hover:translate-y-0 transition-transform">
              <Info size={14} className="text-[#c9a96e]" /> View Full Details
            </span>
          </div>
        </div>

        {/* Card Body with all fields */}
        <div className="p-4 sm:p-5 pb-2">
          {/* Categories & Experiences pills */}
          <div className="flex flex-wrap gap-1.5 mb-2.5">
            {categoriesList.slice(0, 2).map((cat, i) => (
              <span key={i} className="text-[10px] font-bold uppercase tracking-wider text-[#c9a96e] bg-[#c9a96e]/10 px-2 py-0.5 rounded-md border border-[#c9a96e]/20">
                {cat}
              </span>
            ))}
            {dest.tag && categoriesList.length === 0 && (
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#c9a96e] bg-[#c9a96e]/10 px-2 py-0.5 rounded-md border border-[#c9a96e]/20 truncate max-w-[200px]">
                {dest.tag}
              </span>
            )}
          </div>

          {/* Tour Title */}
          <h3
            onClick={() => onOpenDetails && onOpenDetails(dest)}
            className="text-lg md:text-xl font-display font-bold text-white hover:text-[#c9a96e] transition-colors cursor-pointer mb-2 leading-snug line-clamp-2"
          >
            {dest.name}
          </h3>

          {/* Route / Places Covered */}
          {(dest.route || dest.region) && (
            <p className="text-[12.5px] text-[#a09a8e] flex items-start gap-1.5 mb-3 line-clamp-1">
              <MapPin size={13} className="text-[#c9a96e] shrink-0 mt-0.5" />
              <span className="truncate">{dest.route || dest.region}</span>
            </p>
          )}

          {/* Date & Duration Row */}
          <div className="flex items-center gap-3 text-[12px] text-slate-300 py-2 border-y border-white/5 mb-3">
            {dest.date && (
              <div className="flex items-center gap-1.5 truncate">
                <Calendar size={13} className="text-[#c9a96e] shrink-0" />
                <span className="truncate">{dest.date}</span>
              </div>
            )}
            {dest.duration && (
              <div className="flex items-center gap-1.5 truncate ml-auto">
                <Clock size={13} className="text-[#c9a96e] shrink-0" />
                <span className="truncate">{dest.duration}</span>
              </div>
            )}
          </div>

          {/* Price & Basis Row */}
          <div className="flex items-baseline justify-between mb-4">
            <div>
              <span className="text-[10px] text-[#8e887f] font-bold uppercase tracking-wider block">Package Cost</span>
              <span className="text-base md:text-lg font-bold text-white tracking-tight">
                {dest.price}
              </span>
            </div>
            {dest.priceNote && (
              <span className="text-[11px] text-[#c9a96e] text-right max-w-[55%] truncate font-medium">
                {dest.priceNote}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons: 3 Options (Details, Book Now, Book via WhatsApp) */}
      <div className="p-4 sm:p-5 pt-0 flex flex-col gap-2 sm:gap-2.5">
        <div className="flex gap-2 sm:gap-2.5">
          {onOpenDetails && (
            <button
              type="button"
              onClick={() => onOpenDetails(dest)}
              className="flex-1 bg-[#1a1a1f] border border-white/10 hover:border-[#c9a96e]/50 text-white font-semibold py-2.5 sm:py-3 rounded-xl text-[13px] sm:text-[13.5px] transition-all hover:bg-white/5 flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Info size={14} className="text-[#c9a96e]" /> Details
            </button>
          )}

          {onOpenBook && (
            <button
              type="button"
              onClick={() => onOpenBook(dest)}
              className="flex-1 bg-gradient-to-r from-[#c9a96e] to-[#e07b39] text-[#0a0a0b] font-bold py-2.5 sm:py-3 rounded-xl text-[13px] sm:text-[13.5px] transition-transform hover:-translate-y-0.5 flex items-center justify-center gap-1.5 shadow-[0_4px_20px_rgba(201,169,110,0.3)] hover:shadow-[0_6px_25px_rgba(201,169,110,0.45)] cursor-pointer"
            >
              <Calendar size={14} /> Book Now
            </button>
          )}
        </div>

        <a
          href={generateWhatsAppBookingUrl(dest)}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full bg-[#25D366]/15 hover:bg-[#25D366] text-[#25D366] hover:text-[#0a0a0b] border border-[#25D366]/40 hover:border-[#25D366] font-bold py-2.5 sm:py-3 rounded-xl text-[13px] sm:text-[13.5px] transition-all duration-300 flex items-center justify-center gap-2 group/wa shadow-[0_4px_16px_rgba(37,211,102,0.12)] hover:shadow-[0_4px_25px_rgba(37,211,102,0.4)] hover:-translate-y-0.5 cursor-pointer backdrop-blur-sm"
        >
          <MessageCircle size={15} className="text-[#25D366] group-hover/wa:text-[#0a0a0b] transition-colors" />
          <span>Book via WhatsApp</span>
        </a>
      </div>
    </motion.article>
  );
}

export function TourDetailsModal({ dest, onClose, onOpenBook }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'auto'; };
  }, []);

  if (!dest) return null;

  const categoriesList = normalizeList(dest.category);
  const experiencesList = normalizeList(dest.experiences);
  const highlightsList = normalizeList(dest.highlights);
  const includesList = normalizeList(dest.includes);
  const excludesList = normalizeList(dest.excludes);

  const hasPricingDetails = dest.price || dest.priceNote || dest.childRate1 || dest.childRate2 || dest.advance;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-[#0a0a0b]/85 backdrop-blur-md"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-5xl max-h-[92vh] bg-[#0c0c0f] border border-white/10 rounded-[28px] md:rounded-[32px] overflow-hidden shadow-[0_25px_70px_rgba(0,0,0,0.8)] flex flex-col md:flex-row my-auto z-10"
      >
        {/* Fixed Close Button - Always visible at top-right of modal */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-3 right-3 sm:top-5 sm:right-5 z-40 w-9 h-9 sm:w-10 sm:h-10 bg-black/80 hover:bg-black backdrop-blur-md border border-white/20 hover:border-[#c9a96e]/60 rounded-full flex items-center justify-center text-white/90 hover:text-white transition-all shadow-[0_4px_20px_rgba(0,0,0,0.7)] hover:scale-105 active:scale-95 cursor-pointer"
        >
          <X size={18} />
        </button>
        {/* Left Column: Cover / Poster Image */}
        <div className="md:w-5/12 bg-[#08080a] relative flex flex-col shrink-0 border-b md:border-b-0 md:border-r border-white/5">
          <div className="w-full h-52 sm:h-64 md:h-full relative overflow-hidden flex items-center justify-center bg-black/60 group">
            <img
              src={dest.image}
              alt={dest.name}
              className="w-full h-full object-contain md:object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0f] via-transparent to-transparent md:hidden pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#0c0c0f]/80 hidden md:block pointer-events-none" />

            {/* Overlays on Image */}
            <div className="absolute top-4 left-4 z-10 flex flex-wrap gap-1.5 max-w-[85%]">
              <span className="px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase text-emerald-400 bg-emerald-950/80 backdrop-blur-md border border-emerald-500/30 flex items-center gap-1.5 shadow-lg">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {dest.status || 'Upcoming'}
              </span>
              {dest.tag && (
                <span className="hidden sm:inline-block px-2.5 py-1 rounded-full text-[10.5px] font-semibold text-white/90 bg-black/75 backdrop-blur-md border border-white/10 truncate max-w-[180px]">
                  {dest.tag}
                </span>
              )}
            </div>

            {/* Seats Left Overlay (Flashing / Glowing when < 15) */}
            {dest.seatsLeft != null && dest.seatsLeft !== '' && (() => {
              const s = Number(dest.seatsLeft);
              const isUrgent = !isNaN(s) && s < 15 && s > 0;
              const isSoldOut = !isNaN(s) && s === 0;

              if (isSoldOut) {
                return (
                  <div className="absolute top-4 right-4 z-10">
                    <span className="px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase text-red-300 bg-red-950/85 backdrop-blur-md border border-red-500/40 flex items-center gap-1.5 shadow-lg">
                      <AlertCircle size={12} className="text-red-400" /> Sold Out
                    </span>
                  </div>
                );
              }

              if (isUrgent) {
                return (
                  <div className="absolute top-4 right-4 z-10">
                    <span className="urgent-seats-badge px-3.5 py-1.5 rounded-full text-[11px] font-extrabold tracking-wider uppercase text-white bg-gradient-to-r from-red-600/95 via-orange-600/95 to-amber-500/95 backdrop-blur-md border border-amber-300 flex items-center gap-1.5 shadow-[0_0_18px_rgba(245,158,11,0.7)] select-none">
                      <Flame size={13} className="text-yellow-200 fill-yellow-300 animate-pulse shrink-0" />
                      <span className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">Hurry! Only {s} Seats Left!</span>
                    </span>
                  </div>
                );
              }

              return (
                <div className="absolute top-4 right-4 z-10">
                  <span className="px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase text-amber-300 bg-amber-950/80 backdrop-blur-md border border-amber-500/30 flex items-center gap-1.5 shadow-lg">
                    <Users size={12} className="text-amber-400" />
                    {dest.seatsLeft} Seats Left
                  </span>
                </div>
              );
            })()}

            {/* Duration pill overlay on desktop */}
            {dest.duration && (
              <div className="hidden md:flex absolute bottom-4 left-4 z-10 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white/90 bg-black/70 backdrop-blur-md border border-white/10 items-center gap-2 shadow-lg">
                <Clock size={13} className="text-[#c9a96e]" /> {dest.duration}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Full Details */}
        <div className="md:w-7/12 flex flex-col min-h-0 flex-1 max-h-[70vh] md:max-h-[92vh] bg-[#121216] relative overflow-hidden">
          {/* Scrollable Content Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 pr-4 sm:pr-5 md:pr-7 custom-scrollbar space-y-4 sm:space-y-6">
            {/* Header Bar with Badges */}
            <div className="flex items-start justify-between gap-4 pr-12">
              <div className="flex flex-wrap items-center gap-1.5">
                {categoriesList.map((cat, i) => (
                  <span key={`cat-${i}`} className="px-2.5 py-1 rounded-md text-[10.5px] font-bold tracking-wider uppercase bg-[#c9a96e]/15 text-[#c9a96e] border border-[#c9a96e]/25">
                    {cat}
                  </span>
                ))}
                {experiencesList.map((exp, i) => (
                  <span key={`exp-${i}`} className="px-2.5 py-1 rounded-md text-[10.5px] font-bold tracking-wider uppercase bg-white/5 text-slate-300 border border-white/10">
                    {exp}
                  </span>
                ))}
                {dest.tag && categoriesList.length === 0 && (
                  <span className="px-2.5 py-1 rounded-md text-[10.5px] font-bold tracking-wider uppercase bg-white/5 text-amber-200/90 border border-amber-500/20">
                    {dest.tag}
                  </span>
                )}
              </div>
            </div>

          {/* Tour Title */}
          <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-4 mt-1 tracking-tight leading-snug">
            {dest.name}
          </h2>

          {/* Route / Places Covered */}
          {(dest.route || dest.region) && (
            <div className="flex items-start gap-3 bg-[#181820] border border-white/5 rounded-2xl p-3.5 mb-5 shadow-sm">
              <div className="w-8 h-8 rounded-xl bg-[#c9a96e]/15 border border-[#c9a96e]/25 flex items-center justify-center shrink-0 mt-0.5 text-[#c9a96e]">
                <MapPin size={16} />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-[#a09a8e] block mb-0.5">
                  Route / Places Covered
                </span>
                <span className="text-[13px] md:text-[14px] text-white/95 font-medium leading-relaxed block break-words">
                  {dest.route || dest.region}
                </span>
              </div>
            </div>
          )}

          {/* Key Info Stat Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-5">
            <div className="bg-[#181820] border border-white/5 rounded-xl p-3 flex flex-col justify-between">
              <span className="text-[10px] font-bold tracking-wider uppercase text-[#a09a8e] flex items-center gap-1.5 mb-1">
                <Calendar size={12} className="text-[#c9a96e]" /> Travel Date
              </span>
              <span className="text-[13px] font-bold text-white truncate" title={dest.date || 'TBA'}>
                {dest.date || 'TBA'}
              </span>
            </div>
            <div className="bg-[#181820] border border-white/5 rounded-xl p-3 flex flex-col justify-between">
              <span className="text-[10px] font-bold tracking-wider uppercase text-[#a09a8e] flex items-center gap-1.5 mb-1">
                <Clock size={12} className="text-[#c9a96e]" /> Duration
              </span>
              <span className="text-[13px] font-bold text-white truncate" title={dest.duration || 'Flexible'}>
                {dest.duration || 'Flexible'}
              </span>
            </div>
            <div className="bg-[#181820] border border-white/5 rounded-xl p-3 flex flex-col justify-between">
              <span className="text-[10px] font-bold tracking-wider uppercase text-[#a09a8e] flex items-center gap-1.5 mb-1">
                <Tag size={12} className="text-[#c9a96e]" /> Cost
              </span>
              <span className="text-[13px] font-bold text-[#c9a96e] truncate" title={dest.price || 'Contact'}>
                {dest.price || 'Contact'}
              </span>
            </div>
            <div className="bg-[#181820] border border-white/5 rounded-xl p-3 flex flex-col justify-between">
              <span className="text-[10px] font-bold tracking-wider uppercase text-[#a09a8e] flex items-center gap-1.5 mb-1">
                <Users size={12} className="text-[#c9a96e]" /> Seats Left
              </span>
              <span className="text-[13px] font-bold text-white truncate">
                {dest.seatsLeft != null && dest.seatsLeft !== '' ? `${dest.seatsLeft} Available` : 'Available'}
              </span>
            </div>
          </div>

          {/* Short Description */}
          {dest.description && (
            <p className="text-[13.5px] md:text-[14px] text-[#b3aba0] leading-relaxed mb-6 font-normal">
              {dest.description}
            </p>
          )}

          {/* Pricing & Booking Breakdown Card */}
          {hasPricingDetails && (
            <div className="mb-6 rounded-2xl bg-gradient-to-br from-[#181822] to-[#14141a] border border-[#c9a96e]/20 p-4.5 shadow-md">
              <div className="flex items-center justify-between mb-3.5 pb-2.5 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-[#c9a96e]/20 flex items-center justify-center text-[#c9a96e] text-xs font-bold">
                    ₹
                  </div>
                  <h3 className="text-[12px] font-bold tracking-wider uppercase text-[#c9a96e]">
                    Pricing & Booking Details
                  </h3>
                </div>
                {dest.priceNote && (
                  <span className="text-[11px] font-semibold text-slate-400 bg-white/5 px-2.5 py-0.5 rounded-full border border-white/5">
                    {dest.priceNote}
                  </span>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[13px]">
                <div className="bg-black/35 rounded-xl p-3 border border-white/5">
                  <span className="text-[10.5px] text-[#8e887f] font-bold uppercase tracking-wider block">
                    Package Cost (Adult)
                  </span>
                  <span className="text-[16px] font-bold text-white mt-0.5 block">
                    {dest.price}
                  </span>
                  {dest.priceNote && (
                    <span className="text-[11px] text-[#c9a96e]/90 mt-0.5 block">
                      {dest.priceNote}
                    </span>
                  )}
                </div>
                {dest.advance && (
                  <div className="bg-black/35 rounded-xl p-3 border border-white/5">
                    <span className="text-[10.5px] text-[#8e887f] font-bold uppercase tracking-wider block">
                      Advance / Booking Amount
                    </span>
                    <span className="text-[15px] font-bold text-emerald-400 mt-0.5 block">
                      {dest.advance}
                    </span>
                    <span className="text-[11px] text-slate-400 mt-0.5 block">
                      Required for seat confirmation
                    </span>
                  </div>
                )}
                {dest.childRate1 && (
                  <div className="bg-black/35 rounded-xl p-3 border border-white/5">
                    <span className="text-[10.5px] text-[#8e887f] font-bold uppercase tracking-wider block">
                      Child Rate 1
                    </span>
                    <span className="text-[13px] font-semibold text-white mt-0.5 block">
                      {dest.childRate1}
                    </span>
                  </div>
                )}
                {dest.childRate2 && (
                  <div className="bg-black/35 rounded-xl p-3 border border-white/5">
                    <span className="text-[10.5px] text-[#8e887f] font-bold uppercase tracking-wider block">
                      Child Rate 2
                    </span>
                    <span className="text-[13px] font-semibold text-white mt-0.5 block">
                      {dest.childRate2}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Highlights */}
          {highlightsList.length > 0 && (
            <div className="mb-6">
              <h3 className="text-[12px] font-bold tracking-wider text-white uppercase mb-3 flex items-center gap-2">
                <Sparkles size={14} className="text-[#c9a96e]" /> Highlights
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {highlightsList.map((h, i) => (
                  <div
                    key={i}
                    className="text-[13px] text-[#b3aba0] flex items-start gap-2.5 bg-white/[0.02] p-2.5 rounded-xl border border-white/5 hover:border-white/10 transition-colors"
                  >
                    <CheckCircle size={15} className="text-[#c9a96e] shrink-0 mt-0.5" />
                    <span className="leading-snug">{h}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Day-by-Day Itinerary (if available) */}
          {dest.itinerary && dest.itinerary.length > 0 && (
            <div className="mb-6">
              <h3 className="text-[12px] font-bold tracking-wider text-white uppercase mb-3 flex items-center gap-2">
                <Calendar size={14} className="text-[#c9a96e]" /> Day-wise Itinerary
              </h3>
              <div className="space-y-2.5">
                {dest.itinerary.map((item, i) => (
                  <div key={i} className="bg-white/[0.02] border border-white/5 rounded-xl p-3 flex gap-3">
                    <div className="px-2.5 py-1 rounded-lg bg-[#c9a96e]/15 border border-[#c9a96e]/30 text-[#c9a96e] text-xs font-bold shrink-0 h-fit">
                      Day {item.day || i + 1}
                    </div>
                    <div>
                      <p className="text-[13px] font-bold text-white mb-0.5">{item.title}</p>
                      <p className="text-[12px] text-[#a09a8e] leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Inclusions & Exclusions */}
          {(includesList.length > 0 || excludesList.length > 0) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {includesList.length > 0 && (
                <div className="bg-emerald-950/20 border border-emerald-500/25 rounded-2xl p-4">
                  <h3 className="text-[11.5px] font-bold tracking-wider text-emerald-400 uppercase mb-3 flex items-center gap-1.5">
                    <CheckCircle2 size={15} className="text-emerald-400" /> Inclusions
                  </h3>
                  <ul className="space-y-2">
                    {includesList.map((inc, i) => (
                      <li key={i} className="text-[12.5px] text-emerald-100/80 flex items-start gap-2 leading-snug">
                        <span className="text-emerald-400 font-bold shrink-0 mt-0.5">✓</span>
                        <span>{inc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {excludesList.length > 0 && (
                <div className="bg-red-950/15 border border-red-500/20 rounded-2xl p-4">
                  <h3 className="text-[11.5px] font-bold tracking-wider text-red-400 uppercase mb-3 flex items-center gap-1.5">
                    <XCircle size={15} className="text-red-400" /> Exclusions
                  </h3>
                  <ul className="space-y-2">
                    {excludesList.map((exc, i) => (
                      <li key={i} className="text-[12.5px] text-red-100/80 flex items-start gap-2 leading-snug">
                        <span className="text-red-400 font-bold shrink-0 mt-0.5">✕</span>
                        <span>{exc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Important Notes & Policies */}
          {(dest.notes || dest.cancellationPolicy) && (
            <div className="mb-6 bg-amber-950/15 border border-amber-500/20 rounded-2xl p-4 text-[12.5px] text-amber-200/90 leading-relaxed">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-amber-400 mb-1.5 flex items-center gap-1.5">
                <AlertCircle size={13} /> Notes & Policy
              </h4>
              {dest.notes && <p className="mb-2 whitespace-pre-line">{dest.notes}</p>}
              {dest.cancellationPolicy && (
                <p className="whitespace-pre-line text-white/70 italic text-[12px]">
                  {dest.cancellationPolicy}
                </p>
              )}
            </div>
          )}

            {/* Bottom cushion spacer so the last item never touches the border */}
            <div className="h-4" />
          </div>

          {/* Fixed Bottom Action Bar - Outside scroll area: NEVER overlaps content */}
          <div className="shrink-0 px-4 sm:px-6 md:px-8 py-3.5 sm:py-4 bg-[#0e0e12] border-t border-white/10 flex flex-col sm:flex-row gap-2.5 sm:gap-3 shadow-[0_-12px_32px_rgba(0,0,0,0.65)] z-20">
            <button
              onClick={() => { onClose(); onOpenBook(dest); }}
              className="flex-1 bg-gradient-to-r from-[#c9a96e] to-[#e07b39] text-[#0a0a0b] font-bold py-3.5 px-6 rounded-xl text-[14px] transition-all hover:-translate-y-0.5 hover:shadow-[0_4px_25px_rgba(201,169,110,0.4)] flex justify-center items-center gap-2 shadow-lg cursor-pointer active:scale-98"
            >
              <Calendar size={16} /> Book Now
            </button>
            <a
              href={generateWhatsAppBookingUrl(dest)}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 rounded-xl border border-[#25D366]/40 bg-[#25D366]/15 hover:bg-[#25D366] text-[#25D366] hover:text-[#0a0a0b] text-[13.5px] font-bold transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5 shadow-[0_4px_16px_rgba(37,211,102,0.15)] hover:shadow-[0_6px_24px_rgba(37,211,102,0.35)] cursor-pointer group/wa active:scale-98"
            >
              <MessageCircle size={16} className="text-[#25D366] group-hover/wa:text-[#0a0a0b] transition-colors" /> Book via WhatsApp
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export function BookModal({ dest, onClose }) {
  const [form, setForm] = useState({ name: '', phone: '', email: '', date: '', persons: 2, location: '', preferredTravel: 'Train', message: '' });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'auto'; };
  }, []);

  if (!dest) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim() || !form.email.trim()) {
      alert('Please fill in your Name, Phone number, and Email.');
      return;
    }
    if (form.phone.length !== 10) {
      alert('Phone number must be exactly 10 digits.');
      return;
    }
    setLoading(true);
    try {
      const payload = {
        name: form.name,
        phone: form.phone,
        email: form.email,
        destination: dest.name,
        date: dest.date || form.date,
        travellers: parseInt(form.persons, 10),
        location: form.location,
        preferredTravel: form.preferredTravel,
        message: form.message
      };

      const res = await fetch(`${API}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
      } else {
        alert(data.error || 'Failed to submit booking');
      }
    } catch (err) {
      alert('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-[#0a0a0b]/80 backdrop-blur-md"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-lg bg-[#16161a] border border-white/10 rounded-[28px] overflow-hidden shadow-2xl flex flex-col"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 sticky top-0 bg-[#16161a] z-10">
          <h3 className="text-lg font-bold text-white">Book {dest.name}</h3>
          <button onClick={onClose} className="w-9 h-9 bg-black/30 border border-white/10 rounded-full flex items-center justify-center text-white hover:bg-black/50 transition-colors">
            <X size={16} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[80vh] hidden-scrollbar">
          {submitted ? (
            <div className="text-center py-10">
              <div className="w-16 h-16 bg-[#25D366]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={32} className="text-[#25D366]" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Booking Sent!</h3>
              <p className="text-[#a09a8e] mb-8">We will contact you shortly to confirm your booking.</p>
              <button onClick={onClose} className="bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-8 rounded-full transition-colors">
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-[13px] font-bold text-white mb-2">Your Name</label>
                  <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} type="text" placeholder="John Doe" className="w-full bg-[#0a0a0b] border border-white/10 rounded-xl px-4 py-3.5 text-[15px] text-white focus:outline-none focus:border-[#c9a96e] focus:ring-1 focus:ring-[#c9a96e]" />
                </div>
                <div>
                  <label className="block text-[13px] font-bold text-white mb-2">Phone Number</label>
                  <input required value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} type="tel" placeholder="10-digit number" className="w-full bg-[#0a0a0b] border border-white/10 rounded-xl px-4 py-3.5 text-[15px] text-white focus:outline-none focus:border-[#c9a96e] focus:ring-1 focus:ring-[#c9a96e]" />
                </div>
                <div>
                  <label className="block text-[13px] font-bold text-white mb-2">Email Address</label>
                  <input required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} type="email" placeholder="john@example.com" className="w-full bg-[#0a0a0b] border border-white/10 rounded-xl px-4 py-3.5 text-[15px] text-white focus:outline-none focus:border-[#c9a96e] focus:ring-1 focus:ring-[#c9a96e]" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[13px] font-bold text-white mb-2">Location / City</label>
                    <input required value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} type="text" placeholder="City" className="w-full bg-[#0a0a0b] border border-white/10 rounded-xl px-4 py-3.5 text-[15px] text-white focus:outline-none focus:border-[#c9a96e] focus:ring-1 focus:ring-[#c9a96e]" />
                  </div>
                  <div>
                    <label className="block text-[13px] font-bold text-white mb-2">No. of Persons</label>
                    <input required value={form.persons} onChange={e => setForm({ ...form, persons: e.target.value })} type="number" min="1" className="w-full bg-[#0a0a0b] border border-white/10 rounded-xl px-4 py-3.5 text-[15px] text-white focus:outline-none focus:border-[#c9a96e] focus:ring-1 focus:ring-[#c9a96e]" />
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button type="submit" disabled={loading} className="flex-1 bg-gradient-to-r from-[#c9a96e] to-[#e07b39] text-[#0a0a0b] font-bold py-3.5 rounded-xl text-[14px] transition-transform hover:-translate-y-0.5 disabled:opacity-70">
                  {loading ? 'Submitting...' : 'Confirm Booking'}
                </button>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export function HomeDestinationCard({ dest, index }) {
  const cardRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["0 1", "1.2 1"]
  });

  const scale = useTransform(scrollYProgress, [0, 1], [0.85, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [100, 0]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);

  const tagText = dest.tag || (dest.category && dest.category[0]) || 'Tour';

  return (
    <motion.article
      ref={cardRef}
      style={{ scale, y, opacity }}
      className="destination-card h-[400px] md:h-[450px] group relative overflow-hidden rounded-[24px] will-change-transform"
      aria-label={`${dest.name}, ${dest.region || dest.route}`}
    >
      <img
        src={dest.image}
        alt={`${dest.name}`}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-110"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0b] via-[#0a0a0b]/40 to-transparent transition-all duration-500 opacity-90 group-hover:opacity-100" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0b]/80 via-transparent to-transparent opacity-80" />

      {/* Top Header Bar: NEXT ADVENTURE & Category/Tag Badge */}
      <div className="absolute top-0 left-0 right-0 p-5 md:p-6 z-10 flex items-center justify-between gap-3 pointer-events-none">
        <span className="text-[10px] md:text-[11px] font-bold tracking-[0.2em] uppercase text-[#c9a96e] shrink-0 whitespace-nowrap drop-shadow-md">
          Next Adventure
        </span>

        <div className="max-w-[62%] min-w-0 flex justify-end">
          <span className="px-3 py-1.5 rounded-lg text-[11px] font-bold text-white bg-[#16161a]/75 backdrop-blur-md border border-white/10 flex items-center gap-1.5 shadow-md truncate">
            {(dest.route || dest.region) && (
              <span className="text-white/80 max-w-[95px] md:max-w-[130px] truncate shrink-0">
                {dest.route || dest.region} •
              </span>
            )}
            <span className="truncate">{tagText}</span>
          </span>
        </div>
      </div>

      {/* Bottom Content */}
      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 flex flex-row items-end justify-between h-full z-10">
        <div className="flex-1 transform transition-transform duration-500 translate-y-2 group-hover:translate-y-0 pr-4">
          <h3 className="text-3xl md:text-4xl font-display font-bold text-white mb-3 leading-[1.1]">
            {dest.name}
          </h3>
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-[#c9a96e]" />
            {/* The description is hidden by default and shows on hover for extra info */}
            <p className="text-[14px] text-[#a09a8e] line-clamp-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 hidden md:block">
              {dest.description || 'Explore the beauty of this amazing destination.'}
            </p>
          </div>
        </div>

        {/* Bottom Right: Round Arrow Button */}
        <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-[#c9a96e] to-[#e07b39] flex items-center justify-center flex-shrink-0 transition-transform duration-300 transform translate-y-4 group-hover:translate-y-0 shadow-[0_4px_20px_rgba(201,169,110,0.4)]">
          <ArrowRight size={20} className="text-[#0a0a0b]" />
        </div>
      </div>
    </motion.article>
  );
}

export default function Destinations() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDestDetails, setSelectedDestDetails] = useState(null);
  const [selectedDestBook, setSelectedDestBook] = useState(null);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await fetch(`${API}/packages`);
        const data = await res.json();
        if (data.success) {
          const upcoming = data.data.filter(p => !p.status || p.status === 'Upcoming');
          setPackages(upcoming.slice(0, 3));
        }
      } catch (err) {
        console.error('Failed to fetch packages:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPackages();
  }, []);

  const displayDestinations = packages;

  return (
    <section id="destinations" className="pt-12 pb-24 sm:py-20 md:py-28 bg-[#0a0a0b] relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[800px] h-[800px] rounded-full bg-[#c9a96e]/5 blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/3" aria-hidden="true" />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 relative z-10">
        <div className="flex flex-col items-center text-center mb-10 sm:mb-16 md:mb-20">
          <span className="text-[11px] md:text-[12px] font-bold tracking-[0.2em] text-[#c9a96e] uppercase mb-4">
            Destinations
          </span>
          <h2 className="font-display text-[clamp(40px,6vw,64px)] font-bold leading-tight text-white mb-6">
            Where Will You Go Next?
          </h2>
          <p className="text-[15px] md:text-lg text-[#a09a8e] max-w-2xl leading-relaxed">
            From majestic Himalayan viewpoints to sacred pilgrimage trails, discover upcoming holiday departures planned with complete care.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-[460px] rounded-[28px] bg-[#16161a] border border-white/5 animate-pulse" />
            ))}
          </div>
        ) : displayDestinations.length === 0 ? (
          <div className="text-center py-16 text-[#a09a8e] bg-[#141418]/50 rounded-2xl border border-white/5 p-8 max-w-xl mx-auto">
            <p className="text-base text-white/80 font-medium mb-1">No upcoming tour packages available right now.</p>
            <p className="text-sm text-[#a09a8e]">New destinations and departures are announced regularly. Check back soon or contact us to plan a custom trip.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {displayDestinations.map((dest, index) => (
              <DestinationCard 
                key={dest._id || dest.id || index} 
                dest={dest} 
                index={index} 
                onOpenDetails={setSelectedDestDetails}
                onOpenBook={setSelectedDestBook}
              />
            ))}
          </div>
        )}

        <div className="mt-14 text-center">
          <a
            href="/destinations"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-[#c9a96e] to-[#e07b39] text-[#0a0a0b] font-bold py-4 px-10 rounded-full text-[15px] transition-transform hover:-translate-y-1 shadow-[0_8px_30px_rgba(201,169,110,0.3)] hover:shadow-[0_12px_40px_rgba(201,169,110,0.45)]"
          >
            Explore All Tours
            <ArrowRight size={16} />
          </a>
          <p className="text-[#6b6560] text-[13px] mt-4 italic">Discover fixed departures across India and neighboring getaways.</p>
        </div>
      </div>

      {/* Modals for Direct Homepage Exploration */}
      <AnimatePresence>
        {selectedDestDetails && (
          <TourDetailsModal
            dest={selectedDestDetails}
            onClose={() => setSelectedDestDetails(null)}
            onOpenBook={setSelectedDestBook}
          />
        )}
        {selectedDestBook && (
          <BookModal
            dest={selectedDestBook}
            onClose={() => setSelectedDestBook(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
