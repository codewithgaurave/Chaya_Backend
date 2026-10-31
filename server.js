const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to MongoDB Atlas
connectDB();

const app = express();

// Allowed CORS Origins
const allowedOrigins = [
  'https://chaya-admin-panel.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000'
];

// Middleware
app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps, curl, postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    // Agar list me exact match ho ya same domain
    return callback(null, true); // Safely allow all web origins with proper headers
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
}));

// Handle preflight explicitly
app.options('{*path}', cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploads for avatars and documents
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/leads', require('./routes/leadRoutes'));
app.use('/api/checklists', require('./routes/checklistRoutes'));
app.use('/api/history', require('./routes/historyRoutes'));
app.use('/api/enquiries', require('./routes/enquiryRoutes'));

// Root Health Check Route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to International Chaya - Overseas Placement & Visa Processing CRM API',
    status: 'Running',
    version: '1.0.0'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
