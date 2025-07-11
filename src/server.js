const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// CORS Configuration - Allow multiple origins for development and production
const allowedOrigins = [
  'http://localhost:5173', // Frontend development server (Vite default)
  'http://127.0.0.1:5173',  // Alternative localhost
  'http://localhost:3000', // Backend development server
  'http://localhost:3001', // Alternative frontend port
  'https://my-portfolio-gr2e.onrender.com', // Deployed backend URL
  // Add your deployed frontend URL here when you deploy the frontend
  // 'https://your-frontend-name.onrender.com',
  // 'https://your-frontend-name.vercel.app',
  // 'https://your-frontend-name.netlify.app'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, Postman, or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    } else {
      const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
      console.error('CORS Error:', msg);
      return callback(new Error(msg), false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-requested-with'],
  optionsSuccessStatus: 200 // Some legacy browsers (IE11, various SmartTVs) choke on 204
}));

// Parse JSON requests
app.use(express.json());

// Health check endpoint (important for Render)
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    allowedOrigins: process.env.NODE_ENV === 'development' ? allowedOrigins : 'hidden'
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

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/projects', projectRouter);
app.use('/api/v1', infoRouter);

// Database connection with better error handling
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB Connected successfully');
    console.log('Database:', mongoose.connection.name);
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Exit process if database connection fails
  });

// 404 handler for unmatched routes (must be before error handler)
app.use('*', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: `Route ${req.originalUrl} not found`
  });
});

// Import and use the custom error handler middleware (must be last)
const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
  console.log(`Allowed CORS origins:`, allowedOrigins);
});