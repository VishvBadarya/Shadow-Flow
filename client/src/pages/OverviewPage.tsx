import React, { useEffect, useState } from 'react';
import { Activity, AlertTriangle, ArrowRight, ShieldAlert, CheckCircle2, TrendingUp, TrendingDown, Clock, Clock4, Users } from 'lucide-react';
import { ApiService } from '../services/api';
import { ProcessModel, KpiMetric } from '../types';

interface OverviewPageProps {
  onNavigate: (view: any) => void;
  activeWorkflowId: string;
  setActiveWorkflowId: (id: string) => void;
  roleUpdated: number;
}

export default function OverviewPage({ onNavigate, setActiveWorkflowId, roleUpdated }: OverviewPageProps) {
  const [models, setModels] = useState<ProcessModel[]>([]);
  const [kpis, setKpis] = useState<KpiMetric[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [m, k] = await Promise.all([
          ApiService.getProcessModels(),
          ApiService.getKpis()
        ]);
        setModels(m);
        setKpis(k);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [roleUpdated]);

  const handleSelectWorkflow = (id: string) => {
    setActiveWorkflowId(id);
    onNavigate('explorer');
  };

  const kpiOtUtil = kpis.find(k => k.kpi_name === 'OT_UTILIZATION_PCT');
  const kpiCancel = kpis.find(k => k.kpi_name === 'CANCELLED_SURGERY_RATE_PCT');
  const kpiTurnover = kpis.find(k => k.kpi_name === 'TURNOVER_TIME_BETWEEN_CASES_MIN');
  const kpiDischarge = kpis.find(k => k.kpi_name === 'DISCHARGE_TAT_HOURS');

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div></div>;
  }

  return (
    <div className="space-y-6 pb-24">
      {/* Executive Pulse */}
      <section>
        <h2 className="text-xl font-bold text-slate-100 mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-teal-400" />
          Hospital Executive Pulse
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <KpiCard 
            title="OT Utilization" 
            value={kpiOtUtil?.current_value + '%'} 
            target={kpiOtUtil?.target_value + '%'} 
            trend="down" 
            delta="-2.7%" 
            status="warning" 
            icon={<Activity />} 
          />
          <KpiCard 
            title="Cancelled Surgeries" 
            value={kpiCancel?.current_value + '%'} 
            target={kpiCancel?.target_value + '%'} 
            trend="up" 
            delta="+1.2%" 
            status="danger" 
            icon={<AlertTriangle />} 
          />
          <KpiCard 
            title="Avg Turnover Time" 
            value={kpiTurnover?.current_value + ' min'} 
            target={kpiTurnover?.target_value + ' min'} 
            trend="up" 
            delta="+4 min" 
            status="warning" 
            icon={<Clock />} 
          />
          <KpiCard 
            title="Discharge TAT" 
            value={kpiDischarge?.current_value + ' hrs'} 
            target={kpiDischarge?.target_value + ' hrs'} 
            trend="down" 
            delta="-0.2 hrs" 
            status="success" 
            icon={<CheckCircle2 />} 
          />
        </div>
      </section>

      {/* ShadowFlow Highlights (Planted Demo Anomalies) */}
      <section>
        <div className="glass-panel-glow rounded-xl p-6 border-l-4 border-l-amber-500 bg-gradient-to-r from-amber-500/10 to-transparent relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
            <ShieldAlert className="w-32 h-32 text-amber-500" />
          </div>
          <h3 className="text-lg font-bold text-amber-400 mb-4 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5" />
            Active Friction & Shadow Workflows Detected
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
            <div className="bg-cosmic-900/50 p-4 rounded-lg border border-cosmic-800 hover:border-amber-500/50 transition-colors cursor-pointer" onClick={() => handleSelectWorkflow('W2_PAC_CLEARANCE')}>
              <div className="text-xs text-amber-500 font-bold tracking-wider mb-2">CRITICAL RISK</div>
              <h4 className="font-semibold text-slate-200 mb-2">38% PAC Clearance Bypass</h4>
              <p className="text-sm text-slate-400 leading-relaxed">Surgeons are booking OT slots before formal PAC clearance. Anaesthetists chased via WhatsApp, causing 21.8% of these cases to cancel on day-of-surgery.</p>
              <div className="mt-3 text-xs text-teal-400 flex items-center gap-1 font-medium">Explore W2_PAC_CLEARANCE <ArrowRight className="w-3 h-3" /></div>
            </div>
            <div className="bg-cosmic-900/50 p-4 rounded-lg border border-cosmic-800 hover:border-violet-500/50 transition-colors cursor-pointer" onClick={() => handleSelectWorkflow('W6_CSSD_TURNAROUND')}>
              <div className="text-xs text-violet-400 font-bold tracking-wider mb-2">REWORK LOOP</div>
              <h4 className="font-semibold text-slate-200 mb-2">3.0x Duplicate CSSD Indents</h4>
              <p className="text-sm text-slate-400 leading-relaxed">OT nurses lack visibility into autoclave cycles, leading to triple re-entry of tray requests across Paper, EMR, and WhatsApp.</p>
              <div className="mt-3 text-xs text-teal-400 flex items-center gap-1 font-medium">Explore W6_CSSD_TURNAROUND <ArrowRight className="w-3 h-3" /></div>
            </div>
            <div className="bg-cosmic-900/50 p-4 rounded-lg border border-cosmic-800 hover:border-teal-500/50 transition-colors cursor-pointer" onClick={() => handleSelectWorkflow('W8_BILLING_PREAUTH_DISCHARGE')}>
              <div className="text-xs text-teal-400 font-bold tracking-wider mb-2">SEVERE BOTTLENECK</div>
              <h4 className="font-semibold text-slate-200 mb-2">6.2h Pre-Auth Idle Wait</h4>
              <p className="text-sm text-slate-400 leading-relaxed">Billing executives manually query the ward for physical admission notes that already exist digitally, delaying discharge by ~6 hours.</p>
              <div className="mt-3 text-xs text-teal-400 flex items-center gap-1 font-medium">Explore W8_BILLING_DISCHARGE <ArrowRight className="w-3 h-3" /></div>
            </div>
          </div>
        </div>
      </section>

      {/* Operational Workflows */}
      <section>
        <h2 className="text-xl font-bold text-slate-100 mb-4">Perioperative Workflows</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {models.map(model => (
            <div key={model.id} className="glass-panel p-5 rounded-xl hover:bg-cosmic-900/80 transition-all cursor-pointer group border border-cosmic-800 hover:border-teal-500/30" onClick={() => handleSelectWorkflow(model.id)}>
              <div className="flex justify-between items-start mb-3">
                <div>
                  <span className="text-xs font-mono text-slate-500 mb-1 block">{model.id}</span>
                  <h3 className="font-bold text-slate-200 text-lg group-hover:text-teal-400 transition-colors">{model.name}</h3>
                </div>
                <div className="w-10 h-10 rounded-full bg-cosmic-800 flex items-center justify-center group-hover:bg-teal-500/20 group-hover:text-teal-400 transition-colors">
                  <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-teal-400" />
                </div>
              </div>
              <p className="text-sm text-slate-400 mb-4 line-clamp-2">{model.description}</p>
              
              <div className="flex items-center justify-between text-xs text-slate-400 border-t border-cosmic-800 pt-3 mt-auto">
                <div className="flex items-center gap-1"><Clock4 className="w-3.5 h-3.5 text-slate-500" /> Target TAT: <span className="font-medium text-slate-300">{model.target_tat_minutes}m</span></div>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1"><Activity className="w-3.5 h-3.5 text-teal-500" /> Mining Ready</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function KpiCard({ title, value, target, trend, delta, status, icon }: any) {
  const isGood = (trend === 'down' && status !== 'danger') || (trend === 'up' && status === 'success');
  const color = status === 'danger' ? 'text-safety-alert' : status === 'warning' ? 'text-amber-500' : 'text-teal-400';
  const bg = status === 'danger' ? 'bg-safety-alert/10' : status === 'warning' ? 'bg-amber-500/10' : 'bg-teal-500/10';

  return (
    <div className="glass-panel p-5 rounded-xl border border-cosmic-800">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-sm font-medium text-slate-400">{title}</h3>
        <div className={`p-2 rounded ${bg} ${color}`}>
          {React.cloneElement(icon, { className: 'w-4 h-4' })}
        </div>
      </div>
      <div className="flex items-baseline gap-2 mb-1">
        <span className="text-3xl font-bold text-slate-100">{value}</span>
      </div>
      <div className="flex justify-between items-center text-xs mt-3">
        <span className="text-slate-500">Target: {target}</span>
        <span className={`flex items-center gap-1 font-medium ${isGood ? 'text-teal-400' : 'text-safety-alert'}`}>
          {trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {delta}
        </span>
      </div>
    </div>
  );
}
