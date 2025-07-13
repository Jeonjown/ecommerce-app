import app from '../app';
import request from 'supertest';
import pool from '../db';
import jwt from 'jsonwebtoken';

describe('authRoutes', () => {
  let formData: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  };

  beforeEach(() => {
    const uniqueSuffix = Date.now();
    formData = {
      name: 'Test User',
      email: `test+${uniqueSuffix}@email.com`,
      password: 'Testpass123!',
      confirmPassword: 'Testpass123!',
    };
  });

  describe('Signup Route Integration Tests', () => {
    afterEach(async () => {
      await pool.query('DELETE FROM users WHERE email = ?', [formData.email]);
    });

    it('should sign up a user successfully', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send(formData)
        .expect(201)
        .expect('Content-Type', /json/);

      expect(res.body).toHaveProperty(
        'message',
        'User successfully signed up.'
      );
      expect(res.headers['set-cookie']).toBeDefined();

      const cookie = res.headers['set-cookie'][0];
      expect(cookie).toMatch(/authToken=/);

      const token = cookie.split(';')[0].split('=')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

      if (typeof decoded === 'string') throw new Error('Invalid token payload');
      expect(decoded).toHaveProperty('id');
      expect(typeof decoded.id).toBe('number');

      expect(res.body).toHaveProperty('user');
      expect(res.body.user).toMatchObject({
        email: formData.email,
        role: 'user',
      });
      expect(res.body.user).toHaveProperty('id');
      expect(res.body.user).toHaveProperty('created_at');
    });

    it('should return 401 if the email is already registered', async () => {
      await request(app).post('/api/auth/signup').send(formData).expect(201);

      const res = await request(app)
        .post('/api/auth/signup')
        .send(formData)
        .expect(401);

      expect(res.body).toHaveProperty(
        'message',
        'Email already in used. Please try another one'
      );
    });

    it('should return 400 if required fields are missing', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({ email: 'incomplete@email.com' })
        .expect(400);

      expect(res.body).toHaveProperty(
        'message',
        'Please provide all required fields'
      );
    });

    it('should return 400 if passwords do not match', async () => {
      const mismatched = {
        ...formData,
        confirmPassword: 'Mismatch123!',
      };

      const res = await request(app)
        .post('/api/auth/signup')
        .send(mismatched)
        .expect(400);

      expect(res.body).toHaveProperty('message', 'Passwords do not match.');
    });

    it('should return 400 if the email format is invalid', async () => {
      const invalidEmail = {
        ...formData,
        email: 'invalid-email',
      };

      const res = await request(app)
        .post('/api/auth/signup')
        .send(invalidEmail)
        .expect(400);

      expect(res.body).toHaveProperty('message', 'Please enter a valid email.');
    });

    it('should return 400 if the password does not meet complexity requirements', async () => {
      const weakPassword = {
        ...formData,
        password: '123',
        confirmPassword: '123',
      };

      const res = await request(app)
        .post('/api/auth/signup')
        .send(weakPassword)
        .expect(400);

      expect(res.body).toHaveProperty(
        'message',
        'Password must be at least 8 characters and include uppercase, lowercase, number, and symbol.'
      );
    });
  });

  describe('login route', () => {
    let loginData: { email: string; password: string };

    beforeEach(() => {
      const uniqueSuffix = Date.now();
      const email = `test+${uniqueSuffix}@email.com`;
      formData = {
        name: 'Test User',
        email,
        password: 'Testpass123!',
        confirmPassword: 'Testpass123!',
      };
      loginData = {
        email,
        password: 'Testpass123!',
      };
    });

    afterEach(async () => {
      await pool.query('DELETE FROM users WHERE email = ?', [formData.email]);
    });

    it('should login user successfully', async () => {
      await request(app).post('/api/auth/signup').send(formData).expect(201);

      const res = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(200)
        .expect('Content-Type', /json/);

      expect(res.headers['set-cookie']).toBeDefined();
      const cookie = res.headers['set-cookie'][0];
      expect(cookie).toMatch(/authToken=/);

      const token = cookie.split(';')[0].split('=')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

      if (typeof decoded === 'string') throw new Error('Invalid token payload');
      expect(decoded).toHaveProperty('id');
      expect(typeof decoded.id).toBe('number');

      expect(res.body).toHaveProperty('message', 'user successfully logged in');
      expect(res.body).toHaveProperty('user');
    });

    it('should fail when missing required fields on login', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: '', password: '' })
        .expect(400);

      expect(res.body).toHaveProperty(
        'message',
        'Please provide all required fields'
      );
    });

    it('should fail when user not found on login', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(401);

      expect(res.body).toHaveProperty(
        'message',
        'User not found, please sign up first.'
      );
    });

    it('should fail when password not match on login', async () => {
      await request(app).post('/api/auth/signup').send(formData).expect(201);

      const res = await request(app)
        .post('/api/auth/login')
        .send({ ...loginData, password: 'WrongPass123!' })
        .expect(401);

      expect(res.body).toHaveProperty('message', 'Invalid credentials');
    });
  });

  describe('logout route', () => {
    beforeEach(() => {
      const uniqueSuffix = Date.now();
      formData = {
        name: 'Test User',
        email: `test+${uniqueSuffix}@email.com`,
        password: 'Testpass123!',
        confirmPassword: 'Testpass123!',
      };
    });

    afterEach(async () => {
      await pool.query('DELETE FROM users WHERE email = ?', [formData.email]);
    });

    it('should clear authToken cookie and return success', async () => {
      await request(app).post('/api/auth/signup').send(formData).expect(201);

      const res = await request(app).post('/api/auth/logout').expect(200);

      expect(res.body).toHaveProperty('message', 'Logged out successfully');
      expect(res.headers['set-cookie']).toBeDefined();
      const cookie = res.headers['set-cookie'][0];
      expect(cookie).toMatch(/authToken=;/);
    });

    it('should return success even if no authToken cookie is set', async () => {
      const res = await request(app).post('/api/auth/logout').expect(200);

      expect(res.body).toHaveProperty('message', 'Logged out successfully');
    });
  });

  afterAll(async () => {
    await pool.end();
  });
});
