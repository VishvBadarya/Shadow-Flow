import React, { useEffect, useState } from 'react';
import { ScrollText, Filter, ShieldCheck, Database } from 'lucide-react';
import { ApiService } from '../services/api';
import { AuditLog } from '../types';

interface AuditPageProps {
  roleUpdated: number;
}

export default function AuditPage({ roleUpdated }: AuditPageProps) {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const data = await ApiService.getAuditLogs();
        setLogs(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, [roleUpdated]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-teal-400" />
            Compliance & Audit Trail
          </h2>
          <p className="text-sm text-slate-400 mt-1">Immutable HIPAA/DPDP compliant access and action logs.</p>
        </div>
        <button className="flex items-center gap-2 bg-cosmic-900 hover:bg-cosmic-800 border border-cosmic-700 px-4 py-2 rounded-lg text-sm text-slate-300 transition-colors">
          <Filter className="w-4 h-4" /> Filter Logs
        </button>
      </div>

      <div className="glass-panel rounded-xl border border-cosmic-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-cosmic-900 border-b border-cosmic-800 text-slate-400 font-medium">
              <tr>
                <th className="px-6 py-4">Timestamp</th>
                <th className="px-6 py-4">User / Role</th>
                <th className="px-6 py-4">Action</th>
                <th className="px-6 py-4">Resource</th>
                <th className="px-6 py-4">Context</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cosmic-800">
              {loading ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center"><div className="inline-block w-6 h-6 border-2 border-teal-500 border-t-transparent rounded-full animate-spin"></div></td></tr>
              ) : logs.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-500">No audit logs found.</td></tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-cosmic-900/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-slate-400 font-mono text-xs">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-200">{log.user_id}</div>
                      <div className="text-xs text-slate-500">{log.role}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-[10px] font-mono font-bold tracking-wider ${
                        log.action.includes('VIEW') ? 'bg-blue-900/30 text-blue-400' :
                        log.action.includes('DATA') ? 'bg-amber-900/30 text-amber-400' :
                        'bg-teal-900/30 text-teal-400'
                      }`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-300 font-mono text-xs">
                      {log.resource_accessed}
                    </td>
                    <td className="px-6 py-4 text-slate-400 text-xs truncate max-w-[200px]" title={log.ip_address}>
                      IP: {log.ip_address}
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
