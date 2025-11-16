import { Request, Response, NextFunction } from 'express';
import { eq } from 'drizzle-orm';
import { AuthenticatedRequest, authenticateRequest } from './auth.js';
import { db } from '../db/db.js';
import { userProfiles } from '../db/schema/users.js';

/**
 * Role-Based Access Control (RBAC) Middleware
 * Ensures user has required role(s) to access route
 */

export type UserRole = 'admin' | 'customer' | 'promoter';

/**
 * Middleware factory that creates a middleware requiring specific roles
 * @param allowedRoles Array of roles that are allowed to access the route
 */
export const requireRole = (...allowedRoles: UserRole[]) => {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    // First authenticate the user
    await authenticateRequest(req, res, () => {});

    if (!req.user) {
      return res.status(401).json({
        error: 'UNAUTHORIZED',
        message: 'Authentication required'
      });
    }

    try {
      // Fetch user profile from database to get their role
      const [userProfile] = await db
        .select()
        .from(userProfiles)
        .where(eq(userProfiles.userId, req.user.id))
        .limit(1);

      // If no profile exists, user might not have completed onboarding
      if (!userProfile) {
        // Create a default customer profile for new users
        const [newProfile] = await db
          .insert(userProfiles)
          .values({
            userId: req.user.id,
            role: 'customer',
          })
          .returning();

        req.user.role = newProfile.role;

        // Check if customer role is allowed
        if (!allowedRoles.includes('customer')) {
          return res.status(403).json({
            error: 'FORBIDDEN',
            message: 'Insufficient permissions to access this resource'
          });
        }

        return next();
      }

      // Check if user's role is in the allowed roles
      if (!allowedRoles.includes(userProfile.role)) {
        return res.status(403).json({
          error: 'FORBIDDEN',
          message: `This resource requires one of the following roles: ${allowedRoles.join(', ')}`
        });
      }

      // Attach role to request user object
      req.user.role = userProfile.role;

      next();
    } catch (error) {
      console.error('RBAC error:', error);
      return res.status(500).json({
        error: 'INTERNAL_ERROR',
        message: 'Failed to verify user permissions'
      });
    }
  };
};
