// jest.config.js
module.exports = {
  // Use globalSetup and globalTeardown for suite-level setup/teardown
  globalSetup: '<rootDir>/jest.global-setup.js',
  globalTeardown: '<rootDir>/jest.global-teardown.js',
  
  // ... other Jest configurations you might add later
};