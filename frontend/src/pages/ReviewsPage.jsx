import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { ALL_REVIEWS } from '../data/reviewsData';

function StarRating({ rating }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`} role="img">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={14}
          className={i < rating ? 'text-[#f5c842] fill-[#f5c842]' : 'text-[#3a3530]'}
        />
      ))}
    </div>
  );
}

export default function ReviewsPage() {
  return (
    <div className="bg-[#0a0a0b] min-h-screen text-white font-sans selection:bg-[#c9a96e]/30">
      
      <main className="pt-28 sm:pt-32 pb-16 sm:pb-24 px-4 sm:px-6 max-w-[1400px] mx-auto min-h-screen">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[11px] font-semibold tracking-[0.25em] text-[#c9a96e] uppercase mb-4"
          >
            Testimonials
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-[clamp(32px,5vw,56px)] font-bold mb-6 leading-tight"
          >
            What Our Travellers Say
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-[#a09a8e] leading-relaxed"
          >
            Real stories and feedback from travellers who have explored with us over the years. Read their genuine experiences, memories, and honest reviews.
          </motion.p>
        </div>

        {/* Grid of reviews */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {ALL_REVIEWS.map((review, i) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-20px' }}
              transition={{ delay: (i % 10) * 0.05 }}
              className="bg-[#16161a] border border-white/5 rounded-2xl p-5 sm:p-6 hover:border-[#c9a96e]/30 transition-colors flex flex-col h-full"
            >
              <Quote size={20} className="text-[#c9a96e]/30 mb-4" />
              <StarRating rating={review.rating} />
              
              <p className="text-[14px] text-[#a09a8e] leading-relaxed mt-4 mb-6 italic flex-grow">
                "{review.text}"
              </p>
              
              <div className="flex items-center gap-3 pt-4 border-t border-white/5 mt-auto">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-[#c9a96e] flex-shrink-0"
                  style={{ background: 'rgba(201,169,110,0.12)', border: '1px solid rgba(201,169,110,0.2)' }}
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
      </main>

    </div>
  );
}

