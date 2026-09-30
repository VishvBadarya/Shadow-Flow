import { Request, Response, NextFunction } from 'express';
import { HOSPITAL_ROLES } from '../db/processModelsData.js';

export interface AuthenticatedUser {
  id: string;
  role: string;
  department: string;
  tier: 'EXECUTIVE' | 'CLINICAL' | 'NURSING' | 'ALLIED' | 'SUPPORT' | 'ADMIN';
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  // Support simulated role switching for hospital operations testing
  const roleHeader = (req.headers['x-user-role'] as string) || 'Hospital Administrator';
  const userIdHeader = (req.headers['x-user-id'] as string) || 'usr_hospital_administrator';

  const roleMeta = HOSPITAL_ROLES.find(r => r.role.toLowerCase() === roleHeader.toLowerCase()) || {
    role: 'Hospital Administrator',
    department: 'Administration',
    tier: 'EXECUTIVE'
  };

  req.user = {
    id: userIdHeader,
    role: roleMeta.role,
    department: roleMeta.department,
    tier: roleMeta.tier as any
  };

  next();
}

export function requireRoles(allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized: No operational identity supplied' });
      return;
    }

    const hasAccess = allowedRoles.some(r => r.toLowerCase() === req.user!.role.toLowerCase()) ||
      req.user.tier === 'EXECUTIVE'; // Executives have hospital-wide oversight

    if (!hasAccess) {
      res.status(403).json({
        error: `Forbidden: Role '${req.user.role}' lacks authorization for this operational view`,
        allowedRoles
      });
      return;
    }

    next();
  };
}
