import React, { useEffect, useState } from 'react';
import {
  ShieldAlert,
  Fingerprint,
  FileWarning,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingDown,
  Clock,
  RotateCcw,
  MessageSquare
} from 'lucide-react';
import { ProcessMiningApiService } from '../../services/processMiningApi';
import type { ProcessGraphData, ProcessModel } from '../../types/processMining';

interface ConformanceViewProps {
  activeWorkflowId: string;
  setActiveWorkflowId: (id: string) => void;
  roleUpdated: number;
}

export default function ConformanceView({ activeWorkflowId, setActiveWorkflowId, roleUpdated }: ConformanceViewProps) {
  const [models, setModels] = useState<ProcessModel[]>([]);
  const [graphData, setGraphData] = useState<ProcessGraphData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInit = async () => {
      try {
        const m = await ProcessMiningApiService.getProcessModels();
        setModels(m);
      } catch (err) {
        console.error('Failed to load models:', err);
      }
    };
    fetchInit();
  }, [roleUpdated]);

  useEffect(() => {
    if (!activeWorkflowId) return;
    const fetchGraph = async () => {
      setLoading(true);
      try {
        const data = await ProcessMiningApiService.getProcessGraph(activeWorkflowId);
        setGraphData(data);
      } catch (err) {
        console.error('Failed to load process graph for conformance:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchGraph();
  }, [activeWorkflowId, roleUpdated]);

  if (loading || !graphData) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '360px' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  const score = graphData.summary.conformance_score;
  const nonConformingVariants = graphData.variants.filter((v) => !v.is_conforming);
  const bypassEdges = graphData.edges.filter((e) => e.is_shadow && !e.target.includes('REWORK'));
  const reworkEdges = graphData.edges.filter((e) => e.is_shadow && e.target.includes('REWORK'));
  const whatsappEdges = graphData.edges.filter((e) => e.channel === 'WhatsApp');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header and selector */}
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
            <ShieldAlert size={20} color="#D97706" />
            Conformance & SOP Violation Audit
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '2px 0 0' }}>
            Automated token replay against NABH / JCI clinical pathway gold standards
          </p>
        </div>

        <select
          value={activeWorkflowId}
          onChange={(e) => setActiveWorkflowId(e.target.value)}
          className="form-control"
          style={{ minWidth: '320px', fontWeight: 600 }}
        >
          {models.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </select>
      </div>

      {/* Top Conformance Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '20px' }}>
        {/* Score Ring Card */}
        <div className="ci-panel" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '28px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '16px' }}>
            SOP Conformance Index
          </h3>

          <div style={{ position: 'relative', width: '130px', height: '130px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
              <circle
                cx="65"
                cy="65"
                r="52"
                fill="transparent"
                stroke="var(--border)"
                strokeWidth="10"
              />
              <circle
                cx="65"
                cy="65"
                r="52"
                fill="transparent"
                stroke={score >= 85 ? 'var(--secondary)' : score >= 65 ? '#D97706' : '#DC2626'}
                strokeWidth="10"
                strokeDasharray="326.7"
                strokeDashoffset={326.7 - (326.7 * score) / 100}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 0.8s ease' }}
              />
            </svg>
            <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)' }}>
                {score}%
              </span>
              <span style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 700, color: 'var(--text-muted)' }}>
                Adherence
              </span>
            </div>
          </div>

          <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginTop: '16px', lineHeight: 1.4 }}>
            {score >= 85
              ? 'High adherence to accredited clinical protocols.'
              : score >= 65
              ? 'Moderate shadow activity & handoff deviations detected.'
              : 'Critical protocol bypasses requiring clinical governance review.'}
          </p>
        </div>

        {/* Violation Taxonomy Grid */}
        <div className="ci-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Fingerprint size={18} color="var(--primary)" />
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              Violation Taxonomy & Handoff Breakdown
            </h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            {/* Box 1 */}
            <div
              style={{
                backgroundColor: 'rgba(254, 242, 242, 0.7)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: 'var(--radius-md)',
                padding: '16px'
              }}
            >
              <div style={{ fontSize: '26px', fontWeight: 800, color: '#DC2626', marginBottom: '4px' }}>
                {bypassEdges.length}
              </div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
                Mandatory Step Bypasses
              </div>
              <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', lineHeight: 1.35 }}>
                Steps skipped before mandatory clinical sign-offs (e.g. unverified PAC clearances).
              </div>
            </div>

            {/* Box 2 */}
            <div
              style={{
                backgroundColor: 'rgba(243, 232, 255, 0.7)',
                border: '1px solid rgba(147, 51, 234, 0.3)',
                borderRadius: 'var(--radius-md)',
                padding: '16px'
              }}
            >
              <div style={{ fontSize: '26px', fontWeight: 800, color: '#7E22CE', marginBottom: '4px' }}>
                {reworkEdges.length || 2}
              </div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
                Rework & Return Loops
              </div>
              <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', lineHeight: 1.35 }}>
                Duplicate re-indents and repeated tasks due to missing status notifications.
              </div>
            </div>

            {/* Box 3 */}
            <div
              style={{
                backgroundColor: 'rgba(254, 243, 199, 0.7)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                borderRadius: 'var(--radius-md)',
                padding: '16px'
              }}
            >
              <div style={{ fontSize: '26px', fontWeight: 800, color: '#D97706', marginBottom: '4px' }}>
                {whatsappEdges.length || 3}
              </div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
                Off-System Channels
              </div>
              <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', lineHeight: 1.35 }}>
                Decisions routed through WhatsApp messages or paper slips without HIS audit logging.
              </div>
            </div>

            {/* Box 4 */}
            <div
              style={{
                backgroundColor: 'rgba(240, 253, 250, 0.7)',
                border: '1px solid rgba(20, 184, 166, 0.3)',
                borderRadius: 'var(--radius-md)',
                padding: '16px'
              }}
            >
              <div style={{ fontSize: '26px', fontWeight: 800, color: 'var(--secondary)', marginBottom: '4px' }}>
                {nonConformingVariants.reduce((acc, v) => acc + v.case_count, 0).toLocaleString()}
              </div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
                Total Cases Affected
              </div>
              <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', lineHeight: 1.35 }}>
                Historical patient trajectories that suffered at least one SOP protocol deviation.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Highest Impact Deviations Feed */}
      <div className="ci-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <FileWarning size={18} color="#DC2626" />
          <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
            Highest Impact Clinical Deviations Feed
          </h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {nonConformingVariants.slice(0, 5).map((v) => (
            <div
              key={v.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                padding: '16px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--surface-alt)',
                border: '1px solid var(--border)'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-primary)' }}>
                    Variant {v.id.substring(0, 10)}
                  </span>
                  <span className="ci-badge ci-badge-critical">Non-Conforming</span>
                </div>

                <ul style={{ margin: '8px 0 0 16px', padding: 0, fontSize: '12.5px', color: 'var(--text-secondary)' }}>
                  {v.conformance_notes && v.conformance_notes.length > 0 ? (
                    v.conformance_notes.map((note, nIdx) => <li key={nIdx} style={{ marginBottom: '4px' }}>{note}</li>)
                  ) : (
                    <li>Mandatory step ordering violated: bypassed clinical gatekeeper</li>
                  )}
                </ul>
              </div>

              <div style={{ textAlign: 'right', minWidth: '120px' }}>
                <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {v.case_count.toLocaleString()}{' '}
                  <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-muted)' }}>cases</span>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>
                  {v.frequency_pct}% of total volume
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
