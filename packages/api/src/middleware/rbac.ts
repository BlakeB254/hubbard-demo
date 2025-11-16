import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest, authenticateRequest } from './auth.js';

/**
 * Role-Based Access Control (RBAC) Middleware
 * Ensures user has required role(s) to access route
 *
 * TODO: Implement with Drizzle ORM and user_profiles table
 */

export type UserRole = 'admin' | 'customer' | 'promoter';

export const requireRole = (...allowedRoles: UserRole[]) => {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    // First authenticate the user
    await authenticateRequest(req, res, () => {});

    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
      // TODO: Fetch user role from database
      // const userProfile = await db
      //   .select()
      //   .from(userProfiles)
      //   .where(eq(userProfiles.userId, req.user.id))
      //   .limit(1);

      // Placeholder until database is set up
      console.warn('RBAC middleware not fully implemented - Database required');

      // For development, mock role based on user ID
      // REMOVE THIS IN PRODUCTION
      if (process.env.NODE_ENV === 'development') {
        const mockRole: UserRole = 'admin'; // Change as needed for testing

        if (!allowedRoles.includes(mockRole)) {
          return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
        }

        req.user.role = mockRole;
        return next();
      }

      return res.status(500).json({ error: 'RBAC not configured' });
    } catch (error) {
      console.error('RBAC error:', error);
      return res.status(500).json({ error: 'Authorization check failed' });
    }
  };
};
