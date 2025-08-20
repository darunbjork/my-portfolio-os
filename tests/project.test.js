const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const authRouter = require('../src/api/auth');
const projectRouter = require('../src/api/projects');
const User = require('../src/models/User');
const Project = require('../src/models/Project');

const helmet = require('helmet');
const cors = require('cors');
const errorHandler = require('../src/middleware/errorHandler');

const app = express();
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use('/api/auth', authRouter);
app.use('/api/projects', projectRouter);
app.use(errorHandler);

let token;
let projectId;

beforeAll(async () => {
  console.log('Project Test MONGO_URI:', process.env.MONGO_URI);
  const url = process.env.MONGO_URI;
  await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

  // Register a user and get a token
  await request(app)
    .post('/api/auth/register')
    .send({
      email: 'test_project@example.com',
      password: 'password123',
      role: 'owner',
    });

  const loginRes = await request(app)
    .post('/api/auth/login')
    .send({
      email: 'test_project@example.com',
      password: 'password123',
    });
  token = loginRes.body.token;
});

afterAll(async () => {
  if (mongoose.connection.db) {
    await mongoose.connection.db.dropDatabase();
  }
  await mongoose.connection.close();
});

afterEach(async () => {
  await Project.deleteMany({});
});

beforeEach(async () => {
  const res = await request(app)
    .post('/api/projects')
    .set('Authorization', `Bearer ${token}`)
    .send({
      title: 'Test Project',
      description: 'This is a test project description.',
      technologies: ['Node.js', 'Express'],
      githubUrl: 'https://github.com/test/testproject',
      liveUrl: 'https://testproject.com',
    });
  projectId = res.body.data._id;
});

describe('Project CRUD Operations', () => {
  it('should create a new project', async () => {
    const res = await request(app)
      .post('/api/projects')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Test Project',
        description: 'This is a test project description.',
        technologies: ['Node.js', 'Express'],
        githubUrl: 'https://github.com/test/testproject',
        liveUrl: 'https://testproject.com',
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('data');
    expect(res.body.data.title).toEqual('Test Project');
    projectId = res.body.data._id;
  });

  it('should get all projects', async () => {
    const res = await request(app)
      .get('/api/projects')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('data');
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it('should get a single project by ID', async () => {
    const res = await request(app)
      .get(`/api/projects/${projectId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('data');
    expect(res.body.data._id).toEqual(projectId);
  });

  it('should update a project by ID', async () => {
    const res = await request(app)
      .put(`/api/projects/${projectId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Updated Test Project',
        description: 'This is an updated test project description.',
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('data');
    expect(res.body.data.title).toEqual('Updated Test Project');
  });

  it('should delete a project by ID', async () => {
    const res = await request(app)
      .delete(`/api/projects/${projectId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('status', 'success');

    // Verify deletion
    const getRes = await request(app)
      .get(`/api/projects/${projectId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(getRes.statusCode).toEqual(404);
  });
});
