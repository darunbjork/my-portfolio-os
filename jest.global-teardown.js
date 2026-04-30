// jest.global-teardown.js
module.exports = async () => {
  // Stop the MongoDB Memory Server
  if (global.__MONGO_SERVER__) {
    await global.__MONGO_SERVER__.stop();
    console.log('MongoDB Memory Server stopped.');
  }
};