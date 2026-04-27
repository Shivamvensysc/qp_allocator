import { Request, Response } from 'express';
import { db } from '../../db/db';
import { users } from '../../db/schema/users';
import { eq } from 'drizzle-orm';

export async function getUsersByType(req: Request, res: Response) {
  try {
    const type = req.query.type as 'admin' | 'selector';
    
    if (!type) {
      return res.status(400).json({ error: 'User type is required' });
    }

    const result = await db.query.users.findMany({
      where: eq(users.type, type),
      columns: {
        password: false, // Don't send passwords
      },
    });

    res.json(result);
  } catch (err: unknown) {
    console.error('Error fetching users:', err);
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(500).json({ error: message });
  }
}
