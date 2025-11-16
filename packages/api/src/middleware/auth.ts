import { Request, Response, NextFunction } from 'express';

/**
 * Authentication Middleware
 * Validates Stack Auth tokens and attaches user to request
 *
 * TODO: Implement Stack Auth integration
 */

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role?: string;
  };
}

export const authenticateRequest = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'No authentication token provided' });
    }

    // TODO: Verify token with Stack Auth
    // const user = await stackServerApp.getUser({ accessToken: token });

    // Placeholder until Stack Auth is configured
    console.warn('Authentication middleware not fully implemented - Stack Auth required');

    // For development, you can temporarily mock the user
    // REMOVE THIS IN PRODUCTION
    if (process.env.NODE_ENV === 'development') {
      req.user = {
        id: 'dev-user-123',
        email: 'dev@example.com',
      };
      return next();
    }

    return res.status(401).json({ error: 'Authentication not configured' });
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({ error: 'Invalid authentication token' });
  }
};
