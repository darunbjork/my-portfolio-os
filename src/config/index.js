require('dotenv').config();

const config = {
  port: process.env.PORT || 5000,
  env: process.env.NODE_ENV || 'development',
  mongoURI: process.env.MONGO_URI, 
  jwtSecret: process.env.JWT_SECRET, 
};

if (!config.mongoURI) {
  console.error("FATAL ERROR: MONGO_URI is not defined.");
}
if (!config.jwtSecret) {
  console.error("FATAL ERROR: JWT_SECRET is not defined.");
}

module.exports = config;