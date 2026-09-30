import React, { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  HeartPulse,
  GitBranch,
  ShieldAlert,
  Map,
  Sparkles,
  ListTodo,
  TestTube,
  LineChart,
  Database,
  ScrollText,
  UserCircle,
  Activity,
  ArrowLeft,
  Shield
} from 'lucide-react';
import '../../styles/clinicalIntelligence.css';
import PulseView from './PulseView';
import ExplorerView from './ExplorerView';
import ConformanceView from './ConformanceView';
import HeatmapView from './HeatmapView';
import AIInsightsView from './AIInsightsView';
import ActionBoardView from './ActionBoardView';
import SimulatorView from './SimulatorView';
import KpiMonitorView from './KpiMonitorView';
import IngestView from './IngestView';
import AuditTrailView from './AuditTrailView';
import { ProcessMiningApiService } from '../../services/processMiningApi';

interface ClinicalIntelligenceSuiteProps {
  embedded?: boolean;
}

const ROLES = [
  { role: 'Hospital Administrator', tier: 'EXECUTIVE' },
  { role: 'Quality/Compliance Head', tier: 'EXECUTIVE' },
  { role: 'Surgeon', tier: 'CLINICAL' },
  { role: 'Anaesthetist', tier: 'CLINICAL' },
  { role: 'OT Nurse', tier: 'NURSING' },
  { role: 'Ward Nurse', tier: 'NURSING' },
  { role: 'Front Desk', tier: 'ADMIN' },
  { role: 'Billing Executive', tier: 'ADMIN' },
  { role: 'CSSD Technician', tier: 'ALLIED' }
];

export default function ClinicalIntelligenceSuite({ embedded = false }: ClinicalIntelligenceSuiteProps) {
  const { subview } = useParams<{ subview?: string }>();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<string>(subview || 'pulse');
  const [activeWorkflowId, setActiveWorkflowId] = useState<string>('W2_PAC_CLEARANCE');
  const [selectedRole, setSelectedRole] = useState(ROLES[0].role);
  const [roleUpdated, setRoleUpdated] = useState(0);

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const role = e.target.value;
    setSelectedRole(role);
    const id = `usr_${role.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
    ProcessMiningApiService.setRole(role, id);
    setRoleUpdated((prev) => prev + 1);
  };

  const handleSelectWorkflow = (workflowId: string) => {
    setActiveWorkflowId(workflowId);
    setActiveTab('explorer');
    if (!embedded) {
      navigate('/intelligence/explorer');
    }
  };

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    if (!embedded) {
      navigate(`/intelligence/${tabId}`);
    }
  };

  const navItems = [
    { id: 'pulse', label: 'Executive Pulse', icon: <HeartPulse size={15} /> },
    { id: 'explorer', label: 'Process Explorer', icon: <GitBranch size={15} /> },
    { id: 'conformance', label: 'SOP Conformance', icon: <ShieldAlert size={15} /> },
    { id: 'heatmap', label: 'Friction Heatmap', icon: <Map size={15} /> },
    { id: 'insights', label: 'AI Insights', icon: <Sparkles size={15} /> },
    { id: 'actions', label: 'Action Board', icon: <ListTodo size={15} /> },
    { id: 'simulator', label: 'What-If Simulator', icon: <TestTube size={15} /> },
    { id: 'kpis', label: 'Target KPIs', icon: <LineChart size={15} /> },
    { id: 'ingest', label: 'Data Ingestion', icon: <Database size={15} /> },
    { id: 'audit', label: 'Audit Trail', icon: <ScrollText size={15} /> }
  ];

  const currentTier = ROLES.find((r) => r.role === selectedRole)?.tier || 'EXECUTIVE';

  return (
    <div className={`ci-container ${!embedded ? 'ci-dark-theme' : ''}`}>
      {/* Top Banner (Standalone Header) */}
      {!embedded && (
        <header className="ci-header">
          <div style={{ maxWidth: '1600px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94A3B8', fontSize: '13px', fontWeight: 600 }}>
                <ArrowLeft size={16} />
                <span>Return to Hospital Home</span>
              </Link>
              <div style={{ width: '1px', height: '24px', backgroundColor: 'rgba(255,255,255,0.1)' }}></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'rgba(20, 184, 166, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Activity size={18} color="#2DD4BF" />
                </div>
                <div>
                  <div style={{ fontSize: '15px', fontWeight: 800, color: '#F8FAFC', letterSpacing: '-0.01em' }}>
                    ShadowFlow AI <span style={{ color: '#2DD4BF' }}>Clinical Intelligence</span>
                  </div>
                  <div style={{ fontSize: '11px', color: '#94A3B8' }}>
                    MediCare Nexus Enterprise Process Mining Engine
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Role Switcher & Live Engine Status */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              {/* Role Select */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'rgba(30, 41, 59, 0.7)', padding: '6px 12px', borderRadius: '8px', border: '1px solid rgba(51, 65, 85, 0.6)' }}>
                <UserCircle size={16} color="#94A3B8" />
                <select
                  value={selectedRole}
                  onChange={handleRoleChange}
                  style={{ background: 'transparent', border: 'none', color: '#F1F5F9', fontSize: '12.5px', fontWeight: 600, outline: 'none', cursor: 'pointer' }}
                >
                  {ROLES.map((r) => (
                    <option key={r.role} value={r.role} style={{ background: '#0F172A', color: '#F1F5F9' }}>
                      {r.role}
                    </option>
                  ))}
                </select>
                <span
                  style={{
                    fontSize: '10px',
                    fontWeight: 800,
                    padding: '2px 6px',
                    borderRadius: '4px',
                    backgroundColor: currentTier === 'EXECUTIVE' ? 'rgba(168, 85, 247, 0.2)' : 'rgba(20, 184, 166, 0.2)',
                    color: currentTier === 'EXECUTIVE' ? '#C084FC' : '#2DD4BF',
                    border: '1px solid rgba(255,255,255,0.1)'
                  }}
                >
                  {currentTier}
                </span>
              </div>

              {/* Live engine badge */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'rgba(20, 184, 166, 0.1)', padding: '6px 12px', borderRadius: '8px', border: '1px solid rgba(20, 184, 166, 0.3)' }}>
                <div className="ci-pulse-dot"></div>
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#2DD4BF' }}>
                  Mining Engine Online (31,681 Events)
                </span>
              </div>

              {/* Quick Jump to Admin Portal */}
              <Link
                to="/portal/admin"
                className="btn btn-sm"
                style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: '#F8FAFC', border: '1px solid rgba(255,255,255,0.2)', fontSize: '12px' }}
              >
                Admin Portal
              </Link>
            </div>
          </div>
        </header>
      )}

      {/* Embedded Sub-Header (when inside Admin Portal) */}
      {embedded && (
        <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'rgba(20, 184, 166, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Activity size={18} color="var(--secondary)" />
            </div>
            <div>
              <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)' }}>
                ShadowFlow AI Process Mining Engine
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                Official vs. Shadow Surgical Workflows • Conformance Audit • Root Cause Analysis
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Embedded Role Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: 'var(--surface-alt)', padding: '4px 10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
              <UserCircle size={15} color="var(--text-muted)" />
              <select
                value={selectedRole}
                onChange={handleRoleChange}
                style={{ background: 'transparent', border: 'none', fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', outline: 'none', cursor: 'pointer' }}
              >
                {ROLES.map((r) => (
                  <option key={r.role} value={r.role}>
                    {r.role}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--secondary-dark)', fontWeight: 600 }}>
              <div className="ci-pulse-dot"></div>
              <span>Engine Synchronized</span>
            </div>
          </div>
        </div>
      )}

      {/* Unified Tab Navigation Bar */}
      <div style={{ maxWidth: '1600px', margin: '0 auto', padding: embedded ? '0 0 16px 0' : '16px 24px 0 24px' }}>
        <div className="ci-nav-bar" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className={`ci-nav-tab ${activeTab === item.id ? 'active' : ''}`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Subview */}
      <div style={{ maxWidth: '1600px', margin: '0 auto', padding: embedded ? '16px 0 0 0' : '20px 24px 60px 24px' }}>
        {activeTab === 'pulse' && (
          <PulseView
            onSelectWorkflow={handleSelectWorkflow}
            onNavigateTab={handleTabClick}
            roleUpdated={roleUpdated}
          />
        )}
        {activeTab === 'explorer' && (
          <ExplorerView
            activeWorkflowId={activeWorkflowId}
            setActiveWorkflowId={setActiveWorkflowId}
            roleUpdated={roleUpdated}
          />
        )}
        {activeTab === 'conformance' && (
          <ConformanceView
            activeWorkflowId={activeWorkflowId}
            setActiveWorkflowId={setActiveWorkflowId}
            roleUpdated={roleUpdated}
          />
        )}
        {activeTab === 'heatmap' && <HeatmapView roleUpdated={roleUpdated} />}
        {activeTab === 'insights' && (
          <AIInsightsView
            activeWorkflowId={activeWorkflowId}
            setActiveWorkflowId={setActiveWorkflowId}
            roleUpdated={roleUpdated}
          />
        )}
        {activeTab === 'actions' && <ActionBoardView roleUpdated={roleUpdated} />}
        {activeTab === 'simulator' && <SimulatorView roleUpdated={roleUpdated} />}
        {activeTab === 'kpis' && <KpiMonitorView roleUpdated={roleUpdated} />}
        {activeTab === 'ingest' && <IngestView />}
        {activeTab === 'audit' && <AuditTrailView roleUpdated={roleUpdated} />}
      </div>
    </div>
  );
}
