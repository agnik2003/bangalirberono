import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock, Shield, Eye, Database, Mail, Phone, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BRAND } from '../data/constants';

export default function PrivacyPolicyPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Privacy Policy | Bangalir Berano Tours & Travels';
  }, []);

  return (
    <div className="bg-[#0a0a0b] min-h-screen text-white font-sans selection:bg-[#c9a96e]/30">
      <main className="pt-28 sm:pt-36 pb-20 px-4 sm:px-6 max-w-[1100px] mx-auto min-h-screen">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass border-white/10 mb-4 shadow-lg">
            <Lock size={14} className="text-[#c9a96e]" />
            <span className="text-[11px] font-semibold tracking-[0.2em] text-[#c9a96e] uppercase">
              Data Protection &amp; Security
            </span>
          </div>
          <h1 className="font-display text-[clamp(30px,5vw,52px)] font-bold mb-4 leading-tight">
            Privacy Policy
          </h1>
          <p className="text-[14px] sm:text-[15px] text-[#a09a8e] leading-relaxed">
            At Bangalir Berano Tours &amp; Travels, we respect your personal privacy. This policy explains how we collect, handle, safeguard, and utilize customer information when you use our website or book tours with us.
          </p>
          <p className="text-[12px] text-[#6b6560] mt-3">
            Last Updated: January 2026
          </p>
        </div>

        {/* Content Card */}
        <div className="bg-[#141419] border border-white/8 rounded-2xl md:rounded-3xl p-6 sm:p-10 md:p-12 shadow-2xl space-y-10 text-[#d8d3cb] text-[14.5px] sm:text-[15.5px] leading-relaxed">
          
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-white flex items-center gap-2.5 text-[#c9a96e]">
              <span className="text-sm font-sans px-2.5 py-1 rounded-md bg-[#c9a96e]/15 border border-[#c9a96e]/30 text-[#c9a96e]">1</span>
              Information We Collect
            </h2>
            <p>
              To process your holiday inquiries and execute travel bookings smoothly, we may collect the following details:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-[#a09a8e]">
              <li><strong className="text-white">Contact Information:</strong> Full name, telephone/mobile number, WhatsApp number, residential address, and email address.</li>
              <li><strong className="text-white">Travel &amp; Passenger Details:</strong> Dates of travel, preferred destination, group size, ages of travellers (to determine child/senior fare concessions), and room sharing preferences.</li>
              <li><strong className="text-white">Statutory Government Identification:</strong> Government-issued ID proofs (Aadhaar Card, Voter ID, Passport, Driver&apos;s License) required specifically for issuing government inner line permits, hotel registrations, wildlife safari permits, or flight/train ticketing.</li>
              <li><strong className="text-white">Payment &amp; Billing Data:</strong> Transaction references, UTR numbers, payment modes, and billing details necessary to issue valid invoices and receipts. (Note: We do not store credit/debit card PINs or net banking passwords).</li>
            </ul>
          </section>

          <div className="h-px bg-white/5" />

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-white flex items-center gap-2.5 text-[#c9a96e]">
              <span className="text-sm font-sans px-2.5 py-1 rounded-md bg-[#c9a96e]/15 border border-[#c9a96e]/30 text-[#c9a96e]">2</span>
              How We Use Your Information
            </h2>
            <p>
              We use your information solely for legitimate operational and business purposes, including:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-[#a09a8e]">
              <li>Processing tour reservations, hotel bookings, vehicle allocations, and customized itineraries</li>
              <li>Sending booking confirmations, travel vouchers, itineraries, and trip updates via WhatsApp, SMS, or email</li>
              <li>Applying for mandatory local inner-line permits, forest entry passes, or airline/railway tickets</li>
              <li>Providing active customer support, resolving queries, and assisting with payment clarifications</li>
              <li>Complying with applicable Indian tourism, taxation (GST), and regulatory requirements</li>
            </ul>
          </section>

          <div className="h-px bg-white/5" />

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-white flex items-center gap-2.5 text-[#c9a96e]">
              <span className="text-sm font-sans px-2.5 py-1 rounded-md bg-[#c9a96e]/15 border border-[#c9a96e]/30 text-[#c9a96e]">3</span>
              Third-Party Sharing &amp; Disclosures
            </h2>
            <p>
              <strong className="text-white">We never sell, rent, trade, or monetize your personal information to third-party telemarketers or external advertisers.</strong>
            </p>
            <p className="text-[#a09a8e]">
              Information is shared strictly on a need-to-know basis with authorized travel service partners involved in your trip:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-[#a09a8e]">
              <li>Partner hotels and resorts for guest registration and room allocations</li>
              <li>Licensed local transport operators, vehicle drivers, and designated tour managers</li>
              <li>Government departments, district magistrates, or military check-posts for security permits</li>
              <li>Recognized banking and payment gateway partners for secure transaction processing</li>
            </ul>
          </section>

          <div className="h-px bg-white/5" />

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-white flex items-center gap-2.5 text-[#c9a96e]">
              <span className="text-sm font-sans px-2.5 py-1 rounded-md bg-[#c9a96e]/15 border border-[#c9a96e]/30 text-[#c9a96e]">4</span>
              Data Protection &amp; Security Measures
            </h2>
            <p>
              We employ strict industry-standard administrative, technical, and physical security measures to protect your personal details against unauthorized access, loss, misuse, or alteration. All electronic communication is handled over encrypted connections, and confidential identification documents provided for permits are stored in secured environments accessible only to authorized staff.
            </p>
          </section>

          <div className="h-px bg-white/5" />

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-white flex items-center gap-2.5 text-[#c9a96e]">
              <span className="text-sm font-sans px-2.5 py-1 rounded-md bg-[#c9a96e]/15 border border-[#c9a96e]/30 text-[#c9a96e]">5</span>
              Cookies &amp; Web Analytics
            </h2>
            <p>
              Our website may utilize standard session cookies and anonymous analytics to understand site performance, ensure security, and improve user experience. These cookies do not extract personal files or track your private activity across external websites. You may disable cookies through your browser settings if you prefer.
            </p>
          </section>

          <div className="h-px bg-white/5" />

          {/* Section 6 */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-white flex items-center gap-2.5 text-[#c9a96e]">
              <span className="text-sm font-sans px-2.5 py-1 rounded-md bg-[#c9a96e]/15 border border-[#c9a96e]/30 text-[#c9a96e]">6</span>
              Your Rights &amp; Grievance Redressal
            </h2>
            <p>
              You have the right to review, update, or request the deletion of your personal contact records stored with us after your tour completion, subject to legal and taxation record-retention requirements under Indian law.
            </p>
            <p className="text-[#a09a8e]">
              If you have any questions, concerns, or grievances regarding our privacy practices, please contact our designated Grievance Team:
            </p>
            <div className="bg-[#191920] border border-white/5 rounded-xl p-4 text-sm space-y-1 text-[#a09a8e]">
              <p><strong className="text-white">Bangalir Berano<sup className="text-[10px] font-bold text-[#c9a96e] ml-0.5">TM</sup> Tours &amp; Travels</strong></p>
              <p>Email: <a href={`mailto:${BRAND.email}`} className="text-[#c9a96e] hover:underline">{BRAND.email}</a></p>
              <p>Phone: <a href={BRAND.phoneTel} className="text-[#c9a96e] hover:underline">{BRAND.phone}</a></p>
              <p>Address: 42, B G G Sarani, Radha Neel Nibas-II, Bhadrakali, Uttarpara, Hooghly, WB - 712232 (Land Mark : Near Bhadrakali Youth Core Club)</p>
            </div>
          </section>

          {/* Contact Box */}
          <div className="bg-[#191920] border border-[#c9a96e]/20 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mt-8">
            <div>
              <h3 className="text-lg font-bold text-white mb-1">Need help or privacy information?</h3>
              <p className="text-sm text-[#a09a8e]">
                Reach out to our customer care team anytime for support or data requests.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/contact"
                className="btn-primary text-xs sm:text-sm py-2.5 px-5"
              >
                Contact Us <ChevronRight size={14} />
              </Link>
              <Link
                to="/terms"
                className="btn-secondary text-xs sm:text-sm py-2.5 px-5"
              >
                Terms &amp; Conditions
              </Link>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
