import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Routes, Route, Outlet } from 'react-router-dom';

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
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import ContactPage from './pages/ContactPage';
import AllDestinationsPage from './pages/AllDestinationsPage';
import ExperiencesPage from './pages/ExperiencesPage';
import ReviewsPage from './pages/ReviewsPage';
import TermsPage from './pages/TermsPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import RefundPolicyPage from './pages/RefundPolicyPage';
import ScrollToTop from './components/ScrollToTop';
import BillPrintPage from './pages/BillPrintPage';
import AdminUnpaidBills from './pages/AdminUnpaidBills';
import AdminAllCustomers from './pages/AdminAllCustomers';

function Home() {
  return (
    <>
      <Hero />
      <div className="py-4 md:py-8"><FloatingStats /></div>
      <div className="section-divider" />
      <Destinations />
      <JourneySection />
      <div className="section-divider" />
      <Experiences />
      <WhyChooseUs />
      <div className="section-divider" />
      <ProcessSection />
      <About />
      <Reviews />
      <CTA />
      <ContactForm />
    </>
  );
}

function MainLayout() {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
      <FloatingContact />
    </>
  );
}

export default function App() {
  // Remove default focus outlines for mouse users, keep for keyboard
  useEffect(() => {
    const handleMouseDown = () => document.body.classList.add('using-mouse');
    const handleKeyDown = (e) => {
      if (e.key === 'Tab') document.body.classList.remove('using-mouse');
    };
    
    // Interactive cursor click feedback
    const handleClick = (e) => {
      if (!e || typeof e.clientX !== 'number') return;
      const ripple = document.createElement('div');
      ripple.className = 'cursor-click-ripple';
      ripple.style.left = `${e.clientX}px`;
      ripple.style.top = `${e.clientY}px`;
      document.body.appendChild(ripple);
      setTimeout(() => {
        ripple.remove();
      }, 550);
    };

    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('click', handleClick);
    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="relative min-h-[100svh] w-full max-w-full overflow-x-hidden bg-[#0a0a0b]"
      >
        <ScrollToTop />
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/destinations" element={<AllDestinationsPage />} />
            <Route path="/experiences" element={<ExperiencesPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/support" element={<ContactPage />} />
            <Route path="/reviews" element={<ReviewsPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/terms-and-conditions" element={<TermsPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/refund-policy" element={<RefundPolicyPage />} />
            <Route path="/cancellation-policy" element={<RefundPolicyPage />} />
          </Route>
          
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/all-customers" element={<AdminAllCustomers />} />
          <Route path="/admin/unpaid-bills" element={<AdminUnpaidBills />} />
          <Route path="/admin/bill/:id" element={<BillPrintPage />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

