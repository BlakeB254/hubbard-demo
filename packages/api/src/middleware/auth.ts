import { Request, Response, NextFunction } from 'express';
import { stackServerApp } from '../config/stack.js';

/**
 * Authentication Middleware
 * Validates Stack Auth tokens and attaches user to request
 */

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    displayName?: string;
    role?: string;
  };
}

/**
 * Middleware to authenticate requests using Stack Auth
 * Extracts the Bearer token and validates it with Stack Auth
 */
export const authenticateRequest = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        error: 'UNAUTHORIZED',
        message: 'No authentication token provided'
      });
    }

    // Verify token with Stack Auth
    const stackUser = await stackServerApp.getUser({ accessToken: token });

    if (!stackUser) {
      return res.status(401).json({
        error: 'UNAUTHORIZED',
        message: 'Invalid authentication token'
      });
    }

    // Attach user to request
    req.user = {
      id: stackUser.id,
      email: stackUser.primaryEmail || '',
      displayName: stackUser.displayName || undefined,
    };

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({
      error: 'UNAUTHORIZED',
      message: 'Invalid or expired authentication token'
    });
  }
};

/**
 * Optional authentication middleware
 * Attempts to authenticate but allows the request to proceed even if no token is provided
 */
export const optionalAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      // No token provided, continue without authentication
      return next();
    }

    // Try to verify token with Stack Auth
    const stackUser = await stackServerApp.getUser({ accessToken: token });

    if (stackUser) {
      // Attach user to request if token is valid
      req.user = {
        id: stackUser.id,
        email: stackUser.primaryEmail || '',
        displayName: stackUser.displayName || undefined,
      };
    }

    next();
  } catch (error) {
    // If there's an error, just continue without authentication
    // This is optional auth, so we don't fail the request
    console.warn('Optional auth failed:', error);
    next();
  }
};
