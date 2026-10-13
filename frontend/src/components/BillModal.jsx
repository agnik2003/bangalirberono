import { API, authFetch } from '../data/constants';
import { useState, useEffect } from 'react';
import { X, Loader2, Printer, Plus, Edit2, Trash2, Save, Download } from 'lucide-react';



const inp = "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 placeholder-slate-400 transition-all";
const Label = ({ children }) => <label className="block text-xs font-bold text-slate-900 mb-1.5 ml-1 uppercase tracking-wider">{children}</label>;

export default function BillModal({ booking, existingBillId, packages = [], onClose, onSaved }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [viewMode, setViewMode] = useState(existingBillId ? 'view' : 'edit'); // 'edit' or 'view'
  
  const [bill, setBill] = useState(null);
  
  const [form, setForm] = useState({
    bookingId: booking?._id || '',
    customerName: booking?.name || '',
    customerPhone: booking?.phone || '',
    customerEmail: booking?.email || '',
    customerAddress: '',
    packageName: booking?.destination || '',
    packageCategory: '',
    packageExperience: '',
    travelDate: booking?.date || '',
    travellers: booking?.travellers || 1,
    discount: 0,
    tax: 0
  });

  const initialPackage = booking?.destination ? packages.find(p => p.name === booking.destination) : null;
  let initialRate = 0;
  if (initialPackage && initialPackage.price) {
    const parsed = parseFloat(initialPackage.price.replace(/[^\d.-]/g, ''));
    if (!isNaN(parsed)) initialRate = parsed;
  }
  const initialQty = booking?.travellers || 1;

  const [items, setItems] = useState([
    { description: booking?.destination || 'Tour Package', quantity: initialQty, rate: initialRate, amount: initialRate * initialQty }
  ]);

  // Payment states
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);
  const [paymentForm, setPaymentForm] = useState({
    amount: '', method: 'UPI', date: new Date().toISOString().split('T')[0], transactionId: '', notes: ''
  });

  useEffect(() => {
    if (existingBillId) {
      fetchBill();
    }
  }, [existingBillId]);

  const fetchBill = async (idToFetch = (bill?._id || existingBillId)) => {
    if (!idToFetch) return;
    setLoading(true);
    try {
      const res = await authFetch(`${API}/bills/${idToFetch}`);
      const data = await res.json();
      if (data.success) {
        setBill(data.data);
        setForm({
          bookingId: data.data.bookingId || '',
          customerName: data.data.customerName || '',
          customerPhone: data.data.customerPhone || '',
          customerEmail: data.data.customerEmail || '',
          customerAddress: data.data.customerAddress || '',
          packageName: data.data.packageName || '',
          packageCategory: data.data.packageCategory || '',
          packageExperience: data.data.packageExperience || '',
          travelDate: data.data.travelDate || '',
          travellers: data.data.travellers || 1,
          discount: data.data.discount || 0,
          tax: data.data.tax || 0
        });
        if (data.data.items && data.data.items.length > 0) {
          setItems(data.data.items);
        } else {
          setItems([{
            description: data.data.packageName || 'Tour Package',
            quantity: data.data.travellers || 1,
            rate: data.data.travellers ? Math.round((data.data.totalAmount || 0) / data.data.travellers) : (data.data.totalAmount || 0),
            amount: data.data.totalAmount || 0
          }]);
        }
      } else {
        setError(data.message || 'Error fetching bill');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => {
      const next = { ...prev, [name]: value };
      if (name === 'packageName') {
        const selectedPkg = packages.find(p => p.name === value);
        if (selectedPkg) {
          next.packageCategory = selectedPkg.category ? (Array.isArray(selectedPkg.category) ? selectedPkg.category.join(', ') : selectedPkg.category) : '';
          next.packageExperience = selectedPkg.experiences ? (Array.isArray(selectedPkg.experiences) ? selectedPkg.experiences.join(', ') : selectedPkg.experiences) : '';
          
          if (selectedPkg.price) {
            const numStr = selectedPkg.price.replace(/[^\d.-]/g, '');
            const parsedRate = parseFloat(numStr);
            if (!isNaN(parsedRate)) {
              setItems(prevItems => {
                 const newItems = [...prevItems];
                 if (newItems.length > 0) {
                    if (!newItems[0].description || newItems[0].description === 'Tour Package' || newItems[0].description === prev.packageName) {
                      newItems[0].description = value;
                    }
                    newItems[0].rate = parsedRate;
                    newItems[0].amount = parsedRate * (parseFloat(newItems[0].quantity) || 1);
                 }
                 return newItems;
              });
            }
          }
        }
      }
      return next;
    });
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    if (field === 'quantity' || field === 'rate') {
      const qty = parseFloat(newItems[index].quantity) || 0;
      const rate = parseFloat(newItems[index].rate) || 0;
      newItems[index].amount = qty * rate;
    }
    setItems(newItems);
  };

  const addItem = () => {
    setItems([...items, { description: '', quantity: 1, rate: 0, amount: 0 }]);
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const subtotal = items.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
  const discount = parseFloat(form.discount) || 0;
  const tax = parseFloat(form.tax) || 0;
  const grandTotal = Math.max(0, subtotal - discount + tax);

  const saveBill = async () => {
    setLoading(true); setError('');
    try {
      const url = bill ? `${API}/bills/${bill._id}` : `${API}/bills`;
      const method = bill ? 'PUT' : 'POST';

      const payload = { ...form, items };

      const res = await authFetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        if (onSaved) onSaved();
        setBill(data.data);
        setViewMode('view');
        fetchBill(data.data._id); // Re-fetch to get populated items/payments
      } else {
        setError(data.error || 'Failed to save bill');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  const savePayment = async () => {
    setLoading(true); setError('');
    try {
      const url = editingPayment ? `${API}/payments/${editingPayment._id}` : `${API}/payments`;
      const method = editingPayment ? 'PUT' : 'POST';

      const payload = { ...paymentForm, billId: bill._id };

      const res = await authFetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        setShowPaymentForm(false);
        setEditingPayment(null);
        setPaymentForm({ amount: '', method: 'UPI', date: new Date().toISOString().split('T')[0], transactionId: '', notes: '' });
        fetchBill();
        if (onSaved) onSaved();
      } else {
        setError(data.error || 'Failed to save payment');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  const deletePayment = async (id) => {
    if (!window.confirm('Are you sure you want to delete this payment?')) return;
    setLoading(true);
    try {
      const res = await authFetch(`${API}/payments/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        fetchBill();
        if (onSaved) onSaved();
      } else {
        setError(data.error || 'Failed to delete payment');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  const openPaymentForm = (payment = null) => {
    if (payment) {
      setEditingPayment(payment);
      setPaymentForm({
        amount: payment.amount,
        method: payment.method,
        date: new Date(payment.date).toISOString().split('T')[0],
        transactionId: payment.transactionId || '',
        notes: payment.notes || ''
      });
    } else {
      setEditingPayment(null);
      setPaymentForm({
        amount: bill?.dueAmount || 0,
        method: 'UPI',
        date: new Date().toISOString().split('T')[0],
        transactionId: '',
        notes: ''
      });
    }
    setShowPaymentForm(true);
  };

  if (viewMode === 'edit') {
    return (
      <div className="fixed inset-0 z-[2000] flex items-start justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
        <div className="bg-white border border-slate-200 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden my-auto sm:my-10">
          <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50 sticky top-0 z-10">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">{bill ? 'Edit Bill' : 'Create Bill'}</h2>
              <p className="text-xs font-semibold text-slate-500 mt-0.5">{form.customerName}</p>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-700 transition-colors">
              <X size={24} />
            </button>
          </div>

          <div className="p-6 space-y-8">
            {error && <div className="p-4 bg-red-50 text-red-600 rounded-xl font-bold">{error}</div>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-sm font-extrabold text-slate-400 uppercase tracking-widest border-b pb-2">Customer Info</h3>
                <div><Label>Customer Name</Label><input name="customerName" value={form.customerName} onChange={handleFormChange} className={inp} /></div>
                <div><Label>Phone Number</Label><input name="customerPhone" value={form.customerPhone} onChange={handleFormChange} className={inp} /></div>
                <div><Label>Email</Label><input name="customerEmail" value={form.customerEmail} onChange={handleFormChange} className={inp} /></div>
              </div>
              <div className="space-y-4">
                <h3 className="text-sm font-extrabold text-slate-400 uppercase tracking-widest border-b pb-2">Tour Info</h3>
                <div><Label>Package</Label><input list="package-list" name="packageName" value={form.packageName} onChange={handleFormChange} className={inp} placeholder="Type or select a package" /><datalist id="package-list">{packages.map(p => <option key={p._id} value={p.name} />)}</datalist></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>Travel Date</Label><input name="travelDate" value={form.travelDate} onChange={handleFormChange} className={inp} /></div>
                  <div><Label>Travellers</Label><input type="number" name="travellers" value={form.travellers} onChange={handleFormChange} className={inp} /></div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center border-b pb-2">
                <h3 className="text-sm font-extrabold text-slate-400 uppercase tracking-widest">Bill Items</h3>
                <button onClick={addItem} className="text-xs font-bold bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-indigo-100"><Plus size={14} /> Add Item</button>
              </div>
              
              <div className="space-y-3">
                {items.map((item, index) => (
                  <div key={index} className="flex gap-3 items-start">
                    <div className="flex-1"><Label>Description</Label><input list="item-description-suggestions" value={item.description} onChange={e => handleItemChange(index, 'description', e.target.value)} className={inp} placeholder="e.g. Tour Package, Hotel, Transport..." /></div>
                    <div className="w-24"><Label>Qty</Label><input type="number" value={item.quantity} onChange={e => handleItemChange(index, 'quantity', e.target.value)} className={inp} /></div>
                    <div className="w-32"><Label>Rate (₹)</Label><input type="number" value={item.rate} onChange={e => handleItemChange(index, 'rate', e.target.value)} className={inp} /></div>
                    <div className="w-32"><Label>Amount (₹)</Label><input type="number" value={item.amount} disabled className={`${inp} bg-slate-100 font-bold`} /></div>
                    {items.length > 1 && (
                      <div className="pt-7"><button onClick={() => removeItem(index)} className="p-3 text-red-500 hover:bg-red-50 rounded-xl"><Trash2 size={18} /></button></div>
                    )}
                  </div>
                ))}
              </div>
              <datalist id="item-description-suggestions">
                {form.packageName && <option value={form.packageName} />}
                <option value="Tour Package" />
                <option value="Hotel Accommodation" />
                <option value="Transportation / Vehicle Charges" />
                <option value="Train / Flight Tickets" />
                <option value="Sightseeing & Entry Passes" />
                <option value="Food & Dining" />
                <option value="Tour Manager / Guide Charges" />
                <option value="Extra Bed / Mattress" />
                {packages.map(p => (
                  <option key={p._id} value={p.name} />
                ))}
              </datalist>
            </div>

            <div className="flex justify-end pt-6 border-t">
              <div className="w-72 space-y-3">
                <div className="flex justify-between items-center"><span className="text-sm font-bold text-slate-600">Subtotal</span><span className="font-bold">₹{subtotal.toLocaleString('en-IN')}</span></div>
                <div className="flex justify-between items-center"><span className="text-sm font-bold text-slate-600">Discount (₹)</span><input type="number" name="discount" value={form.discount} onChange={handleFormChange} className="w-32 text-right bg-slate-50 border rounded-lg px-2 py-1 font-bold" /></div>
                <div className="flex justify-between items-center"><span className="text-sm font-bold text-slate-600">Tax (₹)</span><input type="number" name="tax" value={form.tax} onChange={handleFormChange} className="w-32 text-right bg-slate-50 border rounded-lg px-2 py-1 font-bold" /></div>
                <div className="flex justify-between items-center pt-2 border-t-2 border-slate-900"><span className="text-lg font-extrabold text-slate-900">Total Bill</span><span className="text-xl font-extrabold text-indigo-700">₹{grandTotal.toLocaleString('en-IN')}</span></div>
              </div>
            </div>

            <div className="flex gap-4 pt-4 sticky bottom-0 bg-white">
              <button onClick={() => bill ? setViewMode('view') : onClose()} className="flex-1 py-4 rounded-xl border-2 border-slate-200 font-bold text-slate-600 hover:bg-slate-50 transition-colors">Cancel</button>
              <button onClick={saveBill} disabled={loading} className="flex-1 py-4 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-colors flex justify-center items-center gap-2 shadow-lg">
                {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />} Save Bill
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // VIEW MODE (BILL PAGE)
  if (!bill) return null;

  return (
    <div className="fixed inset-0 z-[2000] flex items-start justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white border border-slate-200 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden my-auto sm:my-10">
        <div className="flex items-center justify-between px-8 py-5 border-b border-slate-100 bg-slate-50 sticky top-0 z-10">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">BILL #{bill.billNumber}</h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center bg-white border border-slate-200 rounded-full text-slate-400 hover:text-slate-900 hover:shadow-sm transition-all">
            <X size={16} />
          </button>
        </div>

        <div className="p-8 space-y-8">
          {error && <div className="p-4 bg-red-50 text-red-600 rounded-xl font-bold">{error}</div>}
          
          <div className="flex justify-between bg-slate-50 p-6 rounded-2xl border border-slate-100">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Customer</p>
              <p className="font-extrabold text-lg">{bill.customerName}</p>
              <p className="text-sm font-semibold text-slate-500">{bill.customerPhone}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Tour</p>
              <p className="font-extrabold text-lg text-indigo-900">{bill.packageName || 'General'}</p>
              <p className="text-sm font-semibold text-slate-500">Travel Date: {bill.travelDate}</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Status</p>
              <span className={`px-4 py-1.5 rounded-full text-xs font-extrabold tracking-wider uppercase ${bill.paymentStatus === 'PAID' ? 'bg-emerald-100 text-emerald-700' : bill.paymentStatus === 'PENDING' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>
                {bill.paymentStatus}
              </span>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-extrabold text-slate-400 uppercase tracking-widest border-b pb-2 mb-4">Bill Items</h3>
            <table className="w-full text-left text-sm">
              <thead className="text-xs font-bold text-slate-400 uppercase bg-slate-50">
                <tr><th className="px-4 py-3 rounded-l-lg">Description</th><th className="px-4 py-3">Qty</th><th className="px-4 py-3">Rate</th><th className="px-4 py-3 text-right rounded-r-lg">Amount</th></tr>
              </thead>
              <tbody className="font-semibold text-slate-700 divide-y divide-slate-50">
                {bill.items?.map((item, i) => (
                  <tr key={i}>
                    <td className="px-4 py-4">{item.description}</td>
                    <td className="px-4 py-4">{item.quantity}</td>
                    <td className="px-4 py-4">₹{item.rate.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-4 text-right">₹{item.amount.toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            <div className="flex justify-end mt-4">
              <div className="w-72 space-y-2 text-sm">
                <div className="flex justify-between font-bold text-slate-500"><span>Subtotal</span><span>₹{(bill.subtotal || 0).toLocaleString('en-IN')}</span></div>
                <div className="flex justify-between font-bold text-slate-500"><span>Discount</span><span>- ₹{(bill.discount || 0).toLocaleString('en-IN')}</span></div>
                <div className="flex justify-between font-bold text-slate-500"><span>Tax</span><span>+ ₹{(bill.tax || 0).toLocaleString('en-IN')}</span></div>
                <div className="flex justify-between font-extrabold text-lg text-slate-900 border-t pt-2 mt-2"><span>TOTAL BILL</span><span>₹{(bill.totalAmount || 0).toLocaleString('en-IN')}</span></div>
              </div>
            </div>
          </div>

          <div className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-6">
            <h3 className="text-sm font-extrabold text-indigo-900 uppercase tracking-widest mb-6">Payment Summary</h3>
            <div className="flex justify-between items-center text-center divide-x divide-indigo-100">
              <div className="flex-1">
                <p className="text-xs font-bold text-slate-500 uppercase">Total Bill</p>
                <p className="text-2xl font-black text-slate-900 mt-1">₹{bill.totalAmount.toLocaleString('en-IN')}</p>
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-slate-500 uppercase">Total Paid</p>
                <p className="text-2xl font-black text-emerald-600 mt-1">₹{bill.advancePaid.toLocaleString('en-IN')}</p>
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-slate-500 uppercase">Balance Due</p>
                <p className="text-2xl font-black text-orange-600 mt-1">₹{bill.dueAmount.toLocaleString('en-IN')}</p>
              </div>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center border-b pb-2 mb-4">
              <h3 className="text-sm font-extrabold text-slate-400 uppercase tracking-widest">Payment History</h3>
              {bill.dueAmount > 0 && (
                <button onClick={() => openPaymentForm()} className="text-xs font-bold bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-1 hover:bg-indigo-700 shadow-sm transition-all"><Plus size={14} /> Add Payment</button>
              )}
            </div>
            
            {showPaymentForm && (
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 mb-6 flex gap-4 items-end">
                <div className="flex-1"><Label>Amount (₹)</Label><input type="number" value={paymentForm.amount} onChange={e => setPaymentForm({...paymentForm, amount: e.target.value})} className={inp} /></div>
                <div className="w-40"><Label>Method</Label>
                  <select value={paymentForm.method} onChange={e => setPaymentForm({...paymentForm, method: e.target.value})} className={inp}>
                    <option>Cash</option><option>UPI</option><option>Bank Transfer</option><option>Card</option><option>Other</option>
                  </select>
                </div>
                <div className="w-40"><Label>Date</Label><input type="date" value={paymentForm.date} onChange={e => setPaymentForm({...paymentForm, date: e.target.value})} className={inp} /></div>
                <div className="flex-1"><Label>Txn ID / Notes</Label><input value={paymentForm.transactionId} onChange={e => setPaymentForm({...paymentForm, transactionId: e.target.value})} className={inp} placeholder="Optional" /></div>
                <button onClick={savePayment} disabled={loading} className="py-3 px-6 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700">Save</button>
                <button onClick={() => setShowPaymentForm(false)} className="py-3 px-4 bg-white border border-slate-200 font-bold rounded-xl text-slate-500">Cancel</button>
              </div>
            )}

            {!bill.payments || bill.payments.length === 0 ? (
              <div className="text-center py-6 text-slate-400 font-bold text-sm bg-slate-50 rounded-xl border border-slate-100">No payments recorded yet.</div>
            ) : (
              <table className="w-full text-left text-sm">
                <thead className="text-xs font-bold text-slate-400 uppercase border-b">
                  <tr><th className="pb-3">Date</th><th className="pb-3">Method</th><th className="pb-3">Txn ID</th><th className="pb-3 font-extrabold text-slate-900 text-right">Amount</th><th className="pb-3 text-right">Action</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                  {bill.payments.map((p, i) => (
                    <tr key={i} className="hover:bg-slate-50">
                      <td className="py-3">{new Date(p.date).toLocaleDateString('en-IN')}</td>
                      <td className="py-3"><span className="px-2 py-1 bg-slate-100 rounded text-xs">{p.method}</span></td>
                      <td className="py-3 text-slate-500 text-xs">{p.transactionId || '-'}</td>
                      <td className="py-3 text-right font-extrabold text-emerald-600">₹{p.amount.toLocaleString('en-IN')}</td>
                      <td className="py-3 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => openPaymentForm(p)} className="p-1.5 text-slate-400 hover:text-indigo-600"><Edit2 size={14} /></button>
                          <button onClick={() => deletePayment(p._id)} className="p-1.5 text-slate-400 hover:text-red-600"><Trash2 size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="flex justify-between gap-4 pt-6 mt-6 border-t border-slate-100">
            <button onClick={() => setViewMode('edit')} className="px-6 py-3 rounded-xl border-2 border-slate-200 font-bold text-slate-600 hover:bg-slate-50 transition-colors flex items-center gap-2"><Edit2 size={16} /> Edit Bill Details</button>
            <div className="flex gap-3">
              <button onClick={() => window.open('/admin/bill/' + bill._id, '_blank')} className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-colors flex items-center gap-2 shadow-lg"><Printer size={16} /> Print Bill</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



