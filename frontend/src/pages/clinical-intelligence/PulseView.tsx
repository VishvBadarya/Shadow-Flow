import React, { useEffect, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
  CheckCircle2,
  Clock,
  Clock4,
  Layers,
  ArrowUpRight,
  TrendingDown,
  TrendingUp
} from 'lucide-react';
import { ProcessMiningApiService } from '../../services/processMiningApi';
import type { ProcessModel, KpiMetric } from '../../types/processMining';

interface PulseViewProps {
  onSelectWorkflow: (id: string) => void;
  onNavigateTab: (tab: string) => void;
  roleUpdated: number;
}

export default function PulseView({ onSelectWorkflow, onNavigateTab, roleUpdated }: PulseViewProps) {
  const [models, setModels] = useState<ProcessModel[]>([]);
  const [kpis, setKpis] = useState<KpiMetric[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [m, k] = await Promise.all([
          ProcessMiningApiService.getProcessModels(),
          ProcessMiningApiService.getKpis()
        ]);
        setModels(m);
        setKpis(k);
      } catch (err) {
        console.error('Failed to load pulse data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [roleUpdated]);

  const kpiOtUtil = kpis.find(k => k.kpi_name === 'OT_UTILIZATION_PCT');
  const kpiCancel = kpis.find(k => k.kpi_name === 'CANCELLED_SURGERY_RATE_PCT');
  const kpiTurnover = kpis.find(k => k.kpi_name === 'TURNOVER_TIME_BETWEEN_CASES_MIN');
  const kpiDischarge = kpis.find(k => k.kpi_name === 'DISCHARGE_TAT_HOURS');

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '320px' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Executive Pulse Metrics */}
      <section>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Activity size={20} color="var(--secondary)" />
              Hospital Operational Pulse & Core Metrics
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              Real-time telemetry aggregated across surgical theaters, recovery wards, and perioperative checkpoints.
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('kpis')}
            className="btn btn-outline btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <span>All Target Metrics</span>
            <ArrowUpRight size={14} />
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
          {/* Card 1: OT Utilization */}
          <div className="ci-kpi-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)' }}>OT UTILIZATION</span>
              <span className="ci-badge ci-badge-warning">64.2% / Target 85%</span>
            </div>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#D97706', marginBottom: '4px' }}>
              {kpiOtUtil?.current_value || '64.2'}%
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-secondary)' }}>
              <TrendingDown size={14} color="#D97706" />
              <span>-2.7% vs last month • 3 empty theatre slots daily</span>
            </div>
          </div>

          {/* Card 2: Cancelled Surgeries */}
          <div className="ci-kpi-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)' }}>DAY-OF CANCELLATIONS</span>
              <span className="ci-badge ci-badge-critical">Critical Risk</span>
            </div>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#DC2626', marginBottom: '4px' }}>
              {kpiCancel?.current_value || '8.4'}%
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-secondary)' }}>
              <TrendingUp size={14} color="#DC2626" />
              <span>Target: &lt;2.0% • 38% bypass PAC clearance</span>
            </div>
          </div>

          {/* Card 3: Avg Turnover Time */}
          <div className="ci-kpi-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)' }}>THEATRE TURNOVER TIME</span>
              <span className="ci-badge ci-badge-warning">At Risk</span>
            </div>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#D97706', marginBottom: '4px' }}>
              {kpiTurnover?.current_value || '48'} min
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-secondary)' }}>
              <Clock size={14} color="#D97706" />
              <span>Target: 25 min • Delays caused by CSSD re-indent loops</span>
            </div>
          </div>

          {/* Card 4: Discharge TAT */}
          <div className="ci-kpi-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)' }}>DISCHARGE TAT</span>
              <span className="ci-badge ci-badge-teal">Improving</span>
            </div>
            <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--secondary)', marginBottom: '4px' }}>
              {kpiDischarge?.current_value || '5.4'} hrs
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-secondary)' }}>
              <CheckCircle2 size={14} color="var(--secondary)" />
              <span>Target: 2.0 hrs • Pre-auth paperwork idle bottleneck</span>
            </div>
          </div>
        </div>
      </section>

      {/* Critical Shadow Workflows & Friction Highlights */}
      <section className="ci-panel-glow">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <ShieldAlert size={22} color="#D97706" />
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              Active Friction & Shadow Workflows Detected
            </h3>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              AI process mining engine isolated 3 systemic SOP deviations directly impacting clinical outcomes
            </span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
          {/* Friction 1 */}
          <div
            onClick={() => onSelectWorkflow('W2_PAC_CLEARANCE')}
            style={{
              backgroundColor: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              padding: '16px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              borderLeft: '4px solid #DC2626'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span className="ci-badge ci-badge-critical">CRITICAL RISK</span>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'monospace' }}>W2_PAC_CLEARANCE</span>
            </div>
            <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '6px', color: 'var(--text-primary)' }}>
              38% PAC Clearance Bypass
            </h4>
            <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: 1.4, marginBottom: '12px' }}>
              Surgeons booking OT slots before anaesthesia fitness is signed. Coordination chased via WhatsApp groups, causing 21.8% of these cases to cancel on day-of-surgery.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: 700, color: 'var(--primary)' }}>
              <span>Investigate Workflow</span>
              <ArrowRight size={13} />
            </div>
          </div>

          {/* Friction 2 */}
          <div
            onClick={() => onSelectWorkflow('W6_CSSD_TURNAROUND')}
            style={{
              backgroundColor: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              padding: '16px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              borderLeft: '4px solid #7E22CE'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span className="ci-badge ci-badge-purple">REWORK LOOP</span>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'monospace' }}>W6_CSSD_TURNAROUND</span>
            </div>
            <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '6px', color: 'var(--text-primary)' }}>
              3.0x Duplicate CSSD Indents
            </h4>
            <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: 1.4, marginBottom: '12px' }}>
              OT scrub nurses lack visibility into central autoclave cycles, leading to triple re-entry of surgical tray indents across Paper slips, HIS, and WhatsApp.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: 700, color: 'var(--primary)' }}>
              <span>Investigate Workflow</span>
              <ArrowRight size={13} />
            </div>
          </div>

          {/* Friction 3 */}
          <div
            onClick={() => onSelectWorkflow('W8_BILLING_PREAUTH_DISCHARGE')}
            style={{
              backgroundColor: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              padding: '16px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              borderLeft: '4px solid #D97706'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span className="ci-badge ci-badge-warning">SEVERE BOTTLENECK</span>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'monospace' }}>W8_BILLING_DISCHARGE</span>
            </div>
            <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '6px', color: 'var(--text-primary)' }}>
              6.2h Pre-Auth Idle Wait
            </h4>
            <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: 1.4, marginBottom: '12px' }}>
              Billing executives manually cross-verify physical OT implant logs that already exist digitally in EMR, delaying insurer query response and patient bed release by 6.2 hours.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: 700, color: 'var(--primary)' }}>
              <span>Investigate Workflow</span>
              <ArrowRight size={13} />
            </div>
          </div>
        </div>
      </section>

      {/* Perioperative Workflows Directory */}
      <section>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)' }}>
              Surgical & Perioperative Clinical Workflows (8)
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              Select any clinical process model to inspect official BPMN paths vs. discovered shadow flows and bottlenecks.
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {models.map((model) => (
            <div
              key={model.id}
              onClick={() => onSelectWorkflow(model.id)}
              className="ci-panel"
              style={{
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <span style={{ fontSize: '11px', fontFamily: 'monospace', color: 'var(--primary)', fontWeight: 700 }}>
                    {model.id}
                  </span>
                  <span className="ci-badge ci-badge-teal">{model.category}</span>
                </div>
                <h4 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px', lineHeight: 1.3 }}>
                  {model.name}
                </h4>
                <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: 1.4, marginBottom: '16px' }}>
                  {model.description}
                </p>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderTop: '1px solid var(--border-light)',
                  paddingTop: '12px',
                  fontSize: '12px',
                  color: 'var(--text-secondary)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock4 size={13} color="var(--primary)" />
                  <span>Target: <strong>{model.target_tat_minutes}m</strong></span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--primary)', fontWeight: 600 }}>
                  <Layers size={13} />
                  <span>Explore Flow &rarr;</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
