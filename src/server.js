// src/server.js
const express = require('express'); // Import the Express.js framework
const config = require('./config'); // Import our configuration settings
const securityMiddleware = require('./middleware/security'); // Import security middleware
const errorHandler = require('./middleware/errorHandler'); // Import error handling middleware
const healthCheckRouter = require('./api/healthCheck'); // Import health check route

// Create an Express application instance
const app = express();

// --- Global Middleware Setup ---
// These middleware functions will run for every incoming request.

// 1. Security Middleware (e.g., Helmet for various HTTP headers)
// Why: Helps secure Express apps by setting various HTTP headers. It's a collection
// of smaller middleware functions that set security-related headers.
app.use(securityMiddleware);

// 2. Body Parser for JSON requests
// Why: Express doesn't parse JSON request bodies by default. This middleware
// parses incoming requests with JSON payloads, making them available on req.body.
app.use(express.json());

// 3. Health Check Route
// Why: Essential for monitoring. A health check endpoint tells us if our server
// is alive and responsive. This is crucial for load balancers and container orchestrators.
app.use('/health', healthCheckRouter);

// --- Basic Route (for demonstration) ---
app.get('/', (req, res) => {
  // Why: A simple root route to confirm the server is working.
  // It responds with "Hello World!" for GET requests to the root URL.
  res.send('Hello World from My Production Portfolio OS!');
});


// --- Error Handling Middleware ---
// This should always be the last middleware added.
// Why: Catches any errors thrown by previous middleware or route handlers.
// It ensures that even if something goes wrong, we send a consistent error response
// and avoid leaking sensitive internal details to the client.
app.use(errorHandler);


// --- Server Start ---
const PORT = config.port; // Get the port from our configuration
app.listen(PORT, () => {
  // Why: Starts the server and makes it listen for incoming connections on the specified port.
  // The callback function runs once the server is successfully listening.
  console.log(`Server is running on port ${PORT} in ${config.env} environment`);
  console.log(`Access it at: http://localhost:${PORT}`);
});