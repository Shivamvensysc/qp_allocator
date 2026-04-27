import { Request, Response } from 'express';
import { db } from '../db/db';
import { sql } from 'drizzle-orm';

export const healthCheck = async (req: Request, res: Response) => {
  try {
    // Check database connection
    await db.execute(sql`SELECT 1`);

    res.json({ status: 'OK', database: 'connected' });
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ status: 'ERROR', database: 'disconnected' });
  }
};
