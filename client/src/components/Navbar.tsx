import React, { useState } from 'react';
import { Activity, ShieldAlert, GitBranch, Map, ListTodo, TestTube, LineChart, Database, ScrollText, HeartPulse, UserCircle } from 'lucide-react';
import { PageView } from '../types';

interface NavbarProps {
  currentView: PageView;
  onViewChange: (view: PageView) => void;
  onRoleChange: (role: string, id: string) => void;
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
  { role: 'Pharmacist', tier: 'ALLIED' },
  { role: 'CSSD Technician', tier: 'ALLIED' },
  { role: 'Ward Boy', tier: 'SUPPORT' }
];

export default function Navbar({ currentView, onViewChange, onRoleChange }: NavbarProps) {
  const [selectedRole, setSelectedRole] = useState(ROLES[0].role);

  const handleRoleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const role = e.target.value;
    setSelectedRole(role);
    const id = `usr_${role.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
    onRoleChange(role, id);
  };

  const currentTier = ROLES.find(r => r.role === selectedRole)?.tier || 'UNKNOWN';

  const navItems: Array<{ id: PageView; label: string; icon: React.ReactNode }> = [
    { id: 'overview', label: 'Pulse', icon: <HeartPulse className="w-4 h-4" /> },
    { id: 'explorer', label: 'Explorer', icon: <GitBranch className="w-4 h-4" /> },
    { id: 'conformance', label: 'Conformance', icon: <ShieldAlert className="w-4 h-4" /> },
    { id: 'heatmap', label: 'Heatmap', icon: <Map className="w-4 h-4" /> },
    { id: 'insights', label: 'AI Insights', icon: <Activity className="w-4 h-4" /> },
    { id: 'recommendations', label: 'Action Board', icon: <ListTodo className="w-4 h-4" /> },
    { id: 'simulator', label: 'What-If', icon: <TestTube className="w-4 h-4" /> },
    { id: 'kpis', label: 'Metrics', icon: <LineChart className="w-4 h-4" /> },
    { id: 'ingest', label: 'Ingest Data', icon: <Database className="w-4 h-4" /> },
    { id: 'audit', label: 'Audit Log', icon: <ScrollText className="w-4 h-4" /> }
  ];

  return (
    <nav className="glass-panel border-b border-cosmic-800 sticky top-0 z-50 shadow-xl">
      <div className="max-w-[1600px] mx-auto px-4 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded bg-teal-500/20 border border-teal-500/50 flex items-center justify-center shadow-glow-teal">
            <Activity className="w-5 h-5 text-teal-400" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg font-bold leading-tight tracking-wide text-slate-100 flex items-center gap-2">
              SHADOWFLOW
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-cosmic-800 border border-cosmic-700 text-teal-400 font-mono">v1.0</span>
            </h1>
            <span className="text-[11px] text-slate-400">Cosmic Surgical • <span className="italic text-teal-300/70">See how work really flows</span></span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="hidden lg:flex items-center gap-1 mx-4 overflow-x-auto no-scrollbar">
          {navItems.map(item => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-all duration-200 ${
                  isActive 
                    ? 'bg-cosmic-800 text-teal-400 shadow-sm border border-teal-500/30 font-medium' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-cosmic-800/50'
                }`}
              >
                {item.icon}
                <span className="hidden xl:inline">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* User Role Switcher & Status */}
        <div className="flex items-center gap-4 shrink-0">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-cosmic-900 border border-cosmic-800 rounded shadow-inner">
            <UserCircle className="w-4 h-4 text-slate-400" />
            <select 
              className="bg-transparent text-sm text-slate-200 outline-none focus:ring-0 cursor-pointer appearance-none pr-4"
              value={selectedRole}
              onChange={handleRoleSelect}
            >
              {ROLES.map(r => (
                <option key={r.role} value={r.role} className="bg-cosmic-900">{r.role}</option>
              ))}
            </select>
            <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-medium tracking-wider uppercase
              ${currentTier === 'EXECUTIVE' ? 'bg-violet-500/20 text-violet-400 border border-violet-500/30' : 
                currentTier === 'CLINICAL' ? 'bg-teal-500/20 text-teal-400 border border-teal-500/30' : 
                'bg-slate-700/50 text-slate-300 border border-slate-600/50'}`}>
              {currentTier}
            </span>
          </div>
          
          <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-teal-950/30 border border-teal-900/50">
            <div className="w-2 h-2 rounded-full bg-teal-500 animate-pulse shadow-glow-teal"></div>
            <span className="text-xs font-medium text-teal-400">Mining Engine Online</span>
          </div>
        </div>
      </div>
    </nav>
  );
}
