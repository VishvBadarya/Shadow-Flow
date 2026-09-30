import React, { useEffect, useState } from 'react';
import {
  Sparkles,
  MessageSquareWarning,
  Zap,
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  ExternalLink,
  ChevronRight,
  Loader2
} from 'lucide-react';
import { ProcessMiningApiService } from '../../services/processMiningApi';
import type { Finding, ProcessModel } from '../../types/processMining';

interface AIInsightsViewProps {
  activeWorkflowId: string;
  setActiveWorkflowId: (id: string) => void;
  roleUpdated: number;
}

export default function AIInsightsView({ activeWorkflowId, setActiveWorkflowId, roleUpdated }: AIInsightsViewProps) {
  const [models, setModels] = useState<ProcessModel[]>([]);
  const [findings, setFindings] = useState<Finding[]>([]);
  const [loading, setLoading] = useState(true);
  const [explainingId, setExplainingId] = useState<string | null>(null);
  const [aiExplanations, setAiExplanations] = useState<Record<string, any>>({});

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
    const fetchFindings = async () => {
      setLoading(true);
      try {
        const data = await ProcessMiningApiService.getStoredFindings(activeWorkflowId || undefined);
        setFindings(data);
      } catch (err) {
        console.error('Failed to load findings:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFindings();
  }, [activeWorkflowId, roleUpdated]);

  const handleExplain = async (finding: Finding) => {
    setExplainingId(finding.id);
    try {
      const currentModel = models.find((m) => m.id === finding.process_model_id);
      const res = await ProcessMiningApiService.explainFinding({
        findingTitle: finding.title,
        findingType: finding.finding_type,
        department: finding.department,
        affectedRoles: finding.affected_roles,
        evidence: finding.evidence,
        processModelName: currentModel?.name || finding.process_model_id
      });
      setAiExplanations((prev) => ({
        ...prev,
        [finding.id]: res
      }));
    } catch (err) {
      console.error('Error generating AI explanation:', err);
    } finally {
      setExplainingId(null);
    }
  };

  const getSeverityBadgeClass = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return 'ci-badge ci-badge-critical';
      case 'HIGH':
        return 'ci-badge ci-badge-warning';
      case 'MEDIUM':
        return 'ci-badge ci-badge-purple';
      default:
        return 'ci-badge ci-badge-teal';
    }
  };

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
            <Sparkles size={20} color="var(--secondary)" />
            AI Root Cause Insights & Clinical Findings
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '2px 0 0' }}>
            Machine learning anomaly detection synthesized with clinical guidelines and hospital telemetry
          </p>
        </div>

        <select
          value={activeWorkflowId}
          onChange={(e) => setActiveWorkflowId(e.target.value)}
          className="form-control"
          style={{ minWidth: '300px', fontWeight: 600 }}
        >
          <option value="">All Workflows (Consolidated)</option>
          {models.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '360px' }}>
          <div className="spinner"></div>
        </div>
      ) : findings.length === 0 ? (
        <div className="ci-panel" style={{ textAlign: 'center', padding: '48px 24px' }}>
          <BrainCircuit size={48} color="var(--text-muted)" style={{ margin: '0 auto 16px' }} />
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
            No Anomalies Discovered
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            The process mining telemetry indicates normal SOP compliance for this clinical flow.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {findings.map((f) => {
            const explanation = aiExplanations[f.id];
            const isExplaining = explainingId === f.id;

            return (
              <div key={f.id} className="ci-panel" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: 'var(--surface-alt)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px solid var(--border)'
                      }}
                    >
                      <MessageSquareWarning size={18} color="var(--primary)" />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                        {f.title}
                      </h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                        <span className={getSeverityBadgeClass(f.severity)}>
                          {f.severity}
                        </span>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                          {f.process_model_id} • {f.department}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleExplain(f)}
                    disabled={isExplaining}
                    className="btn btn-outline btn-sm"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      borderColor: 'var(--secondary)',
                      color: 'var(--secondary-dark)'
                    }}
                  >
                    {isExplaining ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        <span>Synthesizing...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles size={14} color="var(--secondary)" />
                        <span>{explanation ? 'Re-Explain with AI' : 'Explain with AI Reasoning'}</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Root Cause Hypothesis Box */}
                <div
                  style={{
                    backgroundColor: 'var(--surface-alt)',
                    borderLeft: '4px solid var(--secondary)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '14px 18px',
                    fontSize: '13.5px',
                    color: 'var(--text-primary)',
                    lineHeight: 1.5,
                    marginBottom: '16px'
                  }}
                >
                  <strong>Root Cause Hypothesis:</strong> {f.root_cause_hypothesis}
                </div>

                {/* Evidence Metrics */}
                {f.evidence && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '16px' }}>
                    {Object.entries(f.evidence).map(([key, val]) => (
                      <div
                        key={key}
                        style={{
                          backgroundColor: 'var(--surface)',
                          border: '1px solid var(--border)',
                          borderRadius: 'var(--radius-sm)',
                          padding: '6px 12px',
                          fontSize: '11.5px'
                        }}
                      >
                        <span style={{ color: 'var(--text-secondary)', textTransform: 'capitalize' }}>
                          {key.replace(/_/g, ' ')}:{' '}
                        </span>
                        <strong style={{ color: 'var(--text-primary)' }}>{String(val)}</strong>
                      </div>
                    ))}
                  </div>
                )}

                {/* AI Explanation Result Drawer */}
                {explanation && (
                  <div
                    style={{
                      marginTop: '16px',
                      padding: '18px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'rgba(20, 184, 166, 0.08)',
                      border: '1px solid rgba(20, 184, 166, 0.3)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                      <Lightbulb size={16} color="var(--secondary)" />
                      <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--secondary-dark)' }}>
                        AI Process Diagnostic & Clinical Action Plan
                      </span>
                    </div>

                    <p style={{ fontSize: '13px', color: 'var(--text-primary)', lineHeight: 1.5, marginBottom: '12px' }}>
                      {explanation.explanation || explanation.reasoning || JSON.stringify(explanation)}
                    </p>

                    {explanation.suggested_actions && (
                      <ul style={{ margin: '8px 0 0 16px', padding: 0, fontSize: '12.5px', color: 'var(--text-secondary)' }}>
                        {explanation.suggested_actions.map((act: string, aIdx: number) => (
                          <li key={aIdx} style={{ marginBottom: '4px' }}>{act}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
