import React, { useEffect, useState } from 'react';
import {
  ListTodo,
  Plus,
  Clock,
  DollarSign,
  ShieldAlert,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  MoreVertical,
  ChevronDown
} from 'lucide-react';
import { ProcessMiningApiService } from '../../services/processMiningApi';
import type { Recommendation } from '../../types/processMining';

interface ActionBoardViewProps {
  roleUpdated: number;
}

export default function ActionBoardView({ roleUpdated }: ActionBoardViewProps) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newOwner, setNewOwner] = useState('Hospital Administrator');

  const fetchRecs = async () => {
    try {
      const data = await ProcessMiningApiService.getRecommendations();
      setRecommendations(data);
    } catch (err) {
      console.error('Failed to load recommendations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecs();
  }, [roleUpdated]);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await ProcessMiningApiService.updateRecommendationStatus(id, newStatus);
      setRecommendations((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: newStatus as any } : r))
      );
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const handleAddInitiative = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    const newRec: Recommendation = {
      id: `rec_manual_${Date.now()}`,
      process_model_id: 'W2_PAC_CLEARANCE',
      title: newTitle,
      status: 'PROPOSED',
      owner_role: newOwner,
      change_description: newDesc || 'Identified clinical process optimization initiative.',
      projected_minutes_saved: 25,
      projected_cost_savings_inr: 85000,
      risk_level: 'LOW',
      success_metric: 'Reduced turnaround delay'
    };

    setRecommendations((prev) => [newRec, ...prev]);
    setShowAddModal(false);
    setNewTitle('');
    setNewDesc('');
  };

  const columns = [
    { id: 'PROPOSED', label: 'Identified Backlog', color: '#64748B' },
    { id: 'APPROVED', label: 'Approved & Scheduled', color: '#0F6CBD' },
    { id: 'IN_PROGRESS', label: 'In Progress (Implementation)', color: '#D97706' },
    { id: 'MEASURED', label: 'Impact Validated', color: '#16A34A' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Header */}
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
            <ListTodo size={20} color="var(--secondary)" />
            Clinical Action Board & Process Interventions
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '2px 0 0' }}>
            Track and govern hospital process re-engineering initiatives derived from mining telemetry
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="btn btn-primary btn-sm"
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <Plus size={15} />
          <span>New Initiative</span>
        </button>
      </div>

      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '360px' }}>
          <div className="spinner"></div>
        </div>
      ) : (
        <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '16px' }}>
          {columns.map((col) => {
            const colTasks = recommendations.filter((r) => r.status === col.id || (col.id === 'PROPOSED' && !r.status));

            return (
              <div key={col.id} className="ci-kanban-col">
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '14px',
                    paddingBottom: '8px',
                    borderBottom: `2px solid ${col.color}`
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-primary)' }}>
                      {col.label}
                    </span>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        backgroundColor: 'var(--surface)',
                        padding: '2px 6px',
                        borderRadius: 'var(--radius-full)',
                        border: '1px solid var(--border)'
                      }}
                    >
                      {colTasks.length}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
                  {colTasks.map((task) => (
                    <div key={task.id} className="ci-kanban-card">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                        <span className="ci-badge ci-badge-teal">{task.owner_role}</span>
                        <select
                          value={task.status || 'PROPOSED'}
                          onChange={(e) => handleStatusChange(task.id, e.target.value)}
                          style={{
                            fontSize: '11px',
                            border: '1px solid var(--border)',
                            borderRadius: '4px',
                            padding: '2px 4px',
                            backgroundColor: 'var(--surface-alt)',
                            cursor: 'pointer'
                          }}
                        >
                          <option value="PROPOSED">Backlog</option>
                          <option value="APPROVED">Approved</option>
                          <option value="IN_PROGRESS">In Progress</option>
                          <option value="MEASURED">Validated</option>
                        </select>
                      </div>

                      <h4 style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px', lineHeight: 1.3 }}>
                        {task.title}
                      </h4>
                      <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.4, marginBottom: '12px' }}>
                        {task.change_description}
                      </p>

                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          borderTop: '1px solid var(--border-light)',
                          paddingTop: '8px',
                          fontSize: '11px',
                          color: 'var(--text-secondary)'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--secondary-dark)', fontWeight: 600 }}>
                          <Clock size={12} />
                          <span>+{task.projected_minutes_saved}m saved</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--primary)', fontWeight: 600 }}>
                          <span>₹{(task.projected_cost_savings_inr / 1000).toFixed(0)}k/mo</span>
                        </div>
                      </div>
                    </div>
                  ))}

                  {colTasks.length === 0 && (
                    <div
                      style={{
                        padding: '24px 12px',
                        textAlign: 'center',
                        fontSize: '12px',
                        color: 'var(--text-muted)',
                        border: '1px dashed var(--border)',
                        borderRadius: 'var(--radius-md)'
                      }}
                    >
                      No initiatives in this column
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Initiative Modal */}
      {showAddModal && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: '480px' }}>
            <div className="modal-header">
              <h3 style={{ fontSize: '16px', fontWeight: 800 }}>Create Process Improvement Initiative</h3>
              <button onClick={() => setShowAddModal(false)} className="close-btn">&times;</button>
            </div>
            <form onSubmit={handleAddInitiative} style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label className="form-label">Initiative Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Implement strict digital PAC fitness gatekeeper"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="form-control"
                />
              </div>

              <div>
                <label className="form-label">Process Change Description</label>
                <textarea
                  rows={3}
                  placeholder="Describe the operational intervention and intended outcome..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="form-control"
                ></textarea>
              </div>

              <div>
                <label className="form-label">Executive Owner</label>
                <select value={newOwner} onChange={(e) => setNewOwner(e.target.value)} className="form-control">
                  <option value="Hospital Administrator">Hospital Administrator</option>
                  <option value="Quality/Compliance Head">Quality/Compliance Head</option>
                  <option value="Chief of Surgery">Chief of Surgery</option>
                  <option value="Anaesthesia Lead">Anaesthesia Lead</option>
                  <option value="OT Nursing Supervisor">OT Nursing Supervisor</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-ghost btn-sm">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm">
                  Create Initiative
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
