import { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LogOut, LayoutDashboard, Settings, Users, Image as ImageIcon,
  Calendar, Edit3, Trash2, CheckCircle, XCircle, Plus, X,
  Upload, Loader2, AlertCircle, ChevronDown, ChevronUp, List, FileText, FilePlus, Printer, Search, Bell, MapPin, RefreshCw
} from 'lucide-react';
import { BRAND, EXPERIENCES, API, authFetch } from '../data/constants';
import BillModal from '../components/BillModal';
import BookingModal from '../components/BookingModal';



// ─── Collapsible Section ──────────────────────────────────────────────────────
function Section({ title, subtitle, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-2 border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-6 py-5 bg-slate-50 hover:bg-slate-100 transition-colors text-left"
      >
        <div>
          <p className="text-base font-extrabold text-slate-900">{title}</p>
          {subtitle && <p className="text-xs font-semibold text-slate-500 mt-1">{subtitle}</p>}
        </div>
        {open ? <ChevronUp size={20} className="text-slate-500" /> : <ChevronDown size={20} className="text-slate-500" />}
      </button>
      {open && <div className="p-6 space-y-6 bg-white border-t-2 border-slate-100">{children}</div>}
    </div>
  );
}

// ─── Input helpers ────────────────────────────────────────────────────────────
const inp = "w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3.5 text-[15px] font-bold text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 placeholder-slate-400 transition-all";
const Label = ({ children, sub }) => (
  <label className="block text-sm font-extrabold text-slate-900 mb-2 ml-1">
    {children}
    {sub && <span className="font-semibold text-slate-500 ml-2">{sub}</span>}
  </label>
);

// ─── Package Form Modal ───────────────────────────────────────────────────────
function PackageFormModal({ pkg, categories = [], onClose, onSaved }) {
  const isEdit = Boolean(pkg);
  const fileInputRef = useRef();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(pkg?.image || '');

  const parseInitList = (val) => {
    if (!val) return [];
    if (Array.isArray(val)) {
      return val.flatMap(c => {
        try { const p = JSON.parse(c); if (Array.isArray(p)) return p; } catch (e) { }
        if (typeof c === 'string' && c.startsWith('"') && c.endsWith('"')) return c.slice(1, -1);
        return c;
      });
    }
    if (typeof val === 'string') {
      try { const p = JSON.parse(val); if (Array.isArray(p)) return p; } catch (e) { }
      if (val.startsWith('"') && val.endsWith('"')) return [val.slice(1, -1)];
      return [val];
    }
    return [];
  };

  const [form, setForm] = useState({
    // Basic
    name: pkg?.name || '',
    route: pkg?.route || '',
    category: parseInitList(pkg?.category),
    status: pkg?.status || 'Upcoming',
    tag: pkg?.tag || '',
    date: pkg?.date || '',
    startDate: pkg?.startDate ? new Date(pkg.startDate).toISOString().split('T')[0] : '',
    endDate: pkg?.endDate ? new Date(pkg.endDate).toISOString().split('T')[0] : '',
    duration: pkg?.duration || '',
    description: pkg?.description || '',
    image: pkg?.image || '',
    // Pricing
    price: pkg?.price || '',
    priceNote: pkg?.priceNote || 'Double Bed Sharing',
    childRate1: pkg?.childRate1 || '',
    childRate2: pkg?.childRate2 || '',
    advance: pkg?.advance || '',
    seatsLeft: pkg?.seatsLeft || '',
    // Lists (stored as newline text in form, array in DB)
    highlights: (pkg?.highlights || []).join('\n'),
    includes: (pkg?.includes || []).join('\n'),
    excludes: (pkg?.excludes || []).join('\n'),
    experiences: pkg?.experiences || [],
    // Notes
    notes: pkg?.notes || '',
  });

  const toggleExperience = (expTitle) => {
    setForm(f => ({
      ...f,
      experiences: f.experiences.includes(expTitle)
        ? f.experiences.filter(e => e !== expTitle)
        : [...f.experiences, expTitle]
    }));
  };

  const toggleCategory = (catName) => {
    setForm(f => ({
      ...f,
      category: f.category.includes(catName)
        ? f.category.filter(c => c !== catName)
        : [...f.category, catName]
    }));
  };

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const updateDateString = (startStr, endStr) => {
    if (!startStr || !endStr) return;
    try {
      const s = new Date(startStr);
      const e = new Date(endStr);
      if (isNaN(s.getTime()) || isNaN(e.getTime())) return;

      const sDate = s.getDate();
      const sMonth = s.toLocaleString('default', { month: 'long' });
      const sYear = s.getFullYear();

      const eDate = e.getDate();
      const eMonth = e.toLocaleString('default', { month: 'long' });
      const eYear = e.getFullYear();

      let dateString = '';
      if (sYear === eYear && sMonth === eMonth) {
        dateString = `${sDate}-${eDate} ${sMonth} ${sYear}`;
      } else if (sYear === eYear) {
        dateString = `${sDate} ${s.toLocaleString('default', { month: 'short' })} - ${eDate} ${e.toLocaleString('default', { month: 'short' })} ${sYear}`;
      } else {
        dateString = `${sDate} ${s.toLocaleString('default', { month: 'short' })} ${sYear} - ${eDate} ${e.toLocaleString('default', { month: 'short' })} ${eYear}`;
      }

      set('date', dateString);
    } catch (err) { }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) { setError('Image must be under 10MB'); return; }
    setImageFile(file);
    // Show local preview immediately
    const reader = new FileReader();
    reader.onload = ev => setImagePreview(ev.target.result);
    reader.readAsDataURL(file);
    // Clear the URL field — file takes priority
    set('image', '');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.name.trim()) { setError('Package name is required'); return; }
    if (!form.price.trim()) { setError('Price is required'); return; }

    setLoading(true);
    try {
      const fd = new FormData();
      // Plain text fields — if a file is uploaded, send empty imageUrl so backend uses the file
      ['name', 'route', 'status', 'tag', 'date', 'duration', 'description',
        'price', 'priceNote', 'childRate1', 'childRate2', 'advance', 'notes', 'seatsLeft'].forEach(k => fd.append(k, form[k]));
      fd.append('startDate', form.startDate || '');
      fd.append('endDate', form.endDate || '');
      // Only send imageUrl if no file is being uploaded
      if (!imageFile) fd.append('image', form.image);
      // List fields →’ send as newline strings, backend splits them
      fd.append('highlights', form.highlights);
      fd.append('includes', form.includes);
      fd.append('excludes', form.excludes);
      fd.append('experiences', JSON.stringify(form.experiences));
      fd.append('category', JSON.stringify(form.category));
      // File upload — multer picks this up on the backend
      if (imageFile) fd.append('image', imageFile);

      const url = isEdit ? `${API}/packages/${pkg._id}` : `${API}/packages`;
      const method = isEdit ? 'PUT' : 'POST';
      const res = await authFetch(url, { method, body: fd });
      const data = await res.json();

      if (data.success) { onSaved(); onClose(); }
      else setError(data.error || 'Something went wrong');
    } catch (err) {
      setError('Network error. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md overflow-y-auto">
      <div className="bg-white border border-slate-200 w-full max-w-2xl rounded-[24px] shadow-2xl my-4 flex flex-col max-h-[92vh]">

        {/* ── Header ── */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200 sticky top-0 bg-white z-10 rounded-t-[24px]">
          <div>
            <h2 className="text-lg font-bold text-slate-900">{isEdit ? 'Edit Package' : 'Add New Package'}</h2>
            <p className="text-xs text-slate-400 mt-0.5">Fill in the tour details below</p>
          </div>
          <button onClick={onClose} className="w-9 h-9 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto flex-1">

          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-600 text-sm">
              <AlertCircle size={15} />{error}
            </div>
          )}

          {/* ── 1. Image ── */}
          <Section title="Cover Image" subtitle="Upload a JPG/PNG file or paste an image URL">
            {/* Upload zone */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="relative cursor-pointer rounded-xl border-[3px] border-dashed border-indigo-200 hover:border-indigo-400 bg-indigo-50/50 hover:bg-indigo-50 transition-colors overflow-hidden group"
            >
              {imagePreview ? (
                <div className="relative">
                  <img src={imagePreview} alt="Preview" className="w-full h-44 object-cover" />
                  <div className="absolute inset-0 bg-white/90 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-indigo-700 text-base font-bold">
                    <Upload size={20} /> Click to Change Image
                  </div>
                </div>
              ) : (
                <div className="h-32 flex flex-col items-center justify-center gap-3 text-indigo-500">
                  <Upload size={32} />
                  <span className="text-sm font-bold text-slate-600">Click to upload JPG, PNG, WEBP (max 10MB)</span>
                </div>
              )}
            </div>
            <input ref={fileInputRef} type="file" accept="image/jpeg,image/jpg,image/png,image/webp,image/gif" onChange={handleFileChange} className="hidden" />

            {/* Show selected file name + clear button */}
            {imageFile && (
              <div className="flex items-center justify-between bg-indigo-50 border border-indigo-200 rounded-xl px-4 py-2.5">
                <span className="text-xs text-indigo-600 font-semibold truncate">📎 {imageFile.name}</span>
                <button
                  type="button"
                  onClick={() => { setImageFile(null); setImagePreview(form.image || ''); }}
                  className="text-slate-400 hover:text-red-600 transition-colors ml-3 shrink-0 text-xs"
                >
                  ✕ Remove
                </button>
              </div>
            )}

            {/* URL fallback */}
            <div>
              <Label sub={imageFile ? '(file selected — URL ignored)' : '(or paste a URL instead of uploading)'}>Image URL</Label>
              <input
                type="text"
                value={form.image}
                onChange={e => {
                  set('image', e.target.value);
                  if (!imageFile) setImagePreview(e.target.value);
                }}
                disabled={!!imageFile}
                placeholder="https://images.unsplash.com/..."
                className={inp + (imageFile ? ' opacity-40 cursor-not-allowed' : '')}
              />
            </div>
          </Section>

          {/* ── 2. Basic Info ── */}
          <Section title="Tour Information" subtitle="Name, dates, route, category">
            <div>
              <Label>Package / Tour Name *</Label>
              <input value={form.name} onChange={e => set('name', e.target.value)}
                placeholder="KERALA & KANYAKUMARI GROUP TOUR" className={inp} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
              <div>
                <Label>Start Date</Label>
                <input type="date" value={form.startDate} onChange={e => {
                  set('startDate', e.target.value);
                  updateDateString(e.target.value, form.endDate);
                }} className={inp} />
              </div>
              <div>
                <Label>End Date</Label>
                <input type="date" value={form.endDate} onChange={e => {
                  set('endDate', e.target.value);
                  updateDateString(form.startDate, e.target.value);
                }} className={inp} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <Label sub="(Auto-generated)">Display Date</Label>
                <input value={form.date} onChange={e => set('date', e.target.value)}
                  placeholder="17–26 January 2027" className={inp} />
              </div>
              <div>
                <Label>Duration</Label>
                <input value={form.duration} onChange={e => set('duration', e.target.value)}
                  placeholder="9 Nights / 10 Days" className={inp} />
              </div>
              <div>
                <Label>Seats Left</Label>
                <input type="number" value={form.seatsLeft} onChange={e => set('seatsLeft', e.target.value)}
                  placeholder="e.g. 5" className={inp} />
              </div>
            </div>

            <div>
              <Label>Route / Places Covered</Label>
              <input value={form.route} onChange={e => set('route', e.target.value)}
                placeholder="Kochi • Athirappilly • Munnar • Thekkady • Alleppey • Kovalam • Kanyakumari" className={inp} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Status</Label>
                <select value={form.status} onChange={e => set('status', e.target.value)} className={inp}>
                  <option value="Upcoming">Upcoming</option>
                  <option value="Ongoing">Ongoing</option>
                  <option value="Past">Past</option>
                </select>
              </div>
              <div>
                <Label>Tag / Label</Label>
                <input value={form.tag} onChange={e => set('tag', e.target.value)}
                  placeholder="India • Beach & Hills" className={inp} />
              </div>
            </div>

            <div>
              <Label>Categories</Label>
              <div className="flex flex-wrap gap-3 mt-2">
                {categories.map(c => (
                  <label key={c._id} className="flex items-center gap-2 cursor-pointer text-[14px] text-slate-700 font-medium">
                    <input
                      type="checkbox"
                      checked={form.category.includes(c.name)}
                      onChange={() => toggleCategory(c.name)}
                      className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    {c.name}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <Label>Experiences (Optional)</Label>
              <div className="grid grid-cols-2 gap-2 mt-1">
                {EXPERIENCES.map(exp => (
                  <label key={exp.id} className="flex items-center gap-2 cursor-pointer text-[14px] text-slate-700 font-medium">
                    <input
                      type="checkbox"
                      checked={form.experiences.includes(exp.title)}
                      onChange={() => toggleExperience(exp.title)}
                      className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    {exp.title}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <Label>Short Description</Label>
              <textarea value={form.description} onChange={e => set('description', e.target.value)}
                rows={2} placeholder="Brief overview shown on the card..." className={inp + ' resize-none'} />
            </div>
          </Section>

          {/* ── 3. Pricing ── */}
          <Section title="Pricing" subtitle="Adult rate, child rates, advance amount">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Package Cost (Adult) *</Label>
                <input value={form.price} onChange={e => set('price', e.target.value)}
                  placeholder="₹29,900/-" className={inp} />
              </div>
              <div>
                <Label>Sharing / Basis</Label>
                <input value={form.priceNote} onChange={e => set('priceNote', e.target.value)}
                  placeholder="Double Bed Sharing" className={inp} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Child Rate 1</Label>
                <input value={form.childRate1} onChange={e => set('childRate1', e.target.value)}
                  placeholder="5–8 years: ₹22,900/-" className={inp} />
              </div>
              <div>
                <Label>Child Rate 2</Label>
                <input value={form.childRate2} onChange={e => set('childRate2', e.target.value)}
                  placeholder="Below 5 years: ₹11,900/-" className={inp} />
              </div>
            </div>

            <div>
              <Label>Advance / Booking Amount</Label>
              <input value={form.advance} onChange={e => set('advance', e.target.value)}
                placeholder="₹10,000/- per person" className={inp} />
            </div>
          </Section>

          {/* ── 4. Highlights ── */}
          <Section title="Tour Highlights" subtitle="One item per line" defaultOpen={false}>
            <textarea
              value={form.highlights}
              onChange={e => set('highlights', e.target.value)}
              rows={8}
              placeholder={`Kochi City & Sightseeing\nAthirappilly Waterfalls\nMunnar Tea Gardens & Tea Museum\nMattuppetty Dam & Spice Garden\nPeriyar Lake\nAlleppey\nKovalam Beach & Poovar Beach\nPadmanabhaswamy Temple\nKanyakumari, Vivekananda Rock & Beach`}
              className={inp + ' resize-none font-mono text-[13px]'}
            />
            <p className="text-[11px] text-slate-400">Each line = one highlight bullet</p>
          </Section>

          {/* ── 5. Package Includes ── */}
          <Section title="Package Includes" subtitle="One item per line" defaultOpen={false}>
            <textarea
              value={form.includes}
              onChange={e => set('includes', e.target.value)}
              rows={7}
              placeholder={`3-Star AC Hotels (except Munnar & Thekkady)\nAC Tempo Traveller\nBreakfast & Dinner (MAP Plan)\nAll Toll, Parking & Driver Charges\nExperienced Tour Manager\nSeparate room for each family`}
              className={inp + ' resize-none font-mono text-[13px]'}
            />
          </Section>

          {/* ── 6. Package Excludes ── */}
          <Section title="Package Excludes" subtitle="One item per line" defaultOpen={false}>
            <textarea
              value={form.excludes}
              onChange={e => set('excludes', e.target.value)}
              rows={6}
              placeholder={`Flights\nSafari, Boating & Rides\nEntry Fees & Tips\nPersonal Meals\nCamera & Porter Charges`}
              className={inp + ' resize-none font-mono text-[13px]'}
            />
          </Section>

          {/* ── 7. Notes / Terms ── */}
          <Section title="Notes & Terms" subtitle="Shown at the bottom of the package detail" defaultOpen={false}>
            <textarea
              value={form.notes}
              onChange={e => set('notes', e.target.value)}
              rows={4}
              placeholder={`Alcohol consumption is strictly prohibited during the tour.\nCancellation Policy & Terms and Conditions Apply.`}
              className={inp + ' resize-none'}
            />
          </Section>

          {/* ── Actions ── */}
          <div className="flex gap-4 pt-4 pb-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-4 rounded-xl border-2 border-slate-200 text-slate-500 hover:bg-slate-100 transition-colors text-base font-bold">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-extrabold text-base transition-transform hover:-translate-y-1 hover:shadow-xl shadow-lg disabled:opacity-70 disabled:cursor-wait flex items-center justify-center gap-2">
              {loading
                ? <><Loader2 size={18} className="animate-spin" /> Saving...</>
                : isEdit ? '✓ Save Changes' : '+ Add Package'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Main Admin Dashboard ─────────────────────────────────────────────────────
function getDaysUntilTrip(travelDateStr) {
  if (!travelDateStr || travelDateStr === 'TBA') return null;
  const match = travelDateStr.match(/(\d+).*?([a-zA-Z]+)\s+(\d{4})/);
  if (match) {
    const day = match[1];
    const month = match[2];
    const year = match[3];
    const date = new Date(`${month} ${day}, ${year}`);
    if (!isNaN(date)) {
      const diffTime = date - new Date();
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
  }
  const matchMonth = travelDateStr.match(/([a-zA-Z]+)\s+(\d{4})/);
  if (matchMonth) {
    const month = matchMonth[1];
    const year = matchMonth[2];
    const date = new Date(`${month} 1, ${year}`);
    if (!isNaN(date)) {
      const diffTime = date - new Date();
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
  }
  return null;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');

  const [enquiries, setEnquiries] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [bills, setBills] = useState([]);
  const [packages, setPackages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loadingEnquiries, setLoadingEnquiries] = useState(true);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [loadingBills, setLoadingBills] = useState(true);
  const [loadingPackages, setLoadingPackages] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingCustomers, setLoadingCustomers] = useState(true);

  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showBillModal, setShowBillModal] = useState(false);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [billingBooking, setBillingBooking] = useState(null);
  const [editingBill, setEditingBill] = useState(null);

  const [showPackageForm, setShowPackageForm] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [newCustomer, setNewCustomer] = useState({ name: '', phone: '', email: '', age: '', gender: 'M', locationFrom: '', heads: 1, postpaidNumber: '', downTrainFlight: '', room: '', status: 'Enquired', details: '' });
  const [deletingId, setDeletingId] = useState(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [savingCategory, setSavingCategory] = useState(false);
  const dragItem = useRef(null);
  const dragOverItem = useRef(null);
  const [toastMessage, setToastMessage] = useState(null);

  const [dateFilter, setDateFilter] = useState('all');
  const [packageFilter, setPackageFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  // WhatsApp / Email share states
  const [shareModal, setShareModal] = useState(null); // { type: 'whatsapp'|'email', bill }
  const [sharePhone, setSharePhone] = useState('');
  const [shareEmail, setShareEmail] = useState('');
  const [shareSending, setShareSending] = useState(false);
  const [shareMsg, setShareMsg] = useState('');

  // Customer Contact states
  const [customerContactModal, setCustomerContactModal] = useState(null); // { type: 'whatsapp'|'email', customer }
  const [contactMessageType, setContactMessageType] = useState('invite'); // 'invite', 'greeting', 'custom'
  const [selectedPackageId, setSelectedPackageId] = useState('');
  const [customMessage, setCustomMessage] = useState('');


  // ── WhatsApp Share ──────────────────────────────────────────────────────────
  const openWhatsApp = (bill) => {
    const phone = bill.customerPhone?.replace(/[^\d]/g, '');
    if (!phone) {
      setSharePhone('');
      setShareMsg('');
      setShareModal({ type: 'whatsapp', bill });
      return;
    }
    sendWhatsApp(phone, bill);
  };

  const sendWhatsApp = (rawPhone, bill) => {
    const phone = rawPhone.replace(/[^\d]/g, '');
    const intlPhone = phone.startsWith('91') ? phone : '91' + phone;
    const t = parseFloat(bill.totalAmount) || 0;
    const p = parseFloat(bill.advancePaid) || 0;
    const due = parseFloat(bill.dueAmount) || (t - p);
    const status = bill.paymentStatus || (p === 0 ? 'PENDING' : (p >= t && t > 0 ? 'PAID' : 'PARTIALLY PAID'));

    // Use the backend API base for the PDF download link
    // Replace 'localhost' with '127.0.0.1.nip.io' which is a wildcard DNS pointing to localhost.
    // This tricks WhatsApp into seeing a valid ".io" domain and making it a clickable blue link!
    const baseUrl = API.replace('localhost', '127.0.0.1.nip.io');
    const billLink = `${baseUrl}/bills/${bill._id}/pdf?clientUrl=${encodeURIComponent(window.location.origin)}`;

    const msg = `Dear ${bill.customerName},

Your booking with *Bangalir Berano* has been confirmed!

*Invoice Details:*
Bill No: ${bill.billNumber}
Package: ${bill.packageName || 'Tour Package'}
Travel Date: ${bill.travelDate || 'Flexible'}
Total Persons: ${bill.travellers || 1}

*Payment Summary:*
Total: ₹${t.toLocaleString('en-IN')}
Paid: ₹${p.toLocaleString('en-IN')}
Balance Due: ₹${due.toLocaleString('en-IN')}
Status: *${status}*

View Invoice: ${billLink}

For queries:
+91 9830053647
contact@bangalirberano.com

Thank you for choosing Bangalir Berano!`;
    const url = `https://wa.me/${intlPhone}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
    setShareModal(null);
  };

  // ── Email Share ──────────────────────────────────────────────────────────────
  const openEmail = (bill) => {
    setShareEmail(bill.customerEmail || '');
    setShareMsg('');
    setShareModal({ type: 'email', bill });
  };

  const sendEmail = async () => {
    if (!shareEmail.trim()) { setShareMsg('Please enter an email address.'); return; }
    setShareSending(true); setShareMsg('');
    try {
      const bill = shareModal.bill;
      const billUrl = `${window.location.origin}/admin/bill/${bill._id}`;
      const res = await authFetch(`${API}/email/send-bill`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ toEmail: shareEmail, bill, billUrl, clientUrl: window.location.origin }),
      });
      const data = await res.json();
      if (data.success) {
        setShareMsg('✅ Email sent successfully!');
        setTimeout(() => setShareModal(null), 2000);
      } else {
        setShareMsg(`❌ ${data.error}`);
      }
    } catch { setShareMsg('❌ Network error. Please try again.'); }
    finally { setShareSending(false); }
  };

  const handleSendCustomerContact = async () => {
    const customer = customerContactModal.customer;
    const type = customerContactModal.type;

    let messageText = '';
    const baseUrl = window.location.origin;

    if (contactMessageType === 'invite') {
      const pkg = packages.find(p => p._id === selectedPackageId);
      if (!pkg) { setShareMsg('Please select a package.'); return; }
      const pkgUrl = `${baseUrl}/package/${pkg.routeParam || pkg._id}`;
      messageText = `Hello ${customer.name},\n\nWe are organizing a trip to ${pkg.name}! We would love for you to join us.\n\nCheck out the details here: ${pkgUrl}\n\nFor queries:\n+91 9830053647\ncontact@bangalirberano.com`;
    } else if (contactMessageType === 'greeting') {
      messageText = `Hello ${customer.name},\n\nWarm greetings from Bangalir Berano! Visit our website to see our latest tours: ${baseUrl}\n\nFor queries:\n+91 9830053647\ncontact@bangalirberano.com`;
    } else {
      if (!customMessage.trim()) { setShareMsg('Please enter a message.'); return; }
      messageText = `${customMessage}\n\nVisit our website: ${baseUrl}\n\nFor queries:\n+91 9830053647\ncontact@bangalirberano.com`;
    }

    if (type === 'whatsapp') {
      const rawPhone = customer.phone || '';
      const phone = rawPhone.replace(/[^\d]/g, '');
      if (!phone) { setShareMsg('Customer does not have a valid phone number.'); return; }
      const intlPhone = phone.startsWith('91') ? phone : '91' + phone;
      const url = `https://wa.me/${intlPhone}?text=${encodeURIComponent(messageText)}`;
      window.open(url, '_blank');
      setCustomerContactModal(null);
    } else {
      if (!shareEmail.trim()) { setShareMsg('Please enter an email address.'); return; }
      setShareSending(true); setShareMsg('');
      try {
        const res = await authFetch(`${API}/email/send-customer-message`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ toEmail: shareEmail, subject: contactMessageType === 'invite' ? 'Upcoming Trip Invitation' : 'Message from Bangalir Berano', messageBody: messageText }),
        });
        const data = await res.json();
        if (data.success) {
          setShareMsg('✅ Email sent successfully!');
          setTimeout(() => setCustomerContactModal(null), 2000);
        } else {
          setShareMsg(`❌ ${data.error}`);
        }
      } catch { setShareMsg('❌ Network error. Please try again.'); }
      finally { setShareSending(false); }
    }
  };

  const exportCustomersToCSV = () => {
    const dataToExport = filterData(customers);
    if (dataToExport.length === 0) {
      alert("No customers to export");
      return;
    }

    // Create CSV header
    const headers = ['Name', 'Phone', 'Email', 'Status', 'Interactions Count'];

    // Map data to CSV rows
    const rows = dataToExport.map(c => [
      `"${c.name || ''}"`,
      `"${c.phone || ''}"`,
      `"${c.email || ''}"`,
      `"${c.status || ''}"`,
      `"${c.interactions?.length || 0}"`
    ]);

    // Combine into CSV string
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    // Create and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `bangalir_berano_customers_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filterData = useCallback((data) => data.filter(item => {
    let dateMatch = true;
    const d = new Date(item.createdAt || item.billDate);

    // Quick filters
    if (dateFilter !== 'all') {
      const today = new Date();
      if (dateFilter === 'today') dateMatch = d.toDateString() === today.toDateString();
      else if (dateFilter === 'week') { const w = new Date(); w.setDate(today.getDate() - 7); dateMatch = d >= w; }
      else if (dateFilter === 'month') { const m = new Date(); m.setMonth(today.getMonth() - 1); dateMatch = d >= m; }
    }

    // Range filters
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
      if (packageFilter === 'general') {
        packageMatch = !item.destination || item.destination.trim() === '' || item.destination.toLowerCase() === 'n/a';
      } else {
        const dest = (item.destination || item.travelType || item.packageName || '').toLowerCase();
        packageMatch = dest.includes(packageFilter.toLowerCase());
      }
    }

    let searchMatch = true;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().trim();
      const name = (item.name || item.customerName || '').toLowerCase();
      const phone = (item.phone || item.customerPhone || '').toLowerCase();
      const billNo = (item.billNumber || '').toLowerCase();
      const pkgName = (item.destination || item.packageName || '').toLowerCase();

      searchMatch = name.includes(q) || phone.includes(q) || billNo.includes(q) || pkgName.includes(q);
    }

    return dateMatch && packageMatch && searchMatch;
  }), [dateFilter, packageFilter, searchQuery, dateFrom, dateTo]);

  const fetchEnquiries = useCallback(async () => {
    try {
      const res = await authFetch(`${API}/enquiries`);
      const data = await res.json();
      if (data.success) setEnquiries(data.data);
    } catch { } finally { setLoadingEnquiries(false); }
  }, []);

  const fetchCustomers = useCallback(async () => {
    try {
      const res = await authFetch(`${API}/customers`);
      const data = await res.json();
      if (data.success) setCustomers(data.data);
    } catch { } finally { setLoadingCustomers(false); }
  }, []);

  const fetchBookings = useCallback(async () => {
    try {
      const res = await authFetch(`${API}/bookings`);
      const data = await res.json();
      if (data.success) setBookings(data.data);
    } catch { } finally { setLoadingBookings(false); }
  }, []);

  const fetchBills = useCallback(async () => {
    try {
      const res = await authFetch(`${API}/bills`);
      const data = await res.json();
      if (data.success) setBills(data.data);
    } catch { } finally { setLoadingBills(false); }
  }, []);

  const fetchPackages = useCallback(async () => {
    setLoadingPackages(true);
    try {
      const res = await authFetch(`${API}/packages?t=${Date.now()}`, {
        cache: 'no-store'
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setPackages(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch packages:', err);
    } finally {
      setLoadingPackages(false);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    setLoadingCategories(true);
    try {
      const res = await authFetch(`${API}/categories`);
      const data = await res.json();
      if (data.success) setCategories(data.data);
    } catch { } finally { setLoadingCategories(false); }
  }, []);


  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await authFetch(`${API}/admin/check`);
        if (!res.ok) {
          navigate('/admin');
          return;
        }
        fetchEnquiries(); fetchBookings(); fetchPackages(); fetchCategories(); fetchBills(); fetchCustomers();
      } catch {
        navigate('/admin');
      }
    };
    checkAuth();
  }, [navigate, fetchEnquiries, fetchBookings, fetchPackages, fetchCategories, fetchBills, fetchCustomers]);

  const handleApproveEnquiry = async (id) => {
    if (!window.confirm('Approve this enquiry and move to Bookings?')) return;
    const res = await authFetch(`${API}/enquiries/${id}/approve`, { method: 'POST' });
    if (res.ok) { fetchEnquiries(); fetchBookings(); }
  };
  const handleDeleteEnquiry = async (id) => {
    if (!window.confirm('Delete this enquiry?')) return;
    const res = await authFetch(`${API}/enquiries/${id}`, { method: 'DELETE' });
    if (res.ok) fetchEnquiries();
  };
  const handleDeleteBooking = async (id) => {
    if (!window.confirm('Revert this booking?')) return;
    const res = await authFetch(`${API}/bookings/${id}`, { method: 'DELETE' });
    if (res.ok) { fetchBookings(); fetchEnquiries(); }
  };
  const handleDeleteBill = async (id) => {
    if (!window.confirm('Delete this bill?')) return;
    const res = await authFetch(`${API}/bills/${id}`, { method: 'DELETE' });
    if (res.ok) { fetchBills(); }
  };
  const handleDeletePackage = async (id) => {
    if (!window.confirm('Delete this package? This cannot be undone.')) return;
    setDeletingId(id);
    try {
      const res = await authFetch(`${API}/packages/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) setPackages(prev => prev.filter(p => p._id !== id));
      else alert(data.error || 'Failed to delete');
    } catch { alert('Network error'); } finally { setDeletingId(null); }
  };

  const handleUpdateSeats = async (id, seats) => {
    try {
      const fd = new FormData();
      fd.append('seatsLeft', seats);
      const res = await authFetch(`${API}/packages/${id}`, { method: 'PUT', body: fd });
      const data = await res.json();
      if (data.success) setPackages(prev => prev.map(p => p._id === id ? { ...p, seatsLeft: seats } : p));
    } catch { /* silent */ }
  };

  const handleDragEnd = async (status) => {
    const from = dragItem.current;
    const to = dragOverItem.current;
    dragItem.current = null;
    dragOverItem.current = null;
    if (from === null || to === null || from === to) return;

    // Get the status group that was dragged within
    const statusPkgs = packages.filter(p => (p.status || 'Upcoming') === status);
    const others = packages.filter(p => (p.status || 'Upcoming') !== status);

    // Reorder within this status group
    const reordered = [...statusPkgs];
    const [moved] = reordered.splice(from, 1);
    reordered.splice(to, 0, moved);

    // Rebuild full packages list — keep "others" in their existing position, replace statusPkgs with reordered
    // Assign sortOrder across ALL packages so DB sorts correctly
    const allOrdered = [...reordered, ...others];
    const withSortOrder = allOrdered.map((p, idx) => ({ ...p, sortOrder: idx }));
    setPackages(withSortOrder);

    // Persist to backend — send the full ordered list of IDs
    try {
      console.log('Sending reorder request to backend...', withSortOrder.map(p => p._id));
      const res = await authFetch(`${API}/packages/reorder/bulk`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderedIds: withSortOrder.map(p => p._id) })
      });
      const data = await res.json();
      console.log('Reorder response:', data);
      if (!data.success) {
        console.error('Failed to reorder:', data.error);
        alert('Failed to save order: ' + data.error);
      } else {
        setToastMessage('Order saved successfully!');
        setTimeout(() => setToastMessage(null), 3000);
      }
    } catch (err) {
      console.error('Error reordering:', err);
      alert('Error saving order.');
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    setSavingCategory(true);
    try {
      const res = await authFetch(`${API}/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCategoryName.trim() })
      });
      const data = await res.json();
      if (data.success) {
        setNewCategoryName('');
        fetchCategories();
      } else {
        alert(data.error || 'Failed to add category');
      }
    } catch { alert('Network error'); } finally { setSavingCategory(false); }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Delete this category? Note: existing packages in this category will become tagless.')) return;
    try {
      const res = await authFetch(`${API}/categories/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) fetchCategories();
      else alert(data.error || 'Failed to delete');
    } catch { alert('Network error'); }
  };

  const handleLogout = async () => {
    try {
      await authFetch(`${API}/admin/logout`, { method: 'POST' });
    } catch { }
    navigate('/admin');
  };

  const notifications = bills.filter(bill => {
    const due = parseFloat(bill.dueAmount) || 0;
    if (due <= 0 && bill.paymentStatus === 'PAID') return false;
    const days = getDaysUntilTrip(bill.travelDate);
    return days !== null && days <= 40 && days >= 0;
  }).sort((a, b) => getDaysUntilTrip(a.travelDate) - getDaysUntilTrip(b.travelDate));

  const NAV = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'enquiries', label: 'Enquiries', icon: Users, count: enquiries.length },
    { id: 'bookings', label: 'Bookings', icon: Users, count: bookings.length },
    { id: 'bills', label: 'Billed Customers', icon: FileText, count: bills.length },
    { id: 'customers-ext', label: 'All Customers', icon: Users, count: customers.length },
    { id: 'packages', label: 'Packages', icon: ImageIcon, count: packages.length },
    { id: 'categories', label: 'Categories', icon: List, count: categories.length },
    { id: 'notifications', label: 'Notifications', icon: Bell, count: notifications.length },
  ];

  const filterSel = "bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-500 focus:outline-none focus:border-indigo-500 focus:text-slate-900";
  const settingInp = "w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-indigo-500";


  const renderFilters = () => (
    <div className="flex flex-wrap gap-2 items-center w-full xl:w-auto">
      <div className="relative">
        <input type="text" placeholder="Search name, phone, bill..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-900 focus:outline-none focus:border-indigo-500 w-full md:w-64" />
        <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
      </div>
      <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl px-2 py-1">
        <span className="text-xs font-bold text-slate-400 px-1">FROM</span>
        <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="text-sm bg-transparent border-none focus:outline-none text-slate-700" />
        <span className="text-xs font-bold text-slate-400 px-1 border-l border-slate-200 ml-1 pl-2">TO</span>
        <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="text-sm bg-transparent border-none focus:outline-none text-slate-700" />
      </div>
      <select value={packageFilter} onChange={e => setPackageFilter(e.target.value)} className={filterSel}>
        <option value="all">All Packages</option>
        {packages.map(p => <option key={p._id} value={p.name}>{p.name}</option>)}
      </select>
    </div>
  );

  return (
    <div className="admin-theme min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col md:flex-row">

      {/* ── Toast Notification ── */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-[3000] bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
          <CheckCircle size={18} />
          <span className="font-bold text-sm">{toastMessage}</span>
        </div>
      )}

      {/* ── Sidebar ── */}
      <aside className="w-full md:w-60 bg-white border-r border-slate-200 flex flex-col shrink-0">
        <div className="p-6 border-b border-slate-200 flex items-center justify-center">
          <h2 className="text-base font-bold text-indigo-600 tracking-widest uppercase">Admin</h2>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {NAV.map(({ id, label, icon: Icon, count }) => {
            const hasAlert = id === 'notifications' && count > 0;
            return (
              <div key={id}>
                <button onClick={() => {
                  if (id === 'customers-ext') {
                    window.open('/admin/all-customers', '_blank');
                  } else {
                    setActiveTab(id);
                    if (id === 'packages') fetchPackages();
                  }
                }}
                  className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-colors ${activeTab === id ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                    } ${hasAlert && activeTab !== id ? 'animate-pulse bg-orange-50 text-orange-600 hover:bg-orange-100 hover:text-orange-700' : ''}`}>
                  <span className="flex items-center gap-3">
                    <Icon size={17} className={hasAlert && activeTab !== id ? 'text-orange-500' : ''} />
                    {label}
                  </span>
                  {count !== undefined && (
                    <span className={`text-[11px] px-2 py-0.5 rounded-full ${activeTab === id ? 'bg-indigo-100 text-indigo-600'
                        : hasAlert ? 'bg-orange-200 text-orange-700 animate-bounce'
                          : 'bg-slate-100 text-slate-400'
                      }`}>{count}</span>
                  )}
                </button>
                {hasAlert && (
                  <div className="mt-2 mb-4 mx-2 px-3 py-2 bg-orange-100 border border-orange-200 rounded-lg shadow-sm flex items-start gap-2">
                    <AlertCircle size={14} className="text-orange-600 mt-0.5 shrink-0" />
                    <p className="text-xs font-bold text-orange-800 leading-snug">
                      {count} pending {count === 1 ? 'payment needs' : 'payments need'} collection!
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </nav>
        <div className="p-3 border-t border-slate-200">
          <button onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-red-600 bg-red-50 hover:bg-red-100 transition-colors font-semibold text-sm">
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="flex-1 p-6 md:p-10 max-h-screen overflow-y-auto">
        <header className="mb-8">
          <h1 className="text-2xl md:text-3xl font-display font-bold mb-1">Welcome to {BRAND.name} Admin</h1>
          <p className="text-slate-500 text-sm">Manage your packages, enquiries and bookings.</p>
        </header>

        {/* === === === ===  DASHBOARD === === === ===  */}
        {activeTab === 'dashboard' && (
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-6">Financial Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Total Revenue</h3>
                <p className="text-3xl font-display font-bold text-indigo-900">₹{bills.reduce((s, b) => s + (parseFloat(b.totalAmount) || 0), 0).toLocaleString('en-IN')}</p>
              </div>
              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Payments Received</h3>
                <p className="text-3xl font-display font-bold text-emerald-600">₹{bills.reduce((s, b) => s + (parseFloat(b.advancePaid) || 0), 0).toLocaleString('en-IN')}</p>
              </div>
              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Outstanding Due</h3>
                <p className="text-3xl font-display font-bold text-orange-600">₹{bills.reduce((s, b) => s + (parseFloat(b.dueAmount) || 0), 0).toLocaleString('en-IN')}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-2xl bg-white border border-slate-200 p-6">
                <h3 className="text-sm font-bold text-slate-900 mb-4">Quick Stats</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-slate-100">
                    <span className="text-slate-500 text-sm">Total Bookings</span>
                    <span className="font-bold text-slate-900">{bookings.length}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-100">
                    <span className="text-slate-500 text-sm">Active Enquiries</span>
                    <span className="font-bold text-slate-900">{enquiries.length}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-slate-500 text-sm">Active Packages</span>
                    <span className="font-bold text-slate-900">{packages.length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* === === === ===  ENQUIRIES === === === ===  */}
        {activeTab === 'enquiries' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="p-6 rounded-2xl bg-white border border-slate-200">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Total Enquiries</h3>
                <p className="text-4xl font-display font-bold">{enquiries.length}</p>
              </div>
            </div>
            <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden">
              <div className="p-5 border-b border-slate-200 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold">Recent Enquiries</h2>
                </div>
                <div className="flex flex-wrap gap-2 items-center">
                  <div className="relative">
                    <input type="text" placeholder="Search name, phone, package..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-900 focus:outline-none focus:border-indigo-500 w-72" />
                    <Search size={15} className="absolute left-3 top-2.5 text-slate-400" />
                  </div>
                  <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl px-3 py-2">
                    <span className="text-xs font-bold text-slate-400">FROM</span>
                    <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="text-sm bg-transparent border-none focus:outline-none text-slate-700 ml-1" />
                    <span className="text-xs font-bold text-slate-400 border-l border-slate-200 ml-2 pl-2">TO</span>
                    <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="text-sm bg-transparent border-none focus:outline-none text-slate-700 ml-1" />
                  </div>
                  <select value={packageFilter} onChange={e => setPackageFilter(e.target.value)} className={filterSel}>
                    <option value="all">All Packages</option>
                    <option value="general">General Enquiry</option>
                    {packages.map(p => <option key={p._id} value={p.name}>{p.name}</option>)}
                  </select>
                  {(searchQuery || dateFrom || dateTo || packageFilter !== 'all') && (
                    <button onClick={() => { setSearchQuery(''); setDateFrom(''); setDateTo(''); setPackageFilter('all'); }} className="px-3 py-2 text-xs font-bold text-red-500 bg-red-50 rounded-xl hover:bg-red-100">✕ Clear</button>
                  )}
                </div>
              </div>
              <div className="overflow-x-auto">
                {loadingEnquiries ? <div className="p-10 text-center text-slate-500">Loading...</div>
                  : enquiries.length === 0 ? <div className="p-10 text-center text-slate-500">No enquiries yet.</div>
                    : (
                      <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-white text-slate-400 uppercase tracking-wider text-[11px] font-bold">
                          <tr>
                            <th className="px-6 py-4">Date</th><th className="px-6 py-4">Name & Contact</th>
                            <th className="px-6 py-4">Destination & Mode</th><th className="px-6 py-4">Travel Date & Pax</th>
                            <th className="px-6 py-4">Message</th><th className="px-6 py-4 text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 text-slate-500">
                          {filterData(enquiries).map(eq => (
                            <tr key={eq._id} className="hover:bg-slate-50 transition-colors">
                              <td className="px-6 py-5">
                                <div className="flex items-center gap-2 mb-1"><Calendar size={13} className="text-indigo-600" /><span className="font-bold text-slate-700">{new Date(eq.createdAt).toLocaleDateString()}</span></div>
                              </td>
                              <td className="px-6 py-5">
                                <p className="text-slate-900 font-semibold mb-1">{eq.name}</p>
                                <p className="text-[12px] text-slate-600"><span className="font-bold text-slate-400 mr-1">Phone:</span> {eq.phone}</p>
                                {eq.email && <p className="text-[12px] text-slate-600"><span className="font-bold text-slate-400 mr-1">Email:</span> {eq.email}</p>}
                                <p className="text-[12px] text-slate-600"><span className="font-bold text-slate-400 mr-1">Location:</span> {eq.location || 'N/A'}</p>
                              </td>
                              <td className="px-6 py-5">
                                <div className="mb-2"><span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-[11px] font-bold">{eq.destination || 'N/A'}</span></div>
                                <p className="text-[12px] text-slate-600"><span className="font-bold text-slate-400 mr-1">Type:</span> {eq.travelType || 'N/A'}</p>
                                <p className="text-[12px] text-slate-600"><span className="font-bold text-slate-400 mr-1">Mode:</span> {eq.preferredTravel || 'N/A'}</p>
                              </td>
                              <td className="px-6 py-5">
                                <p className="text-[12px] text-slate-600"><span className="font-bold text-slate-400 mr-1">Date:</span> <span className="font-bold">{eq.date || 'Flexible'}</span></p>
                                <p className="text-[12px] text-slate-600"><span className="font-bold text-slate-400 mr-1">Pax:</span> {eq.travellers ? `${eq.travellers} Travellers` : 'TBD'}</p>
                              </td>
                              <td className="px-6 py-5"><div className="max-w-[140px] truncate text-[12px] text-slate-600" title={eq.message}>{eq.message || '-'}</div></td>
                              <td className="px-6 py-5 text-right">
                                <div className="flex justify-end gap-2">
                                  <button onClick={() => handleApproveEnquiry(eq._id)} className="p-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors" title="Approve"><CheckCircle size={17} /></button>
                                  <button onClick={() => handleDeleteEnquiry(eq._id)} className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors" title="Delete"><XCircle size={17} /></button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
              </div>
            </div>
          </>
        )}

        {/* === === === ===  BOOKINGS === === === ===  */}
        {activeTab === 'bookings' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="p-6 rounded-2xl bg-white border border-slate-200">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Total Bookings</h3>
                <p className="text-4xl font-display font-bold">{bookings.length}</p>
              </div>
            </div>
            <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden">
              <div className="p-5 border-b border-slate-200 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold">Recent Bookings</h2>
                  <button onClick={() => setShowBookingModal(true)} className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-sm hover:bg-indigo-700 transition-colors flex items-center gap-2 whitespace-nowrap">
                    <Plus size={16} /> Add Booking
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 items-center">
                  <div className="relative">
                    <input type="text" placeholder="Search name, phone, package..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-900 focus:outline-none focus:border-indigo-500 w-72" />
                    <Search size={15} className="absolute left-3 top-2.5 text-slate-400" />
                  </div>
                  <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl px-3 py-2">
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
              </div>
              <div className="overflow-x-auto">
                {loadingBookings ? <div className="p-10 text-center text-slate-500">Loading...</div>
                  : bookings.length === 0 ? <div className="p-10 text-center text-slate-500">No bookings yet.</div>
                    : (
                      <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-white text-slate-400 uppercase tracking-wider text-[11px] font-bold">
                          <tr>
                            <th className="px-6 py-4">Date</th><th className="px-6 py-4">Name & Contact</th>
                            <th className="px-6 py-4">Package & Mode</th><th className="px-6 py-4">Travel Date & Pax</th>
                            <th className="px-6 py-4">Billing State</th><th className="px-6 py-4 text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 text-slate-500">
                          {filterData(bookings).map(bk => (
                            <tr key={bk._id} className="hover:bg-slate-50 transition-colors">
                              <td className="px-6 py-5">
                                <div className="flex items-center gap-2 mb-1"><Calendar size={13} className="text-indigo-600" /><span className="font-bold text-slate-700">{new Date(bk.createdAt).toLocaleDateString()}</span></div>
                              </td>
                              <td className="px-6 py-5">
                                <p className="text-slate-900 font-semibold mb-1">{bk.name}</p>
                                <p className="text-[12px] text-slate-600"><span className="font-bold text-slate-400 mr-1">Phone:</span> {bk.phone}</p>
                                {bk.email && <p className="text-[12px] text-slate-600"><span className="font-bold text-slate-400 mr-1">Email:</span> {bk.email}</p>}
                                <p className="text-[12px] text-slate-600"><span className="font-bold text-slate-400 mr-1">Location:</span> {bk.location || 'N/A'}</p>
                              </td>
                              <td className="px-6 py-5">
                                <div className="mb-2"><span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-[11px] font-bold">{bk.destination || 'N/A'}</span></div>
                                <p className="text-[12px] text-slate-600"><span className="font-bold text-slate-400 mr-1">Mode:</span> {bk.preferredTravel || 'N/A'}</p>
                              </td>
                              <td className="px-6 py-5">
                                <p className="text-[12px] text-slate-600"><span className="font-bold text-slate-400 mr-1">Date:</span> <span className="font-bold">{bk.date || 'Flexible'}</span></p>
                                <p className="text-[12px] text-slate-600"><span className="font-bold text-slate-400 mr-1">Pax:</span> {bk.travellers ? `${bk.travellers} Travellers` : 'TBD'}</p>
                              </td>
                              <td className="px-6 py-5">
                                {bills.find(b => b.bookingId === bk._id) ? (
                                  (() => {
                                    const b = bills.find(b => b.bookingId === bk._id);
                                    const t = parseFloat(b.totalAmount) || 0;
                                    const p = parseFloat(b.advancePaid) || 0;
                                    const status = b.paymentStatus || (p === 0 ? 'PENDING' : (p >= t && t > 0 ? 'PAID' : 'PARTIALLY PAID'));
                                    const statusColor = p === 0 ? 'text-slate-600 bg-slate-100' : (p >= t && t > 0 ? 'text-emerald-700 bg-emerald-50' : 'text-orange-700 bg-orange-50');
                                    return (
                                      <div className="text-xs">
                                        <p className="font-bold text-slate-900">Total: ₹{b.totalAmount}</p>
                                        <p className="text-emerald-600 font-bold">Paid: ₹{b.advancePaid}</p>
                                        <p className="text-red-600 font-bold">Due: ₹{b.dueAmount}</p>
                                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold tracking-wider mt-1 inline-block ${statusColor}`}>{status}</span>
                                      </div>
                                    );
                                  })()
                                ) : (
                                  <span className="text-xs text-slate-400 font-bold">No Bill Generated</span>
                                )}
                              </td>
                              <td className="px-6 py-5 text-right">
                                <div className="flex justify-end gap-2">
                                  {bills.find(b => b.bookingId === bk._id) ? (
                                    <button onClick={() => { setEditingBill({ _id: bills.find(b => b.bookingId === bk._id)._id }); setShowBillModal(false); }} className="px-4 py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg font-bold text-xs transition-colors border border-indigo-200">View Bill</button>
                                  ) : (
                                    <button onClick={() => { setBillingBooking(bk); setShowBillModal(true); }} className="px-4 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg font-bold text-xs transition-colors border border-emerald-200">Add Bill</button>
                                  )}
                                  <button onClick={() => handleDeleteBooking(bk._id)} className="px-4 py-1.5 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg font-bold text-xs transition-colors border border-red-200">Delete</button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
              </div>
            </div>
          </>
        )}

        {/* === === === ===  BILLS === === === ===  */}
        {activeTab === 'bills' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="p-6 rounded-2xl bg-white border border-slate-200">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Total Billed Customers</h3>
                <p className="text-4xl font-display font-bold">{bills.length}</p>
              </div>
            </div>
            <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden">
              <div className="p-5 border-b border-slate-200 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold">Recent Bills</h2>
                </div>
                <div className="flex flex-wrap gap-2 items-center">
                  <div className="relative">
                    <input type="text" placeholder="Search name, phone, bill no, package..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-900 focus:outline-none focus:border-indigo-500 w-80" />
                    <Search size={15} className="absolute left-3 top-2.5 text-slate-400" />
                  </div>
                  <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl px-3 py-2">
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
              </div>
              <div className="overflow-x-auto">
                {loadingBills ? <div className="p-10 text-center text-slate-500">Loading...</div>
                  : bills.length === 0 ? <div className="p-10 text-center text-slate-500">No bills generated yet.</div>
                    : filterData(bills).length === 0 ? <div className="p-10 text-center text-slate-500">No bills match your search.</div>
                      : (
                        <table className="w-full text-left text-sm whitespace-nowrap">
                          <thead className="bg-white text-slate-400 uppercase tracking-wider text-[11px] font-bold">
                            <tr>
                              <th className="px-6 py-4">Bill Date & No</th>
                              <th className="px-6 py-4">Customer Name</th>
                              <th className="px-6 py-4">Package & Travel</th>
                              <th className="px-6 py-4">Amounts (Total/Paid/Due)</th>
                              <th className="px-6 py-4">Status</th>
                              <th className="px-6 py-4 text-right">Action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200 text-slate-500">
                            {filterData(bills).map(bl => {
                              const t = parseFloat(bl.totalAmount) || 0;
                              const p = parseFloat(bl.advancePaid) || 0;
                              const status = p === 0 ? 'PENDING' : (p >= t && t > 0 ? 'PAID' : 'PARTIALLY PAID');
                              const statusColor = p === 0 ? 'text-slate-600 bg-slate-100' : (p >= t && t > 0 ? 'text-emerald-700 bg-emerald-50' : 'text-orange-700 bg-orange-50');

                              return (
                                <tr key={bl._id} className="hover:bg-slate-50 transition-colors">
                                  <td className="px-6 py-5">
                                    <div className="flex items-center gap-2 mb-1"><Calendar size={13} className="text-indigo-600" /><span className="font-bold text-slate-700">{new Date(bl.billDate).toLocaleDateString()}</span></div>
                                    <p className="text-[12px] text-slate-600"><span className="font-bold text-slate-400 mr-1">Bill No:</span> <span className="font-bold text-slate-900">{bl.billNumber}</span></p>
                                  </td>
                                  <td className="px-6 py-5">
                                    <p className="text-slate-900 font-semibold mb-1">{bl.customerName}</p>
                                    <p className="text-[12px] text-slate-600"><span className="font-bold text-slate-400 mr-1">Phone:</span> {bl.customerPhone}</p>
                                  </td>
                                  <td className="px-6 py-5">
                                    <div className="mb-2"><span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-[11px] font-bold">{bl.packageName || 'N/A'}</span></div>
                                    <p className="text-[12px] text-slate-600"><span className="font-bold text-slate-400 mr-1">Travel Date:</span> {bl.travelDate}</p>
                                  </td>
                                  <td className="px-6 py-5">
                                    <p className="font-bold text-slate-900">Total: ₹{bl.totalAmount}</p>
                                    <p className="text-xs text-emerald-600">Paid: ₹{bl.advancePaid}</p>
                                    <p className="text-xs text-red-600 font-bold">Due: ₹{bl.dueAmount}</p>
                                  </td>
                                  <td className="px-6 py-5">
                                    <span className={`px-2 py-1 rounded text-[10px] font-bold tracking-wider ${statusColor}`}>{status}</span>
                                  </td>
                                  <td className="px-6 py-5 text-right">
                                    <div className="flex justify-end gap-1 flex-wrap">
                                      <button onClick={() => openWhatsApp(bl)} className="px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg font-bold text-xs transition-colors border border-emerald-200 flex items-center gap-1"><span>📱</span> WhatsApp</button>
                                      <button onClick={() => openEmail(bl)} className="px-3 py-1.5 bg-sky-50 text-sky-700 hover:bg-sky-100 rounded-lg font-bold text-xs transition-colors border border-sky-200 flex items-center gap-1"><span>✉️</span> Email</button>
                                      <button onClick={() => setEditingBill({ _id: bl._id })} className="px-3 py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg font-bold text-xs transition-colors border border-indigo-200">View Bill</button>
                                      <button onClick={() => handleDeleteBill(bl._id)} className="px-3 py-1.5 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg font-bold text-xs transition-colors border border-red-200">Delete</button>
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
          </>
        )}

        {/* === === === ===  CUSTOMERS === === === ===  */}
        {activeTab === 'customers' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="p-6 rounded-2xl bg-white border border-slate-200">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Total Customers</h3>
                <p className="text-4xl font-display font-bold">{customers.length}</p>
              </div>
            </div>
            <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden">
              <div className="p-5 border-b border-slate-200 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold">All Customers</h2>
                  <div className="flex gap-2">
                    <button onClick={exportCustomersToCSV} className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl font-bold text-sm shadow-sm hover:bg-emerald-100 transition-colors flex items-center gap-2 border border-emerald-200">
                      <span>📥</span> Export to CSV
                    </button>
                    <button onClick={() => setShowCustomerModal(true)} className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-sm hover:bg-indigo-700 transition-colors flex items-center gap-2">
                      <Plus size={16} /> Add Customer
                    </button>
                  </div>
                </div>
                {renderFilters()}
              </div>
              <div className="overflow-x-auto">
                {loadingCustomers ? <div className="p-10 text-center text-slate-500">Loading...</div>
                  : customers.length === 0 ? <div className="p-10 text-center text-slate-500">No customers found.</div>
                    : filterData(customers).length === 0 ? <div className="p-10 text-center text-slate-500">No customers match your search.</div>
                      : (
                        <table className="w-full text-left text-sm whitespace-nowrap">
                          <thead className="bg-white text-slate-400 uppercase tracking-wider text-[11px] font-bold">
                            <tr>
                              <th className="px-6 py-4">SL NO.</th>
                              <th className="px-6 py-4">NAME OF THE GUEST</th>
                              <th className="px-6 py-4">AGE & M/F</th>
                              <th className="px-6 py-4">FROM</th>
                              <th className="px-6 py-4">HEADS</th>
                              <th className="px-6 py-4">MOBILE & EMAIL</th>
                              <th className="px-6 py-4">POSTPAID NUMBER</th>
                              <th className="px-6 py-4">DOWN TRAIN / FLIGHT</th>
                              <th className="px-6 py-4">ROOM</th>
                              <th className="px-6 py-4">STATUS</th>
                              <th className="px-6 py-4">INTERACTIONS</th>
                              <th className="px-6 py-4 text-right">ACTION</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200 text-slate-500">
                            {filterData(customers).map((c, index) => {
                              return (
                                <tr key={c._id} className="hover:bg-slate-50 transition-colors">
                                  <td className="px-6 py-5 font-bold text-slate-900">{index + 1}</td>
                                  <td className="px-6 py-5"><p className="text-slate-900 font-bold">{c.name}</p></td>
                                  <td className="px-6 py-5">
                                    <p className="text-[12px]"><span className="font-bold text-slate-400">Age:</span> {c.age || '-'}</p>
                                    <p className="text-[12px]"><span className="font-bold text-slate-400">Sex:</span> {c.gender || '-'}</p>
                                  </td>
                                  <td className="px-6 py-5"><p className="text-[12px] font-semibold">{c.locationFrom || '-'}</p></td>
                                  <td className="px-6 py-5"><p className="text-[12px] font-bold">{c.heads || 1}</p></td>
                                  <td className="px-6 py-5">
                                    <p className="text-sm font-semibold">{c.phone}</p>
                                    {c.email && <p className="text-xs text-slate-400">{c.email}</p>}
                                  </td>
                                  <td className="px-6 py-5"><p className="text-[12px]">{c.postpaidNumber || '-'}</p></td>
                                  <td className="px-6 py-5"><p className="text-[12px]">{c.downTrainFlight || '-'}</p></td>
                                  <td className="px-6 py-5"><p className="text-[12px] font-bold text-indigo-600">{c.room || '-'}</p></td>
                                  <td className="px-6 py-5">
                                    <span className={`px-3 py-1 rounded-full text-[11px] font-bold ${c.status === 'Completed Trip' ? 'bg-emerald-100 text-emerald-700' :
                                        c.status === 'Upcoming Trip' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-700'
                                      }`}>{c.status}</span>
                                  </td>
                                  <td className="px-6 py-5">
                                    <details className="text-xs max-w-sm cursor-pointer group relative z-10">
                                      <summary className="font-bold text-indigo-600 outline-none">{c.interactions?.length || 0} Interactions</summary>
                                      <div className="mt-2 space-y-2 max-h-32 overflow-y-auto pr-2">
                                        {(c.interactions || []).slice().reverse().map((i, idx) => (
                                          <div key={idx} className="bg-white border border-slate-100 p-2 rounded shadow-sm">
                                            <p className="font-bold text-slate-800 flex justify-between">
                                              <span>{i.type}</span>
                                              <span className="text-[10px] text-slate-400 font-normal">{new Date(i.date).toLocaleDateString()}</span>
                                            </p>
                                            <p className="text-slate-500 truncate whitespace-normal leading-snug mt-1">{i.details}</p>
                                          </div>
                                        ))}
                                      </div>
                                    </details>
                                  </td>
                                  <td className="px-6 py-5 text-right">
                                    <div className="flex justify-end gap-1 flex-wrap">
                                      <button onClick={() => { setCustomerContactModal({ type: 'whatsapp', customer: c }); setShareEmail(c.email || ''); setShareMsg(''); setContactMessageType('invite'); setSelectedPackageId(packages[0]?._id || ''); }} className="px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg font-bold text-xs transition-colors border border-emerald-200 flex items-center gap-1"><span>📱</span> WhatsApp</button>
                                      <button onClick={() => { setCustomerContactModal({ type: 'email', customer: c }); setShareEmail(c.email || ''); setShareMsg(''); setContactMessageType('invite'); setSelectedPackageId(packages[0]?._id || ''); }} className="px-3 py-1.5 bg-sky-50 text-sky-700 hover:bg-sky-100 rounded-lg font-bold text-xs transition-colors border border-sky-200 flex items-center gap-1"><span>✉️</span> Email</button>
                                      <button onClick={async () => {
                                        if (!window.confirm('Delete this customer?')) return;
                                        const res = await authFetch(`${API}/customers/${c._id}`, { method: 'DELETE' });
                                        if (res.ok) fetchCustomers();
                                      }} className="px-3 py-1.5 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg font-bold text-xs transition-colors border border-red-200 flex items-center gap-1"><Trash2 size={13} /> Delete</button>
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
          </>
        )}

        {/* === === === ===  SHARE MODAL (WhatsApp / Email) === === === ===  */}
        {shareModal && (
          <div className="fixed inset-0 z-[3000] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-extrabold text-slate-900">
                  {shareModal.type === 'whatsapp' ? '📱 Send via WhatsApp' : '✉️ Send via Email'}
                </h3>
                <button onClick={() => setShareModal(null)} className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-400 hover:bg-slate-200"><X size={16} /></button>
              </div>

              <div className="bg-slate-50 rounded-xl p-4 mb-5 text-sm">
                <p className="font-bold text-slate-900">{shareModal.bill.customerName}</p>
                <p className="text-slate-500">{shareModal.bill.billNumber} • {shareModal.bill.packageName || 'Tour Package'}</p>
              </div>

              {shareModal.type === 'whatsapp' ? (
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1 uppercase tracking-wider">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="Enter WhatsApp number (e.g. 9830012345)"
                    value={sharePhone}
                    onChange={e => setSharePhone(e.target.value)}
                    className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-emerald-500"
                    autoFocus
                  />
                  <p className="text-xs text-slate-400 mt-2">If the number is not on WhatsApp, WhatsApp will notify you automatically.</p>
                  <div className="flex gap-3 mt-5">
                    <button onClick={() => setShareModal(null)} className="flex-1 py-3 rounded-xl border-2 border-slate-200 font-bold text-slate-600 hover:bg-slate-50">Cancel</button>
                    <button
                      onClick={() => sendWhatsApp(sharePhone || shareModal.bill.customerPhone || '', shareModal.bill)}
                      disabled={!sharePhone && !shareModal.bill.customerPhone}
                      className="flex-1 py-3 rounded-xl bg-emerald-500 text-white font-bold hover:bg-emerald-600 transition-colors disabled:opacity-40"
                    >Open WhatsApp</button>
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1 uppercase tracking-wider">Email Address</label>
                  <input
                    type="email"
                    placeholder="Enter customer email"
                    value={shareEmail}
                    onChange={e => setShareEmail(e.target.value)}
                    className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-sky-500"
                    autoFocus
                  />
                  {shareMsg && (
                    <p className={`text-sm font-bold mt-3 ${shareMsg.startsWith('✅') ? 'text-emerald-600' : 'text-red-600'}`}>{shareMsg}</p>
                  )}
                  <div className="flex gap-3 mt-5">
                    <button onClick={() => setShareModal(null)} className="flex-1 py-3 rounded-xl border-2 border-slate-200 font-bold text-slate-600 hover:bg-slate-50">Cancel</button>
                    <button
                      onClick={sendEmail}
                      disabled={shareSending}
                      className="flex-1 py-3 rounded-xl bg-sky-600 text-white font-bold hover:bg-sky-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                    >{shareSending ? <><Loader2 size={16} className="animate-spin" /> Sending...</> : 'Send Email'}</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* === === === ===  PACKAGES === === === ===  */}
        {activeTab === 'packages' && (
          <div>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Manage Packages</h2>
                <p className="text-slate-500 text-sm mt-1">{packages.length} package{packages.length !== 1 ? 's' : ''} in database</p>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={fetchPackages}
                  title="Refresh Packages"
                  className="flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold py-2.5 px-4 rounded-xl text-sm transition-all shadow-sm">
                  <RefreshCw size={14} className={loadingPackages ? 'animate-spin' : ''} /> Refresh
                </button>
                <button onClick={() => { setEditingPackage(null); setShowPackageForm(true); }}
                  className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-bold py-2.5 px-5 rounded-xl text-sm transition-transform hover:-translate-y-0.5 shadow-lg">
                  <Plus size={15} /> Add New Package
                </button>
              </div>
            </div>

            {loadingPackages ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => <div key={i} className="bg-white rounded-2xl h-64 animate-pulse" />)}
              </div>
            ) : packages.length === 0 ? (
              <div className="rounded-2xl bg-white border border-slate-200 p-16 text-center">
                <ImageIcon size={44} className="text-slate-400 mx-auto mb-4" />
                <h3 className="text-slate-900 font-bold text-lg mb-2">No packages yet</h3>
                <p className="text-slate-500 text-sm mb-6">Add your first tour package to get started.</p>
                <div className="flex items-center justify-center gap-3">
                  <button onClick={fetchPackages}
                    className="flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold py-2.5 px-5 rounded-xl text-sm">
                    <RefreshCw size={14} /> Refresh
                  </button>
                  <button onClick={() => { setEditingPackage(null); setShowPackageForm(true); }}
                    className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-bold py-2.5 px-6 rounded-xl text-sm">
                    <Plus size={15} /> Add First Package
                  </button>
                </div>
              </div>
            ) : (
              <div>
                {['Upcoming', 'Ongoing', 'Past'].map(status => {
                  const statusPackages = packages.filter(p => (p.status || 'Upcoming') === status);
                  if (statusPackages.length === 0) return null;

                  return (
                    <div key={status} className="mb-12">
                      <div className="flex items-center gap-3 mb-5 pb-2 border-b border-slate-200">
                        <h3 className="text-lg font-bold text-slate-800">{status} Packages</h3>
                        <span className="text-xs text-slate-400 font-medium">→• Drag cards to reorder display order</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {statusPackages.map((pkg, idx) => (
                          <div
                            key={pkg._id}
                            draggable
                            onDragStart={() => { dragItem.current = idx; }}
                            onDragEnter={() => { dragOverItem.current = idx; }}
                            onDragEnd={() => handleDragEnd(status)}
                            onDragOver={e => e.preventDefault()}
                            className="bg-white border border-slate-200 rounded-2xl overflow-hidden group hover:border-indigo-300 hover:shadow-md transition-all flex flex-col cursor-grab active:cursor-grabbing active:scale-[0.98] active:shadow-xl active:border-indigo-400"
                          >
                            <div className="h-36 relative overflow-hidden bg-slate-50 shrink-0">
                              {pkg.image
                                ? <img src={pkg.image} alt={pkg.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                : <div className="w-full h-full flex items-center justify-center text-slate-400"><ImageIcon size={28} /></div>}
                              <span className="absolute top-3 right-3 bg-slate-50/80 backdrop-blur-sm text-indigo-600 text-[10px] font-bold px-2.5 py-1 rounded-lg border border-slate-200">
                                {Array.isArray(pkg.category) ? pkg.category.join(' • ') : pkg.category}
                              </span>
                              <span className={`absolute top-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded-lg border backdrop-blur-sm ${status === 'Upcoming' ? 'bg-green-50/90 text-green-700 border-green-200' :
                                  status === 'Ongoing' ? 'bg-blue-50/90 text-blue-700 border-blue-200' :
                                    'bg-slate-100/90 text-slate-600 border-slate-300'
                                }`}>
                                {status}
                              </span>
                            </div>
                            <div className="p-4 flex flex-col flex-1">
                              <h3 className="text-slate-900 font-bold text-sm mb-1 leading-snug line-clamp-2">{pkg.name}</h3>
                              {pkg.route && <p className="text-slate-500 text-xs mb-1 flex items-center gap-1 line-clamp-1"><MapPin size={11} className="text-indigo-500 shrink-0" />{pkg.route}</p>}
                              {pkg.tag && <p className="text-slate-400 text-[11px] mb-1 font-medium truncate">{pkg.tag}</p>}
                              {pkg.date && <p className="text-slate-400 text-xs mb-0.5 flex items-center gap-1"><Calendar size={10} />{pkg.date}</p>}
                              {pkg.duration && <p className="text-slate-400 text-xs mb-2">{pkg.duration}</p>}
                              <div className="mt-auto pt-3">
                                <p className="text-indigo-600 font-bold mb-0.5">{pkg.price}</p>
                                {pkg.priceNote && <p className="text-slate-400 text-[11px] mb-1">{pkg.priceNote}</p>}
                                {pkg.advance && <p className="text-emerald-600 text-[11px] font-semibold mb-1">Advance: {pkg.advance}</p>}
                                {(pkg.childRate1 || pkg.childRate2) && (
                                  <p className="text-slate-400 text-[10.5px] truncate mb-1">
                                    {[pkg.childRate1, pkg.childRate2].filter(Boolean).join(' • ')}
                                  </p>
                                )}
                                {/* Inline Seats Left editor */}
                                <div className="flex items-center gap-2 my-2">
                                  <label className="text-[11px] font-bold text-slate-500 shrink-0">Seats Left:</label>
                                  <input
                                    type="number"
                                    defaultValue={pkg.seatsLeft || ''}
                                    onBlur={e => { if (e.target.value !== String(pkg.seatsLeft || '')) handleUpdateSeats(pkg._id, e.target.value); }}
                                    onKeyDown={e => { if (e.key === 'Enter') { e.target.blur(); } }}
                                    placeholder="—"
                                    className="w-full border border-slate-200 rounded-lg px-2 py-1 text-xs text-red-600 font-bold focus:outline-none focus:border-red-400 focus:ring-1 focus:ring-red-200"
                                  />
                                </div>
                                <div className="flex gap-2 mt-2">
                                  <button onClick={() => { setEditingPackage(pkg); setShowPackageForm(true); }}
                                    className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-lg text-xs font-semibold transition-colors">
                                    <Edit3 size={12} /> Edit
                                  </button>
                                  <button onClick={() => handleDeletePackage(pkg._id)} disabled={deletingId === pkg._id}
                                    className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50">
                                    {deletingId === pkg._id ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
                                    {deletingId === pkg._id ? 'Deleting...' : 'Delete'}
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* === === === ===  CATEGORIES === === === ===  */}
        {activeTab === 'categories' && (
          <div className="max-w-2xl">
            <h2 className="text-xl font-bold text-slate-900 mb-2">Manage Categories</h2>
            <p className="text-slate-500 text-sm mb-8">Add or remove categories for tour packages.</p>

            <form onSubmit={handleAddCategory} className="flex gap-3 mb-8 bg-white p-4 rounded-2xl border border-slate-200">
              <input
                type="text"
                value={newCategoryName}
                onChange={e => setNewCategoryName(e.target.value)}
                placeholder="e.g. Family Trip, Weekend Getaway"
                className={settingInp}
              />
              <button
                type="submit"
                disabled={savingCategory || !newCategoryName.trim()}
                className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-bold px-6 rounded-xl shadow-lg transition-transform hover:-translate-y-0.5 disabled:opacity-50 whitespace-nowrap"
              >
                {savingCategory ? 'Adding...' : '+ Add'}
              </button>
            </form>

            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
              {loadingCategories ? (
                <div className="p-10 text-center text-slate-500">Loading...</div>
              ) : categories.length === 0 ? (
                <div className="p-10 text-center text-slate-500">No categories added yet.</div>
              ) : (
                <ul className="divide-y divide-slate-200">
                  {categories.map(cat => (
                    <li key={cat._id} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
                      <div>
                        <p className="text-slate-900 font-semibold">{cat.name}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">Added: {new Date(cat.createdAt).toLocaleDateString()}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteCategory(cat._id)}
                        className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                        title="Delete Category"
                      >
                        <Trash2 size={16} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}

        {/* === === === ===  NOTIFICATIONS === === === ===  */}
        {activeTab === 'notifications' && (
          <div className="max-w-4xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Payment Reminders</h2>
                <p className="text-slate-500 text-sm mt-1">Customers with upcoming trips (≤ 40 days) who have not fully paid.</p>
              </div>
              <button onClick={() => window.open('/admin/unpaid-bills', '_blank')}
                className="flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-indigo-700 font-bold py-2.5 px-5 rounded-xl text-sm transition-colors shadow-sm">
                View All Unpaid Bills →
              </button>
            </div>

            <div className="flex flex-wrap gap-2 items-center mb-6">
              <div className="relative">
                <input type="text" placeholder="Search name, phone, package..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-900 focus:outline-none focus:border-indigo-500 w-80 shadow-sm" />
                <Search size={15} className="absolute left-3 top-2.5 text-slate-400" />
              </div>
              <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-sm">
                <span className="text-xs font-bold text-slate-400">FROM</span>
                <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="text-sm bg-transparent border-none focus:outline-none text-slate-700 ml-1" />
                <span className="text-xs font-bold text-slate-400 border-l border-slate-200 ml-2 pl-2">TO</span>
                <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="text-sm bg-transparent border-none focus:outline-none text-slate-700 ml-1" />
              </div>
              <select value={packageFilter} onChange={e => setPackageFilter(e.target.value)} className={filterSel + " shadow-sm"}>
                <option value="all">All Packages</option>
                {packages.map(p => <option key={p._id} value={p.name}>{p.name}</option>)}
              </select>
              {(searchQuery || dateFrom || dateTo || packageFilter !== 'all') && (
                <button onClick={() => { setSearchQuery(''); setDateFrom(''); setDateTo(''); setPackageFilter('all'); }} className="px-3 py-2 text-xs font-bold text-red-500 bg-red-50 rounded-xl hover:bg-red-100">✕ Clear</button>
              )}
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
              {loadingBills ? (
                <div className="p-10 text-center text-slate-500">Loading...</div>
              ) : filterData(notifications).length === 0 ? (
                <div className="p-16 text-center text-slate-500 flex flex-col items-center">
                  <CheckCircle size={48} className="text-emerald-500 mb-4 opacity-50" />
                  <p className="font-bold text-slate-900 text-lg">All clear!</p>
                  <p>No pending payments match your criteria.</p>
                </div>
              ) : (
                <ul className="divide-y divide-slate-200">
                  {filterData(notifications).map(bl => {
                    const days = getDaysUntilTrip(bl.travelDate);
                    return (
                      <li key={bl._id} className="p-5 hover:bg-slate-50 transition-colors flex items-center justify-between gap-4 flex-wrap md:flex-nowrap">
                        <div className="flex items-start gap-4 flex-1">
                          <div className={`shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${days <= 10 ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'}`}>
                            {days}d
                          </div>
                          <div>
                            <p className="text-slate-900 font-bold text-base">{bl.customerName} <span className="text-slate-500 font-normal text-sm ml-2">{bl.customerPhone}</span></p>
                            <p className="text-sm font-semibold text-indigo-600 mt-1">{bl.packageName || 'General Tour'} • {bl.travelDate}</p>
                            <div className="flex gap-4 mt-2 text-xs">
                              <span className="font-bold">Total: ₹{bl.totalAmount}</span>
                              <span className="text-emerald-600 font-bold">Paid: ₹{bl.advancePaid}</span>
                              <span className="text-red-600 font-bold">Due: ₹{bl.dueAmount}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2 shrink-0">
                          <button onClick={() => openWhatsApp(bl)} className="px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg font-bold text-xs transition-colors border border-emerald-200 flex items-center gap-1"><span>📱</span> Remind</button>
                          <button onClick={() => { setEditingBill({ _id: bl._id }); }} className="px-3 py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg font-bold text-xs transition-colors border border-indigo-200">View Bill</button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
        )}
      </main>

      {/* ── Package Form Modal ── */}
      {showPackageForm && (
        <PackageFormModal
          pkg={editingPackage}
          categories={categories}
          onClose={() => { setShowPackageForm(false); setEditingPackage(null); }}
          onSaved={fetchPackages}
        />
      )}

      {/* ── Bill Form Modal ── */}
      {showBillModal && billingBooking && (
        <BillModal
          booking={billingBooking}
          packages={packages}
          onClose={() => setShowBillModal(false)}
          onSaved={() => {
            fetchBills();
          }}
        />
      )}

      {/* ── Edit Bill Modal ── */}
      {editingBill && (
        <BillModal
          existingBillId={editingBill._id}
          packages={packages}
          onClose={() => setEditingBill(null)}
          onSaved={() => fetchBills()}
        />
      )}

      {/* ── Add Booking Modal ── */}
      {showBookingModal && (
        <BookingModal
          packages={packages}
          onClose={() => setShowBookingModal(false)}
          onSaved={() => fetchBookings()}
        />
      )}

      {/* === === === ===  ADD CUSTOMER MODAL === === === ===  */}
      {showCustomerModal && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md overflow-y-auto">
          <div className="bg-white border border-slate-200 w-full max-w-md rounded-[24px] shadow-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-900">Add Customer</h2>
              <button onClick={() => setShowCustomerModal(false)} className="text-slate-400 hover:text-slate-900"><X size={20} /></button>
            </div>
            <form onSubmit={async (e) => {
              e.preventDefault();
              try {
                const res = await authFetch(`${API}/customers`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(newCustomer)
                });
                if (res.ok) {
                  setShowCustomerModal(false);
                  setNewCustomer({ name: '', phone: '', email: '', age: '', gender: 'M', locationFrom: '', heads: 1, postpaidNumber: '', downTrainFlight: '', room: '', status: 'Enquired', details: '' });
                  fetchCustomers();
                }
              } catch (err) { }
            }} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Name *</label>
                  <input required value={newCustomer.name} onChange={e => setNewCustomer({ ...newCustomer, name: e.target.value })} className={settingInp} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Phone Number *</label>
                  <input required value={newCustomer.phone} onChange={e => setNewCustomer({ ...newCustomer, phone: e.target.value })} className={settingInp} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Email</label>
                  <input type="email" value={newCustomer.email} onChange={e => setNewCustomer({ ...newCustomer, email: e.target.value })} className={settingInp} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Postpaid Number</label>
                  <input value={newCustomer.postpaidNumber} onChange={e => setNewCustomer({ ...newCustomer, postpaidNumber: e.target.value })} className={settingInp} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Age</label>
                  <input type="number" value={newCustomer.age} onChange={e => setNewCustomer({ ...newCustomer, age: e.target.value })} className={settingInp} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Gender (M/F)</label>
                  <select value={newCustomer.gender} onChange={e => setNewCustomer({ ...newCustomer, gender: e.target.value })} className={settingInp}>
                    <option value="M">M</option>
                    <option value="F">F</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">From (Location)</label>
                  <input value={newCustomer.locationFrom} onChange={e => setNewCustomer({ ...newCustomer, locationFrom: e.target.value })} className={settingInp} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Heads (Pax)</label>
                  <input type="number" value={newCustomer.heads} onChange={e => setNewCustomer({ ...newCustomer, heads: e.target.value })} className={settingInp} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Down Train / Flight</label>
                  <input value={newCustomer.downTrainFlight} onChange={e => setNewCustomer({ ...newCustomer, downTrainFlight: e.target.value })} className={settingInp} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Room</label>
                  <input value={newCustomer.room} onChange={e => setNewCustomer({ ...newCustomer, room: e.target.value })} className={settingInp} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Status</label>
                <select value={newCustomer.status} onChange={e => setNewCustomer({ ...newCustomer, status: e.target.value })} className={settingInp}>
                  <option value="Enquired">Enquired</option>
                  <option value="Upcoming Trip">Upcoming Trip</option>
                  <option value="Completed Trip">Completed Trip</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Interaction Details (Optional)</label>
                <textarea value={newCustomer.details} onChange={e => setNewCustomer({ ...newCustomer, details: e.target.value })} className={settingInp + " resize-none"} rows={2} placeholder="E.g. Met at office for Darjeeling tour" />
              </div>
              <button type="submit" className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700">Save Customer</button>
            </form>
          </div>
        </div>
      )}

      {/* === === === ===  CUSTOMER CONTACT MODAL (WhatsApp / Email) === === === ===  */}
      {customerContactModal && (
        <div className="fixed inset-0 z-[3000] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 my-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-extrabold text-slate-900">
                {customerContactModal.type === 'whatsapp' ? '📱 Message via WhatsApp' : '✉️ Message via Email'}
              </h3>
              <button onClick={() => setCustomerContactModal(null)} className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-400 hover:bg-slate-200"><X size={16} /></button>
            </div>

            <div className="bg-slate-50 rounded-xl p-4 mb-5 text-sm">
              <p className="font-bold text-slate-900">Customer: {customerContactModal.customer.name}</p>
              <p className="text-slate-500">Phone: {customerContactModal.customer.phone}</p>
              {customerContactModal.type === 'email' && (
                <div className="mt-3">
                  <label className="block text-xs font-extrabold text-slate-700 mb-1 uppercase tracking-wider">Email Address</label>
                  <input
                    type="email"
                    value={shareEmail}
                    onChange={e => setShareEmail(e.target.value)}
                    placeholder="customer@email.com"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500"
                  />
                </div>
              )}
            </div>

            <div className="mb-5">
              <label className="block text-xs font-extrabold text-slate-700 mb-2 uppercase tracking-wider">Message Type</label>
              <div className="grid grid-cols-3 gap-2">
                <button onClick={() => setContactMessageType('invite')} className={`py-2 px-2 rounded-lg border text-xs font-bold transition-colors ${contactMessageType === 'invite' ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>Invite to Trip</button>
                <button onClick={() => setContactMessageType('greeting')} className={`py-2 px-2 rounded-lg border text-xs font-bold transition-colors ${contactMessageType === 'greeting' ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>Greeting</button>
                <button onClick={() => setContactMessageType('custom')} className={`py-2 px-2 rounded-lg border text-xs font-bold transition-colors ${contactMessageType === 'custom' ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>Custom</button>
              </div>
            </div>

            {contactMessageType === 'invite' && (
              <div className="mb-5">
                <label className="block text-xs font-extrabold text-slate-700 mb-2 uppercase tracking-wider">Select Package</label>
                <select value={selectedPackageId} onChange={(e) => setSelectedPackageId(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 text-sm">
                  {packages.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                </select>
              </div>
            )}

            {contactMessageType === 'custom' && (
              <div className="mb-5">
                <label className="block text-xs font-extrabold text-slate-700 mb-2 uppercase tracking-wider">Custom Message</label>
                <textarea rows={4} value={customMessage} onChange={e => setCustomMessage(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 text-sm resize-none" placeholder="Type your message here..." />
              </div>
            )}

            <div className="bg-blue-50 text-blue-800 p-3 rounded-lg text-xs mb-5">
              <strong>Note:</strong> Website link and contact details will be automatically appended to the message.
            </div>

            {shareMsg && (
              <div className={`p-3 rounded-xl mb-5 text-sm font-bold ${shareMsg.includes('✅') ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'}`}>
                {shareMsg}
              </div>
            )}

            <button
              onClick={handleSendCustomerContact}
              disabled={shareSending}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold py-3 rounded-xl shadow-lg transition-transform hover:-translate-y-0.5 disabled:opacity-50"
            >
              {shareSending ? 'Sending...' : (customerContactModal.type === 'whatsapp' ? 'Open WhatsApp' : 'Send Email')}
            </button>
          </div>
        </div>
      )}

    </div>
  );
}




