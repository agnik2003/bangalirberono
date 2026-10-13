import { API } from '../data/constants';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, CheckCircle, MessageCircle, MapPin, Calendar, Clock } from 'lucide-react';

export default function ExperienceModal({ exp, onClose }) {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    date: '',
    persons: 2,
    message: '',
    packageId: '', // Added package selection
    packageName: 'General Enquiry', // Default
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [packages, setPackages] = useState([]);
  const [fetchingPackages, setFetchingPackages] = useState(true);
  useEffect(() => {
    // Prevent background scrolling
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await fetch(`${API}/packages`);
        const data = await res.json();
        if (data.success) {
          // Filter packages that include this experience, but show all for 'Custom Tours'. Only include Upcoming packages.
          let matching = exp.title === 'Custom Tours'
            ? data.data
            : data.data.filter(p => p.experiences && p.experiences.includes(exp.title));
            
          matching = matching.filter(p => !p.status || p.status === 'Upcoming');
          
          setPackages(matching);
          if (matching.length === 1) {
             setForm(f => ({ ...f, packageId: matching[0]._id, packageName: matching[0].name }));
          }
        }
      } catch (err) {
        console.error('Failed to fetch packages:', err);
      } finally {
        setFetchingPackages(false);
      }
    };
    fetchPackages();
  }, [exp.title]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.email) {
      setError('Please fill in required fields (Name, Phone, and Email).');
      return;
    }
    if (form.phone.length !== 10) {
      setError('Phone number must be exactly 10 digits.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${API}/enquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          email: form.email,
          destination: form.packageName, // mapped from packageName
          date: form.date,
          travellers: form.persons, // mapped from persons
          travelType: exp.title,
          message: form.message
        })
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
      } else {
        setError(data.error || 'Failed to submit enquiry');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-[#0a0a0b]/80 backdrop-blur-md"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-4xl max-h-[90vh] bg-[#0a0a0b] border border-white/10 rounded-[28px] md:rounded-[32px] overflow-hidden shadow-2xl flex flex-col md:flex-row"
      >
        {/* Left Side: Experience Info & Packages */}
        <div className="w-full md:w-5/12 max-h-[38vh] md:max-h-none bg-[#16161a] p-5 sm:p-6 md:p-8 flex flex-col overflow-y-auto hidden-scrollbar relative border-b md:border-b-0 md:border-r border-white/5">
          <button
            onClick={onClose}
            className="md:hidden absolute top-4 right-4 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center text-white"
          >
            <X size={16} />
          </button>
          
          <div className="text-4xl mb-4">{exp.icon}</div>
          <h2 className="text-2xl font-display font-bold text-white mb-2">{exp.title}</h2>
          <p className="text-[14px] text-[#a09a8e] mb-6">{exp.description}</p>
          
          <div className="flex-1">
            <h3 className="text-[11px] font-bold tracking-[0.2em] text-[#c9a96e] uppercase mb-4">
              Matching Packages
            </h3>
            
            {fetchingPackages ? (
              <div className="animate-pulse space-y-3">
                 <div className="h-16 bg-white/5 rounded-xl"></div>
                 <div className="h-16 bg-white/5 rounded-xl"></div>
              </div>
            ) : packages.length === 0 ? (
              <p className="text-[13px] text-[#6b6560]">No specific packages listed yet. You can still send a general enquiry.</p>
            ) : (
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => setForm(f => ({ ...f, packageId: '', packageName: 'General Enquiry' }))}
                  className={`w-full text-left p-4 rounded-xl border transition-colors ${
                    form.packageId === '' 
                      ? 'bg-gradient-to-r from-[#c9a96e]/20 to-transparent border-[#c9a96e]/50 text-[#c9a96e]' 
                      : 'bg-black/30 border-white/5 text-white hover:border-white/20'
                  }`}
                >
                  <div className="font-bold text-[14px]">General Enquiry</div>
                  <div className="text-[12px] opacity-70 mt-1">I want a custom plan</div>
                </button>
                {packages.map(p => (
                  <button
                    key={p._id}
                    type="button"
                    onClick={() => setForm(f => ({ ...f, packageId: p._id, packageName: p.name }))}
                    className={`w-full text-left p-4 rounded-xl border transition-colors ${
                      form.packageId === p._id 
                        ? 'bg-gradient-to-r from-[#c9a96e]/20 to-transparent border-[#c9a96e]/50 text-[#c9a96e]' 
                        : 'bg-black/30 border-white/5 text-white hover:border-white/20'
                    }`}
                  >
                    <div className="font-bold text-[14px] line-clamp-1">{p.name}</div>
                    <div className="text-[12px] opacity-70 mt-1 flex flex-wrap items-center gap-1.5">
                      {p.date && (
                        <>
                          <Calendar size={12}/> <span className="whitespace-nowrap">{p.date}</span>
                          <span className="mx-1">•</span>
                        </>
                      )}
                      <Clock size={12}/> <span className="whitespace-nowrap">{p.duration || 'Flexible'}</span>
                      <span className="mx-1">•</span>
                      <span className="whitespace-nowrap">{p.price}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        {/* Right Side: Form */}
        <div className="flex-1 overflow-y-auto hidden-scrollbar">
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 sticky top-0 bg-[#0a0a0b]/80 backdrop-blur-md z-10">
            <h3 className="text-lg font-bold text-white">Send Enquiry</h3>
            <button
              onClick={onClose}
              className="hidden md:flex w-9 h-9 bg-[#16161a] border border-white/10 rounded-full items-center justify-center text-white hover:bg-[#1a1a1f] transition-colors"
            >
              <X size={16} />
            </button>
          </div>
          {submitted ? (
            <div className="p-10 flex flex-col items-center text-center">
              <CheckCircle size={64} className="text-[#4a7c59] mb-6" />
              <h3 className="text-2xl font-display font-bold text-white mb-4">Request Sent Successfully!</h3>
              <p className="text-[#a09a8e] mb-8 max-w-sm mx-auto">
                Thank you for enquiring about <strong>{form.packageName}</strong>. Our team will contact you shortly on {form.phone}.
              </p>
              <button
                onClick={onClose}
                className="bg-[#16161a] border border-white/10 hover:bg-[#1a1a1f] text-white font-semibold py-3 px-8 rounded-full transition-colors"
              >
                Close Window
              </button>
            </div>
          ) : (
            <form className="p-6 md:p-8" onSubmit={handleSubmit}>
              {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm font-semibold text-center">
                  {error}
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                <div>
                  <label className="block text-[12px] font-bold text-white/70 uppercase tracking-wider mb-2">Name *</label>
                  <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} type="text" placeholder="Your name" className="w-full bg-[#16161a] border border-white/10 rounded-xl px-4 py-3 text-[15px] text-white focus:outline-none focus:border-[#c9a96e] focus:ring-1 focus:ring-[#c9a96e]" />
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-white/70 uppercase tracking-wider mb-2">Phone *</label>
                  <input required value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })} type="tel" pattern="[0-9]{10}" title="10 digit phone number" maxLength="10" placeholder="10-digit phone number" className="w-full bg-[#16161a] border border-white/10 rounded-xl px-4 py-3 text-[15px] text-white focus:outline-none focus:border-[#c9a96e] focus:ring-1 focus:ring-[#c9a96e]" />
                </div>
              </div>
              <div className="mb-5">
                <label className="block text-[12px] font-bold text-white/70 uppercase tracking-wider mb-2">Email Address *</label>
                <input required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} type="email" placeholder="your@email.com" className="w-full bg-[#16161a] border border-white/10 rounded-xl px-4 py-3 text-[15px] text-white focus:outline-none focus:border-[#c9a96e] focus:ring-1 focus:ring-[#c9a96e]" />
              </div>
              <div className="mb-5">
                <label className="block text-[12px] font-bold text-white/70 uppercase tracking-wider mb-2">Selected Package</label>
                <div className="w-full bg-[#16161a]/50 border border-white/5 rounded-xl px-4 py-3 text-[15px] text-[#c9a96e] font-semibold flex items-center gap-2">
                  <MapPin size={16} /> {form.packageName}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                <div>
                  <label className="block text-[12px] font-bold text-white/70 uppercase tracking-wider mb-2">Preferred Date</label>
                  <input value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} type="text" placeholder="Travel date" className="w-full bg-[#16161a] border border-white/10 rounded-xl px-4 py-3 text-[15px] text-white focus:outline-none focus:border-[#c9a96e] focus:ring-1 focus:ring-[#c9a96e]" />
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-white/70 uppercase tracking-wider mb-2">No. of Persons</label>
                  <input value={form.persons} onChange={e => setForm({ ...form, persons: e.target.value })} type="number" min={1} className="w-full bg-[#16161a] border border-white/10 rounded-xl px-4 py-3 text-[15px] text-white focus:outline-none focus:border-[#c9a96e] focus:ring-1 focus:ring-[#c9a96e]" />
                </div>
              </div>
              <div className="mb-8">
                <label className="block text-[12px] font-bold text-white/70 uppercase tracking-wider mb-2">Message</label>
                <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} placeholder="Any special requirement?" rows={3} className="w-full bg-[#16161a] border border-white/10 rounded-xl px-4 py-3 text-[15px] text-white focus:outline-none focus:border-[#c9a96e] focus:ring-1 focus:ring-[#c9a96e] resize-none"></textarea>
              </div>
              <button disabled={loading} type="submit" className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#c9a96e] to-[#e07b39] text-[#0a0a0b] font-bold py-4 px-6 rounded-xl text-[15px] transition-transform hover:-translate-y-0.5 shadow-lg disabled:opacity-70 disabled:cursor-wait">
                {loading ? 'Sending...' : <><MessageCircle size={18} /> Send Enquiry</>}
              </button>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}




