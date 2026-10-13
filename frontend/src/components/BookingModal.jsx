import { API } from '../data/constants';
import { useState } from 'react';
import { X, Loader2, AlertCircle } from 'lucide-react';



const inp = "w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 placeholder-slate-400 transition-all";
const Label = ({ children }) => <label className="block text-xs font-bold text-slate-900 mb-1.5 ml-1 uppercase tracking-wider">{children}</label>;

export default function BookingModal({ packages = [], onClose, onSaved }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    destination: '',
    date: '',
    travellers: '',
    location: '',
    preferredTravel: 'Train',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => {
      const next = { ...prev, [name]: value };
      if (name === 'destination') {
        const selectedPkg = packages.find(p => p.name === value);
        if (selectedPkg && selectedPkg.date) {
          next.date = selectedPkg.date;
        }
      }
      return next;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone) { setError('Name and Phone are required'); return; }
    
    setLoading(true); setError('');
    try {
      const res = await fetch(`${API}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (data.success) {
        if (onSaved) onSaved();
        onClose();
      } else {
        setError(data.error || 'Failed to save booking');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white border border-slate-200 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Add New Booking</h2>
            <p className="text-xs text-slate-500 mt-0.5">Manually add a customer booking</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm font-semibold">
              <AlertCircle size={16} />{error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Customer Name</Label>
              <input name="name" value={form.name} onChange={handleChange} className={inp} required />
            </div>
            <div>
              <Label>Phone Number</Label>
              <input name="phone" value={form.phone} onChange={handleChange} className={inp} required />
            </div>
          </div>
          
          <div>
            <Label>Email Address</Label>
            <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Optional" className={inp} />
          </div>
          
          <div>
            <Label>Package / Destination</Label>
            <select name="destination" value={form.destination} onChange={handleChange} className={inp}>
              <option value="">Select Package</option>
              {packages.map(p => <option key={p._id} value={p.name}>{p.name}</option>)}
            </select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Location / City</Label>
              <input name="location" value={form.location} onChange={handleChange} placeholder="Where are they from?" className={inp} />
            </div>
            <div>
              <Label>Preferred Travel</Label>
              <select name="preferredTravel" value={form.preferredTravel} onChange={handleChange} className={inp}>
                <option value="Train">Train</option>
                <option value="Flight">Flight</option>
                <option value="Bus / Car">Bus / Car</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Travel Date</Label>
              <input name="date" value={form.date} onChange={handleChange} className={inp} />
            </div>
            <div>
              <Label>Travellers (Pax)</Label>
              <input type="number" name="travellers" value={form.travellers} onChange={handleChange} className={inp} min="1" />
            </div>
          </div>

          <div>
            <Label>Additional Notes (Optional)</Label>
            <textarea name="message" value={form.message} onChange={handleChange} className={`${inp} resize-none h-20`} placeholder="Any specific requirements..."></textarea>
          </div>

          <div className="flex gap-4 pt-4 mt-2">
            <button type="button" onClick={onClose} className="flex-1 py-3.5 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="flex-1 py-3.5 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-colors flex justify-center items-center gap-2">
              {loading ? <Loader2 size={18} className="animate-spin" /> : null}
              Save Booking
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}



