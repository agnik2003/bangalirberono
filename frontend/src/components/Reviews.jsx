import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Star, Quote, ArrowRight } from 'lucide-react';
import { BRAND } from '../data/constants';
import { ALL_REVIEWS } from '../data/reviewsData';
import { Link } from 'react-router-dom';

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

const ReviewCard = ({ review }) => (
  <div className="review-card">
    <Quote size={20} className="text-[#c9a96e]/30 mb-4" aria-hidden="true" />
    <StarRating rating={review.rating} />
    <p className="text-[14px] text-[#a09a8e] leading-relaxed mt-4 mb-5 italic line-clamp-6">
      "{review.text}"
    </p>
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
  </div>
);

export default function Reviews() {
  const headRef = useRef(null);
  const inView = useInView(headRef, { once: true, margin: '-60px' });
  const [isPaused, setIsPaused] = useState(false);
  
  // Show only top 15 reviews in the carousel to keep it light
  const displayReviews = ALL_REVIEWS.slice(0, 15);

  return (
    <section
      id="reviews"
      className="section-pad bg-[#111114] overflow-hidden"
      aria-labelledby="reviews-heading"
    >
      <div className="max-w-[1400px] mx-auto">
        {/* Heading */}
        <div ref={headRef} className="px-4 sm:px-6 mb-10 sm:mb-12 text-center">
          <div className="flex flex-col gap-6 items-center justify-center">
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
                className="font-display text-[clamp(28px,4.5vw,48px)] font-bold text-white mb-6"
              >
                Loved By Travellers
              </motion.h2>
              
              <Link 
                to="/reviews" 
                className="inline-flex items-center gap-2 text-[#c9a96e] text-sm font-semibold hover:text-white transition-colors"
              >
                View all reviews <ArrowRight size={16} />
              </Link>
            </div>

            {/* Rating summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="flex items-center gap-4 sm:gap-5 px-4 sm:px-6 py-3.5 sm:py-4 rounded-2xl bg-[#16161a] border border-white/5"
            >
              <div className="text-center">
                <p className="text-3xl font-display font-bold text-[#c9a96e] leading-none">{BRAND.rating}</p>
                <StarRating rating={5} />
                <p className="text-[11px] text-[#6b6560] mt-1">Google Rating</p>
              </div>
              <div className="w-px h-12 bg-white/5" />
              <div className="text-center">
                <p className="text-3xl font-display font-bold text-white leading-none">{ALL_REVIEWS.length}+</p>
                <p className="text-[11px] text-[#6b6560] mt-2">Google Reviews</p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Continuous auto-scrolling marquee with pause on hover */}
        <div 
          className="relative flex overflow-hidden reviews-marquee-container py-3 cursor-default group"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
          aria-label="Traveller reviews carousel - hover to pause and read"
        >
          <div 
            className={`reviews-marquee-track shrink-0 ${isPaused ? 'is-paused' : ''}`}
          >
            {/* Render reviews twice for seamless looping */}
            {[...displayReviews, ...displayReviews].map((review, index) => (
              <ReviewCard key={`r-${review.id}-${index}`} review={review} />
            ))}
          </div>
          
          {/* Fade edges */}
          <div className="pointer-events-none absolute left-0 top-0 h-full w-12 sm:w-20 bg-gradient-to-r from-[#111114] to-transparent z-10" />
          <div className="pointer-events-none absolute right-0 top-0 h-full w-12 sm:w-20 bg-gradient-to-l from-[#111114] to-transparent z-10" />
        </div>

      </div>
    </section>
  );
}

