require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');

// Import Routes
const authRoutes = require('./routes/authRoutes');
const enquiryRoutes = require('./routes/enquiryRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const packageRoutes = require('./routes/packageRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const settingRoutes = require('./routes/settingRoutes');
const billRoutes = require('./routes/billRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const emailRoutes = require('./routes/emailRoutes');
const customerRoutes = require('./routes/customers');

const app = express();
const PORT = process.env.PORT || 5000;
// Trigger restart to load port 587

// Middleware
// CORS origins: automatically supports Netlify, localhost, and custom domains from FRONTEND_URL
const defaultOrigins = ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'https://bangalir-berano.netlify.app'];
const configuredOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(',').map(o => o.trim().replace(/\/+$/, ''))
  : [];
const allowedOrigins = Array.from(new Set([...defaultOrigins, ...configuredOrigins].filter(Boolean)));

app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json({ limit: '20mb' })); // allow large base64 payloads
app.use(express.urlencoded({ extended: true, limit: '20mb' }));
app.use(cookieParser());

// Connect to MongoDB
connectDB();

// API Routes
app.use('/api/admin', authRoutes);
app.use('/api/enquiries', enquiryRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/packages', packageRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/settings', settingRoutes);
app.use('/api/bills', billRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/email', emailRoutes);
app.use('/api/customers', customerRoutes);

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
