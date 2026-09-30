import { Request, Response, NextFunction } from 'express';
import { getDb } from '../db/connection.js';
import { v4 as uuidv4 } from 'uuid';

export async function auditMiddleware(req: Request, res: Response, next: NextFunction) {
  // Capture request start
  const start = Date.now();
  const originalJson = res.json;

  res.json = function (body: any) {
    const durationMs = Date.now() - start;
    // Log asynchronously to avoid blocking the client response
    const db = getDb();
    const action = `${req.method} ${req.baseUrl}${req.path}`;
    const userRole = req.user?.role || 'SYSTEM';
    const userId = req.user?.id || null;
    const ip = req.ip || req.socket.remoteAddress || '127.0.0.1';

    // Filter high-volume logs: record queries, uploads, modifications, exports
    if (req.method !== 'GET' || req.path.includes('/export') || req.path.includes('/conformance') || req.path.includes('/recommendations')) {
      db.query(
        `INSERT INTO audit_logs (id, user_id, user_role, action, resource_type, resource_id, ip_address, details)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          uuidv4(),
          userId,
          userRole,
          action,
          req.baseUrl.replace('/api/', '') || 'ROOT',
          (req.params.id as string) || (req.query.workflow as string) || null,
          ip,
          JSON.stringify({
            status_code: res.statusCode,
            duration_ms: durationMs,
            query: req.query
          })
        ]
      ).catch(err => {
        console.error('⚠️ Audit log insert failed:', err.message);
      });
    }

    return originalJson.call(this, body);
  };

  next();
}
