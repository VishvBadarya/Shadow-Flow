import React, { useEffect, useState } from 'react';
import { Sparkles, MessageSquareWarning, Zap, ArrowRight, BrainCircuit, ExternalLink } from 'lucide-react';
import { ApiService } from '../services/api';
import { InsightRecommendation, ProcessModel } from '../types';

interface InsightsFeedPageProps {
  activeWorkflowId: string;
  setActiveWorkflowId: (id: string) => void;
  roleUpdated: number;
}

export default function InsightsFeedPage({ activeWorkflowId, setActiveWorkflowId, roleUpdated }: InsightsFeedPageProps) {
  const [insights, setInsights] = useState<InsightRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [models, setModels] = useState<ProcessModel[]>([]);

  useEffect(() => {
    const fetchInit = async () => {
      try {
        const m = await ApiService.getProcessModels();
        setModels(m);
      } catch (err) {
        console.error(err);
      }
    };
    fetchInit();
  }, []);

  useEffect(() => {
    if (!activeWorkflowId) return;
    const fetchInsights = async () => {
      setLoading(true);
      try {
        const data = await ApiService.getInsights(activeWorkflowId);
        setInsights(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchInsights();
  }, [activeWorkflowId, roleUpdated]);

  const getSeverityColor = (sev: string) => {
    switch(sev) {
      case 'HIGH': return 'text-safety-alert bg-safety-alert/10 border-safety-alert/30';
      case 'MEDIUM': return 'text-amber-500 bg-amber-500/10 border-amber-500/30';
      case 'LOW': return 'text-teal-400 bg-teal-500/10 border-teal-500/30';
      default: return 'text-slate-300 bg-slate-800 border-slate-700';
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2 mb-2">
            <Sparkles className="w-6 h-6 text-teal-400" />
            AI Process Insights
          </h2>
          <p className="text-slate-400">Autonomously generated from process mining telemetry and anomaly detection patterns.</p>
        </div>
        
        <select 
          value={activeWorkflowId}
          onChange={e => setActiveWorkflowId(e.target.value)}
          className="bg-cosmic-900 border border-cosmic-700 text-slate-200 text-sm rounded-lg px-4 py-2 outline-none focus:border-teal-500 min-w-[250px]"
        >
          {models.map(m => (
            <option key={m.id} value={m.id}>{m.name}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div></div>
      ) : insights.length === 0 ? (
        <div className="glass-panel p-12 rounded-xl text-center border-dashed border-cosmic-700">
          <BrainCircuit className="w-12 h-12 text-slate-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-300 mb-2">No insights generated yet</h3>
          <p className="text-slate-500 max-w-md mx-auto">The mining engine hasn't detected any significant actionable patterns for this workflow yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {insights.map(insight => (
            <div key={insight.id} className="glass-panel rounded-xl overflow-hidden border border-cosmic-800 transition-all hover:border-teal-500/50 hover:shadow-glow-teal-sm">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-cosmic-900 border border-cosmic-700 flex items-center justify-center">
                      <MessageSquareWarning className={`w-5 h-5 ${
                        insight.insight_type === 'BOTTLENECK' ? 'text-amber-500' : 
                        insight.insight_type === 'COMPLIANCE' ? 'text-safety-alert' : 'text-teal-400'
                      }`} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-100">{insight.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold tracking-wider border ${getSeverityColor(insight.severity)}`}>
                          {insight.severity} SEVERITY
                        </span>
                        <span className="text-xs text-slate-500 font-mono">{insight.insight_type}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <p className="text-slate-300 mb-6 leading-relaxed bg-cosmic-900/30 p-4 rounded-lg border-l-2 border-cosmic-700">
                  {insight.description}
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-cosmic-900/50 border border-cosmic-800">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <Zap className="w-3.5 h-3.5 text-teal-500" /> Actionable Recommendations
                    </h4>
                    <ul className="space-y-2 text-sm text-slate-300">
                      {insight.recommendations.map((rec: string, i: number) => (
                        <li key={i} className="flex items-start gap-2">
                          <ArrowRight className="w-4 h-4 text-teal-500 shrink-0 mt-0.5" />
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="p-4 rounded-lg bg-cosmic-900/50 border border-cosmic-800 flex flex-col justify-center">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Estimated Impact</h4>
                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-400">Time Savings</span>
                        <span className="font-bold text-teal-400">{insight.estimated_impact.time_savings_minutes} min/case</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-400">Cost Avoidance</span>
                        <span className="font-bold text-teal-400">${insight.estimated_impact.cost_savings_usd}/mo</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-400">Risk Reduction</span>
                        <span className="font-bold text-amber-500">{insight.estimated_impact.risk_reduction_pct}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-cosmic-900/80 px-6 py-3 border-t border-cosmic-800 flex justify-between items-center">
                <span className="text-xs text-slate-500">Generated automatically based on process mining telemetry.</span>
                <button className="text-xs font-medium text-teal-400 flex items-center gap-1 hover:text-teal-300 transition-colors">
                  Create Action Item <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
