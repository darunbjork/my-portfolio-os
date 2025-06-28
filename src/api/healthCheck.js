// src/api/healthCheck.js
// Why: A simple health check route is critical for monitoring and deployment.
// It allows external systems (like Docker orchestrators, load balancers, CI/CD pipelines)
// to quickly determine if our application is running and responsive.

const express = require('express');
const router = express.Router(); // Create a new router instance

router.get('/', (req, res) => {
  // Why: Respond with a 200 OK status and a simple JSON message.
  // This indicates that the server is up and able to respond to requests.
  res.status(200).json({
    status: 'success',
    message: 'Server is healthy!',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(), // Node.js process uptime in seconds
  });
});

module.exports = router;