import type { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../lib/auth.js';

export type AuthedRequest = Request & {
  userId?: string;
  userEmail?: string;
};

export function requireAuth(req: AuthedRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  try {
    const token = header.slice('Bearer '.length);
    const payload = verifyAccessToken(token);
    req.userId = payload.sub;
    req.userEmail = payload.email;
    return next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}
