import { API, authFetch } from '../data/constants';
import { useState, useEffect, useMemo } from 'react';
import {
  X, Loader2, Printer, Plus, Edit2, Trash2, Save, FileText,
  Search, User, UserPlus, Check, Phone, Mail, MapPin,
  Calendar, CreditCard, AlertCircle, ArrowRight, ArrowLeft, CheckCircle2,
  Filter, RotateCcw, Building2, Smartphone, Wallet
} from 'lucide-react';
import { getPaymentMethodBadgeClass } from '../utils/paymentUtils';

const inp = "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-3 focus:ring-indigo-500/10 placeholder-slate-400 transition-all";
const Label = ({ children, required }) => (
  <label className="block text-xs font-bold text-slate-700 mb-1.5 ml-0.5 uppercase tracking-wider">
    {children} {required && <span className="text-red-500 font-bold">*</span>}
  </label>
);

export default function BillModal({
  booking = null,
  existingBillId = null,
  packages = [],
  customers = [],
  bookings = [],
  bills = [],
  onClose,
  onSaved
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // 'edit' for creating/editing, 'view' for invoice review
  const [viewMode, setViewMode] = useState(existingBillId ? 'view' : 'edit');
  const [cameFromCreate, setCameFromCreate] = useState(false);
  const [bill, setBill] = useState(null);

  // Customer selection mode for creating new bill: 'existing' or 'new'
  const [customerMode, setCustomerMode] = useState('existing');
  const [customerSearch, setCustomerSearch] = useState('');
  const [tripFilter, setTripFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'paid', 'due', 'unpaid', 'unbilled'
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);

  // Initial package lookup
  const initialPackage = booking?.destination ? packages.find(p => p.name === booking.destination) : null;
  let initialRate = 0;
  if (initialPackage && initialPackage.price) {
    const parsed = parseFloat(initialPackage.price.replace(/[^\d.-]/g, ''));
    if (!isNaN(parsed)) initialRate = parsed;
  }
  const initialQty = booking?.travellers || 1;

  const [form, setForm] = useState({
    bookingId: booking?._id || '',
    customerName: booking?.name || '',
    customerPhone: booking?.phone || '',
    customerEmail: booking?.email || '',
    customerAddress: booking?.location || '',
    packageName: booking?.destination || '',
    packageCategory: '',
    packageExperience: '',
    travelDate: booking?.date || '',
    travellers: booking?.travellers || 1,
    discount: 0,
    tax: 0,
    // Payment fields
    advancePaid: 0,
    paymentMethod: 'UPI',
    paymentDate: new Date().toISOString().split('T')[0],
    transactionId: '',
    upiId: '',
    paymentApp: 'Google Pay',
    bankName: '',
    accountNumber: '',
    transferType: 'IMPS',
    cardType: 'Credit Card',
    cardNetwork: 'Visa',
    cardLast4: '',
    paymentNotes: ''
  });

  const [items, setItems] = useState([
    {
      description: booking?.destination || 'Tour Package',
      quantity: initialQty,
      rate: initialRate,
      amount: initialRate * initialQty
    }
  ]);

  // Payment states for View mode
  const defaultPaymentForm = {
    amount: '',
    method: 'UPI',
    date: new Date().toISOString().split('T')[0],
    transactionId: '',
    upiId: '',
    paymentApp: 'Google Pay',
    bankName: '',
    accountNumber: '',
    transferType: 'IMPS',
    cardType: 'Credit Card',
    cardNetwork: 'Visa',
    cardLast4: '',
    notes: ''
  };

  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);
  const [paymentForm, setPaymentForm] = useState(defaultPaymentForm);

  // Merge and deduplicate existing customers from `customers`, `bookings`, and `bills`
  const existingCustomersList = useMemo(() => {
    const list = [];
    const seenPhones = new Set();
    const seenNames = new Set();

    // Helper to get all bills for a phone / name
    const findBills = (phone, name) => {
      const cleanP = (phone || '').trim().replace(/[^\d]/g, '');
      const cleanN = (name || '').trim().toLowerCase();
      return (bills || []).filter(b => {
        const bP = (b.customerPhone || '').trim().replace(/[^\d]/g, '');
        const bN = (b.customerName || '').trim().toLowerCase();
        return (cleanP && bP && bP === cleanP) || (cleanN && bN && bN === cleanN);
      });
    };

    // Helper to get all bookings for a phone / name
    const findBooking = (phone, name) => {
      const cleanP = (phone || '').trim().replace(/[^\d]/g, '');
      const cleanN = (name || '').trim().toLowerCase();
      return (bookings || []).find(b => {
        const bP = (b.phone || '').trim().replace(/[^\d]/g, '');
        const bN = (b.name || '').trim().toLowerCase();
        return (cleanP && bP && bP === cleanP) || (cleanN && bN && bN === cleanN);
      });
    };

    // 1. Process from customers collection
    (customers || []).forEach(c => {
      const cleanP = (c.phone || '').trim().replace(/[^\d]/g, '');
      const cleanN = (c.name || '').trim().toLowerCase();
      if (cleanP) seenPhones.add(cleanP);
      if (cleanN) seenNames.add(cleanN);

      const custBills = findBills(c.phone, c.name);
      const custBooking = findBooking(c.phone, c.name);

      let billingStatus = 'unbilled'; // 'paid' | 'due' | 'unpaid' | 'unbilled'
      let latestBill = null;
      if (custBills.length > 0) {
        latestBill = custBills[0];
        const hasPaidBill = custBills.some(b => b.paymentStatus === 'PAID' || (parseFloat(b.dueAmount) || 0) <= 0);
        const hasDueBill = custBills.some(b => (parseFloat(b.dueAmount) || 0) > 0 && (parseFloat(b.advancePaid) || 0) > 0);
        const hasPendingBill = custBills.some(b => (parseFloat(b.advancePaid) || 0) === 0);

        if (hasPaidBill) billingStatus = 'paid';
        else if (hasDueBill) billingStatus = 'due';
        else if (hasPendingBill) billingStatus = 'unpaid';
      }

      list.push({
        _id: c._id,
        name: c.name || 'Unnamed',
        phone: c.phone || '',
        email: c.email || '',
        location: c.locationFrom || '',
        heads: c.heads || 1,
        status: c.status || 'Customer',
        bills: custBills,
        latestBill,
        billingStatus,
        booking: custBooking || null,
        tripName: custBooking?.destination || latestBill?.packageName || c.packageName || ''
      });
    });

    // 2. Add from bills if any customer was in bills but not in customers
    (bills || []).forEach(b => {
      const cleanP = (b.customerPhone || '').trim().replace(/[^\d]/g, '');
      const cleanN = (b.customerName || '').trim().toLowerCase();
      if ((cleanP && !seenPhones.has(cleanP)) || (!cleanP && cleanN && !seenNames.has(cleanN))) {
        if (cleanP) seenPhones.add(cleanP);
        if (cleanN) seenNames.add(cleanN);

        const custBills = findBills(b.customerPhone, b.customerName);
        const custBooking = findBooking(b.customerPhone, b.customerName);

        const isPaid = (parseFloat(b.dueAmount) || 0) <= 0 || b.paymentStatus === 'PAID';
        const isDue = (parseFloat(b.dueAmount) || 0) > 0 && (parseFloat(b.advancePaid) || 0) > 0;
        const billingStatus = isPaid ? 'paid' : (isDue ? 'due' : 'unpaid');

        list.push({
          _id: b._id,
          name: b.customerName || 'Customer',
          phone: b.customerPhone || '',
          email: b.customerEmail || '',
          location: b.customerAddress || '',
          heads: b.travellers || 1,
          status: 'Billed',
          bills: custBills,
          latestBill: b,
          billingStatus,
          booking: custBooking || null,
          tripName: b.packageName || ''
        });
      }
    });

    // 3. Add from bookings if not yet added
    (bookings || []).forEach(b => {
      const cleanP = (b.phone || '').trim().replace(/[^\d]/g, '');
      const cleanN = (b.name || '').trim().toLowerCase();
      if ((cleanP && !seenPhones.has(cleanP)) || (!cleanP && cleanN && !seenNames.has(cleanN))) {
        if (cleanP) seenPhones.add(cleanP);
        if (cleanN) seenNames.add(cleanN);

        const custBills = findBills(b.phone, b.name);
        list.push({
          _id: b._id,
          name: b.name || 'Unnamed',
          phone: b.phone || '',
          email: b.email || '',
          location: b.location || '',
          heads: b.travellers || 1,
          status: 'Booked',
          bills: custBills,
          latestBill: custBills[0] || null,
          billingStatus: custBills.length > 0 ? (custBills[0].paymentStatus === 'PAID' ? 'paid' : 'due') : 'unbilled',
          booking: b,
          tripName: b.destination || ''
        });
      }
    });

    return list;
  }, [customers, bookings, bills]);

  // Selected customer object
  const selectedCustomerObj = useMemo(() => {
    return existingCustomersList.find(c => c._id === selectedCustomerId) || null;
  }, [existingCustomersList, selectedCustomerId]);

  // Check if an existing bill exists for this selected customer + package
  const existingBillForThisTour = useMemo(() => {
    if (!selectedCustomerObj || !selectedCustomerObj.bills?.length || !form.packageName) return null;
    const cleanPkg = form.packageName.trim().toLowerCase();
    return selectedCustomerObj.bills.find(b => b.packageName && b.packageName.trim().toLowerCase() === cleanPkg) || null;
  }, [selectedCustomerObj, form.packageName]);

  // Status counts for filter pills
  const statusCounts = useMemo(() => {
    return {
      all: existingCustomersList.length,
      paid: existingCustomersList.filter(c => c.billingStatus === 'paid').length,
      due: existingCustomersList.filter(c => c.billingStatus === 'due').length,
      unpaid: existingCustomersList.filter(c => c.billingStatus === 'unpaid').length,
      unbilled: existingCustomersList.filter(c => c.billingStatus === 'unbilled').length
    };
  }, [existingCustomersList]);

  // Filtered customers with search, trip, and status filters
  const filteredCustomers = useMemo(() => {
    return existingCustomersList.filter(c => {
      // 1. Search Query
      if (customerSearch.trim()) {
        const q = customerSearch.toLowerCase();
        const matchesName = c.name && c.name.toLowerCase().includes(q);
        const matchesPhone = c.phone && c.phone.includes(q);
        const matchesEmail = c.email && c.email.toLowerCase().includes(q);
        const matchesLocation = c.location && c.location.toLowerCase().includes(q);
        const matchesBillNo = c.bills?.some(b => b.billNumber && b.billNumber.toLowerCase().includes(q));
        if (!matchesName && !matchesPhone && !matchesEmail && !matchesLocation && !matchesBillNo) {
          return false;
        }
      }

      // 2. Trip / Package Filter
      if (tripFilter !== 'all') {
        const tf = tripFilter.toLowerCase();
        const matchesTrip = (c.tripName && c.tripName.toLowerCase() === tf) ||
          c.bills?.some(b => b.packageName && b.packageName.toLowerCase() === tf) ||
          (c.booking?.destination && c.booking.destination.toLowerCase() === tf);
        if (!matchesTrip) return false;
      }

      // 3. Payment Status Filter
      if (statusFilter !== 'all') {
        if (c.billingStatus !== statusFilter) return false;
      }

      return true;
    });
  }, [existingCustomersList, customerSearch, tripFilter, statusFilter]);

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
          tax: data.data.tax || 0,
          advancePaid: data.data.advancePaid || 0,
          paymentMethod: 'UPI',
          paymentDate: new Date().toISOString().split('T')[0],
          transactionId: '',
          upiId: '',
          paymentApp: 'Google Pay',
          bankName: '',
          accountNumber: '',
          transferType: 'IMPS',
          cardType: 'Credit Card',
          cardNetwork: 'Visa',
          cardLast4: '',
          paymentNotes: ''
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

  const handleSelectCustomer = (cust) => {
    setSelectedCustomerId(cust._id);
    const existingBill = cust.latestBill || cust.bills?.[0];

    setForm(prev => {
      const next = {
        ...prev,
        customerName: cust.name || '',
        customerPhone: cust.phone || '',
        customerEmail: cust.email || '',
        customerAddress: cust.location || ''
      };

      if (existingBill) {
        if (existingBill.packageName) next.packageName = existingBill.packageName;
        if (existingBill.travelDate) next.travelDate = existingBill.travelDate;
        if (existingBill.travellers) next.travellers = existingBill.travellers;

        if ((parseFloat(existingBill.dueAmount) || 0) > 0) {
          next.advancePaid = existingBill.dueAmount;
        } else {
          next.advancePaid = existingBill.totalAmount || 0;
        }
      } else if (cust.booking) {
        next.bookingId = cust.booking._id || '';
        if (cust.booking.destination) next.packageName = cust.booking.destination;
        if (cust.booking.date) next.travelDate = cust.booking.date;
        if (cust.booking.travellers) next.travellers = cust.booking.travellers;
        next.advancePaid = 0;
      } else {
        next.advancePaid = 0;
      }

      const pkgToMatch = next.packageName;
      if (pkgToMatch) {
        const matchedPkg = packages.find(p => p.name === pkgToMatch);
        if (matchedPkg) {
          next.packageCategory = matchedPkg.category ? (Array.isArray(matchedPkg.category) ? matchedPkg.category.join(', ') : matchedPkg.category) : '';
          next.packageExperience = matchedPkg.experiences ? (Array.isArray(matchedPkg.experiences) ? matchedPkg.experiences.join(', ') : matchedPkg.experiences) : '';
          if (matchedPkg.price) {
            const parsed = parseFloat(matchedPkg.price.replace(/[^\d.-]/g, ''));
            if (!isNaN(parsed)) {
              const qty = next.travellers || 1;
              setItems([{
                description: pkgToMatch,
                quantity: qty,
                rate: parsed,
                amount: parsed * qty
              }]);
            }
          }
        }
      }

      return next;
    });
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
          if (selectedPkg.date && !next.travelDate) {
            next.travelDate = selectedPkg.date;
          }
          if (selectedPkg.price) {
            const numStr = selectedPkg.price.replace(/[^\d.-]/g, '');
            const parsedRate = parseFloat(numStr);
            if (!isNaN(parsedRate)) {
              setItems(prevItems => {
                const newItems = [...prevItems];
                if (newItems.length > 0) {
                  newItems[0].description = value;
                  newItems[0].rate = parsedRate;
                  newItems[0].amount = parsedRate * (parseFloat(newItems[0].quantity) || 1);
                }
                return newItems;
              });
            }
          }
        }
      }
      if (name === 'travellers') {
        const pax = parseFloat(value) || 1;
        setItems(prevItems => {
          const newItems = [...prevItems];
          if (newItems.length > 0) {
            newItems[0].quantity = pax;
            newItems[0].amount = (parseFloat(newItems[0].rate) || 0) * pax;
          }
          return newItems;
        });
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
  const advancePaidNum = Math.min(grandTotal, Math.max(0, parseFloat(form.advancePaid) || 0));
  const liveDueAmount = Math.max(0, grandTotal - advancePaidNum);
  const liveStatus = advancePaidNum === 0 ? 'PENDING' : (advancePaidNum >= grandTotal && grandTotal > 0 ? 'PAID' : 'PARTIALLY PAID');

  // Recording payment for an existing bill that has due amount
  const handleReceivePaymentForExisting = async () => {
    if (!existingBillForThisTour) return;
    const payAmount = parseFloat(form.advancePaid) || existingBillForThisTour.dueAmount;
    if (payAmount <= 0) {
      setError('Please enter a valid payment amount to receive.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const payload = {
        billId: existingBillForThisTour._id,
        amount: payAmount,
        method: form.paymentMethod || 'UPI',
        date: form.paymentDate || new Date().toISOString().split('T')[0],
        transactionId: form.transactionId || '',
        upiId: form.upiId || '',
        paymentApp: form.paymentApp || '',
        bankName: form.bankName || '',
        accountNumber: form.accountNumber || '',
        transferType: form.transferType || '',
        cardType: form.cardType || '',
        cardNetwork: form.cardNetwork || '',
        cardLast4: form.cardLast4 || '',
        notes: form.paymentNotes || 'Payment received'
      };

      const res = await authFetch(`${API}/payments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        if (onSaved) onSaved({ billNumber: existingBillForThisTour.billNumber, _id: existingBillForThisTour._id });
      } else {
        setError(data.error || 'Failed to record payment');
      }
    } catch (err) {
      setError('Network error recording payment');
    } finally {
      setLoading(false);
    }
  };

  // Normal save bill for new bills or editing existing bill
  const saveBill = async () => {
    setError('');
    if (!form.customerName.trim()) {
      setError('Customer name is required');
      return;
    }
    if (!form.customerPhone.trim()) {
      setError('Customer phone number is required');
      return;
    }

    // Safety check against duplicate bills
    if (!bill && existingBillForThisTour) {
      if (existingBillForThisTour.paymentStatus === 'PAID' || (parseFloat(existingBillForThisTour.dueAmount) || 0) <= 0) {
        setError(`Bill #${existingBillForThisTour.billNumber} already exists for this tour and is FULLY PAID. Duplicate bills cannot be created for the same tour.`);
        return;
      }
      await handleReceivePaymentForExisting();
      return;
    }

    if (grandTotal <= 0 && items.length === 0) {
      setError('Please add at least one line item to the bill');
      return;
    }
    if (parseFloat(form.advancePaid) > grandTotal) {
      setError('Advance payment cannot exceed the total bill amount');
      return;
    }

    setLoading(true);
    try {
      const url = bill ? `${API}/bills/${bill._id}` : `${API}/bills`;
      const method = bill ? 'PUT' : 'POST';

      const payload = {
        ...form,
        advancePaid: advancePaidNum,
        items
      };

      if (!payload.bookingId || !payload.bookingId.trim()) {
        delete payload.bookingId;
      }

      const res = await authFetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        if (onSaved) onSaved(data.data);
      } else {
        setError(data.error || 'Failed to save bill');
      }
    } catch (err) {
      setError('Network error. Please make sure backend is reachable.');
    } finally {
      setLoading(false);
    }
  };

  // Payment operations in View Mode
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
        setPaymentForm(defaultPaymentForm);
        fetchBill();
        if (onSaved) onSaved(bill);
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
        if (onSaved) onSaved(bill);
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
        amount: payment.amount ?? '',
        method: payment.method || 'UPI',
        date: payment.date ? new Date(payment.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        transactionId: payment.transactionId || '',
        upiId: payment.upiId || '',
        paymentApp: payment.paymentApp || 'Google Pay',
        bankName: payment.bankName || '',
        accountNumber: payment.accountNumber || '',
        transferType: payment.transferType || 'IMPS',
        cardType: payment.cardType || 'Credit Card',
        cardNetwork: payment.cardNetwork || 'Visa',
        cardLast4: payment.cardLast4 || '',
        notes: payment.notes || ''
      });
    } else {
      setEditingPayment(null);
      setPaymentForm({
        ...defaultPaymentForm,
        amount: bill?.dueAmount > 0 ? bill.dueAmount : '',
        date: new Date().toISOString().split('T')[0]
      });
    }
    setShowPaymentForm(true);
  };

  // ─── BACK NAVIGATION (Smooth Inside Navigation) ───────────────────────────
  const handleBack = () => {
    // 1. If viewing an invoice that was opened from create/edit mode
    if (viewMode === 'view') {
      if (cameFromCreate) {
        setViewMode('edit');
        setBill(null);
        setCameFromCreate(false);
        return;
      }
      onClose();
      return;
    }

    // 2. If editing an existing bill opened via existingBillId prop
    if (bill && existingBillId) {
      setViewMode('view');
      return;
    }

    // 3. If in create billing flow (opened via Add Billing)
    if (!booking) {
      // If a customer was selected from the list, return to customer directory
      if (selectedCustomerId) {
        setSelectedCustomerId(null);
        setError('');
        return;
      }

      // If in new customer mode, return to customer directory
      if (customerMode === 'new') {
        setCustomerMode('existing');
        setError('');
        return;
      }
    }

    // 4. At root directory level or fixed booking, close the modal
    onClose();
  };

  // ─── EDIT / CREATE MODE ──────────────────────────────────────────────────────────
  if (viewMode === 'edit') {
    const isNewBill = !bill;
    const isStepOneDirectory = !booking && !bill && !selectedCustomerId && customerMode === 'existing';
    const isExistingTourPaid = existingBillForThisTour && (existingBillForThisTour.paymentStatus === 'PAID' || (parseFloat(existingBillForThisTour.dueAmount) || 0) <= 0);
    const isExistingTourHasDue = existingBillForThisTour && (parseFloat(existingBillForThisTour.dueAmount) || 0) > 0;

    return (
      <div className="fixed inset-0 z-[2000] flex items-start justify-center p-3 sm:p-5 md:p-6 bg-slate-900/60 backdrop-blur-xs overflow-y-auto admin-theme custom-scrollbar">
        <div className="bg-white border border-slate-200 w-full max-w-5xl 2xl:max-w-6xl rounded-2xl shadow-xl overflow-hidden my-auto sm:my-6 flex flex-col max-h-[92vh]">
          
          {/* ── Professional Clean Header with Inside Back Navigation ── */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-white sticky top-0 z-20">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleBack}
                className="w-9 h-9 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-600 hover:text-slate-900 transition-colors shadow-xs group"
                title={
                  !booking && (selectedCustomerId || customerMode === 'new')
                    ? "Back to Customer Directory"
                    : "Close"
                }
              >
                <ArrowLeft size={18} className="group-hover:-translate-x-0.5 transition-transform" />
              </button>
              <div>
                <h2 className="text-lg font-bold text-slate-900 tracking-tight leading-tight">
                  {isNewBill
                    ? (isStepOneDirectory
                        ? 'Select Customer for Billing'
                        : 'Add Customer Billing')
                    : `Edit Invoice #${bill.billNumber}`}
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  {isNewBill
                    ? (isStepOneDirectory
                        ? 'Choose an existing customer or create a new profile'
                        : (form.customerName ? `Billing details for ${form.customerName}` : 'Generate tour invoice or receive payments'))
                    : `Editing invoice details for ${form.customerName}`}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              title="Close"
            >
              <X size={18} />
            </button>
          </div>

          <div className="p-6 space-y-6 overflow-y-auto flex-1 bg-slate-50/50 custom-scrollbar">
            {error && (
              <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-semibold flex items-center gap-2">
                <AlertCircle size={16} className="shrink-0 text-red-600" />
                <span>{error}</span>
              </div>
            )}

            {/* ── 1. CUSTOMER SELECTION CARD (Clean SaaS Design) ── */}
            {isNewBill && (
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Customer Information
                    </h3>
                    <p className="text-xs text-slate-400">Select an existing customer or create a new profile</p>
                  </div>

                  {/* Clean Segmented Control */}
                  <div className="inline-flex p-1 bg-slate-100 rounded-lg">
                    <button
                      type="button"
                      onClick={() => setCustomerMode('existing')}
                      className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 ${
                        customerMode === 'existing'
                          ? 'bg-white text-slate-900 shadow-xs'
                          : 'text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      <User size={13} />
                      Existing Customer
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setCustomerMode('new');
                        setSelectedCustomerId(null);
                      }}
                      className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 ${
                        customerMode === 'new'
                          ? 'bg-white text-slate-900 shadow-xs'
                          : 'text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      <UserPlus size={13} />
                      New Customer
                    </button>
                  </div>
                </div>

                {/* Existing Customer: Selected state or Searchable List */}
                {customerMode === 'existing' && (
                  <div className="space-y-3">
                    {/* Selected Customer View (Clean, non-garish) */}
                    {selectedCustomerObj ? (
                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center shrink-0">
                              {selectedCustomerObj.name.slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="text-sm font-bold text-slate-900">{selectedCustomerObj.name}</h4>
                                <span className="text-[11px] font-medium text-slate-500">📞 {selectedCustomerObj.phone}</span>
                                {selectedCustomerObj.email && <span className="text-[11px] font-medium text-slate-400">✉️ {selectedCustomerObj.email}</span>}
                              </div>
                              {selectedCustomerObj.location && (
                                <p className="text-xs text-slate-500">Location: {selectedCustomerObj.location}</p>
                              )}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={handleBack}
                            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 hover:underline px-2 py-1 rounded"
                          >
                            ← Change Customer
                          </button>
                        </div>

                        {/* Existing Bill Notice (Clean Callout, not double green boxes) */}
                        {isExistingTourPaid && (
                          <div className="pt-3 border-t border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
                            <div className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                              <span className="text-slate-700 font-medium">
                                Bill <strong className="text-slate-900 font-bold">#{existingBillForThisTour.billNumber}</strong> for {existingBillForThisTour.packageName} is <strong className="text-emerald-700 font-bold">fully paid</strong> (₹{existingBillForThisTour.totalAmount?.toLocaleString('en-IN')}).
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setCameFromCreate(true);
                                fetchBill(existingBillForThisTour._id);
                                setViewMode('view');
                              }}
                              className="font-bold text-indigo-600 hover:text-indigo-800 hover:underline flex items-center gap-1 whitespace-nowrap self-start sm:self-auto"
                            >
                              Open Bill #{existingBillForThisTour.billNumber} →
                            </button>
                          </div>
                        )}

                        {isExistingTourHasDue && (
                          <div className="pt-3 border-t border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
                            <div className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                              <span className="text-slate-700 font-medium">
                                Bill <strong className="text-slate-900 font-bold">#{existingBillForThisTour.billNumber}</strong> has balance due of <strong className="text-orange-700 font-bold">₹{(existingBillForThisTour.dueAmount || 0).toLocaleString('en-IN')}</strong> (Paid: ₹{(existingBillForThisTour.advancePaid || 0).toLocaleString('en-IN')}).
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setCameFromCreate(true);
                                fetchBill(existingBillForThisTour._id);
                                setViewMode('view');
                              }}
                              className="font-bold text-indigo-600 hover:text-indigo-800 hover:underline flex items-center gap-1 whitespace-nowrap self-start sm:self-auto"
                            >
                              Open Bill Details →
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <>
                        {/* Search and Filters */}
                        <div className="space-y-2.5">
                          <div className="flex flex-col sm:flex-row gap-2">
                            <div className="relative flex-1">
                              <input
                                type="text"
                                value={customerSearch}
                                onChange={e => setCustomerSearch(e.target.value)}
                                placeholder="Search by name, phone, email, or bill number..."
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white placeholder-slate-400"
                              />
                              <Search size={15} className="absolute left-3 top-2.5 text-slate-400" />
                            </div>

                            <select
                              value={tripFilter}
                              onChange={e => setTripFilter(e.target.value)}
                              className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-indigo-500"
                            >
                              <option value="all">All Trips</option>
                              {packages.map(p => (
                                <option key={p._id} value={p.name}>
                                  {p.name}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Status Filter Tabs */}
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-600">
                              <button
                                type="button"
                                onClick={() => setStatusFilter('all')}
                                className={`px-2.5 py-1 rounded-md transition-colors ${
                                  statusFilter === 'all' ? 'bg-slate-900 text-white font-bold' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                                }`}
                              >
                                All ({statusCounts.all})
                              </button>
                              <button
                                type="button"
                                onClick={() => setStatusFilter('paid')}
                                className={`px-2.5 py-1 rounded-md transition-colors ${
                                  statusFilter === 'paid' ? 'bg-emerald-700 text-white font-bold' : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                                }`}
                              >
                                Paid ({statusCounts.paid})
                              </button>
                              <button
                                type="button"
                                onClick={() => setStatusFilter('due')}
                                className={`px-2.5 py-1 rounded-md transition-colors ${
                                  statusFilter === 'due' ? 'bg-orange-700 text-white font-bold' : 'bg-orange-50 text-orange-800 hover:bg-orange-100'
                                }`}
                              >
                                Due ({statusCounts.due})
                              </button>
                              <button
                                type="button"
                                onClick={() => setStatusFilter('unbilled')}
                                className={`px-2.5 py-1 rounded-md transition-colors ${
                                  statusFilter === 'unbilled' ? 'bg-indigo-700 text-white font-bold' : 'bg-indigo-50 text-indigo-800 hover:bg-indigo-100'
                                }`}
                              >
                                Not Billed ({statusCounts.unbilled})
                              </button>
                            </div>

                            {(customerSearch || tripFilter !== 'all' || statusFilter !== 'all') && (
                              <button
                                type="button"
                                onClick={() => {
                                  setCustomerSearch('');
                                  setTripFilter('all');
                                  setStatusFilter('all');
                                }}
                                className="text-[11px] font-semibold text-slate-400 hover:text-slate-700"
                              >
                                Reset filters
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Customer List Container */}
                        <div className={`border border-slate-200 rounded-xl bg-white ${isStepOneDirectory ? 'max-h-[52vh]' : 'max-h-60'} overflow-y-auto overflow-x-hidden divide-y divide-slate-100 custom-scrollbar`}>
                          {filteredCustomers.length === 0 ? (
                            <div className="p-8 text-center text-xs text-slate-400 font-medium space-y-1">
                              <p>No customers found matching the search criteria.</p>
                              <button
                                type="button"
                                onClick={() => {
                                  setCustomerSearch('');
                                  setTripFilter('all');
                                  setStatusFilter('all');
                                }}
                                className="text-indigo-600 font-bold hover:underline"
                              >
                                Clear all filters
                              </button>
                            </div>
                          ) : (
                            filteredCustomers.map(cust => (
                              <div
                                key={cust._id}
                                onClick={() => handleSelectCustomer(cust)}
                                className="p-3.5 pr-4 hover:bg-slate-50 cursor-pointer transition-colors flex items-center justify-between gap-3 text-xs group"
                              >
                                <div className="flex items-center gap-3 min-w-0">
                                  <div className="w-9 h-9 rounded-full bg-slate-100 group-hover:bg-indigo-50 group-hover:text-indigo-600 text-slate-700 font-bold text-xs flex items-center justify-center shrink-0 transition-colors">
                                    {cust.name.slice(0, 2).toUpperCase()}
                                  </div>
                                  <div className="min-w-0">
                                    <div className="flex items-center gap-2">
                                      <p className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors truncate">{cust.name}</p>
                                      {cust.billingStatus === 'paid' && (
                                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800">
                                          PAID
                                        </span>
                                      )}
                                      {cust.billingStatus === 'due' && (
                                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-orange-100 text-orange-800">
                                          DUE ₹{(cust.latestBill?.dueAmount || 0).toLocaleString('en-IN')}
                                        </span>
                                      )}
                                      {cust.billingStatus === 'unbilled' && (
                                        <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">
                                          NOT BILLED
                                        </span>
                                      )}
                                    </div>
                                    <div className="text-[11px] text-slate-500 font-normal mt-0.5">
                                      <span>📞 {cust.phone}</span>
                                      {cust.tripName && <span> • 🎒 Trip: {cust.tripName}</span>}
                                      {cust.location && <span> • 📍 {cust.location}</span>}
                                    </div>
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  className="text-xs font-semibold text-indigo-600 group-hover:text-white bg-indigo-50 group-hover:bg-indigo-600 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 shrink-0"
                                >
                                  <span>Select</span>
                                  <ArrowRight size={13} />
                                </button>
                              </div>
                            ))
                          )}
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* New Customer Mode Inputs */}
                {customerMode === 'new' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                    <div>
                      <Label required>Customer Name</Label>
                      <input
                        name="customerName"
                        value={form.customerName}
                        onChange={handleFormChange}
                        placeholder="e.g. Rahul Mukherjee"
                        className={inp}
                        required
                      />
                    </div>
                    <div>
                      <Label required>Phone Number</Label>
                      <input
                        name="customerPhone"
                        value={form.customerPhone}
                        onChange={handleFormChange}
                        placeholder="e.g. 9830012345"
                        className={inp}
                        required
                      />
                    </div>
                    <div>
                      <Label>Email</Label>
                      <input
                        type="email"
                        name="customerEmail"
                        value={form.customerEmail}
                        onChange={handleFormChange}
                        placeholder="customer@example.com (optional)"
                        className={inp}
                      />
                    </div>
                    <div>
                      <Label>Address / City</Label>
                      <input
                        name="customerAddress"
                        value={form.customerAddress}
                        onChange={handleFormChange}
                        placeholder="City, State"
                        className={inp}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Editing Existing Bill Customer Info */}
            {!isNewBill && (
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider border-b pb-2">
                  Customer Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label required>Customer Name</Label>
                    <input name="customerName" value={form.customerName} onChange={handleFormChange} className={inp} />
                  </div>
                  <div>
                    <Label required>Phone Number</Label>
                    <input name="customerPhone" value={form.customerPhone} onChange={handleFormChange} className={inp} />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <input name="customerEmail" value={form.customerEmail} onChange={handleFormChange} className={inp} />
                  </div>
                  <div>
                    <Label>Address / City</Label>
                    <input name="customerAddress" value={form.customerAddress} onChange={handleFormChange} className={inp} />
                  </div>
                </div>
              </div>
            )}

            {/* ── 2. TOUR & TRIP INFORMATION (Shown once customer is selected or in new profile mode) ── */}
            {!isStepOneDirectory && (
              <>
                {/* ── 2. TOUR & TRIP INFORMATION ── */}
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider border-b pb-2">
                    Tour Package & Travel Dates
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <Label>Package</Label>
                      <input
                        list="package-billing-options"
                        name="packageName"
                        value={form.packageName}
                        onChange={handleFormChange}
                        className={inp}
                        placeholder="Select package"
                      />
                      <datalist id="package-billing-options">
                        {packages.map(p => (
                          <option key={p._id} value={p.name} />
                        ))}
                      </datalist>
                    </div>
                    <div>
                      <Label>Travel Date</Label>
                      <input
                        name="travelDate"
                        value={form.travelDate}
                        onChange={handleFormChange}
                        placeholder="e.g. 15-24 Jan 2027"
                        className={inp}
                      />
                    </div>
                    <div>
                      <Label>Travellers (Heads)</Label>
                      <input
                        type="number"
                        min="1"
                        name="travellers"
                        value={form.travellers}
                        onChange={handleFormChange}
                        className={inp}
                      />
                    </div>
                  </div>
                </div>

            {/* ── 3. INVOICE LINE ITEMS ── */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
              <div className="flex justify-between items-center border-b pb-2">
                <div>
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Invoice Line Items
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={addItem}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                >
                  <Plus size={14} /> Add Line Item
                </button>
              </div>

              <div className="space-y-3">
                {items.map((item, index) => (
                  <div key={index} className="flex flex-col sm:flex-row gap-3 items-start bg-slate-50/70 p-3 rounded-lg border border-slate-200/60">
                    <div className="flex-1 w-full">
                      <Label>Description</Label>
                      <input
                        list="bill-item-suggestions"
                        value={item.description}
                        onChange={e => handleItemChange(index, 'description', e.target.value)}
                        className={inp}
                        placeholder="Item description"
                      />
                    </div>
                    <div className="w-full sm:w-24">
                      <Label>Head</Label>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={e => handleItemChange(index, 'quantity', e.target.value)}
                        className={inp}
                      />
                    </div>
                    <div className="w-full sm:w-32">
                      <Label>Rate (₹)</Label>
                      <input
                        type="number"
                        value={item.rate}
                        onChange={e => handleItemChange(index, 'rate', e.target.value)}
                        className={inp}
                        placeholder="0"
                      />
                    </div>
                    <div className="w-full sm:w-32">
                      <Label>Amount (₹)</Label>
                      <input
                        type="number"
                        value={item.amount}
                        disabled
                        className={`${inp} bg-slate-100 font-bold text-slate-800`}
                      />
                    </div>
                    {items.length > 1 && (
                      <div className="self-end sm:self-center pt-1 sm:pt-6">
                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          className="p-2 text-slate-400 hover:text-red-500 rounded-lg transition-colors"
                          title="Remove Item"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <datalist id="bill-item-suggestions">
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

              {/* Financial Summary */}
              <div className="flex justify-end pt-3 border-t border-slate-100">
                <div className="w-full sm:w-80 space-y-2 text-xs">
                  <div className="flex justify-between font-semibold text-slate-600">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-600 font-semibold">
                    <span>Discount (₹)</span>
                    <input
                      type="number"
                      min="0"
                      name="discount"
                      value={form.discount}
                      onChange={handleFormChange}
                      className="w-28 text-right bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold"
                    />
                  </div>
                  <div className="flex justify-between items-center text-slate-600 font-semibold">
                    <span>Tax / GST (₹)</span>
                    <input
                      type="number"
                      min="0"
                      name="tax"
                      value={form.tax}
                      onChange={handleFormChange}
                      className="w-28 text-right bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold"
                    />
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t-2 border-slate-900 font-bold text-sm text-slate-900">
                    <span>TOTAL BILL</span>
                    <span className="text-base font-extrabold text-indigo-700">₹{grandTotal.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ── 4. PAYMENT / ADVANCE (Only shown when not already fully paid) ── */}
            {isNewBill && !isExistingTourPaid && (
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div>
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      {isExistingTourHasDue
                        ? `Receive Payment for Bill #${existingBillForThisTour.billNumber}`
                        : 'Record Payment / Advance'}
                    </h3>
                  </div>

                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                    isExistingTourHasDue
                      ? 'bg-orange-100 text-orange-800'
                      : liveStatus === 'PAID' ? 'bg-emerald-100 text-emerald-800' :
                        liveStatus === 'PARTIALLY PAID' ? 'bg-orange-100 text-orange-800' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {isExistingTourHasDue ? 'HAS BALANCE DUE' : liveStatus}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <Label>Amount (₹)</Label>
                      {isExistingTourHasDue ? (
                        <button
                          type="button"
                          onClick={() => setForm(f => ({ ...f, advancePaid: existingBillForThisTour.dueAmount }))}
                          className="text-[11px] font-bold text-indigo-600 hover:underline"
                        >
                          Clear Due (₹{existingBillForThisTour.dueAmount.toLocaleString('en-IN')})
                        </button>
                      ) : (
                        grandTotal > 0 && (
                          <button
                            type="button"
                            onClick={() => setForm(f => ({ ...f, advancePaid: grandTotal }))}
                            className="text-[11px] font-bold text-indigo-600 hover:underline"
                          >
                            Full Pay (₹{grandTotal.toLocaleString('en-IN')})
                          </button>
                        )
                      )}
                    </div>
                    <input
                      type="number"
                      min="0"
                      name="advancePaid"
                      value={form.advancePaid}
                      onChange={handleFormChange}
                      placeholder="0"
                      className={inp}
                    />
                  </div>

                  <div>
                    <Label>Payment Method</Label>
                    <select
                      name="paymentMethod"
                      value={form.paymentMethod}
                      onChange={handleFormChange}
                      className={inp}
                    >
                      <option value="UPI">UPI</option>
                      <option value="Cash">Cash</option>
                      <option value="Bank Transfer">Bank Transfer</option>
                      <option value="Card">Card</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <Label>Date</Label>
                    <input
                      type="date"
                      name="paymentDate"
                      value={form.paymentDate}
                      onChange={handleFormChange}
                      className={inp}
                    />
                  </div>
                </div>

                {/* UPI Details */}
                {form.paymentMethod === 'UPI' && (
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-3">
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">UPI Details</p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <Label>UPI App</Label>
                        <select
                          name="paymentApp"
                          value={form.paymentApp}
                          onChange={handleFormChange}
                          className={inp}
                        >
                          <option value="Google Pay">Google Pay (GPay)</option>
                          <option value="PhonePe">PhonePe</option>
                          <option value="Paytm">Paytm</option>
                          <option value="BHIM UPI">BHIM UPI</option>
                          <option value="Cred">Cred</option>
                          <option value="Amazon Pay">Amazon Pay</option>
                          <option value="Bank UPI App">Bank UPI App</option>
                          <option value="Other UPI">Other UPI</option>
                        </select>
                      </div>
                      <div>
                        <Label>UPI ID</Label>
                        <input
                          name="upiId"
                          value={form.upiId}
                          onChange={handleFormChange}
                          placeholder="customer@upi"
                          className={inp}
                        />
                      </div>
                      <div>
                        <Label>UTR / Ref No / Txn ID</Label>
                        <input
                          name="transactionId"
                          value={form.transactionId}
                          onChange={handleFormChange}
                          placeholder="12-digit UTR No"
                          className={inp}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Bank Transfer Details */}
                {form.paymentMethod === 'Bank Transfer' && (
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-3">
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Bank Details</p>
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                      <div>
                        <Label>Bank Name</Label>
                        <input
                          name="bankName"
                          value={form.bankName}
                          onChange={handleFormChange}
                          placeholder="e.g. SBI, HDFC"
                          className={inp}
                        />
                      </div>
                      <div>
                        <Label>Transfer Type</Label>
                        <select
                          name="transferType"
                          value={form.transferType}
                          onChange={handleFormChange}
                          className={inp}
                        >
                          <option value="IMPS">IMPS</option>
                          <option value="NEFT">NEFT</option>
                          <option value="RTGS">RTGS</option>
                        </select>
                      </div>
                      <div>
                        <Label>A/C or Ref</Label>
                        <input
                          name="accountNumber"
                          value={form.accountNumber}
                          onChange={handleFormChange}
                          placeholder="Account or Ref"
                          className={inp}
                        />
                      </div>
                      <div>
                        <Label>UTR / Ref No</Label>
                        <input
                          name="transactionId"
                          value={form.transactionId}
                          onChange={handleFormChange}
                          placeholder="UTR / Ref No"
                          className={inp}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Card Details */}
                {form.paymentMethod === 'Card' && (
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-3">
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Card Details</p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <Label>Network</Label>
                        <select
                          name="cardNetwork"
                          value={form.cardNetwork}
                          onChange={handleFormChange}
                          className={inp}
                        >
                          <option value="Visa">Visa</option>
                          <option value="Mastercard">Mastercard</option>
                          <option value="RuPay">RuPay</option>
                        </select>
                      </div>
                      <div>
                        <Label>Last 4 Digits</Label>
                        <input
                          name="cardLast4"
                          maxLength={4}
                          value={form.cardLast4}
                          onChange={handleFormChange}
                          placeholder="1234"
                          className={inp}
                        />
                      </div>
                      <div>
                        <Label>Auth / Txn Code</Label>
                        <input
                          name="transactionId"
                          value={form.transactionId}
                          onChange={handleFormChange}
                          placeholder="Auth Code"
                          className={inp}
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <Label>Payment Notes (Optional)</Label>
                  <input
                    name="paymentNotes"
                    value={form.paymentNotes}
                    onChange={handleFormChange}
                    placeholder="e.g. Received at office"
                    className={inp}
                  />
                </div>

                {/* Live breakdown */}
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg text-xs font-semibold text-slate-700">
                  <span>Total: <strong>₹{grandTotal.toLocaleString('en-IN')}</strong></span>
                  <span>Paid: <strong className="text-emerald-700">₹{advancePaidNum.toLocaleString('en-IN')}</strong></span>
                  <span>Due: <strong className="text-orange-700">₹{liveDueAmount.toLocaleString('en-IN')}</strong></span>
                </div>
              </div>
            )}
              </>
            )}
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-between px-6 py-4 bg-white border-t border-slate-200 sticky bottom-0 z-20">
            {isStepOneDirectory ? (
              <>
                <button
                  type="button"
                  onClick={onClose}
                  className="py-2.5 px-5 rounded-xl border border-slate-200 font-semibold text-xs text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Close
                </button>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 hidden sm:inline">Select a customer above or create a new profile</span>
                  <button
                    type="button"
                    onClick={() => {
                      setCustomerMode('new');
                      setSelectedCustomerId(null);
                    }}
                    className="py-2.5 px-4 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs transition-colors flex items-center gap-1.5"
                  >
                    <UserPlus size={14} /> New Customer Profile
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  {!booking && !bill && (selectedCustomerId || customerMode === 'new') && (
                    <button
                      type="button"
                      onClick={handleBack}
                      className="py-2.5 px-4 rounded-xl border border-slate-200 font-semibold text-xs text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5"
                    >
                      <ArrowLeft size={14} /> Back to Customers
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => (bill ? setViewMode('view') : onClose())}
                    className="py-2.5 px-4 rounded-xl border border-transparent font-semibold text-xs text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                  >
                    Cancel
                  </button>
                </div>

                {isNewBill && isExistingTourPaid ? (
                  <button
                    type="button"
                    onClick={() => {
                      setCameFromCreate(true);
                      fetchBill(existingBillForThisTour._id);
                      setViewMode('view');
                    }}
                    className="py-2.5 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors flex items-center gap-1.5"
                  >
                    <FileText size={15} />
                    Open Bill #{existingBillForThisTour.billNumber}
                  </button>
                ) : isNewBill && isExistingTourHasDue ? (
                  <button
                    type="button"
                    onClick={handleReceivePaymentForExisting}
                    disabled={loading}
                    className="py-2.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors flex items-center gap-1.5 disabled:opacity-60"
                  >
                    {loading ? <Loader2 size={15} className="animate-spin" /> : <CheckCircle2 size={15} />}
                    Receive Payment (₹{(parseFloat(form.advancePaid) || existingBillForThisTour.dueAmount).toLocaleString('en-IN')}) for #{existingBillForThisTour.billNumber}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={saveBill}
                    disabled={loading}
                    className="py-2.5 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-colors flex items-center gap-1.5 disabled:opacity-60 shadow-xs"
                  >
                    {loading ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
                    {isNewBill ? 'Create & Go to Billed Customers' : 'Save Changes'}
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ─── VIEW MODE (INVOICE / BILL DETAILS) ─────────────────────────────────────────
  if (!bill) return null;

  return (
    <div className="fixed inset-0 z-[2000] flex items-start justify-center p-3 sm:p-5 md:p-6 bg-slate-900/60 backdrop-blur-xs overflow-y-auto admin-theme custom-scrollbar">
      <div className="bg-white border border-slate-200 w-full max-w-5xl 2xl:max-w-6xl rounded-2xl shadow-xl overflow-hidden my-auto sm:my-6 flex flex-col max-h-[92vh]">
        
        {/* Header with Back button */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-white sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleBack}
              className="w-9 h-9 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-600 hover:text-slate-900 transition-colors shadow-xs group"
              title={cameFromCreate ? "Back to Billing Form" : "Back"}
            >
              <ArrowLeft size={18} className="group-hover:-translate-x-0.5 transition-transform" />
            </button>
            <div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight leading-tight">INVOICE #{bill.billNumber}</h2>
              <p className="text-xs text-slate-500 font-medium">
                Issued on {new Date(bill.billDate).toLocaleDateString('en-IN')}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto flex-1 bg-slate-50/50 custom-scrollbar">
          {error && <div className="p-3.5 bg-red-50 text-red-700 rounded-xl font-medium text-xs">{error}</div>}

          {/* Quick Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Customer</p>
              <p className="font-bold text-base text-slate-900">{bill.customerName}</p>
              <p className="text-xs font-medium text-slate-500 mt-0.5">📞 {bill.customerPhone}</p>
              {bill.customerEmail && <p className="text-xs text-slate-400">✉️ {bill.customerEmail}</p>}
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Tour Package</p>
              <p className="font-bold text-base text-slate-900">{bill.packageName || 'Custom Tour'}</p>
              <p className="text-xs font-medium text-slate-500 mt-0.5">Date: {bill.travelDate || 'Flexible'}</p>
              <p className="text-xs text-slate-400">{bill.travellers || 1} Travellers</p>
            </div>
            <div className="sm:text-right">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Status</p>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase ${
                bill.paymentStatus === 'PAID' ? 'bg-emerald-100 text-emerald-800' :
                bill.paymentStatus === 'PENDING' ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800'
              }`}>
                {bill.paymentStatus}
              </span>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider border-b pb-2">
              Invoice Items
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs whitespace-nowrap">
                <thead className="text-[11px] font-bold text-slate-400 uppercase bg-slate-50">
                  <tr>
                    <th className="px-4 py-2.5 rounded-l-lg">Description</th>
                    <th className="px-4 py-2.5">Head</th>
                    <th className="px-4 py-2.5">Rate</th>
                    <th className="px-4 py-2.5 text-right rounded-r-lg">Amount</th>
                  </tr>
                </thead>
                <tbody className="font-semibold text-slate-700 divide-y divide-slate-100">
                  {bill.items?.map((item, i) => (
                    <tr key={i}>
                      <td className="px-4 py-3 text-slate-900 font-bold">{item.description}</td>
                      <td className="px-4 py-3">{item.quantity}</td>
                      <td className="px-4 py-3">₹{item.rate.toLocaleString('en-IN')}</td>
                      <td className="px-4 py-3 text-right font-bold">₹{item.amount.toLocaleString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end pt-2">
              <div className="w-72 space-y-1.5 text-xs">
                <div className="flex justify-between font-semibold text-slate-500">
                  <span>Subtotal</span>
                  <span>₹{(bill.subtotal || 0).toLocaleString('en-IN')}</span>
                </div>
                {bill.discount > 0 && (
                  <div className="flex justify-between font-semibold text-slate-500">
                    <span>Discount</span>
                    <span>- ₹{(bill.discount || 0).toLocaleString('en-IN')}</span>
                  </div>
                )}
                {bill.tax > 0 && (
                  <div className="flex justify-between font-semibold text-slate-500">
                    <span>Tax</span>
                    <span>+ ₹{(bill.tax || 0).toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-sm text-slate-900 border-t pt-1.5">
                  <span>TOTAL INVOICE</span>
                  <span className="text-indigo-700 font-extrabold">₹{(bill.totalAmount || 0).toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Summary */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Payment Summary</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
              <div className="pt-2 sm:pt-0">
                <p className="text-[11px] font-bold text-slate-400 uppercase">Total Bill</p>
                <p className="text-xl font-bold text-slate-900 mt-1">₹{bill.totalAmount.toLocaleString('en-IN')}</p>
              </div>
              <div className="pt-2 sm:pt-0">
                <p className="text-[11px] font-bold text-slate-400 uppercase">Total Paid</p>
                <p className="text-xl font-bold text-emerald-600 mt-1">₹{bill.advancePaid.toLocaleString('en-IN')}</p>
              </div>
              <div className="pt-2 sm:pt-0">
                <p className="text-[11px] font-bold text-slate-400 uppercase">Balance Due</p>
                <p className="text-xl font-bold text-orange-600 mt-1">₹{bill.dueAmount.toLocaleString('en-IN')}</p>
              </div>
            </div>
          </div>

          {/* Payment History */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Payment History</h3>
              {bill.dueAmount > 0 && (
                <button
                  onClick={() => openPaymentForm()}
                  className="text-xs font-bold bg-indigo-600 text-white px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-indigo-700 transition-colors"
                >
                  <Plus size={14} /> Add Payment
                </button>
              )}
            </div>

            {/* Embedded Payment Form in View Mode */}
            {showPaymentForm && (
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
                  <h4 className="text-xs font-bold text-slate-800 uppercase">
                    {editingPayment ? 'Edit Payment' : 'Add Payment'}
                  </h4>
                  <span className="text-xs font-semibold text-slate-500">
                    Due: <strong className="text-orange-600">₹{(bill.dueAmount || 0).toLocaleString('en-IN')}</strong>
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <Label required>Amount (₹)</Label>
                    <input
                      type="number"
                      value={paymentForm.amount}
                      onChange={e => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                      className={inp}
                      placeholder="Amount"
                      required
                    />
                  </div>
                  <div>
                    <Label required>Method</Label>
                    <select
                      value={paymentForm.method}
                      onChange={e => setPaymentForm({ ...paymentForm, method: e.target.value })}
                      className={inp}
                    >
                      <option value="UPI">UPI</option>
                      <option value="Cash">Cash</option>
                      <option value="Bank Transfer">Bank Transfer</option>
                      <option value="Card">Card</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <Label required>Date</Label>
                    <input
                      type="date"
                      value={paymentForm.date}
                      onChange={e => setPaymentForm({ ...paymentForm, date: e.target.value })}
                      className={inp}
                      required
                    />
                  </div>
                </div>

                {paymentForm.method === 'UPI' && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-white rounded-lg border border-slate-200">
                    <div>
                      <Label>UPI App</Label>
                      <select
                        value={paymentForm.paymentApp}
                        onChange={e => setPaymentForm({ ...paymentForm, paymentApp: e.target.value })}
                        className={inp}
                      >
                        <option value="Google Pay">Google Pay</option>
                        <option value="PhonePe">PhonePe</option>
                        <option value="Paytm">Paytm</option>
                        <option value="BHIM UPI">BHIM UPI</option>
                        <option value="Other">Other UPI</option>
                      </select>
                    </div>
                    <div>
                      <Label>UPI ID</Label>
                      <input
                        value={paymentForm.upiId}
                        onChange={e => setPaymentForm({ ...paymentForm, upiId: e.target.value })}
                        className={inp}
                        placeholder="customer@upi"
                      />
                    </div>
                    <div>
                      <Label>UTR / Ref</Label>
                      <input
                        value={paymentForm.transactionId}
                        onChange={e => setPaymentForm({ ...paymentForm, transactionId: e.target.value })}
                        className={inp}
                        placeholder="UTR No"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <Label>Notes</Label>
                  <input
                    value={paymentForm.notes}
                    onChange={e => setPaymentForm({ ...paymentForm, notes: e.target.value })}
                    className={inp}
                    placeholder="Notes (optional)"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => { setShowPaymentForm(false); setEditingPayment(null); }}
                    className="py-1.5 px-3 bg-white border border-slate-200 font-semibold rounded-lg text-slate-600 text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={savePayment}
                    disabled={loading}
                    className="py-1.5 px-4 bg-indigo-600 text-white font-semibold rounded-lg text-xs"
                  >
                    Save Payment
                  </button>
                </div>
              </div>
            )}

            {!bill.payments || bill.payments.length === 0 ? (
              <div className="text-center py-4 text-slate-400 font-medium text-xs">
                No payments recorded yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs whitespace-nowrap">
                  <thead className="text-[11px] font-bold text-slate-400 uppercase border-b">
                    <tr>
                      <th className="pb-2 w-24">Date</th>
                      <th className="pb-2 w-28">Method</th>
                      <th className="pb-2">Details</th>
                      <th className="pb-2 font-bold text-slate-900 text-right w-28">Amount</th>
                      <th className="pb-2 text-right w-16">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {bill.payments.map((p, i) => (
                      <tr key={i} className="hover:bg-slate-50 transition-colors">
                        <td className="py-2.5 text-slate-600">{new Date(p.date).toLocaleDateString('en-IN')}</td>
                        <td className="py-2.5">
                          <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold border ${getPaymentMethodBadgeClass(p.method)}`}>
                            {p.method}
                          </span>
                        </td>
                        <td className="py-2.5 text-slate-500">
                          {p.paymentApp && <span className="font-semibold text-slate-700">{p.paymentApp} </span>}
                          {p.transactionId && <span>Ref: {p.transactionId}</span>}
                          {p.notes && <span className="italic"> ({p.notes})</span>}
                        </td>
                        <td className="py-2.5 text-right font-bold text-emerald-600">
                          ₹{p.amount.toLocaleString('en-IN')}
                        </td>
                        <td className="py-2.5 text-right">
                          <div className="flex justify-end gap-1">
                            <button
                              onClick={() => openPaymentForm(p)}
                              className="p-1 text-slate-400 hover:text-indigo-600 rounded"
                            >
                              <Edit2 size={13} />
                            </button>
                            <button
                              onClick={() => deletePayment(p._id)}
                              className="p-1 text-slate-400 hover:text-red-600 rounded"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap justify-between gap-3 pt-4 border-t border-slate-200">
            <button
              onClick={() => setViewMode('edit')}
              className="px-4 py-2 rounded-xl border border-slate-200 font-semibold text-slate-700 hover:bg-slate-50 text-xs flex items-center gap-1.5"
            >
              <Edit2 size={14} /> Edit Invoice
            </button>
            <div className="flex gap-2">
              <a
                href={`${API}/bills/${bill._id}/pdf`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center gap-1.5 transition-colors"
              >
                <FileText size={14} /> PDF
              </a>
              <button
                onClick={() => window.open('/admin/bill/' + bill._id, '_blank')}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <Printer size={14} /> Print Invoice
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
