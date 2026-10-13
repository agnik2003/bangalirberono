import { API } from '../data/constants';
import { useState, useEffect } from 'react';
import { X, Loader2, AlertCircle } from 'lucide-react';



const inp = "w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3 text-[15px] font-bold text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all";
const Label = ({ children }) => <label className="block text-sm font-extrabold text-slate-900 mb-2 ml-1">{children}</label>;

const CATEGORIES = ['Transport', 'Hotel', 'Food', 'Marketing', 'Office', 'Staff', 'Tour/Trip', 'Other'];
const METHODS = ['Cash', 'UPI', 'Bank Transfer', 'Card', 'Other'];

export default function ExpenseModal({ existingExpense, onClose, onSaved }) {
  const [form, setForm] = useState({
    title: '',
    category: 'Other',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    method: 'UPI',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (existingExpense) {
      setForm({
        title: existingExpense.title || '',
        category: existingExpense.category || 'Other',
        amount: existingExpense.amount || '',
        date: new Date(existingExpense.date || new Date()).toISOString().split('T')[0],
        method: existingExpense.method || 'UPI',
        notes: existingExpense.notes || ''
      });
    }
  }, [existingExpense]);

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.title.trim()) { setError('Expense title is required'); return; }
    if (!form.amount || parseFloat(form.amount) <= 0) { setError('Valid amount is required'); return; }

    setLoading(true);
    try {
      const url = existingExpense ? `${API}/expenses/${existingExpense._id}` : `${API}/expenses`;
      const method = existingExpense ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (data.success) {
        onSaved();
        onClose();
      } else {
        setError(data.error || 'Failed to save expense');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white border border-slate-200 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden my-8">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50 sticky top-0">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">{existingExpense ? 'Edit Expense' : 'Add Expense'}</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && <div className="p-4 bg-red-50 text-red-600 rounded-xl font-bold flex gap-2"><AlertCircle size={18}/> {error}</div>}

          <div>
            <Label>Expense Title</Label>
            <input name="title" value={form.title} onChange={handleChange} placeholder="e.g. Hotel Booking for Darjeeling" className={inp} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Amount (₹)</Label>
              <input type="number" name="amount" value={form.amount} onChange={handleChange} placeholder="0.00" min="0" step="0.01" className={inp} />
            </div>
            <div>
              <Label>Date</Label>
              <input type="date" name="date" value={form.date} onChange={handleChange} className={inp} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Category</Label>
              <select name="category" value={form.category} onChange={handleChange} className={inp}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <Label>Payment Method</Label>
              <select name="method" value={form.method} onChange={handleChange} className={inp}>
                {METHODS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
          </div>

          <div>
            <Label>Notes (Optional)</Label>
            <textarea name="notes" value={form.notes} onChange={handleChange} rows="2" className={inp + " resize-none"} placeholder="Any additional details..." />
          </div>

          <div className="pt-4 border-t border-slate-100 flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 py-3.5 rounded-xl border-2 border-slate-200 font-bold text-slate-500 hover:bg-slate-50">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 py-3.5 rounded-xl bg-indigo-600 text-white font-extrabold hover:bg-indigo-700 flex items-center justify-center gap-2">
              {loading ? <><Loader2 size={16} className="animate-spin" /> Saving</> : 'Save Expense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}



