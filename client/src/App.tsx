import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import OverviewPage from './pages/OverviewPage';
import ProcessExplorerPage from './pages/ProcessExplorerPage';
import ConformancePage from './pages/ConformancePage';
import HeatmapPage from './pages/HeatmapPage';
import InsightsFeedPage from './pages/InsightsFeedPage';
import RecommendationsKanbanPage from './pages/RecommendationsKanbanPage';
import SimulatorPage from './pages/SimulatorPage';
import KpiMonitorPage from './pages/KpiMonitorPage';
import IngestPage from './pages/IngestPage';
import AuditPage from './pages/AuditPage';
import { ApiService } from './services/api';
import { PageView } from './types';

export type { PageView };

export default function App() {
  const [currentView, setCurrentView] = useState<PageView>('overview');
  const [activeWorkflowId, setActiveWorkflowId] = useState<string>('W2_PAC_CLEARANCE');
  
  // This state is just to force re-fetches when role changes
  const [roleUpdated, setRoleUpdated] = useState(0);

  const handleRoleChange = (role: string, id: string) => {
    ApiService.setRole(role, id);
    setRoleUpdated(prev => prev + 1);
  };

  const renderView = () => {
    switch (currentView) {
      case 'overview':
        return <OverviewPage onNavigate={setCurrentView} activeWorkflowId={activeWorkflowId} setActiveWorkflowId={setActiveWorkflowId} roleUpdated={roleUpdated} />;
      case 'explorer':
        return <ProcessExplorerPage activeWorkflowId={activeWorkflowId} setActiveWorkflowId={setActiveWorkflowId} roleUpdated={roleUpdated} />;
      case 'conformance':
        return <ConformancePage activeWorkflowId={activeWorkflowId} setActiveWorkflowId={setActiveWorkflowId} roleUpdated={roleUpdated} />;
      case 'heatmap':
        return <HeatmapPage roleUpdated={roleUpdated} />;
      case 'insights':
        return <InsightsFeedPage activeWorkflowId={activeWorkflowId} setActiveWorkflowId={setActiveWorkflowId} roleUpdated={roleUpdated} />;
      case 'recommendations':
        return <RecommendationsKanbanPage roleUpdated={roleUpdated} />;
      case 'simulator':
        return <SimulatorPage roleUpdated={roleUpdated} />;
      case 'kpis':
        return <KpiMonitorPage roleUpdated={roleUpdated} />;
      case 'ingest':
        return <IngestPage />;
      case 'audit':
        return <AuditPage roleUpdated={roleUpdated} />;
      default:
        return <OverviewPage onNavigate={setCurrentView} activeWorkflowId={activeWorkflowId} setActiveWorkflowId={setActiveWorkflowId} roleUpdated={roleUpdated} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-cosmic-950 text-slate-100 font-sans">
      <Navbar currentView={currentView} onViewChange={setCurrentView} onRoleChange={handleRoleChange} />
      <main className="flex-1 overflow-auto p-4 lg:p-6 w-full max-w-[1600px] mx-auto">
        {renderView()}
      </main>
    </div>
  );
}
