/**
 * Payment utility helper for Bangalir Berano
 * Handles formatted display of payment details across Bill views and Print/PDF invoices.
 */

/**
 * Returns a clean, professional single-line text summary of payment details for print invoices and PDFs.
 * @param {Object} payment
 * @returns {string}
 */
export function formatPaymentDetailsText(payment) {
  if (!payment) return '-';
  const method = payment.method || 'Other';
  const parts = [];

  if (method === 'UPI') {
    if (payment.paymentApp) parts.push(payment.paymentApp);
    if (payment.upiId) parts.push(`UPI ID: ${payment.upiId}`);
    if (payment.transactionId) parts.push(`UTR/Txn: ${payment.transactionId}`);
  } else if (method === 'Bank Transfer') {
    const bankDetails = [
      payment.bankName,
      payment.transferType ? `(${payment.transferType})` : ''
    ].filter(Boolean).join(' ');

    if (bankDetails) parts.push(bankDetails);
    if (payment.accountNumber) parts.push(`A/C: ${payment.accountNumber}`);
    if (payment.transactionId) parts.push(`Ref/UTR: ${payment.transactionId}`);
  } else if (method === 'Card') {
    const cardInfo = [payment.cardNetwork, payment.cardType || 'Card'].filter(Boolean).join(' ');
    const cardDigits = payment.cardLast4 ? `(•••• ${payment.cardLast4})` : '';
    const fullCard = [cardInfo, cardDigits].filter(Boolean).join(' ');
    if (fullCard) parts.push(fullCard);
    if (payment.transactionId) parts.push(`Auth/Txn: ${payment.transactionId}`);
  } else if (method === 'Cash') {
    parts.push('Cash Payment');
  } else {
    if (payment.transactionId) parts.push(`Ref: ${payment.transactionId}`);
  }

  // Graceful fallback for legacy records where only transactionId was saved
  if (parts.length === 0 && payment.transactionId) {
    parts.push(payment.transactionId);
  }

  if (payment.notes && payment.notes.trim()) {
    parts.push(`Note: ${payment.notes.trim()}`);
  }

  return parts.length > 0 ? parts.join(' | ') : '-';
}

/**
 * Returns badge CSS classes based on payment method.
 * @param {string} method 
 * @returns {string}
 */
export function getPaymentMethodBadgeClass(method) {
  switch (method) {
    case 'UPI':
      return 'bg-indigo-100 text-indigo-700 border-indigo-200';
    case 'Bank Transfer':
      return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'Card':
      return 'bg-purple-100 text-purple-700 border-purple-200';
    case 'Cash':
      return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    default:
      return 'bg-slate-100 text-slate-700 border-slate-200';
  }
}
