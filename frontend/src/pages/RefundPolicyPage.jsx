import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, AlertTriangle, Clock, CreditCard, CheckCircle2, ChevronRight, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BRAND } from '../data/constants';

export default function RefundPolicyPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Refund & Cancellation Policy | Bangalir Berano Tours & Travels';
  }, []);

  return (
    <div className="bg-[#0a0a0b] min-h-screen text-white font-sans selection:bg-[#c9a96e]/30">
      <main className="pt-28 sm:pt-36 pb-20 px-4 sm:px-6 max-w-[1100px] mx-auto min-h-screen">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass border-white/10 mb-4 shadow-lg">
            <RefreshCw size={14} className="text-[#c9a96e]" />
            <span className="text-[11px] font-semibold tracking-[0.2em] text-[#c9a96e] uppercase">
              Transparent Cancellation Terms
            </span>
          </div>
          <h1 className="font-display text-[clamp(30px,5vw,52px)] font-bold mb-4 leading-tight">
            Refund &amp; Cancellation Policy
          </h1>
          <p className="text-[14px] sm:text-[15px] text-[#a09a8e] leading-relaxed">
            We understand that travel plans can change unexpectedly. Our cancellation and refund policy is designed to be fair, clear, and transparent for all our guests.
          </p>
          <p className="text-[12px] text-[#6b6560] mt-3">
            Last Updated: January 2026
          </p>
        </div>

        {/* Content Card */}
        <div className="bg-[#141419] border border-white/8 rounded-2xl md:rounded-3xl p-6 sm:p-10 md:p-12 shadow-2xl space-y-10 text-[#d8d3cb] text-[14.5px] sm:text-[15.5px] leading-relaxed">
          
          {/* Section 1: Overview */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-white flex items-center gap-2.5 text-[#c9a96e]">
              <span className="text-sm font-sans px-2.5 py-1 rounded-md bg-[#c9a96e]/15 border border-[#c9a96e]/30 text-[#c9a96e]">1</span>
              General Cancellation Guidelines
            </h2>
            <p>
              When a tour package is booked, Bangalir Berano immediately commits resources, pre-books hotel rooms, reserves dedicated transport vehicles, and purchases necessary administrative permits on your behalf. Because these providers require non-refundable commitments, cancellations are subject to deduction tiers based on how far in advance notice is provided.
            </p>
            <p className="text-[#a09a8e]">
              All cancellation notices must be submitted in writing via email to <a href={`mailto:${BRAND.email}`} className="text-[#c9a96e] underline">{BRAND.email}</a> or via official message to our WhatsApp support team at <strong className="text-white">{BRAND.phone}</strong>. The date and time of receipt of the written request will determine the applicable cancellation tier.
            </p>
          </section>

          <div className="h-px bg-white/5" />

          {/* Section 2: Cancellation Timeline Table */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-white flex items-center gap-2.5 text-[#c9a96e]">
              <span className="text-sm font-sans px-2.5 py-1 rounded-md bg-[#c9a96e]/15 border border-[#c9a96e]/30 text-[#c9a96e]">2</span>
              Standard Cancellation Schedule &amp; Refund Slabs
            </h2>
            <p className="text-sm text-[#a09a8e]">
              For all standard group tours and customized land packages, the following refund schedule applies to the total package cost:
            </p>

            {/* Responsive Table */}
            <div className="overflow-x-auto rounded-xl border border-white/10">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#1f1f28] text-white font-semibold border-b border-white/10">
                  <tr>
                    <th className="p-3.5 sm:p-4">Cancellation Notice Period</th>
                    <th className="p-3.5 sm:p-4">Deduction / Charge</th>
                    <th className="p-3.5 sm:p-4 text-[#25D366]">Refund Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 bg-[#141419] text-[#a09a8e]">
                  <tr className="hover:bg-white/2 transition-colors">
                    <td className="p-3.5 sm:p-4 text-white font-medium">30 days or more before departure</td>
                    <td className="p-3.5 sm:p-4">10% of total package cost (Processing fee)</td>
                    <td className="p-3.5 sm:p-4 text-[#25D366] font-bold">90% of package cost</td>
                  </tr>
                  <tr className="hover:bg-white/2 transition-colors">
                    <td className="p-3.5 sm:p-4 text-white font-medium">15 to 29 days before departure</td>
                    <td className="p-3.5 sm:p-4">25% of total package cost</td>
                    <td className="p-3.5 sm:p-4 text-[#25D366] font-bold">75% of package cost</td>
                  </tr>
                  <tr className="hover:bg-white/2 transition-colors">
                    <td className="p-3.5 sm:p-4 text-white font-medium">7 to 14 days before departure</td>
                    <td className="p-3.5 sm:p-4">50% of total package cost</td>
                    <td className="p-3.5 sm:p-4 text-[#25D366] font-bold">50% of package cost</td>
                  </tr>
                  <tr className="hover:bg-white/2 transition-colors bg-red-950/10">
                    <td className="p-3.5 sm:p-4 text-white font-medium">Less than 7 days before departure or No-Show</td>
                    <td className="p-3.5 sm:p-4 text-red-400">100% of package cost</td>
                    <td className="p-3.5 sm:p-4 text-[#e07b39] font-bold">No Refund</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-[12.5px] text-[#8a837c] italic">
              * Note: If only booking advance was paid and it is less than the cancellation charge incurred, the customer is not entitled to any refund.
            </p>
          </section>

          <div className="h-px bg-white/5" />

          {/* Section 3: Third Party Costs */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-white flex items-center gap-2.5 text-[#c9a96e]">
              <span className="text-sm font-sans px-2.5 py-1 rounded-md bg-[#c9a96e]/15 border border-[#c9a96e]/30 text-[#c9a96e]">3</span>
              Third-Party Non-Refundable Services
            </h2>
            <p>
              Certain components of a holiday package are governed by the strict, independent cancellation policies of third-party carriers:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-[#a09a8e]">
              <li><strong className="text-white">Flight Tickets:</strong> Airline cancellation rules and airline convenience/penalty fees apply as per the booked ticket fare class.</li>
              <li><strong className="text-white">Train Tickets:</strong> Governed strictly by Indian Railways (IRCTC) cancellation and refund rules.</li>
              <li><strong className="text-white">Government Permits &amp; Entry Passes:</strong> Inner Line Permits, wildlife safari permits, and boat/cruise tickets once issued by authorities are 100% non-refundable.</li>
            </ul>
          </section>

          <div className="h-px bg-white/5" />

          {/* Section 4: Cancellation by Operator */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-white flex items-center gap-2.5 text-[#c9a96e]">
              <span className="text-sm font-sans px-2.5 py-1 rounded-md bg-[#c9a96e]/15 border border-[#c9a96e]/30 text-[#c9a96e]">4</span>
              Cancellations Due to Force Majeure
            </h2>
            <p>
              If Bangalir Berano is compelled to cancel or postpone a departure due to natural disasters (landslides, earthquakes, flash floods), severe weather warnings, government travel bans, or civil disruptions:
            </p>
            <div className="grid sm:grid-cols-2 gap-4 pt-2">
              <div className="bg-[#191920] border border-white/5 rounded-xl p-4">
                <div className="flex items-center gap-2 text-[#c9a96e] font-bold text-sm mb-1">
                  <CheckCircle2 size={16} /> Option A: Tour Credit Note
                </div>
                <p className="text-xs text-[#a09a8e] leading-relaxed">
                  100% of your paid amount will be preserved as a credit voucher, valid for 12 months for any future departure or alternate destination of your choice.
                </p>
              </div>
              <div className="bg-[#191920] border border-white/5 rounded-xl p-4">
                <div className="flex items-center gap-2 text-[#c9a96e] font-bold text-sm mb-1">
                  <RefreshCw size={16} /> Option B: Direct Refund
                </div>
                <p className="text-xs text-[#a09a8e] leading-relaxed">
                  A refund will be issued after deducting only actual, non-recoverable charges already paid to hotels, airlines, or local permit offices.
                </p>
              </div>
            </div>
          </section>

          <div className="h-px bg-white/5" />

          {/* Section 5: Refund Processing Timeline */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-white flex items-center gap-2.5 text-[#c9a96e]">
              <span className="text-sm font-sans px-2.5 py-1 rounded-md bg-[#c9a96e]/15 border border-[#c9a96e]/30 text-[#c9a96e]">5</span>
              Refund Processing Mode &amp; Timelines
            </h2>
            <ul className="list-disc pl-5 space-y-1.5 text-[#a09a8e]">
              <li><strong className="text-white">Processing Time:</strong> Eligible refunds are reviewed and approved within <span className="text-white font-semibold">48 business hours</span> of written cancellation request, and disbursed within <span className="text-[#25D366] font-semibold">7 to 10 working days</span>.</li>
              <li><strong className="text-white">Payment Method:</strong> All refunds are issued directly to the original bank account, UPI ID, or payment mode from which the payment was received. Cash refunds are not issued.</li>
              <li><strong className="text-white">Confirmation:</strong> Once the bank transfer or gateway refund is initiated, a bank transaction reference (UTR) is shared with the customer over WhatsApp/email for tracking.</li>
            </ul>
          </section>

          {/* Help & Support Banner */}
          <div className="bg-gradient-to-r from-[#191920] to-[#141419] border border-[#c9a96e]/25 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mt-8">
            <div>
              <div className="flex items-center gap-2 text-[#c9a96e] font-bold text-base mb-1">
                <HelpCircle size={18} /> Need Help with a Refund or Payment Query?
              </div>
              <p className="text-sm text-[#a09a8e]">
                Our payment and booking support team is available Mon–Sat from 10:00 AM to 8:00 PM IST.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/contact"
                className="btn-primary text-xs sm:text-sm py-2.5 px-5"
              >
                Payment Support <ChevronRight size={14} />
              </Link>
              <a
                href={BRAND.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary text-xs sm:text-sm py-2.5 px-5"
              >
                WhatsApp Help
              </a>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
