import React, { useEffect, useState } from 'react';
import { ApiService } from '../services/api';
import { ProcessGraphData, ProcessModel } from '../types';
import OfficialVsShadowCanvas from '../components/OfficialVsShadowCanvas';
import { Activity, Clock4, Filter, GitBranch, GitMerge, Settings2, ShieldAlert } from 'lucide-react';

interface ProcessExplorerPageProps {
  activeWorkflowId: string;
  setActiveWorkflowId: (id: string) => void;
  roleUpdated: number;
}

export default function ProcessExplorerPage({ activeWorkflowId, setActiveWorkflowId, roleUpdated }: ProcessExplorerPageProps) {
  const [models, setModels] = useState<ProcessModel[]>([]);
  const [graphData, setGraphData] = useState<ProcessGraphData | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'split' | 'overlay'>('split');

  useEffect(() => {
    const fetchInit = async () => {
      try {
        const m = await ApiService.getProcessModels();
        setModels(m);
        if (!activeWorkflowId && m.length > 0) setActiveWorkflowId(m[0].id);
      } catch (err) {
        console.error(err);
      }
    };
    fetchInit();
  }, [roleUpdated]);

  useEffect(() => {
    if (!activeWorkflowId) return;
    const fetchGraph = async () => {
      setLoading(true);
      try {
        const data = await ApiService.getProcessGraph(activeWorkflowId);
        setGraphData(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchGraph();
  }, [activeWorkflowId, roleUpdated]);

  return (
    <div className="flex flex-col h-[calc(100vh-100px)]">
      {/* Top Controls */}
      <div className="flex items-center justify-between mb-4 shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <GitBranch className="w-5 h-5 text-teal-400" />
            <h2 className="text-xl font-bold text-slate-100">Process Explorer</h2>
          </div>
          
          <select 
            value={activeWorkflowId}
            onChange={e => setActiveWorkflowId(e.target.value)}
            className="bg-cosmic-900 border border-cosmic-700 text-slate-200 text-sm rounded-lg px-4 py-2 outline-none focus:border-teal-500 min-w-[280px]"
          >
            {models.map(m => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 bg-cosmic-900 rounded-lg p-1 border border-cosmic-800">
          <button 
            onClick={() => setViewMode('split')}
            className={`px-3 py-1.5 rounded text-sm flex items-center gap-2 ${viewMode === 'split' ? 'bg-cosmic-700 text-slate-100 shadow' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <GitMerge className="w-4 h-4" /> Split View
          </button>
          <button 
            onClick={() => setViewMode('overlay')}
            className={`px-3 py-1.5 rounded text-sm flex items-center gap-2 ${viewMode === 'overlay' ? 'bg-cosmic-700 text-slate-100 shadow' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <Activity className="w-4 h-4" /> Overlay
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : graphData ? (
        <div className="flex flex-col lg:flex-row gap-4 flex-1 overflow-hidden">
          {/* Main Canvas */}
          <div className="flex-1 rounded-xl bg-cosmic-950 flex flex-col min-h-[500px]">
            <OfficialVsShadowCanvas data={graphData} viewMode={viewMode} />
          </div>

          {/* Right Sidebar: Trace Variants & Summary */}
          <div className="w-full lg:w-96 flex flex-col gap-4 shrink-0 overflow-y-auto pr-2 no-scrollbar">
            {/* Quick Summary Card */}
            <div className="glass-panel p-4 rounded-xl space-y-4 shrink-0">
              <h3 className="font-semibold text-slate-200 border-b border-cosmic-800 pb-2">Telemetry Pulse</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-slate-500 mb-1">Total Cases</div>
                  <div className="text-lg font-bold text-slate-200">{graphData.summary.total_cases.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 mb-1">Conformance Score</div>
                  <div className="text-lg font-bold text-teal-400">{graphData.summary.conformance_score}%</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 mb-1">Median Cycle Time</div>
                  <div className="text-lg font-bold text-slate-200">{graphData.summary.median_cycle_time_min}m</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 mb-1">P90 Cycle Time</div>
                  <div className="text-lg font-bold text-amber-500">{graphData.summary.p90_cycle_time_min}m</div>
                </div>
              </div>
            </div>

            {/* Variants List */}
            <div className="glass-panel rounded-xl flex-1 flex flex-col overflow-hidden">
              <div className="p-4 border-b border-cosmic-800 flex justify-between items-center shrink-0">
                <h3 className="font-semibold text-slate-200 flex items-center gap-2">
                  <Filter className="w-4 h-4 text-slate-400" />
                  Trace Variants
                </h3>
                <span className="text-xs bg-cosmic-800 text-slate-300 px-2 py-1 rounded">{graphData.variants.length} Found</span>
              </div>
              
              <div className="overflow-y-auto p-4 space-y-3">
                {graphData.variants.map((v, i) => (
                  <div key={v.id} className={`p-3 rounded-lg border ${v.is_conforming ? 'bg-cosmic-900 border-cosmic-800 hover:border-teal-500/50' : 'bg-amber-950/20 border-amber-900/50 hover:border-amber-500/50'} cursor-pointer transition-colors`}>
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-200">Variant {i + 1}</span>
                        {v.is_conforming ? (
                          <span className="px-1.5 py-0.5 rounded text-[10px] bg-teal-500/20 text-teal-400">SOP</span>
                        ) : (
                          <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-500/20 text-amber-400 flex items-center gap-1">
                            <ShieldAlert className="w-3 h-3" /> SHADOW
                          </span>
                        )}
                      </div>
                      <span className="text-xs font-mono text-slate-400">{v.frequency_pct}%</span>
                    </div>
                    
                    <div className="text-xs text-slate-500 mb-3">
                      {v.case_count} cases • <Clock4 className="w-3 h-3 inline ml-1 mr-0.5"/> {v.median_duration_minutes}m (P50)
                    </div>
                    
                    {/* Tiny visualization of sequence */}
                    <div className="flex flex-wrap gap-1">
                      {v.activity_sequence.slice(0, 4).map((act, idx) => (
                        <div key={idx} className="flex items-center gap-1">
                          <span className={`truncate max-w-[80px] text-[10px] px-1.5 py-0.5 rounded bg-cosmic-800 border border-cosmic-700 text-slate-300`} title={act}>
                            {act}
                          </span>
                          {idx < 3 && idx < v.activity_sequence.length - 1 && <ArrowRightIcon />}
                        </div>
                      ))}
                      {v.activity_sequence.length > 4 && <span className="text-[10px] text-slate-500 px-1">+{v.activity_sequence.length - 4} more</span>}
                    </div>
                    
                    {!v.is_conforming && v.conformance_notes && v.conformance_notes.length > 0 && (
                      <div className="mt-3 pt-2 border-t border-amber-900/30">
                        <ul className="text-[10px] text-amber-400/80 list-disc list-inside">
                          {v.conformance_notes.slice(0, 2).map((note, idx) => (
                            <li key={idx} className="truncate" title={note}>{note}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

const ArrowRightIcon = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-600">
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);
