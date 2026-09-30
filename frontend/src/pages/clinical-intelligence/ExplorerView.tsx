import React, { useEffect, useState } from 'react';
import {
  GitBranch,
  GitMerge,
  Activity,
  Filter,
  Clock4,
  ShieldAlert,
  ArrowRight,
  Layers,
  ChevronRight,
  Info
} from 'lucide-react';
import { ProcessMiningApiService } from '../../services/processMiningApi';
import type { ProcessGraphData, ProcessModel } from '../../types/processMining';
import OfficialVsShadowCanvas from '../../components/OfficialVsShadowCanvas';

interface ExplorerViewProps {
  activeWorkflowId: string;
  setActiveWorkflowId: (id: string) => void;
  roleUpdated: number;
}

export default function ExplorerView({ activeWorkflowId, setActiveWorkflowId, roleUpdated }: ExplorerViewProps) {
  const [models, setModels] = useState<ProcessModel[]>([]);
  const [graphData, setGraphData] = useState<ProcessGraphData | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'split' | 'overlay'>('overlay');
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);

  useEffect(() => {
    const fetchInit = async () => {
      try {
        const m = await ProcessMiningApiService.getProcessModels();
        setModels(m);
        if (!activeWorkflowId && m.length > 0) {
          setActiveWorkflowId(m[0].id);
        }
      } catch (err) {
        console.error('Failed to load process models:', err);
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
        if (data.variants && data.variants.length > 0) {
          setSelectedVariantId(data.variants[0].id);
        }
      } catch (err) {
        console.error('Failed to load process graph:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchGraph();
  }, [activeWorkflowId, roleUpdated]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Filter and Controls Bar */}
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
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-xs)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <GitBranch size={20} color="var(--primary)" />
            <span style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-primary)' }}>
              Clinical Process Flow:
            </span>
          </div>

          <select
            value={activeWorkflowId}
            onChange={(e) => setActiveWorkflowId(e.target.value)}
            className="form-control"
            style={{ minWidth: '320px', fontWeight: 600, padding: '8px 12px' }}
          >
            {models.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name} ({m.category})
              </option>
            ))}
          </select>
        </div>

        {/* View Mode Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              display: 'flex',
              backgroundColor: 'var(--surface-alt)',
              padding: '3px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border)'
            }}
          >
            <button
              onClick={() => setViewMode('overlay')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: 600,
                backgroundColor: viewMode === 'overlay' ? 'var(--surface)' : 'transparent',
                color: viewMode === 'overlay' ? 'var(--primary)' : 'var(--text-secondary)',
                boxShadow: viewMode === 'overlay' ? 'var(--shadow-xs)' : 'none'
              }}
            >
              <Activity size={14} />
              <span>Discovered Overlay</span>
            </button>
            <button
              onClick={() => setViewMode('split')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: 600,
                backgroundColor: viewMode === 'split' ? 'var(--surface)' : 'transparent',
                color: viewMode === 'split' ? 'var(--primary)' : 'var(--text-secondary)',
                boxShadow: viewMode === 'split' ? 'var(--shadow-xs)' : 'none'
              }}
            >
              <GitMerge size={14} />
              <span>SOP vs Shadow Split</span>
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '480px' }}>
          <div className="spinner"></div>
        </div>
      ) : graphData ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 360px', gap: '20px', alignItems: 'start' }}>
          {/* Main Visual Interactive Flow Canvas */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <OfficialVsShadowCanvas data={graphData} viewMode={viewMode} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-muted)' }}>
              <Info size={14} />
              <span>
                Scroll to zoom • Drag to pan • Solid blue lines represent official SOP pathways • Dashed violet lines show undocumented clinical workarounds • Amber lines indicate WhatsApp or paper requisition channels.
              </span>
            </div>
          </div>

          {/* Right Sidebar: Telemetry Pulse & Trace Variants */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Telemetry Card */}
            <div className="ci-panel" style={{ padding: '16px' }}>
              <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '10px', marginBottom: '14px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                  Workflow Telemetry
                </h4>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  Computed across {graphData.summary.total_cases.toLocaleString()} historical surgical cases
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Total Surgical Cases</div>
                  <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)' }}>
                    {graphData.summary.total_cases.toLocaleString()}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Conformance Adherence</div>
                  <div
                    style={{
                      fontSize: '20px',
                      fontWeight: 800,
                      color: graphData.summary.conformance_score >= 80 ? 'var(--secondary)' : '#D97706'
                    }}
                  >
                    {graphData.summary.conformance_score}%
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Median Cycle (P50)</div>
                  <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {graphData.summary.median_cycle_time_min}m
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Long Tail (P90)</div>
                  <div style={{ fontSize: '18px', fontWeight: 700, color: '#DC2626' }}>
                    {graphData.summary.p90_cycle_time_min}m
                  </div>
                </div>
              </div>
            </div>

            {/* Trace Variants Explorer */}
            <div className="ci-panel" style={{ padding: '16px', display: 'flex', flexDirection: 'column', maxHeight: '480px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderBottom: '1px solid var(--border)',
                  paddingBottom: '10px',
                  marginBottom: '12px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Filter size={15} color="var(--primary)" />
                  <h4 style={{ fontSize: '14px', fontWeight: 800, margin: 0 }}>Discovered Trace Variants</h4>
                </div>
                <span className="ci-badge ci-badge-teal">{graphData.variants.length} Routes</span>
              </div>

              <div style={{ overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', paddingRight: '4px' }}>
                {graphData.variants.map((v, idx) => {
                  const isSelected = selectedVariantId === v.id;
                  return (
                    <div
                      key={v.id}
                      onClick={() => setSelectedVariantId(v.id)}
                      style={{
                        padding: '12px',
                        borderRadius: 'var(--radius-md)',
                        border: isSelected
                          ? '2px solid var(--primary)'
                          : v.is_conforming
                          ? '1px solid var(--border)'
                          : '1px solid rgba(220, 38, 38, 0.3)',
                        backgroundColor: isSelected
                          ? 'var(--primary-light)'
                          : v.is_conforming
                          ? 'var(--surface)'
                          : 'rgba(254, 242, 242, 0.6)',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--text-primary)' }}>
                            Variant #{idx + 1}
                          </span>
                          {v.is_conforming ? (
                            <span className="ci-badge ci-badge-success">SOP Conforming</span>
                          ) : (
                            <span className="ci-badge ci-badge-critical" style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                              <ShieldAlert size={10} /> Shadow
                            </span>
                          )}
                        </div>
                        <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text-primary)' }}>
                          {v.frequency_pct}%
                        </span>
                      </div>

                      <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                        {v.case_count} cases • <Clock4 size={11} style={{ display: 'inline', verticalAlign: 'middle' }} /> {v.median_duration_minutes}m duration
                      </div>

                      {/* Sequence Pill Chain */}
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                        {v.activity_sequence.slice(0, 4).map((step, sIdx) => (
                          <span
                            key={sIdx}
                            style={{
                              fontSize: '10px',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              backgroundColor: 'var(--surface-alt)',
                              border: '1px solid var(--border)',
                              maxWidth: '100px',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}
                            title={step}
                          >
                            {step}
                          </span>
                        ))}
                        {v.activity_sequence.length > 4 && (
                          <span style={{ fontSize: '10px', color: 'var(--text-muted)', alignSelf: 'center' }}>
                            +{v.activity_sequence.length - 4} more
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
