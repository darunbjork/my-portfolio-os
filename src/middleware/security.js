// src/middleware/security.js
// Why: Centralized security headers. Helmet helps secure Express apps
// by setting various HTTP headers. These headers can prevent common attacks
// like cross-site scripting (XSS), clickjacking, and others.

const helmet = require('helmet'); // Import the helmet package (we'll install this next)
const cors = require('cors'); // Import the cors package (we'll install this next)

// Why: Helmet is a collection of 14 smaller middleware functions
// that set security-related HTTP headers. It's a vital first line of defense.
const securityMiddleware = [
  helmet(), // Apply all default Helmet protections
  cors({
    origin: '*', // For development, allow all origins.
                 // WARNING: In production, configure this to your specific front-end URL(s).
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
    credentials: true, // Allow cookies to be sent
  }),
];

module.exports = securityMiddleware;