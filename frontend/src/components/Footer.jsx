import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Phone, MapPin, ArrowRight } from 'lucide-react';
import { BRAND, NAV_LINKS } from '../data/constants';

const YoutubeIcon = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const FacebookIcon = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const FOOTER_LINKS = {
  Explore: NAV_LINKS,
  Connect: [
    {
      label: 'WhatsApp', href: BRAND.whatsapp, external: true, icon: () => (
        <svg viewBox="0 0 24 24" className="w-[15px] h-[15px] fill-current">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.489-1.761-1.662-2.062-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
        </svg>
      )
    },
    { label: 'YouTube', href: BRAND.youtube, external: true, icon: YoutubeIcon },
    { label: 'Facebook', href: BRAND.facebook, external: true, icon: FacebookIcon },
  ],
};

export default function Footer() {
  const scrollTo = (href) => {
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer
      className="bg-[#0a0a0b] border-t border-white/5 relative overflow-hidden"
      role="contentinfo"
      aria-label="Site footer"
    >
      {/* Top gradient accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-[#c9a96e]/20 to-transparent" aria-hidden="true" />

      {/* Background blob */}
      <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-[#c9a96e]/2 blur-3xl pointer-events-none" aria-hidden="true" />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 pt-12 sm:pt-16 pb-28 md:pb-8">
        {/* Main footer grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-14">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <button
              onClick={() => scrollTo('#home')}
              className="flex items-center gap-3 mb-5 group"
              aria-label="Back to top"
            >
              <img
                src="/logo.png?v=4"
                alt="Bangalir Berano Logo"
                className="w-12 h-12 rounded-full shadow-lg group-hover:shadow-[0_0_20px_rgba(201,169,110,0.4)] transition-shadow duration-300 object-cover"
              />
              <div>
                <p className="text-[11px] font-bold tracking-[0.2em] text-[#c9a96e] uppercase">Bangalir Berano</p>
                <p className="text-[10px] text-[#6b6560] tracking-wider">Tours &amp; Travels</p>
              </div>
            </button>
            <p className="text-[13px] text-[#6b6560] leading-relaxed max-w-[220px] mb-5">
              Comfortable, well-planned holidays for Bengali travellers and families. Based in West Bengal, exploring India together.
            </p>
            <a
              href={BRAND.phoneTel}
              className="inline-flex items-center gap-2 text-[13px] font-semibold text-[#c9a96e] hover:text-[#e07b39] transition-colors"
              aria-label={`Call us at ${BRAND.phone}`}
            >
              <Phone size={14} /> {BRAND.phone}
            </a>
          </div>

          {/* Explore column */}
          <div>
            <p className="text-[11px] font-bold tracking-[0.2em] text-[#6b6560] uppercase mb-5">Explore</p>
            <ul className="flex flex-col gap-3" role="list">
              {FOOTER_LINKS.Explore.map(link => (
                <li key={link.label}>
                  <button
                    onClick={() => scrollTo(link.href)}
                    className="text-[14px] text-[#a09a8e] hover:text-[#c9a96e] transition-colors flex items-center gap-2 group"
                  >
                    <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all text-[#c9a96e]" />
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect column */}
          <div>
            <p className="text-[11px] font-bold tracking-[0.2em] text-[#6b6560] uppercase mb-5">Connect</p>
            <ul className="flex flex-col gap-4" role="list">
              {FOOTER_LINKS.Connect.map(({ label, href, icon: Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-[14px] text-[#a09a8e] hover:text-[#c9a96e] transition-colors group"
                    aria-label={`${label} — opens in new tab`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-white/4 border border-white/8 flex items-center justify-center group-hover:border-[#c9a96e]/30 group-hover:bg-[#c9a96e]/8 transition-all">
                      <Icon size={15} />
                    </div>
                    {label}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href={BRAND.phoneTel}
                  className="flex items-center gap-3 text-[14px] text-[#a09a8e] hover:text-[#c9a96e] transition-colors group"
                >
                  <div className="w-8 h-8 rounded-lg bg-white/4 border border-white/8 flex items-center justify-center group-hover:border-[#c9a96e]/30 group-hover:bg-[#c9a96e]/8 transition-all">
                    <Phone size={14} />
                  </div>
                  {BRAND.phone}
                </a>
              </li>
            </ul>
          </div>

          {/* Visit Us column */}
          <div>
            <p className="text-[11px] font-bold tracking-[0.2em] text-[#6b6560] uppercase mb-5">Visit Us</p>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/4 border border-white/8 flex items-center justify-center flex-shrink-0 mt-0.5">
                <MapPin size={14} className="text-[#c9a96e]" />
              </div>
              <address className="text-[13px] text-[#6b6560] leading-relaxed not-italic">
                42, B G G Sarani, Radha Neel Nibas, Bhadrakali, Hooghly, WB - 712232.
                <br />Land Mark : Near Bhadrakali Youth Core Club.
              </address>
            </div>

            {/* Plan CTA */}
            <button
              onClick={() => scrollTo('#contact')}
              className="mt-6 w-full btn-primary justify-center text-sm py-3"
            >
              Plan A Trip
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="section-divider mb-6" />

        {/* Legal & Policy Compliance Links */}
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-6 gap-y-2.5 mb-6 text-[12.5px] text-[#8a837c]">
          <Link to="/terms" className="hover:text-[#c9a96e] transition-colors">
            Terms &amp; Conditions
          </Link>
          <span className="text-white/10 hidden sm:inline">•</span>
          <Link to="/privacy-policy" className="hover:text-[#c9a96e] transition-colors">
            Privacy Policy
          </Link>
          <span className="text-white/10 hidden sm:inline">•</span>
          <Link to="/refund-policy" className="hover:text-[#c9a96e] transition-colors">
            Refund &amp; Cancellation Policy
          </Link>
          <span className="text-white/10 hidden sm:inline">•</span>
          <Link to="/contact" className="hover:text-[#c9a96e] transition-colors">
            Contact Us &amp; Support
          </Link>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-20 md:pb-0 pt-4 border-t border-white/5">
          <p className="text-[12px] text-[#6b6560] text-center md:text-left md:flex-1">
            © 2026 Bangalir Berano Tours &amp; Travels. All rights reserved.
          </p>
          <p className="text-[12px] text-[#6b6560] text-center leading-relaxed md:flex-1">
            Made by{' '}
            <a 
              href="https://www.smsrc.in" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#c9a96e] hover:text-[#e07b39] font-bold transition-colors"
            >
              SM Software Resource Capital
            </a>
          </p>
          <div className="hidden md:block md:flex-1"></div>
        </div>
      </div>
    </footer>
  );
}

