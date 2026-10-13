import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock, MessageCircle, CreditCard, ShieldCheck, HelpCircle } from 'lucide-react';
import ContactForm from '../components/ContactForm';
import { BRAND } from '../data/constants';

export default function ContactPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Contact Us & Support | Bangalir Berano Tours & Travels';
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-white selection:bg-[#c9a96e]/30">
      {/* Page hero strip */}
      <div className="pt-28 sm:pt-36 pb-8 px-4 sm:px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#c9a96e]/8 to-transparent pointer-events-none" />
        <div className="max-w-[1200px] mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass border-white/10 mb-4 shadow-lg">
            <HelpCircle size={14} className="text-[#c9a96e]" />
            <span className="text-[11px] font-semibold tracking-[0.2em] text-[#c9a96e] uppercase">
              Customer Care &amp; Payment Support
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-white mb-4">
            Contact Us &amp; Support
          </h1>
          <p className="text-sm sm:text-base text-[#a09a8e] max-w-2xl mx-auto leading-relaxed">
            Have a question about a destination, booking status, or payment inquiry? Reach out to our dedicated support team through any of the channels below.
          </p>
        </div>
      </div>

      {/* Support & Payment Assistance Grid */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 mb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {/* Card 1: Phone */}
          <div className="bg-[#141419] border border-white/8 hover:border-[#c9a96e]/30 rounded-2xl p-5 sm:p-6 transition-all flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#c9a96e]/20 to-[#e07b39]/10 border border-[#c9a96e]/30 flex items-center justify-center text-[#c9a96e] mb-4">
                <Phone size={18} />
              </div>
              <h3 className="text-base font-bold text-white mb-1">Direct Call Support</h3>
              <p className="text-xs text-[#a09a8e] mb-3">Instant booking assistance &amp; telephone queries</p>
            </div>
            <a
              href={BRAND.phoneTel}
              className="text-sm font-bold text-[#c9a96e] hover:text-[#e07b39] transition-colors mt-2"
            >
              {BRAND.phone}
            </a>
          </div>

          {/* Card 2: WhatsApp */}
          <div className="bg-[#141419] border border-white/8 hover:border-[#25D366]/30 rounded-2xl p-5 sm:p-6 transition-all flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#25D366]/15 border border-[#25D366]/30 flex items-center justify-center text-[#25D366] mb-4">
                <MessageCircle size={18} />
              </div>
              <h3 className="text-base font-bold text-white mb-1">WhatsApp Chat</h3>
              <p className="text-xs text-[#a09a8e] mb-3">Fast itinerary quotes, vouchers &amp; photo updates</p>
            </div>
            <a
              href={BRAND.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-bold text-[#25D366] hover:underline transition-colors mt-2"
            >
              Chat on WhatsApp &rarr;
            </a>
          </div>

          {/* Card 3: Payment & Accounts */}
          <div className="bg-[#141419] border border-white/8 hover:border-[#c9a96e]/30 rounded-2xl p-5 sm:p-6 transition-all flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#c9a96e]/20 to-[#e07b39]/10 border border-[#c9a96e]/30 flex items-center justify-center text-[#c9a96e] mb-4">
                <CreditCard size={18} />
              </div>
              <h3 className="text-base font-bold text-white mb-1">Payment &amp; Billing</h3>
              <p className="text-xs text-[#a09a8e] mb-3">Bank transfer verification, receipts &amp; refund status</p>
            </div>
            <a
              href={`mailto:${BRAND.email}`}
              className="text-sm font-bold text-[#c9a96e] hover:text-[#e07b39] transition-colors mt-2 truncate"
            >
              {BRAND.email}
            </a>
          </div>

          {/* Card 4: Working Hours */}
          <div className="bg-[#141419] border border-white/8 rounded-2xl p-5 sm:p-6 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#a09a8e] mb-4">
                <Clock size={18} />
              </div>
              <h3 className="text-base font-bold text-white mb-1">Working Hours</h3>
              <p className="text-xs text-[#a09a8e] mb-1">Mon – Sat: 10:00 AM – 8:00 PM</p>
              <p className="text-xs text-[#6b6560]">Sunday: 11:00 AM – 5:00 PM</p>
            </div>
            <span className="text-xs text-[#25D366] font-semibold mt-2 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" /> Support Active
            </span>
          </div>
        </div>

        {/* Office Location Banner */}
        <div className="mt-5 bg-[#141419]/90 border border-white/8 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#c9a96e] shrink-0 mt-0.5">
              <MapPin size={18} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white mb-0.5">Registered Office Address</h4>
              <p className="text-xs text-[#a09a8e] leading-relaxed">
                42, B G G Sarani, Radha Neel Nibas, Bhadrakali, Hooghly, WB - 712232 (Near Bhadrakali Youth Core Club).
              </p>
            </div>
          </div>
          <a
            href={BRAND.phoneTel}
            className="btn-secondary text-xs sm:text-sm py-2.5 px-4 shrink-0"
          >
            Call Office
          </a>
        </div>
      </div>

      {/* Interactive Contact & Enquiry Form Section */}
      <div className="relative">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 mb-2">
          <div className="h-px bg-white/5" />
        </div>
        <ContactForm />
      </div>
    </div>
  );
}
