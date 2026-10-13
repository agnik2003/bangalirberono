import { API, BRAND, authFetch } from '../data/constants';
import { useEffect, useState } from 'react';
import { Calendar, FileText, Search, Loader2 } from 'lucide-react';

export default function AdminUnpaidBills() {
  const [bills, setBills] = useState([]);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [packageFilter, setPackageFilter] = useState('all');

  useEffect(() => {
    document.title = `Unpaid Bills | ${BRAND.name} Admin`;

    const fetchBills = async () => {
      try {
        const res = await authFetch(`${API}/bills`);
        const data = await res.json();
        if (data.success) {
          // Filter out only unpaid/partially paid bills
          const unpaid = data.data.filter(bill => {
            const due = parseFloat(bill.dueAmount) || 0;
            return due > 0 || bill.paymentStatus !== 'PAID';
          });
          setBills(unpaid);
        }
      } catch (err) {
        console.error('Error fetching bills:', err);
      } finally {
        setLoading(false);
      }
    };
    const fetchPackages = async () => {
      try {
        const res = await authFetch(`${API}/packages`);
        const data = await res.json();
        if (data.success) setPackages(data.data);
      } catch (err) { }
    };

    // Quick auth check
    const checkAuth = async () => {
      try {
        const res = await authFetch(`${API}/admin/check`);
        if (!res.ok) { 
          window.location.href = '/admin'; 
          return; 
        }
        fetchBills();
        fetchPackages();
      } catch { 
        window.location.href = '/admin'; 
      }
    };

    checkAuth();
  }, []);

  const openWhatsApp = (bill) => {
    const rawPhone = bill.customerPhone;
    if (!rawPhone) return;
    const phone = rawPhone.replace(/[^\d]/g, '');
    const intlPhone = phone.startsWith('91') ? phone : '91' + phone;
    const t = parseFloat(bill.totalAmount) || 0;
    const p = parseFloat(bill.advancePaid) || 0;
    const due = parseFloat(bill.dueAmount) || (t - p);
    const status = bill.paymentStatus || (p === 0 ? 'PENDING' : 'PARTIALLY PAID');

    const baseUrl = API.replace('localhost', '127.0.0.1.nip.io');
    const billLink = `${baseUrl}/bills/${bill._id}/pdf?clientUrl=${encodeURIComponent(window.location.origin)}`;

    const msg = `Dear ${bill.customerName},

Your booking with *Bangalir Berano* has been confirmed!

*Invoice Details:*
Bill No: ${bill.billNumber}
Package: ${bill.packageName || 'Tour Package'}
Travel Date: ${bill.travelDate || 'Flexible'}

*Payment Summary:*
Total: ₹${t.toLocaleString('en-IN')}
Paid: ₹${p.toLocaleString('en-IN')}
Balance Due: ₹${due.toLocaleString('en-IN')}
Status: *${status}*

View Invoice: ${billLink}

Please complete your pending payment.
For queries: +91 9830053647
Thank you!`;
    const url = `https://wa.me/${intlPhone}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  const filteredBills = bills.filter(item => {
    let dateMatch = true;
    const d = new Date(item.billDate);
    if (dateFrom) {
      const from = new Date(dateFrom);
      from.setHours(0, 0, 0, 0);
      if (d < from) dateMatch = false;
    }
    if (dateTo) {
      const to = new Date(dateTo);
      to.setHours(23, 59, 59, 999);
      if (d > to) dateMatch = false;
    }

    let packageMatch = true;
    if (packageFilter !== 'all') {
      const dest = (item.packageName || '').toLowerCase();
      packageMatch = dest.includes(packageFilter.toLowerCase());
    }

    let searchMatch = true;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().trim();
      const name = (item.customerName || '').toLowerCase();
      const phone = (item.customerPhone || '').toLowerCase();
      const billNo = (item.billNumber || '').toLowerCase();
      const pkgName = (item.packageName || '').toLowerCase();
      searchMatch = name.includes(q) || phone.includes(q) || billNo.includes(q) || pkgName.includes(q);
    }

    return dateMatch && packageMatch && searchMatch;
  });

  const filterSel = "bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-500 focus:outline-none focus:border-indigo-500 focus:text-slate-900 shadow-sm";

  return (
    <div className="admin-theme min-h-screen bg-slate-50 text-slate-900 font-sans p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-bold mb-1">All Unpaid Bills</h1>
            <p className="text-slate-500 text-sm">Customers who have not completed their full payment for all trips.</p>
          </div>
          <div className="flex flex-wrap gap-2 items-center justify-end w-full md:w-auto">
            <div className="relative">
              <input type="text" placeholder="Search name, phone, package..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-900 focus:outline-none focus:border-indigo-500 w-full md:w-64 shadow-sm" />
              <Search size={15} className="absolute left-3 top-2.5 text-slate-400" />
            </div>
            <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-sm">
              <span className="text-xs font-bold text-slate-400">FROM</span>
              <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="text-sm bg-transparent border-none focus:outline-none text-slate-700 ml-1" />
              <span className="text-xs font-bold text-slate-400 border-l border-slate-200 ml-2 pl-2">TO</span>
              <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="text-sm bg-transparent border-none focus:outline-none text-slate-700 ml-1" />
            </div>
            <select value={packageFilter} onChange={e => setPackageFilter(e.target.value)} className={filterSel}>
              <option value="all">All Packages</option>
              {packages.map(p => <option key={p._id} value={p.name}>{p.name}</option>)}
            </select>
            {(searchQuery || dateFrom || dateTo || packageFilter !== 'all') && (
              <button onClick={() => { setSearchQuery(''); setDateFrom(''); setDateTo(''); setPackageFilter('all'); }} className="px-3 py-2 text-xs font-bold text-red-500 bg-red-50 rounded-xl hover:bg-red-100">✕ Clear</button>
            )}
          </div>
        </header>

        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-16 text-center text-slate-500 flex flex-col items-center gap-3">
                <Loader2 size={32} className="animate-spin text-indigo-500" />
                <p>Loading unpaid bills...</p>
              </div>
            ) : filteredBills.length === 0 ? (
              <div className="p-16 text-center text-slate-500">
                <FileText size={48} className="mx-auto mb-4 text-slate-300" />
                <h3 className="text-lg font-bold text-slate-900 mb-1">No Unpaid Bills</h3>
                <p>There are no unpaid bills matching your search.</p>
              </div>
            ) : (
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[11px] font-bold border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4">Bill Details</th>
                    <th className="px-6 py-4">Customer Info</th>
                    <th className="px-6 py-4">Package & Travel</th>
                    <th className="px-6 py-4">Financials</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600">
                  {filteredBills.map(bl => {
                    const t = parseFloat(bl.totalAmount) || 0;
                    const p = parseFloat(bl.advancePaid) || 0;
                    const status = p === 0 ? 'PENDING' : 'PARTIALLY PAID';
                    const statusColor = p === 0 ? 'text-slate-600 bg-slate-100' : 'text-orange-700 bg-orange-50';

                    return (
                      <tr key={bl._id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-5">
                          <span className="flex items-center gap-2 mb-1"><Calendar size={13} className="text-indigo-600" />{new Date(bl.billDate).toLocaleDateString()}</span>
                          <p className="text-xs font-bold text-slate-900">{bl.billNumber}</p>
                        </td>
                        <td className="px-6 py-5">
                          <p className="text-slate-900 font-semibold mb-1 text-base">{bl.customerName}</p>
                          <p className="text-xs text-slate-500">{bl.customerPhone}</p>
                        </td>
                        <td className="px-6 py-5">
                          <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-[11px] font-bold inline-block mb-1 truncate max-w-[200px]">{bl.packageName || 'N/A'}</span>
                          <p className="mt-1 text-xs">{bl.travelDate}</p>
                        </td>
                        <td className="px-6 py-5">
                          <p className="font-bold text-slate-900">Total: ₹{bl.totalAmount}</p>
                          <p className="text-xs text-emerald-600 mt-0.5">Paid: ₹{bl.advancePaid}</p>
                          <p className="text-xs text-red-600 font-bold mt-0.5">Due: ₹{bl.dueAmount}</p>
                          <span className={`px-2 py-1 rounded text-[10px] font-bold tracking-wider mt-2 inline-block ${statusColor}`}>{status}</span>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <div className="flex justify-end gap-2 flex-wrap">
                            <button onClick={() => openWhatsApp(bl)} className="px-4 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-xl font-bold text-xs transition-colors border border-emerald-200 flex items-center gap-1">
                              <span>📱</span> Remind on WA
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


