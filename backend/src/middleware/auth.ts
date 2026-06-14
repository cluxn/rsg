import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      admin?: { id: number; email: string };
    }
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const token = req.cookies?.token;
  if (!token) { res.status(401).json({ error: 'Unauthorized' }); return; }
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as { id: number; email: string };
    req.admin = payload;
    next();
  } catch {
    res.status(401).json({ error: 'Unauthorized' });
  }
}
