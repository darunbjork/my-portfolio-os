
require('dotenv').config({ path: './.env' });

const request = require('supertest');
const express = require('express');
const authRouter = require('../src/api/auth');

const app = express();
app.use(express.json());
app.use('/api/auth', authRouter);

console.log('Auth Test MONGO_URI:', process.env.MONGO_URI);

describe('Auth Routes', () => {
  jest.setTimeout(10000); // Increase timeout for all tests in this suite
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'testuser',
        email: 'testuser@example.com',
        password: 'password123',
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('token');
  });
});
