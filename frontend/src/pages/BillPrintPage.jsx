import { API, BRAND } from '../data/constants';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Printer } from 'lucide-react';




export default function BillPrintPage() {
  const { id } = useParams();
  const [bill, setBill] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBill = async () => {
      try {
        const res = await fetch(`${API}/bills/${id}`);
        const data = await res.json();
        if (data.success) {
          setBill(data.data);
          // Wait slightly for images to load before printing
          setTimeout(() => window.print(), 500);
        } else {
          setError(data.message || 'Bill not found');
        }
      } catch (err) {
        setError('Network error');
      } finally {
        setLoading(false);
      }
    };
    fetchBill();
  }, [id]);

  if (loading) return <div className="p-10 text-center">Loading bill...</div>;
  if (error || !bill) return <div className="p-10 text-center text-red-600 font-bold">{error || 'Bill not found'}</div>;

  const t = parseFloat(bill.totalAmount) || 0;
  const p = parseFloat(bill.advancePaid) || 0;
  const paymentStatus = bill.paymentStatus || (p === 0 ? 'PENDING' : (p >= t && t > 0 ? 'PAID' : 'PARTIALLY PAID'));
  const statusColor = paymentStatus === 'PENDING' ? 'text-slate-500' : (paymentStatus === 'PAID' ? 'text-emerald-600' : 'text-orange-500');

  return (
    <div className="bg-slate-200 min-h-screen text-slate-900 py-10 print:py-0 print:bg-white">
      <style>{`
        @page { size: A4 portrait; margin: 0; }
        @media print {
          html, body { background: white; margin: 0; padding: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          #print-area { box-sizing: border-box !important; padding: 12mm !important; margin: 0 auto !important; width: 100% !important; max-width: none !important; min-height: 100vh !important; }
        }
      `}</style>
      
      {/* Floating print button for user */}
      <div className="fixed bottom-8 right-8 print:hidden z-50">
        <button onClick={() => window.print()} className="px-6 py-3 bg-indigo-600 text-white rounded-full font-bold shadow-xl hover:bg-indigo-700 flex items-center gap-2">
          <Printer size={18} /> Print Invoice
        </button>
      </div>

      <div className="w-full max-w-[210mm] min-h-[297mm] mx-auto p-6 bg-white shadow-2xl print:shadow-none print:w-auto print:max-w-none print:min-h-[99vh] flex flex-col print:p-0" id="print-area">
        {/* Header */}
        <div className="flex justify-between items-start border-b-2 border-indigo-900 pb-4 mb-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <img src="/logo.png?v=4" alt="Bangalir Berano Logo" className="h-8 w-8 rounded-full object-cover" />
              <h1 className="text-xl font-extrabold text-indigo-900 uppercase tracking-wider flex items-baseline">
                BANGALIR BERANO<sup className="text-[10px] font-bold text-indigo-900 ml-0.5 -top-1 relative">TM</sup>
              </h1>
            </div>
            <p className="text-sm font-semibold text-slate-700">Tours and Travels Operator</p>
            <p className="text-xs text-slate-600 mt-1">42, B G G Sarani, Radha Neel Nibas-II, Bhadrakali, Uttarpara, Hooghly, WB - 712232.<br/>Land Mark : Near Bhadrakali Youth Core Club.</p>
          </div>
          <div className="text-right text-xs text-slate-600 space-y-1 mt-2">
            <p><span className="font-bold">MSME:</span> UDYAM-WB-07-0135043</p>
            <p><span className="font-bold">Trade License:</span> 0917P1800240190</p>
            <p><span className="font-bold">Phone:</span> {BRAND.phone}</p>
            <p><span className="font-bold">Email:</span> contact@bangalirberano.com</p>
          </div>
        </div>

        <div className="text-center mb-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-800 border border-slate-800 inline-block px-4 py-1">INVOICE</h2>
        </div>

        {/* Details Grid */}
        <div className="flex justify-between mb-4">
          <div className="w-1/2">
            <p className="text-xs text-slate-500 uppercase font-bold mb-1">Bill To:</p>
            <h3 className="text-xs font-bold text-slate-900">{bill.customerName}</h3>
            {bill.customerAddress && <p className="text-xs text-slate-700">{bill.customerAddress}</p>}
            <p className="text-xs text-slate-700">{bill.customerPhone}</p>
            {bill.customerEmail && <p className="text-xs text-slate-700">{bill.customerEmail}</p>}
            
            <div className="mt-2">
              <p className="text-xs text-slate-500 uppercase font-bold mb-1">Tour Package:</p>
              <p className="font-bold text-slate-900">{bill.packageName || 'N/A'}</p>
              <p className="text-xs text-slate-700">Travel Date: {bill.travelDate || 'N/A'} | Pax: {bill.travellers}</p>
            </div>
          </div>
          <div className="w-1/3 border border-slate-300 rounded-lg p-3 bg-slate-50 h-max">
            <div className="flex justify-between mb-1 pb-1 border-b border-slate-200">
              <span className="text-xs font-bold text-slate-500">Invoice No:</span>
              <span className="text-xs font-bold text-indigo-900">{bill.billNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs font-bold text-slate-500">Date:</span>
              <span className="text-xs font-bold text-slate-900">{new Date(bill.billDate).toLocaleDateString('en-IN')}</span>
            </div>
          </div>
        </div>

        {/* Bill Items */}
        <div className="mb-4 border border-slate-300 rounded-lg overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-100 border-b border-slate-300 text-slate-700 text-[10px] uppercase font-bold">
              <tr>
                <th className="px-3 py-1 border-r border-slate-300">Description</th>
                <th className="px-3 py-1 border-r border-slate-300 text-center w-24">Qty</th>
                <th className="px-3 py-1 border-r border-slate-300 text-right w-32">Rate</th>
                <th className="px-3 py-1 text-right w-32">Amount</th>
              </tr>
            </thead>
            <tbody className="text-xs text-slate-900 divide-y divide-slate-200">
              {bill.items && bill.items.length > 0 ? bill.items.map((item, idx) => (
                <tr key={idx} className="print:break-inside-avoid">
                  <td className="px-3 py-1 border-r border-slate-300 font-semibold">{item.description}</td>
                  <td className="px-3 py-1 border-r border-slate-300 text-center">{item.quantity}</td>
                  <td className="px-3 py-1 border-r border-slate-300 text-right">₹{item.rate.toLocaleString('en-IN')}</td>
                  <td className="px-3 py-1 text-right font-bold">₹{item.amount.toLocaleString('en-IN')}</td>
                </tr>
              )) : (
                <tr>
                  <td className="px-3 py-1 border-r border-slate-300 font-semibold">{bill.packageName || 'Tour Package'}</td>
                  <td className="px-3 py-1 border-r border-slate-300 text-center">{bill.travellers}</td>
                  <td className="px-3 py-1 border-r border-slate-300 text-right">-</td>
                  <td className="px-3 py-1 text-right font-bold">₹{bill.totalAmount.toLocaleString('en-IN')}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pricing Summary */}
        <div className="flex justify-end mb-4 print:break-inside-avoid">
          <div className="w-1/2">
            {(bill.items && bill.items.length > 0) && (
              <>
                <div className="flex justify-between py-1 text-sm font-semibold text-slate-600">
                  <span>Subtotal:</span>
                  <span>₹{(bill.subtotal || 0).toLocaleString('en-IN')}</span>
                </div>
                {bill.discount > 0 && (
                <div className="flex justify-between py-1 text-sm font-semibold text-slate-600">
                  <span>Discount:</span>
                  <span>- ₹{(bill.discount || 0).toLocaleString('en-IN')}</span>
                </div>
                )}
                {bill.tax > 0 && (
                <div className="flex justify-between py-1 text-sm font-semibold text-slate-600">
                  <span>Tax:</span>
                  <span>+ ₹{(bill.tax || 0).toLocaleString('en-IN')}</span>
                </div>
                )}
              </>
            )}
            <div className="flex justify-between py-2 border-t border-b border-slate-300 mt-2">
              <span className="text-xs font-bold text-slate-600">Total Bill:</span>
              <span className="text-xs font-bold text-slate-900">₹{bill.totalAmount.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-300">
              <span className="text-xs font-bold text-emerald-600">Total Paid:</span>
              <span className="text-xs font-bold text-emerald-600">₹{bill.advancePaid.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between py-1 border-b-2 border-indigo-900 bg-slate-50 px-2 rounded mt-2">
              <span className="text-sm font-extrabold text-indigo-900">Balance Due:</span>
              <span className="text-sm font-extrabold text-indigo-900">₹{bill.dueAmount.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between py-2 mt-2">
              <span className="text-xs font-bold text-slate-600">Payment Status:</span>
              <span className={`text-sm font-extrabold ${statusColor}`}>{paymentStatus}</span>
            </div>
          </div>
        </div>

        {/* Payment History */}
        {bill.payments && bill.payments.length > 0 && (
          <div className="mb-4 print:mb-4">
            <h4 className="text-[10px] font-bold text-slate-500 uppercase mb-1 border-b border-slate-300 pb-1">Payment History</h4>
            <table className="w-full text-left text-xs">
              <thead className="text-slate-500">
                <tr><th className="py-1">Date</th><th className="py-1">Method</th><th className="py-1">Txn ID</th><th className="py-1 text-right">Amount</th></tr>
              </thead>
              <tbody className="text-slate-800 font-semibold divide-y divide-slate-100">
                {bill.payments.map((p, i) => (
                  <tr key={i}>
                    <td className="py-1">{new Date(p.date).toLocaleDateString('en-IN')}</td>
                    <td className="py-1">{p.method}</td>
                    <td className="py-1">{p.transactionId || '-'}</td>
                    <td className="py-1 text-right font-bold text-emerald-600">₹{p.amount.toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer */}
        <div className="mt-auto pt-4 border-t border-slate-300 flex justify-between items-end print:break-inside-avoid print:pt-4">
          <div className="text-xs text-slate-500 space-y-1">
            <p className="font-bold text-slate-700 mb-2">Terms & Conditions:</p>
            <p>1. All payments are subject to realization.</p>
            <p>2. Subject to Hooghly Jurisdiction.</p>
            <p>3. This is a computer generated invoice and does not require a physical signature.</p>
          </div>
          <div className="text-center">
            <p className="text-xs font-bold text-slate-900">For BANGALIR BERANO</p>
            <div className="h-12"></div> {/* Signature space */}
            <p className="text-xs font-semibold text-slate-500 border-t border-slate-300 pt-1">Authorized Signatory</p>
          </div>
        </div>
      </div>
    </div>
  );
}


