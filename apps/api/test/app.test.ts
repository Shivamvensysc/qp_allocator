import request from 'supertest';
import app from '../src/app';
import { expect } from '@jest/globals';

describe('GET /api/health', () => {
  it('should return OK with database status', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'OK', database: 'connected' });
  });
});
