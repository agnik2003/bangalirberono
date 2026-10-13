const nodemailer = require('nodemailer');
const { generateBillPDF } = require('../utils/pdfGenerator');
const Bill = require('../models/Bill');
const InvoiceItem = require('../models/InvoiceItem');
const Payment = require('../models/Payment');

// Send bill via Email
exports.sendBillEmail = async (req, res) => {
  try {
    const { toEmail, bill, billUrl } = req.body;

    if (!toEmail || !bill) {
      return res.json({ success: false, error: 'Email and bill data are required.' });
    }

    // Use credentials from .env
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
    const smtpPort = parseInt(process.env.SMTP_PORT || '587');

    if (!smtpUser || !smtpPass) {
      return res.json({ success: false, error: 'Email credentials not configured. Please add SMTP_USER and SMTP_PASS to your .env file.' });
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: { user: smtpUser, pass: smtpPass },
    });

    const t = parseFloat(bill.totalAmount) || 0;
    const p = parseFloat(bill.advancePaid) || 0;
    const due = parseFloat(bill.dueAmount) || (t - p);
    const status = bill.paymentStatus || (p === 0 ? 'PENDING' : (p >= t && t > 0 ? 'PAID' : 'PARTIALLY PAID'));

    const statusColor = status === 'PAID' ? '#10b981' : (status === 'PENDING' ? '#64748b' : '#f97316');

    const htmlBody = `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:Arial,sans-serif;">
  <div style="max-width:600px;margin:30px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);">
    
    <!-- Header -->
    <div style="background:#1e1b4b;padding:28px 32px;text-align:center;">
      <h1 style="color:#fff;margin:0;font-size:24px;letter-spacing:2px;">BANGALIR BERANO</h1>
      <p style="color:#a5b4fc;margin:6px 0 0;font-size:13px;">Tours and Travels Operator</p>
    </div>

    <!-- Invoice Title -->
    <div style="padding:24px 32px 0;text-align:center;">
      <div style="display:inline-block;border:2px solid #1e1b4b;padding:6px 24px;border-radius:4px;">
        <span style="font-size:14px;font-weight:bold;letter-spacing:3px;color:#1e1b4b;">INVOICE</span>
      </div>
      <p style="color:#64748b;font-size:13px;margin:12px 0 0;">Bill No: <strong style="color:#1e1b4b;">${bill.billNumber}</strong> &nbsp;|&nbsp; Date: <strong>${new Date(bill.billDate).toLocaleDateString('en-IN')}</strong></p>
    </div>

    <!-- Customer Info -->
    <div style="padding:20px 32px;">
      <table style="width:100%;border-collapse:collapse;">
        <tr>
          <td style="padding:8px 0;vertical-align:top;width:50%;">
            <p style="margin:0;font-size:11px;color:#94a3b8;text-transform:uppercase;font-weight:bold;letter-spacing:1px;">BILLED TO</p>
            <p style="margin:6px 0 2px;font-size:16px;font-weight:bold;color:#0f172a;">${bill.customerName}</p>
            <p style="margin:0;font-size:13px;color:#475569;">${bill.customerPhone || ''}</p>
            ${bill.customerEmail ? `<p style="margin:0;font-size:13px;color:#475569;">${bill.customerEmail}</p>` : ''}
          </td>
          <td style="padding:8px 0;vertical-align:top;text-align:right;">
            <p style="margin:0;font-size:11px;color:#94a3b8;text-transform:uppercase;font-weight:bold;letter-spacing:1px;">TOUR PACKAGE</p>
            <p style="margin:6px 0 2px;font-size:14px;font-weight:bold;color:#3730a3;">${bill.packageName || 'N/A'}</p>
            <p style="margin:0;font-size:13px;color:#475569;">Travel: ${bill.travelDate || 'Flexible'}</p>
            <p style="margin:0;font-size:13px;color:#475569;">Pax: ${bill.travellers || 1}</p>
          </td>
        </tr>
      </table>
    </div>

    <!-- Bill Items Table -->
    <div style="padding:0 32px;">
      <table style="width:100%;border-collapse:collapse;border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;">
        <thead>
          <tr style="background:#f8fafc;">
            <th style="padding:10px 14px;text-align:left;font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:1px;border-bottom:1px solid #e2e8f0;">Description</th>
            <th style="padding:10px 14px;text-align:center;font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:1px;border-bottom:1px solid #e2e8f0;width:60px;">Qty</th>
            <th style="padding:10px 14px;text-align:right;font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:1px;border-bottom:1px solid #e2e8f0;width:100px;">Rate</th>
            <th style="padding:10px 14px;text-align:right;font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:1px;border-bottom:1px solid #e2e8f0;width:100px;">Amount</th>
          </tr>
        </thead>
        <tbody>
          ${(bill.items && bill.items.length > 0 ? bill.items : [{ description: bill.packageName || 'Tour Package', quantity: bill.travellers || 1, rate: 0, amount: t }]).map(item => `
          <tr>
            <td style="padding:10px 14px;font-size:13px;color:#1e293b;border-bottom:1px solid #f1f5f9;font-weight:600;">${item.description}</td>
            <td style="padding:10px 14px;font-size:13px;color:#475569;border-bottom:1px solid #f1f5f9;text-align:center;">${item.quantity}</td>
            <td style="padding:10px 14px;font-size:13px;color:#475569;border-bottom:1px solid #f1f5f9;text-align:right;">₹${(parseFloat(item.rate) || 0).toLocaleString('en-IN')}</td>
            <td style="padding:10px 14px;font-size:13px;color:#1e293b;border-bottom:1px solid #f1f5f9;text-align:right;font-weight:bold;">₹${(parseFloat(item.amount) || 0).toLocaleString('en-IN')}</td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>

    <!-- Summary -->
    <div style="padding:16px 32px 0;text-align:right;">
      <table style="margin-left:auto;width:260px;border-collapse:collapse;">
        <tr><td style="padding:5px 0;font-size:13px;color:#64748b;">Subtotal:</td><td style="padding:5px 0;font-size:13px;text-align:right;font-weight:600;color:#1e293b;">₹${(parseFloat(bill.subtotal) || t).toLocaleString('en-IN')}</td></tr>
        ${(parseFloat(bill.discount) || 0) > 0 ? `<tr><td style="padding:5px 0;font-size:13px;color:#64748b;">Discount:</td><td style="padding:5px 0;font-size:13px;text-align:right;color:#10b981;">- ₹${(parseFloat(bill.discount) || 0).toLocaleString('en-IN')}</td></tr>` : ''}
        ${(parseFloat(bill.tax) || 0) > 0 ? `<tr><td style="padding:5px 0;font-size:13px;color:#64748b;">Tax:</td><td style="padding:5px 0;font-size:13px;text-align:right;color:#1e293b;">+ ₹${(parseFloat(bill.tax) || 0).toLocaleString('en-IN')}</td></tr>` : ''}
        <tr style="border-top:2px solid #1e1b4b;"><td style="padding:10px 0 5px;font-size:15px;font-weight:bold;color:#1e1b4b;">Total Bill:</td><td style="padding:10px 0 5px;font-size:15px;font-weight:bold;text-align:right;color:#1e1b4b;">₹${t.toLocaleString('en-IN')}</td></tr>
        <tr><td style="padding:4px 0;font-size:13px;color:#10b981;font-weight:bold;">Amount Paid:</td><td style="padding:4px 0;font-size:13px;text-align:right;color:#10b981;font-weight:bold;">₹${p.toLocaleString('en-IN')}</td></tr>
        <tr style="background:#fef3c7;"><td style="padding:8px;font-size:14px;font-weight:bold;color:#1e1b4b;">Balance Due:</td><td style="padding:8px;font-size:14px;font-weight:bold;text-align:right;color:#1e1b4b;">₹${due.toLocaleString('en-IN')}</td></tr>
      </table>
    </div>

    <!-- Status Badge -->
    <div style="padding:16px 32px;text-align:right;">
      <span style="display:inline-block;background:${statusColor}20;color:${statusColor};padding:4px 16px;border-radius:99px;font-size:12px;font-weight:bold;letter-spacing:1px;">${status}</span>
    </div>

    <!-- PDF note -->
    <div style="padding:0 32px 20px;text-align:center;">
      <div style="display:inline-block;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:12px 24px;">
        <p style="margin:0;color:#166534;font-size:14px;font-weight:bold;">📎 Invoice PDF attached to this email</p>
        <p style="margin:4px 0 0;color:#15803d;font-size:12px;">Please find your detailed invoice attached as a PDF file.</p>
      </div>
    </div>

    <!-- Footer -->
    <div style="background:#f8fafc;padding:20px 32px;border-top:1px solid #e2e8f0;text-align:center;">
      <p style="margin:0 0 6px;font-size:13px;color:#475569;">For any queries, please contact us:</p>
      <p style="margin:0;font-size:13px;font-weight:bold;color:#1e1b4b;">📞 +91 9830053647 &nbsp;|&nbsp; ✉️ contact@bangalirberano.com</p>
      <p style="margin:10px 0 0;font-size:11px;color:#94a3b8;">42, B G G Sarani, Radha Neel Nibas-II, Bhadrakali, Uttarpara, Hooghly, WB - 712232.<br/>Land Mark : Near Bhadrakali Youth Core Club.</p>
      <p style="margin:8px 0 0;font-size:11px;color:#94a3b8;">Thank you for choosing Bangalir Berano! 🌟</p>
    </div>
  </div>
</body>
</html>`;

    // Generate PDF
    let pdfBuffer = null;
    try {
      const clientUrl = req.body.clientUrl || process.env.FRONTEND_URL || 'http://localhost:5173';
      const billDoc = await Bill.findById(bill._id);
      if (billDoc) {
        const items = await InvoiceItem.find({ billId: billDoc._id });
        const payments = await Payment.find({ billId: billDoc._id }).sort({ date: -1 });
        const fullBillData = { ...billDoc.toObject(), items, payments };
        pdfBuffer = await generateBillPDF(fullBillData, clientUrl);
      } else {
        pdfBuffer = await generateBillPDF(bill, clientUrl);
      }
    } catch (pdfErr) {
      console.warn('PDF generation failed, sending without attachment:', pdfErr.message);
    }

    const mailOptions = {
      from: `"Bangalir Berano" <${smtpUser}>`,
      to: toEmail,
      subject: `Your Invoice ${bill.billNumber} from Bangalir Berano`,
      html: htmlBody,
    };

    if (pdfBuffer) {
      mailOptions.attachments = [{
        filename: `Invoice_${bill.billNumber}.pdf`,
        content: pdfBuffer,
        contentType: 'application/pdf',
      }];
    }

    await transporter.sendMail(mailOptions);

    res.json({ success: true, message: 'Email sent successfully!' });
  } catch (err) {
    console.error('Email error:', err);
    res.json({ success: false, error: err.message || 'Failed to send email.' });
  }
};

exports.sendCustomerEmail = async (req, res) => {
  try {
    const { toEmail, subject, messageBody } = req.body;

    if (!toEmail || !messageBody) {
      return res.json({ success: false, error: 'Email and message are required.' });
    }

    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
    const smtpPort = parseInt(process.env.SMTP_PORT || '587');

    if (!smtpUser || !smtpPass) {
      return res.json({ success: false, error: 'Email credentials not configured.' });
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: { user: smtpUser, pass: smtpPass },
    });

    const htmlMessage = messageBody.replace(/\n/g, '<br>');

    const htmlBody = `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:Arial,sans-serif;">
  <div style="max-width:600px;margin:30px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);">
    
    <!-- Header -->
    <div style="background:#1e1b4b;padding:28px 32px;text-align:center;">
      <h1 style="color:#fff;margin:0;font-size:24px;letter-spacing:2px;">BANGALIR BERANO</h1>
      <p style="color:#a5b4fc;margin:6px 0 0;font-size:13px;">Tours and Travels Operator</p>
    </div>

    <!-- Message Body -->
    <div style="padding:30px 32px; color:#1e293b; font-size:15px; line-height:1.6;">
      ${htmlMessage}
    </div>

    <!-- Footer -->
    <div style="background:#f8fafc;padding:20px 32px;border-top:1px solid #e2e8f0;text-align:center;">
      <p style="margin:0 0 6px;font-size:13px;color:#475569;">For any queries, please contact us:</p>
      <p style="margin:0;font-size:13px;font-weight:bold;color:#1e1b4b;">📞 +91 9830053647 &nbsp;|&nbsp; ✉️ contact@bangalirberano.com</p>
      <p style="margin:10px 0 0;font-size:11px;color:#94a3b8;">42, B G G Sarani, Radha Neel Nibas-II, Bhadrakali, Uttarpara, Hooghly, WB - 712232.<br/>Land Mark : Near Bhadrakali Youth Core Club.</p>
      <p style="margin:8px 0 0;font-size:11px;color:#94a3b8;">Thank you for choosing Bangalir Berano! 🌟</p>
    </div>
  </div>
</body>
</html>`;

    const mailOptions = {
      from: `"Bangalir Berano" <${smtpUser}>`,
      to: toEmail,
      subject: subject || 'Message from Bangalir Berano',
      html: htmlBody,
    };

    await transporter.sendMail(mailOptions);

    res.json({ success: true, message: 'Email sent successfully!' });
  } catch (err) {
    console.error('Customer email error:', err);
    res.json({ success: false, error: err.message || 'Failed to send email.' });
  }
};
