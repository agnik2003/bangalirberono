import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import FloatingStats from './components/FloatingStats';
import Destinations from './components/Destinations';
import JourneySection from './components/JourneySection';
import Experiences from './components/Experiences';
import WhyChooseUs from './components/WhyChooseUs';
import ProcessSection from './components/ProcessSection';
import About from './components/About';
import SocialSection from './components/SocialSection';
import Reviews from './components/Reviews';
import CTA from './components/CTA';
import ContactForm from './components/ContactForm';
import FloatingContact from './components/FloatingContact';
import Footer from './components/Footer';

export default function App() {
  // Remove default focus outlines for mouse users, keep for keyboard
  useEffect(() => {
    const handleMouseDown = () => document.body.classList.add('using-mouse');
    const handleKeyDown = (e) => {
      if (e.key === 'Tab') document.body.classList.remove('using-mouse');
    };
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="relative min-h-[100svh] w-full max-w-[100vw] overflow-x-hidden bg-[#0a0a0b]"
      >
        {/* Navigation */}
        <Navbar />

        {/* Main content */}
        <main>
          {/* 1. Hero */}
          <Hero />

          {/* 2. Stats strip */}
          <div className="py-10">
            <FloatingStats />
          </div>

          {/* Divider */}
          <div className="section-divider" />

          {/* 3. Destinations */}
          <Destinations />

          {/* 4. Featured Journey */}
          <JourneySection />

          {/* Divider */}
          <div className="section-divider" />

          {/* 5. Experiences */}
          <Experiences />

          {/* 6. Why Choose Us */}
          <WhyChooseUs />

          {/* Divider */}
          <div className="section-divider" />

          {/* 7. Process */}
          <ProcessSection />

          {/* 8. About */}
          <About />

          {/* Divider */}
          <div className="section-divider" />

          {/* 9. Social */}
          <SocialSection />

          {/* 10. Reviews */}
          <Reviews />

          {/* 11. CTA */}
          <CTA />

          {/* 12. Contact / Enquiry Form */}
          <ContactForm />
        </main>

        {/* Footer */}
        <Footer />

        {/* Floating contact widget */}
        <FloatingContact />
      </motion.div>
    </AnimatePresence>
  );
}
