// src/server.js

const express = require('express');
const cors = require('cors'); // Import the cors package
const config = require('./config');
const securityMiddleware = require('./middleware/security');
const errorHandler = require('./middleware/errorHandler');
const healthCheckRouter = require('./api/healthCheck');
const authRouter = require('./api/auth');
const projectRouter = require('./api/projects');
const infoRouter = require('./api/info');
const connectDB = require('./db/connect');

const app = express();

// --- Database Connection ---
connectDB();

// --- Global Middleware Setup ---
// Why: We use the cors middleware to enable cross-origin requests.
// In a production environment, you would specify the allowed origins.
app.use(cors());

app.use(securityMiddleware);
app.use(express.json());

// --- Routes ---
app.use('/health', healthCheckRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/projects', projectRouter);
app.use('/api/v1', infoRouter);

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