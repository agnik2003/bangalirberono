import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, FileText, AlertCircle, Phone, Mail, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BRAND } from '../data/constants';

export default function TermsPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Terms & Conditions | Bangalir Berano Tours & Travels';
  }, []);

  return (
    <div className="bg-[#0a0a0b] min-h-screen text-white font-sans selection:bg-[#c9a96e]/30">
      <main className="pt-28 sm:pt-36 pb-20 px-4 sm:px-6 max-w-[1100px] mx-auto min-h-screen">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass border-white/10 mb-4 shadow-lg">
            <ShieldCheck size={14} className="text-[#c9a96e]" />
            <span className="text-[11px] font-semibold tracking-[0.2em] text-[#c9a96e] uppercase">
              Business Compliance & Legal
            </span>
          </div>
          <h1 className="font-display text-[clamp(30px,5vw,52px)] font-bold mb-4 leading-tight">
            Terms &amp; Conditions
          </h1>
          <p className="text-[14px] sm:text-[15px] text-[#a09a8e] leading-relaxed">
            Please read these terms and conditions carefully before booking your holiday with Bangalir Berano Tours &amp; Travels. By confirming a booking with us, you agree to comply with the terms set forth below.
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
              Introduction &amp; Scope of Service
            </h2>
            <p>
              Bangalir Berano<sup className="text-[10px] font-bold text-[#c9a96e] ml-0.5">TM</sup> Tours &amp; Travels (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) is a registered travel and holiday organizer based in West Bengal, India. We organize fixed-departure group tours, customized family holiday packages, transport arrangements, hotel accommodations, and guided travel itineraries across India and neighboring tourist regions.
            </p>
            <p>
              By accessing our website (<span className="text-white font-medium">bangalirberano.com</span>), booking a package via WhatsApp, phone, email, or in-person at our registered office, you enter into a binding agreement with us under these terms.
            </p>
          </section>

          <div className="h-px bg-white/5" />

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-white flex items-center gap-2.5 text-[#c9a96e]">
              <span className="text-sm font-sans px-2.5 py-1 rounded-md bg-[#c9a96e]/15 border border-[#c9a96e]/30 text-[#c9a96e]">2</span>
              Booking, Confirmation &amp; Payments
            </h2>
            <ul className="list-disc pl-5 space-y-2 text-[#a09a8e]">
              <li><strong className="text-white">Booking Advance:</strong> A seat or tour booking is considered confirmed only upon receipt of the designated booking advance payment per person.</li>
              <li><strong className="text-white">Balance Payment:</strong> The remaining package balance must be settled in full at least 30 days prior to the tour departure date, or as explicitly indicated on your booking invoice.</li>
              <li><strong className="text-white">Payment Methods:</strong> We accept payments through official bank NEFT/IMPS transfers, UPI, registered payment gateways, and official agency payment links. Please retain your payment receipt or transaction ID for all verification.</li>
              <li><strong className="text-white">Price Inclusions:</strong> All package costs quoted are per person based on double/triple sharing unless specifically arranged otherwise. Taxes, government permits, entry fees, and included meals are outlined in each tour voucher.</li>
            </ul>
          </section>

          <div className="h-px bg-white/5" />

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-white flex items-center gap-2.5 text-[#c9a96e]">
              <span className="text-sm font-sans px-2.5 py-1 rounded-md bg-[#c9a96e]/15 border border-[#c9a96e]/30 text-[#c9a96e]">3</span>
              Food &amp; Meal Services Policy
            </h2>
            <p>
              To ensure wholesome, hygienic, and convenient dining while on tour, our food policy operates as follows:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-[#a09a8e]">
              <li><strong className="text-white">Breakfast &amp; Dinner Included:</strong> Daily fresh breakfast and dinner are provided as standard components in our fixed group tour packages (MAP plan), served at our hotel accommodations or authorized tour bases.</li>
              <li><strong className="text-white">Lunch Arrangements:</strong> Daily lunch is organized based on the specific travel schedule and sightseeing route. On long transit journeys, mountain excursions, or free sightseeing days, lunch may or may not be provided by the agency (guests can dine at verified en-route local restaurants or as designated in the day-by-day tour itinerary voucher).</li>
              <li><strong className="text-white">Hygienic Bengali &amp; Regional Cuisine:</strong> Meals served are fresh, hygienic, and prepared to suit Bengali family tastes with wholesome vegetarian and non-vegetarian options wherever available.</li>
              <li><strong className="text-white">Special Dietary Needs:</strong> Travellers with strict dietary restrictions, food allergies, or pure vegetarian/Jain preferences are kindly requested to notify our team at the time of booking.</li>
            </ul>
          </section>

          <div className="h-px bg-white/5" />

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-white flex items-center gap-2.5 text-[#c9a96e]">
              <span className="text-sm font-sans px-2.5 py-1 rounded-md bg-[#c9a96e]/15 border border-[#c9a96e]/30 text-[#c9a96e]">4</span>
              Traveller Identification &amp; Mandatory Documents
            </h2>
            <p>
              Every traveller is required to carry valid, government-approved photo identification (such as Aadhaar Card, Voter ID, or Passport) along with required copies and passport-size photographs as necessitated by local police, forest department, or border security check-posts (e.g., Ladakh, Sikkim, Andaman, Arunachal Pradesh).
            </p>
            <p className="text-[#a09a8e]">
              Bangalir Berano cannot be held responsible for denial of entry or travel permits by government authorities if a traveller fails to provide authentic identity documents.
            </p>
          </section>

          <div className="h-px bg-white/5" />

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-white flex items-center gap-2.5 text-[#c9a96e]">
              <span className="text-sm font-sans px-2.5 py-1 rounded-md bg-[#c9a96e]/15 border border-[#c9a96e]/30 text-[#c9a96e]">5</span>
              Itinerary Modifications &amp; Force Majeure
            </h2>
            <p>
              While every effort is made to adhere strictly to the published tour schedule, itineraries may be adjusted or rerouted on short notice due to circumstances beyond our reasonable control, including but not limited to:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-[#a09a8e]">
              <li>Inclement weather conditions, landslides, snowfall, or heavy rains</li>
              <li>Road closures, bridge repairs, or traffic diversions mandated by administration</li>
              <li>Strikes, bandhs, local political unrest, or unexpected administrative lockdowns</li>
              <li>Flight delays, train cancellations, or airline rescheduling</li>
            </ul>
            <p className="text-[#a09a8e]">
              Any additional expenses incurred due to delays or unforeseen extensions (e.g., extra hotel nights, alternate transport arrangements) will be borne by the travellers on an actual basis.
            </p>
          </section>

          <div className="h-px bg-white/5" />

          {/* Section 6 */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-white flex items-center gap-2.5 text-[#c9a96e]">
              <span className="text-sm font-sans px-2.5 py-1 rounded-md bg-[#c9a96e]/15 border border-[#c9a96e]/30 text-[#c9a96e]">6</span>
              Health, Fitness &amp; Conduct During Tours
            </h2>
            <p>
              Travellers are requested to disclose any severe medical conditions, respiratory ailments, or mobility restrictions prior to booking, particularly for high-altitude destinations (e.g., Ladakh, Spiti, North Sikkim).
            </p>
            <p className="text-[#a09a8e]">
              Bangalir Berano promotes family-friendly and respectful group tourism. We reserve the right to decline service or dismiss any traveller whose conduct causes physical harm, harassment, or severe disturbance to fellow tour members, hotel staff, or local communities.
            </p>
          </section>

          <div className="h-px bg-white/5" />

          {/* Section 7 */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-white flex items-center gap-2.5 text-[#c9a96e]">
              <span className="text-sm font-sans px-2.5 py-1 rounded-md bg-[#c9a96e]/15 border border-[#c9a96e]/30 text-[#c9a96e]">7</span>
              Limitation of Liability &amp; Insurance
            </h2>
            <p>
              Bangalir Berano acts as a facilitator and coordinator between travellers and service providers (including hotels, bus operators, airlines, and local guides). We are not liable for any personal injury, loss or theft of luggage, delays, or property damage during transit.
            </p>
            <p className="text-[#a09a8e]">
              We strongly advise all travellers to obtain comprehensive personal travel and health insurance covering medical emergencies, trip interruptions, and baggage loss prior to departure.
            </p>
          </section>

          <div className="h-px bg-white/5" />

          {/* Section 8 */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-white flex items-center gap-2.5 text-[#c9a96e]">
              <span className="text-sm font-sans px-2.5 py-1 rounded-md bg-[#c9a96e]/15 border border-[#c9a96e]/30 text-[#c9a96e]">8</span>
              Governing Law &amp; Dispute Resolution
            </h2>
            <p>
              These Terms &amp; Conditions are governed by and construed in accordance with the laws of India. Any legal claims, disputes, or proceedings arising out of or related to our services shall be subject exclusively to the jurisdiction of the competent courts in Hooghly / Kolkata, West Bengal.
            </p>
          </section>

          {/* Contact Box */}
          <div className="bg-[#191920] border border-[#c9a96e]/20 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mt-8">
            <div>
              <h3 className="text-lg font-bold text-white mb-1">Have questions regarding our terms?</h3>
              <p className="text-sm text-[#a09a8e]">
                Contact our customer support team for any clarifications before confirming your booking.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/contact"
                className="btn-primary text-xs sm:text-sm py-2.5 px-5"
              >
                Contact Support <ChevronRight size={14} />
              </Link>
              <Link
                to="/refund-policy"
                className="btn-secondary text-xs sm:text-sm py-2.5 px-5"
              >
                Refund Policy
              </Link>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
