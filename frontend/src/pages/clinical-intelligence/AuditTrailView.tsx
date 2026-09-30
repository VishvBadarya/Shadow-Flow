import React, { useEffect, useState } from 'react';
import {
  ShieldCheck,
  Filter,
  Lock,
  Download,
  Search,
  CheckCircle2
} from 'lucide-react';
import { ProcessMiningApiService } from '../../services/processMiningApi';
import type { AuditLog } from '../../types/processMining';

interface AuditTrailViewProps {
  roleUpdated: number;
}

export default function AuditTrailView({ roleUpdated }: AuditTrailViewProps) {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const data = await ProcessMiningApiService.getAuditLogs();
        setLogs(data);
      } catch (err) {
        console.error('Failed to load audit logs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, [roleUpdated]);

  const filteredLogs = logs.filter(
    (l) =>
      l.user_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.resource_accessed.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          backgroundColor: 'var(--surface)',
          padding: '16px 20px',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border)'
        }}
      >
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
            <ShieldCheck size={20} color="var(--secondary)" />
            HIPAA & DPDP Compliance Audit Trail
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '2px 0 0' }}>
            Cryptographically signed, immutable record of clinical model accesses and telemetry queries
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ position: 'relative', width: '240px' }}>
            <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search user, action, resource..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-control"
              style={{ paddingLeft: '32px', fontSize: '12px' }}
            />
          </div>

          <span className="ci-badge ci-badge-success" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Lock size={11} /> 100% Immutable
          </span>
        </div>
      </div>

      {/* Table Card */}
      <div className="ci-panel" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--surface-alt)', borderBottom: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '12px 16px', fontWeight: 700, fontSize: '11px', textTransform: 'uppercase' }}>Timestamp</th>
                <th style={{ padding: '12px 16px', fontWeight: 700, fontSize: '11px', textTransform: 'uppercase' }}>User / Role</th>
                <th style={{ padding: '12px 16px', fontWeight: 700, fontSize: '11px', textTransform: 'uppercase' }}>Action</th>
                <th style={{ padding: '12px 16px', fontWeight: 700, fontSize: '11px', textTransform: 'uppercase' }}>Resource Accessed</th>
                <th style={{ padding: '12px 16px', fontWeight: 700, fontSize: '11px', textTransform: 'uppercase' }}>Network IP</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} style={{ padding: '36px', textAlign: 'center' }}>
                    <div className="spinner" style={{ margin: '0 auto' }}></div>
                  </td>
                </tr>
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: '36px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    No audit records match your query.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                    <td style={{ padding: '12px 16px', fontFamily: 'monospace', fontSize: '11.5px', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '12.5px' }}>{log.user_id}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{log.role}</div>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span
                        className={
                          log.action.includes('VIEW')
                            ? 'ci-badge ci-badge-teal'
                            : log.action.includes('DATA')
                            ? 'ci-badge ci-badge-warning'
                            : 'ci-badge ci-badge-purple'
                        }
                      >
                        {log.action}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', fontFamily: 'monospace', fontSize: '11.5px', color: 'var(--text-primary)' }}>
                      {log.resource_accessed}
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '11.5px', color: 'var(--text-muted)' }}>
                      {log.ip_address}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
