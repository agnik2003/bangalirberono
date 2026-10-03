import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Send, CheckCircle, User, Phone, Mail, MapPin, Calendar, Users, ChevronDown } from 'lucide-react';
import { BRAND, TRAVEL_TYPES } from '../data/constants';

const INITIAL_STATE = {
  name: '', phone: '', email: '', destination: '',
  date: '', travellers: '', travelType: '', message: '',
};

export default function ContactForm() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [form, setForm] = useState(INITIAL_STATE);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate async submission (connect to API later)
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    setForm(INITIAL_STATE);
  };

  return (
    <section
      id="contact"
      ref={ref}
      className="section-pad bg-[#0a0a0b] relative overflow-hidden"
      aria-labelledby="contact-heading"
    >
      {/* Background accent blobs */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute bottom-0 left-1/4 w-80 h-80 rounded-full bg-[#c9a96e]/4 blur-3xl" />
        <div className="absolute top-1/4 right-1/4 w-60 h-60 rounded-full bg-[#e07b39]/3 blur-3xl" />
      </div>

      <div className="max-w-[1400px] mx-auto px-6 relative">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left info panel */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="lg:sticky lg:top-32"
          >
            <p className="text-[11px] font-semibold tracking-[0.25em] text-[#c9a96e] uppercase mb-5">
              Get In Touch
            </p>
            <h2
              id="contact-heading"
              className="font-display text-[clamp(30px,4.5vw,50px)] font-bold text-white leading-tight mb-5"
            >
              Let's Plan
              <br />
              <span className="gradient-text">Your Journey.</span>
            </h2>
            <p className="text-[15px] text-[#6b6560] leading-relaxed mb-10 max-w-sm">
              Share your travel preferences and we'll help you put together the perfect trip.
            </p>

            {/* Contact details */}
            <div className="flex flex-col gap-5">
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href={BRAND.phoneTel}
                  className="flex-1 flex items-center gap-4 group"
                  aria-label={`Call us at ${BRAND.phone}`}
                >
                  <div className="w-11 h-11 rounded-xl bg-[#c9a96e]/10 border border-[#c9a96e]/20 flex items-center justify-center group-hover:bg-[#c9a96e]/20 transition-colors">
                    <Phone size={18} className="text-[#c9a96e]" />
                  </div>
                  <div>
                    <p className="text-[11px] text-[#6b6560] uppercase tracking-wide mb-0.5">Call Us</p>
                    <p className="text-[14px] font-semibold text-white group-hover:text-[#c9a96e] transition-colors">
                      {BRAND.phone}
                    </p>
                  </div>
                </a>

                <a
                  href={BRAND.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center gap-4 group"
                  aria-label="Message on WhatsApp"
                >
                  <div className="w-11 h-11 rounded-xl bg-[#25D366]/10 border border-[#25D366]/20 flex items-center justify-center group-hover:bg-[#25D366]/20 transition-colors">
                    <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#25D366] fill-current">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.489-1.761-1.662-2.062-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[11px] text-[#6b6560] uppercase tracking-wide mb-0.5">WhatsApp</p>
                    <p className="text-[14px] font-semibold text-white group-hover:text-[#25D366] transition-colors">
                      {BRAND.phone}
                    </p>
                  </div>
                </a>
              </div>

              <a
                href={`mailto:${BRAND.email}`}
                className="flex items-center gap-4 group"
              >
                <div className="w-11 h-11 rounded-xl bg-[#c9a96e]/10 border border-[#c9a96e]/20 flex items-center justify-center group-hover:bg-[#c9a96e]/20 transition-colors">
                  <Mail size={18} className="text-[#c9a96e]" />
                </div>
                <div>
                  <p className="text-[11px] text-[#6b6560] uppercase tracking-wide mb-0.5">Email</p>
                  <p className="text-[15px] font-semibold text-white group-hover:text-[#c9a96e] transition-colors">
                    {BRAND.email}
                  </p>
                </div>
              </a>

              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-[#c9a96e]/10 border border-[#c9a96e]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MapPin size={18} className="text-[#c9a96e]" />
                </div>
                <div className="flex-1 w-full">
                  <p className="text-[11px] text-[#6b6560] uppercase tracking-wide mb-0.5">Visit Us</p>
                  <p className="text-[14px] text-[#a09a8e] leading-relaxed mb-5 pr-4">{BRAND.address}</p>
                  
                  {/* Google Map Embed */}
                  <div className="w-full h-48 md:h-56 rounded-xl overflow-hidden border border-[#c9a96e]/20 group relative bg-[#16161a]">
                    <iframe 
                      src="https://maps.google.com/maps?q=BANGALIR%20BERANO,%20Uttarpara,%20West%20Bengal&t=&z=16&ie=UTF8&iwloc=&output=embed" 
                      width="100%" 
                      height="100%" 
                      style={{ border: 0 }} 
                      allowFullScreen="" 
                      loading="lazy" 
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Bangalir Berano Office Location"
                      className="opacity-80 group-hover:opacity-100 transition-opacity duration-300 w-full h-full"
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right — Form */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            <div
              className="rounded-3xl p-7 md:p-9"
              style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.07)',
              }}
            >
              <AnimatePresence mode="wait">
                {!submitted ? (
                  <motion.form
                    key="form"
                    onSubmit={handleSubmit}
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, y: -20 }}
                    noValidate
                    aria-label="Travel enquiry form"
                  >
                    <div className="grid sm:grid-cols-2 gap-4 mb-4">
                      {/* Name */}
                      <div>
                        <label htmlFor="contact-name" className="block text-[12px] font-medium text-[#6b6560] uppercase tracking-wide mb-2">
                          Full Name *
                        </label>
                        <div className="relative">
                          <User size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6b6560] pointer-events-none" />
                          <input
                            id="contact-name"
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="Your name"
                            required
                            className="form-input !pl-11"
                          />
                        </div>
                      </div>

                      {/* Phone */}
                      <div>
                        <label htmlFor="contact-phone" className="block text-[12px] font-medium text-[#6b6560] uppercase tracking-wide mb-2">
                          Phone Number *
                        </label>
                        <div className="relative">
                          <Phone size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6b6560] pointer-events-none" />
                          <input
                            id="contact-phone"
                            type="tel"
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                            placeholder="+91 XXXXXXXXXX"
                            required
                            className="form-input !pl-11"
                          />
                        </div>
                      </div>

                      {/* Email */}
                      <div>
                        <label htmlFor="contact-email" className="block text-[12px] font-medium text-[#6b6560] uppercase tracking-wide mb-2">
                          Email Address
                        </label>
                        <div className="relative">
                          <Mail size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6b6560] pointer-events-none" />
                          <input
                            id="contact-email"
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="your@email.com"
                            className="form-input !pl-11"
                          />
                        </div>
                      </div>

                      {/* Destination */}
                      <div>
                        <label htmlFor="contact-destination" className="block text-[12px] font-medium text-[#6b6560] uppercase tracking-wide mb-2">
                          Destination
                        </label>
                        <div className="relative">
                          <MapPin size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6b6560] pointer-events-none" />
                          <input
                            id="contact-destination"
                            type="text"
                            name="destination"
                            value={form.destination}
                            onChange={handleChange}
                            placeholder="Darjeeling, Sikkim..."
                            className="form-input !pl-11"
                          />
                        </div>
                      </div>

                      {/* Date */}
                      <div>
                        <label htmlFor="contact-date" className="block text-[12px] font-medium text-[#6b6560] uppercase tracking-wide mb-2">
                          Travel Date
                        </label>
                        <div className="relative">
                          <Calendar size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6b6560] pointer-events-none" />
                          <input
                            id="contact-date"
                            type="date"
                            name="date"
                            value={form.date}
                            onChange={handleChange}
                            className="form-input !pl-11"
                            style={{ colorScheme: 'dark' }}
                          />
                        </div>
                      </div>

                      {/* Travellers */}
                      <div>
                        <label htmlFor="contact-travellers" className="block text-[12px] font-medium text-[#6b6560] uppercase tracking-wide mb-2">
                          No. of Travellers
                        </label>
                        <div className="relative">
                          <Users size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6b6560] pointer-events-none" />
                          <input
                            id="contact-travellers"
                            type="number"
                            name="travellers"
                            value={form.travellers}
                            onChange={handleChange}
                            placeholder="e.g. 4"
                            min="1"
                            className="form-input !pl-11"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Travel Type */}
                    <div className="mb-4">
                      <label htmlFor="contact-type" className="block text-[12px] font-medium text-[#6b6560] uppercase tracking-wide mb-2">
                        Travel Type
                      </label>
                      <div className="relative">
                        <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6b6560] pointer-events-none" />
                        <select
                          id="contact-type"
                          name="travelType"
                          value={form.travelType}
                          onChange={handleChange}
                          className="form-input appearance-none pr-10"
                        >
                          <option value="" className="bg-[#16161a] text-white">Select travel type</option>
                          {TRAVEL_TYPES.map(t => (
                            <option key={t} value={t} className="bg-[#16161a] text-white">{t}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Message */}
                    <div className="mb-7">
                      <label htmlFor="contact-message" className="block text-[12px] font-medium text-[#6b6560] uppercase tracking-wide mb-2">
                        Message
                      </label>
                      <textarea
                        id="contact-message"
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                        placeholder="Tell us about your dream trip, preferences, special requirements..."
                        rows={4}
                        className="form-input resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-primary w-full justify-center text-sm py-4 gap-3 disabled:opacity-70 disabled:cursor-wait"
                    >
                      {loading ? (
                        <>
                          <motion.div
                            className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                          />
                          Sending...
                        </>
                      ) : (
                        <>
                          Send Enquiry <Send size={16} />
                        </>
                      )}
                    </button>
                  </motion.form>
                ) : (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="py-16 flex flex-col items-center text-center"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 200, damping: 12 }}
                    >
                      <CheckCircle size={56} className="text-[#4a7c59] mb-5" />
                    </motion.div>
                    <h3 className="font-display text-2xl font-bold text-white mb-3">Enquiry Sent!</h3>
                    <p className="text-[15px] text-[#a09a8e] leading-relaxed mb-7 max-w-sm">
                      Thank you for reaching out. We'll get back to you soon to discuss your journey.
                    </p>
                    <div className="flex flex-wrap gap-3 justify-center">
                      <a href={BRAND.phoneTel} className="btn-primary gap-2">
                        <Phone size={15} /> Call Us Now
                      </a>
                      <button onClick={handleReset} className="btn-secondary gap-2">
                        Send Another Enquiry
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
