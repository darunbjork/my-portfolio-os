// jest.global-setup.js
const { MongoMemoryServer } = require('mongodb-memory-server');
const dotenv = require('dotenv'); // Import dotenv to load .env.test

// Declare mongoServer in the module scope so it's accessible in teardown
let mongoServer;

module.exports = async () => {
  // Load environment variables from .env.test first
  // This ensures JWT_SECRET and SENDGRID_API_KEY are available if they are in .env.test
  dotenv.config({ path: '.env.test' });

  // Initialize and start MongoDB Memory Server
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  // Set the MONGO_URI for tests to use the in-memory server
  process.env.MONGO_URI = uri;

  // Provide fallback values for other secrets if they are not in .env.test
  // This is good practice in case .env.test is missing some variables locally.
  process.env.JWT_SECRET = process.env.JWT_SECRET || 'default_test_jwt_secret_fallback';
  process.env.SENDGRID_API_KEY = process.env.SENDGRID_API_KEY || 'SG.default_test_sendgrid_key_fallback';

  console.log(`MongoDB Memory Server started at: ${uri}`);
  
  // Store the server instance globally so it can be accessed in globalTeardown
  global.__MONGO_SERVER__ = mongoServer;
};