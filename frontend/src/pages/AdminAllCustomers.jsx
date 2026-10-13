import { API, BRAND } from '../data/constants';
import { useEffect, useState } from 'react';
import { Search, Plus, Trash2, X, FileText, Loader2 } from 'lucide-react';




export default function AdminAllCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [packages, setPackages] = useState([]);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [packageFilter, setPackageFilter] = useState('all');
  
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [newCustomer, setNewCustomer] = useState({ name: '', phone: '', email: '', age: '', gender: 'M', locationFrom: '', heads: 1, postpaidNumber: '', downTrainFlight: '', room: '', packageName: '', status: 'Enquired', details: '' });
  
  const [customerContactModal, setCustomerContactModal] = useState(null); // { type: 'whatsapp'|'email', customer }
  const [sharePhone, setSharePhone] = useState('');
  const [shareMessage, setShareMessage] = useState('');
  
  const fetchCustomers = async () => {
    try {
      const res = await fetch(`${API}/customers`, { credentials: 'include' });
      const data = await res.json();
      if (data.success) setCustomers(data.data);
    } catch (err) {}
    setLoading(false);
  };

  useEffect(() => {
    document.title = `All Customers | ${BRAND.name} Admin`;
    const checkAuth = async () => {
      try {
        const res = await fetch(`${API}/admin/check`, { credentials: 'include' });
        if (!res.ok) { window.location.href = '/admin'; return; }
        
        // Fetch packages for the dropdown
        try {
          const pkgRes = await fetch(`${API}/packages`, { credentials: 'include' });
          const pkgData = await pkgRes.json();
          if (pkgData.success) setPackages(pkgData.data);
        } catch(e) {}
        
        fetchCustomers();
      } catch { window.location.href = '/admin'; }
    };
    checkAuth();
  }, []);

  const handleDeleteCustomer = async (id) => {
    if (!window.confirm('Are you sure you want to delete this customer?')) return;
    try {
      await fetch(`${API}/customers/${id}`, { method: 'DELETE', credentials: 'include' });
      fetchCustomers();
    } catch(err) {}
  };

  const handleSendCustomerMessage = () => {
    if (!sharePhone) return;
    const phone = sharePhone.replace(/[^\d]/g, '');
    const intlPhone = phone.startsWith('91') ? phone : '91' + phone;
    
    if (customerContactModal.type === 'whatsapp') {
      window.open(`https://wa.me/${intlPhone}?text=${encodeURIComponent(shareMessage)}`, '_blank');
    } else {
      window.open(`mailto:${customerContactModal.customer.email || ''}?subject=${encodeURIComponent('Updates from Bangalir Berano')}&body=${encodeURIComponent(shareMessage)}`, '_blank');
    }
    setCustomerContactModal(null);
  };

  const exportCustomersToCSV = () => {
    if (customers.length === 0) return;
    const headers = ['SL NO', 'NAME', 'AGE', 'GENDER', 'FROM', 'TRIP', 'HEADS', 'PHONE', 'EMAIL', 'POSTPAID', 'DOWN TRAIN/FLIGHT', 'ROOM', 'STATUS'];
    const rows = customers.map((c, i) => [
      i + 1,
      `"${c.name || ''}"`,
      c.age || '',
      c.gender || '',
      `"${c.locationFrom || ''}"`,
      `"${c.packageName || ''}"`,
      c.heads || 1,
      c.phone || '',
      c.email || '',
      c.postpaidNumber || '',
      `"${c.downTrainFlight || ''}"`,
      `"${c.room || ''}"`,
      c.status || ''
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `customers_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const filteredCustomers = customers.filter(item => {
    let dateMatch = true;
    if (dateFrom || dateTo) {
      // Assuming item.createdAt exists (default Mongoose timestamps)
      const d = item.createdAt ? new Date(item.createdAt) : null;
      if (d) {
        if (dateFrom) {
          const from = new Date(dateFrom);
          from.setHours(0,0,0,0);
          if (d < from) dateMatch = false;
        }
        if (dateTo) {
          const to = new Date(dateTo);
          to.setHours(23,59,59,999);
          if (d > to) dateMatch = false;
        }
      } else {
        // If no createdAt, we can't reliably filter by date, skip or exclude.
        // Usually, just let it pass or fail. We'll fail it if dates are strictly asked.
        dateMatch = false;
      }
    }

    let statusMatch = true;
    if (statusFilter !== 'all') {
      statusMatch = item.status === statusFilter;
    }

    let pkgMatch = true;
    if (packageFilter !== 'all') {
      pkgMatch = item.packageName === packageFilter;
    }

    let searchMatch = true;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().trim();
      const name = (item.name || '').toLowerCase();
      const phone = (item.phone || '').toLowerCase();
      const email = (item.email || '').toLowerCase();
      searchMatch = name.includes(q) || phone.includes(q) || email.includes(q);
    }

    return dateMatch && statusMatch && pkgMatch && searchMatch;
  });

  const filterSel = "bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-500 focus:outline-none focus:border-indigo-500 focus:text-slate-900 shadow-sm";

  const settingInp = "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors text-slate-900";

  return (
    <div className="admin-theme min-h-screen bg-slate-50 text-slate-900 font-sans p-6 md:p-10">
      <div className="w-full">
        <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-bold mb-1">All Customers</h1>
            <p className="text-slate-500 text-sm">Full view of all customers ({customers.length} total)</p>
          </div>
          <div className="flex flex-wrap gap-2 items-center justify-end w-full md:w-auto">
            <div className="relative w-full md:w-auto">
              <input type="text" placeholder="Search name, phone, email..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-900 focus:outline-none focus:border-indigo-500 w-full md:w-64 shadow-sm" />
              <Search size={15} className="absolute left-3 top-2.5 text-slate-400" />
            </div>
            <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl px-2 py-1.5 shadow-sm">
              <span className="text-xs font-bold text-slate-400 px-1">FROM</span>
              <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="text-sm bg-transparent border-none focus:outline-none text-slate-700 w-28" />
              <span className="text-xs font-bold text-slate-400 px-1 border-l border-slate-200 ml-1 pl-2">TO</span>
              <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="text-sm bg-transparent border-none focus:outline-none text-slate-700 w-28" />
            </div>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className={filterSel}>
              <option value="all">All Status</option>
              <option value="Enquired">Enquired</option>
              <option value="Upcoming Trip">Upcoming Trip</option>
              <option value="Completed Trip">Completed Trip</option>
            </select>
            <select value={packageFilter} onChange={e => setPackageFilter(e.target.value)} className={filterSel}>
              <option value="all">All Trips</option>
              {packages.map(p => <option key={p._id} value={p.name}>{p.name}</option>)}
            </select>
            <button onClick={exportCustomersToCSV} className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl font-bold text-sm shadow-sm hover:bg-emerald-100 transition-colors flex items-center gap-2 border border-emerald-200">
              <span>📊</span> Export CSV
            </button>
            <button onClick={() => setShowCustomerModal(true)} className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-sm hover:bg-indigo-700 transition-colors flex items-center gap-2">
              <Plus size={16} /> Add Customer
            </button>
          </div>
        </header>

        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto w-full">
            {loading ? (
              <div className="p-16 text-center text-slate-500 flex flex-col items-center gap-3">
                <Loader2 size={32} className="animate-spin text-indigo-500" />
                <p>Loading customers...</p>
              </div>
            ) : filteredCustomers.length === 0 ? (
              <div className="p-16 text-center text-slate-500">
                <FileText size={48} className="mx-auto mb-4 text-slate-300" />
                <h3 className="text-lg font-bold text-slate-900 mb-1">No Customers Found</h3>
              </div>
            ) : (
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] font-bold border-b border-slate-200">
                  <tr>
                    <th className="px-2 py-3 border-r border-slate-100">SL NO.</th>
                    <th className="px-2 py-3 border-r border-slate-100">NAME OF THE GUEST</th>
                    <th className="px-2 py-3 border-r border-slate-100">AGE & M/F</th>
                    <th className="px-2 py-3 border-r border-slate-100">FROM</th>
                    <th className="px-2 py-3 border-r border-slate-100">TRIP</th>
                    <th className="px-2 py-3 border-r border-slate-100">HEADS</th>
                    <th className="px-2 py-3 border-r border-slate-100">MOBILE & EMAIL</th>
                    <th className="px-2 py-3 border-r border-slate-100">POSTPAID NUMBER</th>
                    <th className="px-2 py-3 border-r border-slate-100">DOWN TRAIN / FLIGHT</th>
                    <th className="px-2 py-3 border-r border-slate-100">ROOM</th>
                    <th className="px-2 py-3 border-r border-slate-100">STATUS</th>
                    <th className="px-2 py-3 border-r border-slate-100">INTERACTIONS</th>
                    <th className="px-2 py-3 text-right">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600">
                  {filteredCustomers.map((c, index) => (
                    <tr key={c._id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-2 py-3 font-bold text-slate-900 border-r border-slate-100 text-xs">{index + 1}</td>
                      <td className="px-2 py-3 border-r border-slate-100"><p className="text-slate-900 font-bold text-xs">{c.name}</p></td>
                      <td className="px-2 py-3 border-r border-slate-100">
                        <p className="text-[11px]"><span className="font-bold text-slate-400">Age:</span> {c.age || '-'}</p>
                        <p className="text-[11px]"><span className="font-bold text-slate-400">Sex:</span> {c.gender || '-'}</p>
                      </td>
                      <td className="px-2 py-3 border-r border-slate-100"><p className="text-[11px] font-semibold break-words max-w-[80px]">{c.locationFrom || '-'}</p></td>
                      <td className="px-2 py-3 border-r border-slate-100"><p className="text-[11px] font-bold text-indigo-600 break-words max-w-[80px]">{c.packageName || '-'}</p></td>
                      <td className="px-2 py-3 border-r border-slate-100"><p className="text-[11px] font-bold">{c.heads || 1}</p></td>
                      <td className="px-2 py-3 border-r border-slate-100 break-words max-w-[120px]">
                        <p className="text-xs font-semibold">{c.phone}</p>
                        {c.email && <p className="text-[10px] text-slate-400 leading-tight mt-0.5">{c.email}</p>}
                      </td>
                      <td className="px-2 py-3 border-r border-slate-100"><p className="text-[11px] break-words max-w-[80px]">{c.postpaidNumber || '-'}</p></td>
                      <td className="px-2 py-3 border-r border-slate-100"><p className="text-[11px] break-words max-w-[80px]">{c.downTrainFlight || '-'}</p></td>
                      <td className="px-2 py-3 border-r border-slate-100"><p className="text-[11px] font-bold text-indigo-600 break-words max-w-[60px]">{c.room || '-'}</p></td>
                      <td className="px-2 py-3 border-r border-slate-100">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold inline-block text-center whitespace-nowrap ${
                          c.status === 'Completed Trip' ? 'bg-emerald-100 text-emerald-700' :
                          c.status === 'Upcoming Trip' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-700'
                        }`}>{c.status}</span>
                      </td>
                      <td className="px-2 py-3 border-r border-slate-100">
                        <details className="text-xs max-w-xs cursor-pointer group relative z-10">
                          <summary className="font-bold text-indigo-600 outline-none">{c.interactions?.length || 0} Interactions</summary>
                          <div className="mt-2 space-y-2 max-h-32 overflow-y-auto pr-2">
                            {c.interactions?.slice().reverse().map((int, i) => (
                              <div key={i} className="bg-slate-100 p-2 rounded border border-slate-200">
                                <p className="font-bold text-slate-700">{int.type}</p>
                                <p className="text-[10px] text-slate-400 mb-1">{new Date(int.date).toLocaleString()}</p>
                                <p className="text-slate-600 leading-relaxed">{int.details}</p>
                              </div>
                            ))}
                          </div>
                        </details>
                      </td>
                      <td className="px-2 py-3 text-right">
                        <div className="flex gap-1 justify-end flex-col sm:flex-row">
                          <button onClick={() => { setSharePhone(c.phone); setShareMessage(`Hi ${c.name},\n\nGreetings from Bangalir Berano!`); setCustomerContactModal({ type: 'whatsapp', customer: c }); }} className="px-2 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded text-[10px] font-bold border border-emerald-200">WhatsApp</button>
                          <button onClick={() => { setSharePhone(c.phone); setShareMessage(`Hi ${c.name},\n\nGreetings from Bangalir Berano!`); setCustomerContactModal({ type: 'email', customer: c }); }} className="px-2 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded text-[10px] font-bold border border-blue-200">Email</button>
                          <button onClick={() => handleDeleteCustomer(c._id)} className="px-2 py-1 bg-red-50 text-red-600 hover:bg-red-100 rounded text-[10px] font-bold border border-red-200">Del</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {showCustomerModal && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
          <div className="bg-white border border-slate-200 w-full max-w-4xl rounded-[24px] shadow-2xl p-6 md:p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-900">Add Customer</h2>
              <button onClick={() => setShowCustomerModal(false)} className="text-slate-400 hover:text-slate-900"><X size={20}/></button>
            </div>
            <form onSubmit={async (e) => {
              e.preventDefault();
              try {
                const res = await fetch(`${API}/customers`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(newCustomer),
                  credentials: 'include'
                });
                if (res.ok) {
                  setShowCustomerModal(false);
                  setNewCustomer({ name: '', phone: '', email: '', age: '', gender: 'M', locationFrom: '', heads: 1, postpaidNumber: '', downTrainFlight: '', room: '', packageName: '', status: 'Enquired', details: '' });
                  fetchCustomers();
                }
              } catch(err) {}
            }} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Name *</label>
                  <input required value={newCustomer.name} onChange={e=>setNewCustomer({...newCustomer, name: e.target.value})} className={settingInp} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Phone Number *</label>
                  <input required value={newCustomer.phone} onChange={e=>setNewCustomer({...newCustomer, phone: e.target.value})} className={settingInp} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Email</label>
                  <input type="email" value={newCustomer.email} onChange={e=>setNewCustomer({...newCustomer, email: e.target.value})} className={settingInp} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Postpaid Number</label>
                  <input value={newCustomer.postpaidNumber} onChange={e=>setNewCustomer({...newCustomer, postpaidNumber: e.target.value})} className={settingInp} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Age</label>
                  <input type="number" value={newCustomer.age} onChange={e=>setNewCustomer({...newCustomer, age: e.target.value})} className={settingInp} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Gender (M/F)</label>
                  <select value={newCustomer.gender} onChange={e=>setNewCustomer({...newCustomer, gender: e.target.value})} className={settingInp}>
                    <option value="M">M</option>
                    <option value="F">F</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">From (Location)</label>
                  <input value={newCustomer.locationFrom} onChange={e=>setNewCustomer({...newCustomer, locationFrom: e.target.value})} className={settingInp} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Trip / Package</label>
                  <select value={newCustomer.packageName} onChange={e=>setNewCustomer({...newCustomer, packageName: e.target.value})} className={settingInp}>
                    <option value="">-- Select Trip --</option>
                    {packages.map(p => <option key={p._id} value={p.name}>{p.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Heads (Pax)</label>
                  <input type="number" value={newCustomer.heads} onChange={e=>setNewCustomer({...newCustomer, heads: e.target.value})} className={settingInp} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Down Train / Flight</label>
                  <input value={newCustomer.downTrainFlight} onChange={e=>setNewCustomer({...newCustomer, downTrainFlight: e.target.value})} className={settingInp} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Room</label>
                  <input value={newCustomer.room} onChange={e=>setNewCustomer({...newCustomer, room: e.target.value})} className={settingInp} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Status</label>
                  <select value={newCustomer.status} onChange={e=>setNewCustomer({...newCustomer, status: e.target.value})} className={settingInp}>
                    <option value="Enquired">Enquired</option>
                    <option value="Upcoming Trip">Upcoming Trip</option>
                    <option value="Completed Trip">Completed Trip</option>
                  </select>
                </div>
              </div>
              <div className="mt-5">
                <label className="block text-xs font-bold text-slate-400 mb-1">Interaction Details (Optional)</label>
                <textarea value={newCustomer.details} onChange={e=>setNewCustomer({...newCustomer, details: e.target.value})} className={settingInp + " resize-none"} rows={2} placeholder="E.g. Met at office for Darjeeling tour" />
              </div>
              <button type="submit" className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700">Save Customer</button>
            </form>
          </div>
        </div>
      )}

      {customerContactModal && (
        <div className="fixed inset-0 z-[3000] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 my-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-extrabold text-slate-900">
                {customerContactModal.type === 'whatsapp' ? '📱 Message via WhatsApp' : '✉️ Message via Email'}
              </h3>
              <button onClick={() => setCustomerContactModal(null)} className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-400 hover:bg-slate-200"><X size={16} /></button>
            </div>
            
            <div className="mb-4">
              <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wide">Customer Details</label>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <p className="font-bold text-slate-800">{customerContactModal.customer.name}</p>
                <p className="text-sm text-slate-500 mt-1">{customerContactModal.customer.phone} {customerContactModal.customer.email ? `• ${customerContactModal.customer.email}` : ''}</p>
              </div>
            </div>

            <div className="space-y-4">
              {customerContactModal.type === 'whatsapp' && (
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wide">WhatsApp Number</label>
                  <input value={sharePhone} onChange={e => setSharePhone(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-medium" />
                </div>
              )}
              
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wide">Message Content</label>
                <textarea rows={6} value={shareMessage} onChange={e => setShareMessage(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none font-medium leading-relaxed"></textarea>
              </div>
              
              <button onClick={handleSendCustomerMessage} className={`w-full py-3.5 text-white rounded-xl font-bold shadow-lg transition-transform hover:-translate-y-0.5 mt-2 ${customerContactModal.type === 'whatsapp' ? 'bg-[#25D366] hover:bg-[#1ebd5a] shadow-emerald-500/20' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20'}`}>
                {customerContactModal.type === 'whatsapp' ? 'Open WhatsApp Desktop / Web' : 'Open Default Email App'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


