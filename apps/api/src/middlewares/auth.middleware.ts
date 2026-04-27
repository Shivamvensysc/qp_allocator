import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;

export interface AuthRequest extends Request {
  user?: {
    id: number;
    username: string;
    type: string;
    examId?: number;
    examName?: string;
    examBodyName?: string;
  };
}

export function authenticate(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  const token = 
    req.headers.authorization?.split(' ')[1] || 
    req.body?.token || 
    req.query?.token as string;

  if (!token) {
    if (req.method === 'GET' || req.headers.accept?.includes('text/html')) {
      return res.redirect('http://localhost:3001/auth/loginSelector');
    }
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: number;
      username: string;
      type: string;
      examId?: number;
      examName?: string;
      examBodyName?: string;
    };
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid token' });
  }
}
