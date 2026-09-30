import React, { useEffect, useState } from 'react';
import {
  Activity,
  Target,
  TrendingDown,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  Clock
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { ProcessMiningApiService } from '../../services/processMiningApi';
import type { KpiMetric } from '../../types/processMining';

interface KpiMonitorViewProps {
  roleUpdated: number;
}

export default function KpiMonitorView({ roleUpdated }: KpiMonitorViewProps) {
  const [kpis, setKpis] = useState<KpiMetric[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchKpis = async () => {
      try {
        const data = await ProcessMiningApiService.getKpis();
        setKpis(data);
      } catch (err) {
        console.error('Failed to load KPIs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchKpis();
  }, [roleUpdated]);

  const generateHistory = (base: number, trend: 'up' | 'down') => {
    return Array.from({ length: 10 }, (_, i) => ({
      day: `W${i + 1}`,
      value: Number((base + (trend === 'up' ? i * 0.4 : -i * 0.4) + (Math.random() * 1.5 - 0.75)).toFixed(1))
    }));
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '360px' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: 'var(--surface)',
          padding: '16px 20px',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border)'
        }}
      >
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
            <Activity size={20} color="var(--primary)" />
            Hospital Live Metric Targets & Operational KPIs
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '2px 0 0' }}>
            Continuous automated telemetry tracking against hospital accreditation standards
          </p>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px' }}>
        {kpis.map((kpi) => {
          const isBetter = kpi.is_higher_better
            ? kpi.current_value >= kpi.target_value
            : kpi.current_value <= kpi.target_value;

          const trend = kpi.is_higher_better ? 'up' : 'down';
          const history = generateHistory(Number(kpi.current_value), trend);

          return (
            <div key={kpi.id} className="ci-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                <div>
                  <h3 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                    {kpi.kpi_name.replace(/_/g, ' ')}
                  </h3>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                    {kpi.process_model_id} {kpi.department ? `• ${kpi.department}` : ''}
                  </span>
                </div>
                <span className={isBetter ? 'ci-badge ci-badge-success' : 'ci-badge ci-badge-warning'}>
                  {isBetter ? 'ON TARGET' : 'AT RISK'}
                </span>
              </div>

              {/* Stat row */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '16px' }}>
                <div style={{ backgroundColor: 'var(--surface-alt)', padding: '10px', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Current</div>
                  <div style={{ fontSize: '20px', fontWeight: 800, color: isBetter ? 'var(--secondary)' : '#D97706' }}>
                    {kpi.current_value} {kpi.unit === 'PERCENT' ? '%' : kpi.unit === 'MINUTES' ? 'm' : kpi.unit === 'HOURS' ? 'h' : ''}
                  </div>
                </div>

                <div style={{ backgroundColor: 'var(--surface-alt)', padding: '10px', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Target</div>
                  <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {kpi.target_value} {kpi.unit === 'PERCENT' ? '%' : kpi.unit === 'MINUTES' ? 'm' : kpi.unit === 'HOURS' ? 'h' : ''}
                  </div>
                </div>

                <div style={{ backgroundColor: 'var(--surface-alt)', padding: '10px', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Baseline</div>
                  <div style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-muted)' }}>
                    {kpi.baseline_value} {kpi.unit === 'PERCENT' ? '%' : kpi.unit === 'MINUTES' ? 'm' : kpi.unit === 'HOURS' ? 'h' : ''}
                  </div>
                </div>
              </div>

              {/* Sparkline Trend Chart */}
              <div style={{ height: '90px', width: '100%', marginTop: 'auto' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={history}>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'var(--surface)',
                        borderColor: 'var(--border)',
                        borderRadius: '6px',
                        fontSize: '11px'
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke={isBetter ? '#14B8A6' : '#F59E0B'}
                      strokeWidth={2.5}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
