import React, { useState } from 'react';
import { Database, UploadCloud, FileType, CheckCircle2, AlertTriangle, PlayCircle } from 'lucide-react';

export default function IngestPage() {
  const [ingesting, setIngesting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [complete, setComplete] = useState(false);

  const handleIngest = () => {
    setIngesting(true);
    setComplete(false);
    setProgress(0);
    
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setIngesting(false);
          setComplete(true);
          return 100;
        }
        return p + Math.floor(Math.random() * 15);
      });
    }, 500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Database className="w-6 h-6 text-teal-400" />
        <h2 className="text-xl font-bold text-slate-100">Data Ingestion Pipeline</h2>
      </div>

      <div className="glass-panel p-8 rounded-xl border border-cosmic-800 text-center">
        <div className="w-20 h-20 mx-auto bg-cosmic-900 border border-cosmic-700 rounded-full flex items-center justify-center mb-6">
          <UploadCloud className="w-10 h-10 text-slate-400" />
        </div>
        
        <h3 className="text-2xl font-bold text-slate-200 mb-2">Connect Hospital Systems</h3>
        <p className="text-slate-400 max-w-lg mx-auto mb-8">
          Upload HIS extracts or connect live streaming HL7/FHIR feeds to continuously update process mining models.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 text-left">
          <div className="p-4 rounded-lg bg-cosmic-900/50 border border-cosmic-800 hover:border-teal-500/50 cursor-pointer transition-colors">
            <FileType className="w-6 h-6 text-blue-400 mb-3" />
            <h4 className="font-semibold text-slate-200">CSV Event Log</h4>
            <p className="text-xs text-slate-500 mt-1">Upload standard XES or CSV format.</p>
          </div>
          <div className="p-4 rounded-lg bg-cosmic-900/50 border border-cosmic-800 hover:border-teal-500/50 cursor-pointer transition-colors relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-teal-500 text-slate-950 text-[10px] font-bold px-2 py-0.5 rounded-bl">RECOMMENDED</div>
            <Database className="w-6 h-6 text-teal-400 mb-3" />
            <h4 className="font-semibold text-slate-200">PostgreSQL Feed</h4>
            <p className="text-xs text-slate-500 mt-1">Direct JDBC connection to HIS replicas.</p>
          </div>
          <div className="p-4 rounded-lg bg-cosmic-900/50 border border-cosmic-800 hover:border-teal-500/50 cursor-pointer transition-colors">
            <ActivityIcon className="w-6 h-6 text-amber-500 mb-3" />
            <h4 className="font-semibold text-slate-200">HL7 Streaming</h4>
            <p className="text-xs text-slate-500 mt-1">Real-time MLLP endpoint connection.</p>
          </div>
        </div>

        <div className="bg-cosmic-950 p-6 rounded-lg border border-cosmic-800">
          <div className="flex items-center justify-between mb-4">
            <div className="text-left">
              <h4 className="font-bold text-slate-200">Demo Data Seed</h4>
              <p className="text-sm text-slate-500">Run the synthetic clinical case generator (5,000 cases).</p>
            </div>
            <button 
              onClick={handleIngest}
              disabled={ingesting}
              className="bg-teal-500 hover:bg-teal-400 text-slate-950 px-6 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              {ingesting ? <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div> : <PlayCircle className="w-4 h-4" />}
              {ingesting ? 'Seeding...' : 'Run Seed Job'}
            </button>
          </div>

          {(ingesting || complete) && (
            <div className="mt-6 text-left">
              <div className="flex justify-between text-xs mb-2">
                <span className="text-slate-400">Pipeline Progress</span>
                <span className="text-teal-400 font-mono">{Math.min(100, progress)}%</span>
              </div>
              <div className="w-full h-2 bg-cosmic-900 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-teal-500 transition-all duration-300"
                  style={{ width: `${Math.min(100, progress)}%` }}
                ></div>
              </div>
              
              {complete && (
                <div className="mt-4 p-3 bg-teal-900/20 border border-teal-500/30 rounded-lg flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0" />
                  <div>
                    <h5 className="font-medium text-teal-400 text-sm">Ingestion Complete</h5>
                    <p className="text-xs text-slate-400 mt-1">Successfully inserted 5,000 clinical cases, generated DFG matrices, and calculated cycle times.</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const ActivityIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
  </svg>
);
