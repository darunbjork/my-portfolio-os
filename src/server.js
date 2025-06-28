// src/server.js

const express = require('express');
const config = require('./config');
const securityMiddleware = require('./middleware/security');
const errorHandler = require('./middleware/errorHandler');
const healthCheckRouter = require('./api/healthCheck'); 
const connectDB = require('./db/connect'); // Import our database connection module

// Create an Express application instance
const app = express();

// --- Database Connection ---
// Why: We connect to the database *before* starting the server.
// If the database is not available, the server should not start.
connectDB();

// --- Global Middleware Setup ---
app.use(securityMiddleware);
app.use(express.json());

// --- Routes ---
app.use('/health', healthCheckRouter);

// Basic Route (for demonstration)
app.get('/', (req, res) => {
  res.send('Hello World from My Production Portfolio OS!');
});

// --- Error Handling Middleware ---
app.use(errorHandler);

// --- Server Start ---
const PORT = config.port;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} in ${config.env} environment`);
  console.log(`Access it at: http://localhost:${PORT}`);
});