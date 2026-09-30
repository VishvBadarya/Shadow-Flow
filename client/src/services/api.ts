import { ProcessGraphData, ProcessModel, Finding, Recommendation, KpiMetric, SimulationResult, AuditLog, InsightRecommendation } from '../types/index.js';

const API_BASE = '/api';

export class ApiService {
  private static userRole = 'Hospital Administrator';
  private static userId = 'usr_hospital_administrator';

  static setRole(role: string, id: string) {
    this.userRole = role;
    this.userId = id;
  }

  static getRole() {
    return this.userRole;
  }

  private static getHeaders() {
    return {
      'Content-Type': 'application/json',
      'X-User-Role': this.userRole,
      'X-User-Id': this.userId
    };
  }

  static async getProcessModels(): Promise<ProcessModel[]> {
    const res = await fetch(`${API_BASE}/models`, { headers: this.getHeaders() });
    if (!res.ok) throw new Error('Failed to load process models');
    return res.json();
  }

  static async getProcessGraph(workflowId: string): Promise<ProcessGraphData> {
    const res = await fetch(`${API_BASE}/discovery/graph?workflow=${encodeURIComponent(workflowId)}`, {
      headers: this.getHeaders()
    });
    if (!res.ok) throw new Error('Failed to load process graph');
    return res.json();
  }

  static async getHeatmap(): Promise<any[]> {
    const res = await fetch(`${API_BASE}/discovery/heatmap`, { headers: this.getHeaders() });
    if (!res.ok) throw new Error('Failed to load heatmap');
    return res.json();
  }

  static async getFrictionAlerts(workflowId?: string): Promise<any[]> {
    const url = workflowId ? `${API_BASE}/friction/alerts?workflow=${encodeURIComponent(workflowId)}` : `${API_BASE}/friction/alerts`;
    const res = await fetch(url, { headers: this.getHeaders() });
    if (!res.ok) throw new Error('Failed to load friction alerts');
    return res.json();
  }

  static async getStoredFindings(workflowId?: string): Promise<Finding[]> {
    const url = workflowId ? `${API_BASE}/friction/findings?workflow=${encodeURIComponent(workflowId)}` : `${API_BASE}/friction/findings`;
    const res = await fetch(url, { headers: this.getHeaders() });
    if (!res.ok) throw new Error('Failed to load findings');
    return res.json();
  }

  static async explainFinding(payload: {
    findingTitle: string;
    findingType: string;
    department: string;
    affectedRoles: string[];
    evidence: any;
    processModelName: string;
  }) {
    const res = await fetch(`${API_BASE}/friction/explain`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Failed to generate AI explanation');
    return res.json();
  }

  static async getRecommendations(): Promise<Recommendation[]> {
    const res = await fetch(`${API_BASE}/recommendations`, { headers: this.getHeaders() });
    if (!res.ok) throw new Error('Failed to load recommendations');
    return res.json();
  }

  static async updateRecommendationStatus(id: string, status: string): Promise<any> {
    const res = await fetch(`${API_BASE}/recommendations/${id}/status`, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: JSON.stringify({ status })
    });
    if (!res.ok) throw new Error('Failed to update recommendation status');
    return res.json();
  }

  static async runSimulation(params: any): Promise<SimulationResult> {
    const res = await fetch(`${API_BASE}/simulator/run`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(params)
    });
    if (!res.ok) throw new Error('Failed to run simulation');
    return res.json();
  }

  static async getKpis(): Promise<KpiMetric[]> {
    const res = await fetch(`${API_BASE}/kpis`, { headers: this.getHeaders() });
    if (!res.ok) throw new Error('Failed to load KPIs');
    return res.json();
  }

  static async uploadEventLog(events: any[], filename: string): Promise<any> {
    const res = await fetch(`${API_BASE}/ingest/upload`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ events, filename })
    });
    if (!res.ok) throw new Error('Failed to upload events');
    return res.json();
  }

  static async parseChat(chatText: string): Promise<any> {
    const res = await fetch(`${API_BASE}/ingest/chat`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ chatText })
    });
    if (!res.ok) throw new Error('Failed to parse chat');
    return res.json();
  }

  static async getInsights(workflowId: string): Promise<InsightRecommendation[]> {
    const res = await fetch(`${API_BASE}/friction/findings?workflow=${encodeURIComponent(workflowId)}`, {
      headers: this.getHeaders()
    });
    if (!res.ok) throw new Error('Failed to load insights');
    const findings: Finding[] = await res.json();
    return findings.map((f: Finding) => ({
      id: f.id,
      title: f.title,
      severity: f.severity,
      insight_type: f.finding_type,
      description: f.root_cause_hypothesis || 'Identified through deterministic process mining trace analysis.',
      recommendations: [
        'Review standard clinical pathways with department leads',
        'Implement system validation check prior to case progression'
      ],
      estimated_impact: {
        time_savings_minutes: Math.round(Number(f.evidence?.median_delay_minutes || 45)),
        cost_savings_usd: Math.round(Number(f.evidence?.projected_cost_impact || 1200)),
        risk_reduction_pct: f.severity === 'CRITICAL' ? 85 : 45
      }
    }));
  }

  static async getAuditLogs(): Promise<AuditLog[]> {
    const res = await fetch(`${API_BASE}/audit`, { headers: this.getHeaders() });
    if (!res.ok) throw new Error('Failed to load audit logs');
    return res.json();
  }
}
