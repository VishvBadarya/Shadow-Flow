export type ProcessMiningView = 
  | 'overview' 
  | 'explorer' 
  | 'conformance' 
  | 'heatmap' 
  | 'insights' 
  | 'recommendations' 
  | 'simulator' 
  | 'kpis' 
  | 'ingest' 
  | 'audit';

export interface ProcessNode {
  id: string;
  label: string;
  department: string;
  expected_role: string;
  is_required: boolean;
  frequency?: number;
  median_duration_minutes?: number;
  p90_duration_minutes?: number;
  queue_time_minutes?: number;
  service_time_minutes?: number;
  is_bottleneck?: boolean;
}

export interface ProcessEdge {
  id: string;
  source: string;
  target: string;
  count: number;
  frequency_pct: number;
  median_duration_minutes: number;
  p90_duration_minutes: number;
  is_official: boolean;
  channel?: string;
  is_shadow?: boolean;
}

export interface ProcessModel {
  id: string;
  name: string;
  category: string;
  description: string;
  target_tat_minutes: number;
  official_graph?: {
    nodes: ProcessNode[];
    edges: Array<{ source: string; target: string; is_required: boolean }>;
  };
}

export interface TraceVariant {
  id: string;
  variant_hash: string;
  activity_sequence: string[];
  case_count: number;
  frequency_pct: number;
  median_duration_minutes: number;
  p90_duration_minutes: number;
  is_conforming: boolean;
  conformance_notes?: string[];
}

export interface ProcessGraphData {
  process_model: ProcessModel;
  summary: {
    total_cases: number;
    total_events: number;
    unique_variants: number;
    conformance_score: number;
    median_cycle_time_min: number;
    p90_cycle_time_min: number;
    off_system_handoff_pct: number;
  };
  nodes: ProcessNode[];
  edges: ProcessEdge[];
  variants: TraceVariant[];
  conformance: {
    conforming_cases: number;
    non_conforming_cases: number;
    skipped_steps: Array<{ activity: string; count: number; severity: string }>;
    unofficial_transitions: Array<{ from: string; to: string; count: number; channel: string }>;
    off_system_events: Array<{ channel: string; count: number; pct: number }>;
  };
}

export interface Finding {
  id: string;
  process_model_id: string;
  finding_type: 'BOTTLENECK' | 'REWORK_LOOP' | 'PING_PONG' | 'SHADOW_CHANNEL' | 'COMPLIANCE_BREACH';
  title: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  department: string;
  affected_roles: string[];
  evidence: Record<string, any>;
  root_cause_hypothesis: string;
  ai_confidence: number;
  requires_clinical_review: boolean;
  created_at: string;
}

export interface Recommendation {
  id: string;
  finding_id?: string;
  process_model_id: string;
  title: string;
  status: 'PROPOSED' | 'APPROVED' | 'IN_PROGRESS' | 'MEASURED';
  owner_role: string;
  change_description: string;
  projected_minutes_saved: number;
  projected_cost_savings_inr: number;
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH';
  success_metric: string;
  before_kpi_value?: number;
  after_kpi_value?: number;
}

export interface KpiMetric {
  id: string;
  process_model_id: string;
  kpi_name: string;
  current_value: number;
  baseline_value: number;
  target_value: number;
  unit: string;
  department?: string;
  is_higher_better?: boolean;
  trend_data?: Array<{ month: string; value: number }>;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user_id: string;
  role: string;
  action: string;
  resource_accessed: string;
  ip_address: string;
  details?: any;
}

export interface InsightRecommendation {
  id: string;
  title: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  insight_type: string;
  description: string;
  recommendations: string[];
  estimated_impact: {
    time_savings_minutes: number;
    cost_savings_usd: number;
    risk_reduction_pct: number;
  };
}

export interface SimulationResult {
  scenario_name: string;
  parameters: {
    cssd_technicians?: number;
    pac_gatekeeper_enabled?: boolean;
    digital_tpa_push_enabled?: boolean;
    ot_turnover_buffer_reduction_min?: number;
  };
  baseline: {
    ot_utilization_pct: number;
    average_turnover_min: number;
    cancelled_surgery_rate_pct: number;
    total_cycle_time_min: number;
  };
  projected: {
    ot_utilization_pct: number;
    average_turnover_min: number;
    cancelled_surgery_rate_pct: number;
    total_cycle_time_min: number;
    delta_ot_utilization_pct: number;
    delta_minutes_saved: number;
    projected_annual_cost_savings_inr: number;
  };
}
