import request from 'supertest';
import app from '../app';
import pool from '../db';
import { User } from '../types/models/user';
import * as userModel from '../models/userModel';

describe('userRoutes', () => {
  let signupData: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  };

  let loginData: {
    email: string;
    password: string;
  };

  let authCookie: string;

  beforeEach(async () => {
    // Create a unique email per test
    const uniqueEmail = `test+${Date.now()}@email.com`;

    signupData = {
      name: 'Test User',
      email: uniqueEmail,
      password: 'Testpass123!',
      confirmPassword: 'Testpass123!',
    };

    loginData = {
      email: uniqueEmail,
      password: 'Testpass123!',
    };

    // Just in case something is left over
    await pool.query('DELETE FROM users WHERE email = ?', [signupData.email]);

    // Sign up
    await request(app)
      .post('/api/auth/signup')
      .send(signupData)
      .expect(201)
      .expect('Content-Type', /json/);

    // Log in
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send(loginData)
      .expect(200)
      .expect('Content-Type', /json/);

    authCookie = loginRes.headers['set-cookie'][0];
  });

  afterEach(async () => {
    // Clean up created user
    await pool.query('DELETE FROM users WHERE email = ?', [signupData.email]);
  });

  describe('getUsersController', () => {
    it('should return users successfully', async () => {
      const res = await request(app)
        .get('/api/users/')
        .set('Cookie', authCookie)
        .expect(200)
        .expect('Content-Type', /json/);

      expect(res.body).toBeInstanceOf(Array);

      expect(res.body.length).toBeGreaterThan(0);

      const user = res.body.find((u: User) => u.email === signupData.email);
      expect(user).toBeDefined();

      expect(user).toHaveProperty('id');
      expect(user).toHaveProperty('role');
      expect(user).toHaveProperty('created_at');
      expect(user).toHaveProperty('name');
      expect(user).toHaveProperty('email');
    });

    it('should handle error and return 500', async () => {
      jest
        .spyOn(userModel, 'getAllUsers')
        .mockRejectedValueOnce(new Error('DB error'));
      const res = await request(app)
        .get('/api/users/')
        .set('Cookie', authCookie)
        .expect(500);

      expect(res.body.message).toBe('Failed to fetch users');
    });
  });

  describe('getLoggedInUserController', () => {
    it('should return users successfully', async () => {
      const res = await request(app)
        .get('/api/users/me')
        .set('Cookie', authCookie)
        .expect(200)
        .expect('Content-Type', /json/);

      expect(res.body).toHaveProperty('message', 'User successfully fetched.');

      expect(res.body).toHaveProperty('user');

      expect(res.body.user).toHaveProperty('id');
      expect(res.body.user).toHaveProperty('created_at');
      expect(res.body.user).toHaveProperty('name');
      expect(res.body.user).toHaveProperty('email');
      expect(res.body.user).toHaveProperty('role');
    });

    it('should return 401 when user is unauthorized', async () => {
      const res = await request(app)
        .get('/api/users/me')
        .expect(401)
        .expect('Content-Type', /json/);

      expect(res.body).toHaveProperty(
        'message',
        'Not authenticated. No token provided.'
      );
    });
    it('should return 404 when user is not found', async () => {
      jest.spyOn(userModel, 'getUserById').mockResolvedValueOnce(undefined);

      const res = await request(app)
        .get('/api/users/me')
        .set('Cookie', authCookie)
        .expect(404)
        .expect('Content-Type', /json/);

      expect(res.body).toHaveProperty('message', 'User not found.');
    });
  });

  afterAll(async () => {
    // Final cleanup & close pool
    await pool.end();
  });
});
