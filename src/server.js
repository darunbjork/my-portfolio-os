// src/server.js

const express = require('express');
const config = require('./config');
const securityMiddleware = require('./middleware/security');
const errorHandler = require('./middleware/errorHandler');
const healthCheckRouter = require('./api/healthCheck');
const authRouter = require('./api/auth'); // Import our new authentication router
const { protect } = require('./middleware/auth'); // Import the protect middleware
const connectDB = require('./db/connect');

const app = express();

// --- Database Connection ---
connectDB();

// --- Global Middleware Setup ---
app.use(securityMiddleware);
app.use(express.json());

// --- Routes ---
// Why: We're using versioning (`/api/v1`) for our API routes.
// This is a best practice that allows for a smooth transition to a new API version
// in the future without breaking existing clients.
app.use('/health', healthCheckRouter);
app.use('/api/v1/auth', authRouter); // Mount the authentication router at /api/v1/auth

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