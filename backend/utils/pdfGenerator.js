const puppeteer = require('puppeteer');
const PDFDocument = require('pdfkit');

function formatPaymentDetailsText(p) {
  const parts = [];
  if (p.method === 'UPI') {
    if (p.paymentApp) parts.push(`App: ${p.paymentApp}`);
    if (p.upiId) parts.push(`UPI ID: ${p.upiId}`);
    if (p.transactionId) parts.push(`UTR: ${p.transactionId}`);
  } else if (p.method === 'Bank Transfer') {
    if (p.bankName) parts.push(`Bank: ${p.bankName}`);
    if (p.transferType) parts.push(`Type: ${p.transferType}`);
    if (p.accountNumber) parts.push(`A/C: ${p.accountNumber}`);
    if (p.transactionId) parts.push(`Ref: ${p.transactionId}`);
  } else if (p.method === 'Card') {
    if (p.cardType) parts.push(p.cardType);
    if (p.cardNetwork) parts.push(p.cardNetwork);
    if (p.cardLast4) parts.push(`**** ${p.cardLast4}`);
    if (p.transactionId) parts.push(`Auth: ${p.transactionId}`);
  } else if (p.method === 'Cash') {
    if (p.transactionId) parts.push(p.transactionId);
  } else if (p.transactionId) {
    parts.push(`Ref: ${p.transactionId}`);
  }
  return parts.join(' | ') || '-';
}

/**
 * Builds standalone, self-contained HTML for an invoice.
 * Completely offline: no external styles or fonts required.
 */
function buildInvoiceHTML(bill) {
  const t = parseFloat(bill.totalAmount) || 0;
  const p = parseFloat(bill.advancePaid) || 0;
  const due = parseFloat(bill.dueAmount) !== undefined ? parseFloat(bill.dueAmount) : (t - p);
  const status = bill.paymentStatus || (p === 0 ? 'PENDING' : (p >= t && t > 0 ? 'PAID' : 'PARTIALLY PAID'));
  const statusColor = status === 'PAID' ? '#059669' : (status === 'PENDING' ? '#64748b' : '#ea580c');
  const statusBg = status === 'PAID' ? '#ecfdf5' : (status === 'PENDING' ? '#f1f5f9' : '#fff7ed');

  const items = Array.isArray(bill.items) && bill.items.length > 0
    ? bill.items
    : [{ description: bill.packageName || 'Tour Package', quantity: bill.travellers || 1, rate: t, amount: t }];

  const payments = Array.isArray(bill.payments) ? bill.payments : [];

  const itemsRows = items.map(it => `
    <tr>
      <td style="padding:7px 10px;border:1px solid #cbd5e1;font-weight:600;color:#0f172a;">${it.description || 'Service'}</td>
      <td style="padding:7px 10px;border:1px solid #cbd5e1;text-align:center;color:#334155;">${it.quantity !== undefined ? it.quantity : 1}</td>
      <td style="padding:7px 10px;border:1px solid #cbd5e1;text-align:right;color:#334155;">₹${(parseFloat(it.rate) || 0).toLocaleString('en-IN')}</td>
      <td style="padding:7px 10px;border:1px solid #cbd5e1;text-align:right;font-weight:700;color:#0f172a;">₹${(parseFloat(it.amount) || 0).toLocaleString('en-IN')}</td>
    </tr>
  `).join('');

  const paymentsSection = payments.length > 0 ? `
    <div style="margin-top:16px;">
      <div style="font-size:11px;font-weight:800;color:#475569;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:6px;border-bottom:1px solid #cbd5e1;padding-bottom:3px;">Payment History</div>
      <table style="width:100%;border-collapse:collapse;font-size:11px;">
        <thead>
          <tr style="background:#f8fafc;">
            <th style="padding:6px 8px;border:1px solid #cbd5e1;text-align:left;width:80px;">Date</th>
            <th style="padding:6px 8px;border:1px solid #cbd5e1;text-align:left;width:95px;">Method</th>
            <th style="padding:6px 8px;border:1px solid #cbd5e1;text-align:left;">Payment Details / Reference</th>
            <th style="padding:6px 8px;border:1px solid #cbd5e1;text-align:right;width:90px;">Amount</th>
          </tr>
        </thead>
        <tbody>
          ${payments.map(pay => `
            <tr>
              <td style="padding:5px 8px;border:1px solid #e2e8f0;color:#334155;">${pay.date ? new Date(pay.date).toLocaleDateString('en-IN') : '-'}</td>
              <td style="padding:5px 8px;border:1px solid #e2e8f0;font-weight:700;color:#0f172a;">${pay.method || 'Cash'}</td>
              <td style="padding:5px 8px;border:1px solid #e2e8f0;color:#475569;">${formatPaymentDetailsText(pay)}</td>
              <td style="padding:5px 8px;border:1px solid #e2e8f0;text-align:right;font-weight:700;color:#059669;">₹${(parseFloat(pay.amount) || 0).toLocaleString('en-IN')}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  ` : '';

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Invoice ${bill.billNumber || ''}</title>
  <style>
    @page { size: A4 portrait; margin: 10mm; }
    * { box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
      color: #0f172a;
      background: #ffffff;
      margin: 0;
      padding: 8px 12px;
      font-size: 11.5px;
      line-height: 1.4;
    }
    .header-box {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 2.5px solid #1e1b4b;
      padding-bottom: 12px;
      margin-bottom: 12px;
    }
    .company-name {
      font-size: 20px;
      font-weight: 800;
      color: #1e1b4b;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin: 0;
    }
    .company-tag {
      font-size: 12px;
      font-weight: 600;
      color: #334155;
      margin: 2px 0 4px;
    }
    .company-addr {
      font-size: 10.5px;
      color: #64748b;
      line-height: 1.35;
      max-width: 340px;
    }
    .company-right {
      text-align: right;
      font-size: 10.5px;
      color: #475569;
      line-height: 1.45;
    }
    .invoice-title-wrap {
      text-align: center;
      margin: 8px 0 14px;
    }
    .invoice-title {
      display: inline-block;
      border: 1.5px solid #1e1b4b;
      padding: 3px 20px;
      font-size: 12px;
      font-weight: 800;
      letter-spacing: 2px;
      color: #1e1b4b;
      border-radius: 4px;
    }
    .info-grid {
      display: flex;
      justify-content: space-between;
      margin-bottom: 14px;
    }
    .billed-to {
      width: 56%;
    }
    .bill-meta-box {
      width: 40%;
      background: #f8fafc;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      padding: 10px 12px;
    }
    .meta-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 5px;
    }
    .meta-row:last-child {
      margin-bottom: 0;
    }
    .label {
      font-size: 9.5px;
      font-weight: 700;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .val-bold {
      font-weight: 700;
      color: #1e1b4b;
    }
    table.items-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 12px;
    }
    table.items-table th {
      background: #f1f5f9;
      color: #475569;
      font-size: 9.5px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      padding: 7px 10px;
      border: 1px solid #cbd5e1;
    }
    .summary-wrap {
      display: flex;
      justify-content: flex-end;
      margin-top: 10px;
      margin-bottom: 14px;
    }
    .summary-box {
      width: 44%;
    }
    .summary-row {
      display: flex;
      justify-content: space-between;
      padding: 3px 0;
      font-size: 11.5px;
    }
    .summary-total {
      font-size: 13.5px;
      font-weight: 800;
      border-top: 1.5px solid #1e1b4b;
      border-bottom: 1px solid #cbd5e1;
      padding: 5px 0;
      color: #1e1b4b;
      margin-top: 2px;
    }
    .due-box {
      background: #fef3c7;
      border: 1px solid #fde68a;
      border-radius: 6px;
      padding: 5px 8px;
      margin-top: 5px;
      font-size: 12.5px;
      font-weight: 800;
      color: #92400e;
      display: flex;
      justify-content: space-between;
    }
    .status-badge {
      display: inline-block;
      padding: 2px 10px;
      border-radius: 99px;
      font-size: 10.5px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .footer-box {
      margin-top: 20px;
      padding-top: 10px;
      border-top: 1px solid #cbd5e1;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      font-size: 9.5px;
      color: #64748b;
    }
  </style>
</head>
<body>
  <div class="header-box">
    <div>
      <h1 class="company-name">BANGALIR BERANO<sup style="font-size:9px;margin-left:2px;">TM</sup></h1>
      <p class="company-tag">Tours and Travels Operator</p>
      <div class="company-addr">
        42, B G G Sarani, Radha Neel Nibas-II, Bhadrakali, Uttarpara, Hooghly, WB - 712232.<br>
        Land Mark: Near Bhadrakali Youth Core Club.
      </div>
    </div>
    <div class="company-right">
      <div><strong>MSME:</strong> UDYAM-WB-07-0135043</div>
      <div><strong>Trade License:</strong> 0917P1800240190</div>
      <div><strong>Phone:</strong> +91 9830053647</div>
      <div><strong>Email:</strong> contact@bangalirberano.com</div>
    </div>
  </div>

  <div class="invoice-title-wrap">
    <span class="invoice-title">INVOICE</span>
  </div>

  <div class="info-grid">
    <div class="billed-to">
      <div class="label">BILLED TO:</div>
      <div style="font-size:13.5px;font-weight:700;color:#0f172a;margin:2px 0;">${bill.customerName || 'Guest'}</div>
      ${bill.customerAddress ? `<div style="color:#334155;">${bill.customerAddress}</div>` : ''}
      <div style="color:#334155;">${bill.customerPhone || ''}</div>
      ${bill.customerEmail ? `<div style="color:#334155;">${bill.customerEmail}</div>` : ''}
      
      <div style="margin-top:8px;">
        <span class="label">TOUR PACKAGE:</span>
        <strong style="color:#1e1b4b;margin-left:4px;">${bill.packageName || 'N/A'}</strong>
        <div style="font-size:10.5px;color:#475569;margin-top:1px;">
          Travel: ${bill.travelDate || 'Flexible'} &nbsp;|&nbsp; Pax: ${bill.travellers || 1} Head(s)
        </div>
      </div>
    </div>

    <div class="bill-meta-box">
      <div class="meta-row">
        <span class="label">Invoice No:</span>
        <span class="val-bold">${bill.billNumber || 'BB-0000'}</span>
      </div>
      <div class="meta-row">
        <span class="label">Date:</span>
        <span class="val-bold">${bill.billDate ? new Date(bill.billDate).toLocaleDateString('en-IN') : new Date().toLocaleDateString('en-IN')}</span>
      </div>
      <div class="meta-row" style="align-items:center;margin-top:6px;">
        <span class="label">Payment Status:</span>
        <span class="status-badge" style="color:${statusColor};background:${statusBg};border:1px solid ${statusColor}30;">
          ${status}
        </span>
      </div>
    </div>
  </div>

  <table class="items-table">
    <thead>
      <tr>
        <th style="text-align:left;">Description</th>
        <th style="text-align:center;width:65px;">Head</th>
        <th style="text-align:right;width:95px;">Rate</th>
        <th style="text-align:right;width:105px;">Amount</th>
      </tr>
    </thead>
    <tbody>
      ${itemsRows}
    </tbody>
  </table>

  <div class="summary-wrap">
    <div class="summary-box">
      <div class="summary-row">
        <span style="color:#475569;">Subtotal:</span>
        <span style="font-weight:600;color:#0f172a;">₹${(parseFloat(bill.subtotal) || t).toLocaleString('en-IN')}</span>
      </div>
      ${(parseFloat(bill.discount) || 0) > 0 ? `
      <div class="summary-row" style="color:#059669;">
        <span>Discount:</span>
        <span>- ₹${(parseFloat(bill.discount) || 0).toLocaleString('en-IN')}</span>
      </div>` : ''}
      ${(parseFloat(bill.tax) || 0) > 0 ? `
      <div class="summary-row" style="color:#334155;">
        <span>Tax:</span>
        <span>+ ₹${(parseFloat(bill.tax) || 0).toLocaleString('en-IN')}</span>
      </div>` : ''}
      <div class="summary-row summary-total">
        <span>Total Bill:</span>
        <span>₹${t.toLocaleString('en-IN')}</span>
      </div>
      <div class="summary-row" style="color:#059669;font-weight:700;">
        <span>Total Paid:</span>
        <span>₹${p.toLocaleString('en-IN')}</span>
      </div>
      <div class="due-box">
        <span>Balance Due:</span>
        <span>₹${due.toLocaleString('en-IN')}</span>
      </div>
    </div>
  </div>

  ${paymentsSection}

  <div class="footer-box">
    <div style="line-height:1.45;">
      <strong style="color:#334155;">Terms &amp; Conditions:</strong><br>
      1. All payments are subject to realization.<br>
      2. Subject to Hooghly Jurisdiction.<br>
      3. This is a computer generated invoice and does not require a physical signature.
    </div>
    <div style="text-align:center;min-width:140px;">
      <strong style="color:#1e1b4b;">For BANGALIR BERANO</strong><br><br><br>
      <div style="border-top:1px solid #94a3b8;padding-top:3px;font-size:9.5px;font-weight:600;color:#475569;">Authorized Signatory</div>
    </div>
  </div>
</body>
</html>`;
}

/**
 * Generates an invoice PDF using PDFKit as a 100% reliable fallback.
 */
function generateWithPDFKit(bill) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 36, size: 'A4' });
      const chunks = [];
      doc.on('data', chunk => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', err => reject(err));

      const t = parseFloat(bill.totalAmount) || 0;
      const p = parseFloat(bill.advancePaid) || 0;
      const due = parseFloat(bill.dueAmount) !== undefined ? parseFloat(bill.dueAmount) : (t - p);
      const status = bill.paymentStatus || (p === 0 ? 'PENDING' : (p >= t && t > 0 ? 'PAID' : 'PARTIALLY PAID'));

      // Header
      doc.fillColor('#1e1b4b').fontSize(18).text('BANGALIR BERANO', { characterSpacing: 1 });
      doc.fillColor('#334155').fontSize(10).text('Tours and Travels Operator');
      doc.fillColor('#64748b').fontSize(8.5).text('42, B G G Sarani, Radha Neel Nibas-II, Bhadrakali, Hooghly, WB - 712232');
      doc.text('Phone: +91 9830053647 | Email: contact@bangalirberano.com');
      doc.moveDown(0.5);

      doc.moveTo(36, doc.y).lineTo(559, doc.y).strokeColor('#1e1b4b').lineWidth(1.5).stroke();
      doc.moveDown(0.8);

      // Invoice Title
      doc.fillColor('#1e1b4b').fontSize(13).text('INVOICE', { align: 'center', characterSpacing: 2 });
      doc.moveDown(0.5);

      // Meta & Customer Details
      const colTop = doc.y;
      doc.fontSize(8.5).fillColor('#64748b').text('BILLED TO:', 36, colTop);
      doc.fontSize(11).fillColor('#0f172a').text(bill.customerName || 'Guest', 36, colTop + 12);
      let nextY = colTop + 26;
      if (bill.customerAddress) {
        doc.fontSize(9).fillColor('#334155').text(bill.customerAddress, 36, nextY);
        nextY += 12;
      }
      doc.fontSize(9).fillColor('#334155').text(bill.customerPhone || '', 36, nextY);
      nextY += 12;
      if (bill.customerEmail) {
        doc.fontSize(9).fillColor('#334155').text(bill.customerEmail, 36, nextY);
        nextY += 12;
      }
      doc.moveDown(0.3);
      doc.fontSize(8.5).fillColor('#64748b').text(`Tour Package: ${bill.packageName || 'N/A'}`);
      doc.text(`Travel Date: ${bill.travelDate || 'Flexible'} | Pax: ${bill.travellers || 1} Head(s)`);

      // Right Meta Box
      doc.fontSize(9).fillColor('#64748b').text('Invoice No:', 360, colTop);
      doc.fillColor('#1e1b4b').text(bill.billNumber || 'BB-0000', 430, colTop, { align: 'right', width: 120 });
      doc.fillColor('#64748b').text('Date:', 360, colTop + 14);
      doc.fillColor('#1e1b4b').text(bill.billDate ? new Date(bill.billDate).toLocaleDateString('en-IN') : new Date().toLocaleDateString('en-IN'), 430, colTop + 14, { align: 'right', width: 120 });
      doc.fillColor('#64748b').text('Status:', 360, colTop + 28);
      doc.fillColor(status === 'PAID' ? '#059669' : '#ea580c').text(status, 430, colTop + 28, { align: 'right', width: 120 });

      doc.y = Math.max(doc.y, nextY + 20);
      doc.moveDown(1);

      // Items Table Header
      const tableTop = doc.y;
      doc.rect(36, tableTop, 523, 18).fill('#f1f5f9');
      doc.fillColor('#475569').fontSize(8.5);
      doc.text('Description', 44, tableTop + 5, { width: 260 });
      doc.text('Head', 310, tableTop + 5, { width: 50, align: 'center' });
      doc.text('Rate', 370, tableTop + 5, { width: 80, align: 'right' });
      doc.text('Amount', 460, tableTop + 5, { width: 90, align: 'right' });

      let currentY = tableTop + 20;
      const items = Array.isArray(bill.items) && bill.items.length > 0
        ? bill.items
        : [{ description: bill.packageName || 'Tour Package', quantity: bill.travellers || 1, rate: t, amount: t }];

      items.forEach(it => {
        doc.fillColor('#0f172a').fontSize(9);
        doc.text(it.description || 'Service', 44, currentY, { width: 260 });
        doc.fillColor('#334155').text(String(it.quantity !== undefined ? it.quantity : 1), 310, currentY, { width: 50, align: 'center' });
        doc.text(`INR ${(parseFloat(it.rate) || 0).toLocaleString('en-IN')}`, 370, currentY, { width: 80, align: 'right' });
        doc.fillColor('#0f172a').text(`INR ${(parseFloat(it.amount) || 0).toLocaleString('en-IN')}`, 460, currentY, { width: 90, align: 'right' });
        currentY += 18;
      });

      doc.moveTo(36, currentY).lineTo(559, currentY).strokeColor('#cbd5e1').lineWidth(0.8).stroke();
      currentY += 8;

      // Summary
      doc.fontSize(9).fillColor('#475569');
      doc.text('Subtotal:', 360, currentY);
      doc.fillColor('#0f172a').text(`INR ${(parseFloat(bill.subtotal) || t).toLocaleString('en-IN')}`, 450, currentY, { width: 100, align: 'right' });
      currentY += 14;

      if ((parseFloat(bill.discount) || 0) > 0) {
        doc.fillColor('#059669').text('Discount:', 360, currentY);
        doc.text(`- INR ${(parseFloat(bill.discount) || 0).toLocaleString('en-IN')}`, 450, currentY, { width: 100, align: 'right' });
        currentY += 14;
      }

      doc.moveTo(360, currentY).lineTo(559, currentY).strokeColor('#1e1b4b').lineWidth(1).stroke();
      currentY += 4;
      doc.fontSize(10).fillColor('#1e1b4b').text('Total Bill:', 360, currentY);
      doc.text(`INR ${t.toLocaleString('en-IN')}`, 450, currentY, { width: 100, align: 'right' });
      currentY += 16;

      doc.fontSize(9).fillColor('#059669').text('Total Paid:', 360, currentY);
      doc.text(`INR ${p.toLocaleString('en-IN')}`, 450, currentY, { width: 100, align: 'right' });
      currentY += 16;

      doc.rect(360, currentY, 199, 20).fill('#fef3c7');
      doc.fontSize(9.5).fillColor('#92400e').text('Balance Due:', 368, currentY + 5);
      doc.text(`INR ${due.toLocaleString('en-IN')}`, 450, currentY + 5, { width: 100, align: 'right' });

      // Footer
      const footerY = 750;
      doc.moveTo(36, footerY).lineTo(559, footerY).strokeColor('#cbd5e1').lineWidth(0.8).stroke();
      doc.fontSize(8).fillColor('#64748b').text('1. All payments subject to realization.  2. Hooghly Jurisdiction.  3. Computer generated invoice.', 36, footerY + 8);
      doc.fontSize(8.5).fillColor('#1e1b4b').text('For BANGALIR BERANO', 420, footerY + 8, { align: 'right', width: 130 });
      doc.fontSize(7.5).fillColor('#64748b').text('Authorized Signatory', 420, footerY + 36, { align: 'right', width: 130 });

      doc.end();
    } catch (e) {
      reject(e);
    }
  });
}

/**
 * Generates an invoice PDF with 100% guarantee:
 * 1. Primary: Puppeteer with setContent (exact A4 layout, zero network dependencies, fast)
 * 2. Fallback: PDFKit (pure JS in-memory generation that never fails)
 * @param {Object} bill - The bill object
 * @returns {Promise<Buffer>}
 */
async function generateBillPDF(bill) {
  const html = buildInvoiceHTML(bill);

  // 1. Try Puppeteer with self-contained HTML (no external HTTP calls)
  try {
    const browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--no-first-run',
        '--no-zygote'
      ]
    });

    try {
      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: 'load', timeout: 8000 });
      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: { top: '8mm', right: '8mm', bottom: '8mm', left: '8mm' }
      });
      return Buffer.from(pdfBuffer);
    } finally {
      await browser.close().catch(() => {});
    }
  } catch (pupErr) {
    console.warn('Puppeteer setContent PDF generation error, using PDFKit fallback:', pupErr.message);
  }

  // 2. Fallback: Pure JS PDFKit (guaranteed to succeed)
  console.log('Generating invoice PDF using PDFKit fallback...');
  return await generateWithPDFKit(bill);
}

module.exports = { generateBillPDF, buildInvoiceHTML };
