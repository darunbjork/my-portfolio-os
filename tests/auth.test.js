
require('dotenv').config({ path: './.env' });

const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const authRouter = require('../src/api/auth');
const User = require('../src/models/User');

const app = express();
app.use(express.json());
app.use('/api/auth', authRouter);

let token;

beforeAll(async () => {
  console.log('Auth Test MONGO_URI:', process.env.MONGO_URI);
  const url = process.env.MONGO_URI;
  await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
  if (mongoose.connection.db) {
    await mongoose.connection.db.dropDatabase();
  }
  await mongoose.connection.close();
});

beforeEach(async () => {
  await User.deleteMany({});
});

afterEach(async () => {
  await User.deleteMany({});
});

describe('Auth Routes', () => {
  jest.setTimeout(60000); // Increase timeout for all tests in this suite
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'testuser@example.com',
        password: 'password123',
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('token');
  });
});
