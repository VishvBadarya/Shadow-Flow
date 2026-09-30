import React, { useEffect, useState } from 'react';
import { ShieldAlert, Activity, GitBranch, ArrowRight, CheckCircle2, AlertTriangle, FileWarning, Fingerprint } from 'lucide-react';
import { ApiService } from '../services/api';
import { ProcessGraphData, ProcessModel } from '../types';

interface ConformancePageProps {
  activeWorkflowId: string;
  setActiveWorkflowId: (id: string) => void;
  roleUpdated: number;
}

export default function ConformancePage({ activeWorkflowId, setActiveWorkflowId, roleUpdated }: ConformancePageProps) {
  const [models, setModels] = useState<ProcessModel[]>([]);
  const [graphData, setGraphData] = useState<ProcessGraphData | null>(null);
  const [loading, setLoading] = useState(true);

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

  if (loading || !graphData) {
    return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div></div>;
  }

  const score = graphData.summary.conformance_score;
  const nonConformingVariants = graphData.variants.filter(v => !v.is_conforming);
  const bypassEdges = graphData.edges.filter(e => e.is_shadow && !e.target.includes('REWORK'));
  const reworkEdges = graphData.edges.filter(e => e.is_shadow && e.target.includes('REWORK'));
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-amber-500" />
          Conformance & SOP Violations
        </h2>
        <select 
          value={activeWorkflowId}
          onChange={e => setActiveWorkflowId(e.target.value)}
          className="bg-cosmic-900 border border-cosmic-700 text-slate-200 text-sm rounded-lg px-4 py-2 outline-none focus:border-teal-500"
        >
          {models.map(m => (
            <option key={m.id} value={m.id}>{m.name}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Score Card */}
        <div className="glass-panel p-6 rounded-xl flex flex-col items-center justify-center border border-cosmic-800">
          <div className="text-center">
            <h3 className="text-slate-400 font-medium mb-4">Workflow Conformance Score</h3>
            <div className="relative inline-flex items-center justify-center">
              <svg className="w-32 h-32 transform -rotate-90">
                <circle cx="64" cy="64" r="56" fill="transparent" stroke="currentColor" strokeWidth="8" className="text-cosmic-800" />
                <circle 
                  cx="64" cy="64" r="56" fill="transparent" stroke="currentColor" strokeWidth="8" 
                  className={score >= 90 ? 'text-teal-500' : score >= 70 ? 'text-amber-500' : 'text-safety-alert'}
                  strokeDasharray="351.858"
                  strokeDashoffset={351.858 - (351.858 * score) / 100}
                />
              </svg>
              <span className="absolute text-3xl font-bold text-slate-100">{score}%</span>
            </div>
            <p className="mt-4 text-sm text-slate-500">
              {score >= 90 ? 'Healthy adherence to SOP.' : score >= 70 ? 'Moderate shadow activity detected.' : 'Severe SOP deviations found.'}
            </p>
          </div>
        </div>

        {/* Violations Summary */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-xl border border-cosmic-800">
          <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
            <Fingerprint className="w-4 h-4 text-slate-400" />
            Violation Taxonomy
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-cosmic-900/50 p-4 rounded-lg border border-amber-900/30">
              <div className="text-amber-500 font-bold text-2xl mb-1">{bypassEdges.length}</div>
              <div className="text-sm font-medium text-slate-300">Mandatory Step Bypasses</div>
              <div className="text-xs text-slate-500 mt-2">Steps skipped or executed out of order, violating clinical or administrative protocols.</div>
            </div>
            <div className="bg-cosmic-900/50 p-4 rounded-lg border border-violet-900/30">
              <div className="text-violet-400 font-bold text-2xl mb-1">{reworkEdges.length}</div>
              <div className="text-sm font-medium text-slate-300">Rework Loops</div>
              <div className="text-xs text-slate-500 mt-2">Steps repeated unnecessarily, often indicating a failure in handoff or missing information.</div>
            </div>
            <div className="bg-cosmic-900/50 p-4 rounded-lg border border-teal-900/30">
              <div className="text-teal-400 font-bold text-2xl mb-1">{graphData.edges.filter(e => e.channel === 'WhatsApp').length}</div>
              <div className="text-sm font-medium text-slate-300">Off-System Channels</div>
              <div className="text-xs text-slate-500 mt-2">Activities happening outside the HMS (e.g., WhatsApp, Paper, Verbal).</div>
            </div>
            <div className="bg-cosmic-900/50 p-4 rounded-lg border border-safety-alert/30">
              <div className="text-safety-alert font-bold text-2xl mb-1">{nonConformingVariants.reduce((acc, v) => acc + v.case_count, 0)}</div>
              <div className="text-sm font-medium text-slate-300">Total Cases Affected</div>
              <div className="text-xs text-slate-500 mt-2">Total volume of historical cases experiencing at least one SOP deviation.</div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Deviations Feed */}
      <div className="glass-panel p-6 rounded-xl border border-cosmic-800">
         <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
            <FileWarning className="w-4 h-4 text-slate-400" />
            Highest Impact Deviations
          </h3>
          <div className="space-y-3">
            {nonConformingVariants.slice(0, 5).map(v => (
              <div key={v.id} className="p-4 rounded-lg bg-cosmic-900/50 border border-cosmic-800 flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-slate-200">Variant {v.id.substring(0, 8)}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-amber-500/20 text-amber-400 border border-amber-500/30">NON-CONFORMING</span>
                  </div>
                  <ul className="text-sm text-slate-400 list-disc list-inside space-y-1 mt-2">
                    {v.conformance_notes?.map((note, idx) => (
                      <li key={idx}>{note}</li>
                    ))}
                  </ul>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-slate-100">{v.case_count} <span className="text-sm font-normal text-slate-500">cases</span></div>
                  <div className="text-sm text-slate-500">{v.frequency_pct}% of total</div>
                </div>
              </div>
            ))}
          </div>
      </div>
    </div>
  );
}
