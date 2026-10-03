import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { TESTIMONIALS, BRAND } from '../data/constants';

function StarRating({ rating }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`} role="img">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={13}
          className={i < rating ? 'text-[#f5c842] fill-[#f5c842]' : 'text-[#3a3530]'}
        />
      ))}
    </div>
  );
}

export default function Reviews() {
  const headRef = useRef(null);
  const trackRef = useRef(null);
  const inView = useInView(headRef, { once: true, margin: '-60px' });
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [dragging, setDragging] = useState(false);

  // Drag-to-scroll
  const onMouseDown = (e) => {
    setDragging(true);
    setStartX(e.pageX - trackRef.current.offsetLeft);
    setScrollLeft(trackRef.current.scrollLeft);
  };
  const onMouseMove = (e) => {
    if (!dragging) return;
    e.preventDefault();
    const x = e.pageX - trackRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    trackRef.current.scrollLeft = scrollLeft - walk;
  };
  const onMouseUp = () => setDragging(false);

  const scroll = (dir) => {
    trackRef.current?.scrollBy({ left: dir * 360, behavior: 'smooth' });
  };

  return (
    <section
      id="reviews"
      className="section-pad bg-[#111114] overflow-hidden"
      aria-labelledby="reviews-heading"
    >
      <div className="max-w-[1400px] mx-auto">
        {/* Heading */}
        <div ref={headRef} className="px-6 mb-12">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : {}}
                className="text-[11px] font-semibold tracking-[0.25em] text-[#c9a96e] uppercase mb-4"
              >
                Reviews
              </motion.p>
              <motion.h2
                id="reviews-heading"
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.1, duration: 0.6 }}
                className="font-display text-[clamp(28px,4.5vw,48px)] font-bold text-white"
              >
                Loved By Travellers
              </motion.h2>
            </div>

            {/* Rating summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="flex items-center gap-5 px-6 py-4 rounded-2xl bg-[#16161a] border border-white/5 self-start md:self-auto"
            >
              <div className="text-center">
                <p className="text-3xl font-display font-bold text-[#c9a96e] leading-none">{BRAND.rating}</p>
                <StarRating rating={5} />
                <p className="text-[11px] text-[#6b6560] mt-1">Google Rating</p>
              </div>
              <div className="w-px h-12 bg-white/5" />
              <div className="text-center">
                <p className="text-3xl font-display font-bold text-white leading-none">{BRAND.reviews}</p>
                <p className="text-[11px] text-[#6b6560] mt-2">Google Reviews</p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Carousel controls */}
        <div className="px-6 flex gap-3 mb-6 justify-end">
          <button
            onClick={() => scroll(-1)}
            className="w-10 h-10 rounded-full glass flex items-center justify-center text-[#a09a8e] hover:text-white hover:border-[#c9a96e]/30 transition-colors"
            aria-label="Scroll reviews left"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => scroll(1)}
            className="w-10 h-10 rounded-full glass flex items-center justify-center text-[#a09a8e] hover:text-white hover:border-[#c9a96e]/30 transition-colors"
            aria-label="Scroll reviews right"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Review cards */}
        <div
          ref={trackRef}
          className="flex gap-5 overflow-x-auto scrollbar-hide px-6 pb-4 cursor-grab active:cursor-grabbing select-none"
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
          role="list"
          aria-label="Customer testimonials"
        >
          {TESTIMONIALS.map((review, i) => (
            <motion.div
              key={review.id}
              role="listitem"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.55 }}
              className="review-card"
            >
              {/* Quote icon */}
              <Quote size={20} className="text-[#c9a96e]/30 mb-4" aria-hidden="true" />

              <StarRating rating={review.rating} />

              <p className="text-[14px] text-[#a09a8e] leading-relaxed mt-4 mb-5 italic">
                "{review.text}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-[#c9a96e] flex-shrink-0"
                  style={{ background: 'rgba(201,169,110,0.12)', border: '1px solid rgba(201,169,110,0.2)' }}
                  aria-hidden="true"
                >
                  {review.avatar}
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-white">{review.name}</p>
                  <p className="text-[11px] text-[#4a7c59] flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#4a7c59] inline-block" />
                    {review.location}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Disclaimer */}
        <p className="px-6 mt-6 text-[11px] text-[#3a3530] text-center">
          * Testimonial names are representative placeholders. Replace with verified Google reviews.
        </p>
      </div>
    </section>
  );
}
