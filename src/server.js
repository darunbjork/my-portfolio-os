const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
require('dotenv').config();

// const allowedOrigins = [
//   'http://localhost:5173',
//   'http://127.0.0.1:5173',
//   'https://my-portfolio-gr2e.onrender.com',
//   'https://myportfolio-ui.netlify.app'
// ];

const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'https://my-portfolio-gr2e.onrender.com',
  'https://myportfolio-ui.netlify.app'
];

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static('uploads'));

// Health check endpoint (important for Render)
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV 
  });
});

// Basic Root Route
app.get('/', (req, res) => {
  res.send('Welcome to My Production Portfolio OS Backend!');
});

// API Routes
const authRouter = require('./api/auth');
const projectRouter = require('./api/projects');
const infoRouter = require('./api/info');
const profileRouter = require('./api/profile');
const uploadRouter = require('./api/upload'); // New: Upload router

// New: Create uploads directory if it doesn't exist
const fs = require('fs');
const path = require('path');
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/projects', projectRouter);
app.use('/api/v1', infoRouter);
app.use('/api/v1/profile', profileRouter);
app.use('/api/v1/upload', uploadRouter); 

// Database connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
});