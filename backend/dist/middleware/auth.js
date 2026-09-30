import { HOSPITAL_ROLES } from '../db/processModelsData.js';
export function authMiddleware(req, res, next) {
    // Support simulated role switching for hospital operations testing
    const roleHeader = req.headers['x-user-role'] || 'Hospital Administrator';
    const userIdHeader = req.headers['x-user-id'] || 'usr_hospital_administrator';
    const roleMeta = HOSPITAL_ROLES.find(r => r.role.toLowerCase() === roleHeader.toLowerCase()) || {
        role: 'Hospital Administrator',
        department: 'Administration',
        tier: 'EXECUTIVE'
    };
    req.user = {
        id: userIdHeader,
        role: roleMeta.role,
        department: roleMeta.department,
        tier: roleMeta.tier
    };
    next();
}
export function requireRoles(allowedRoles) {
    return (req, res, next) => {
        if (!req.user) {
            res.status(401).json({ error: 'Unauthorized: No operational identity supplied' });
            return;
        }
        const hasAccess = allowedRoles.some(r => r.toLowerCase() === req.user.role.toLowerCase()) ||
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
