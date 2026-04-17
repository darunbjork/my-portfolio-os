const helmet = require('helmet'); 
const cors = require('cors'); 

const securityMiddleware = [
  helmet(), 
  cors({
    origin: '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'], 
    credentials: true, // Allow cookies to be sent
  }),
];

module.exports = securityMiddleware;