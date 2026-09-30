// Embedded SQL Schema to ensure seamless execution in both dev and compiled production environments
export const SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL,
    department TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS process_models (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    target_tat_minutes INTEGER DEFAULT 60,
    official_graph JSONB NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS conformance_rules (
    id TEXT PRIMARY KEY,
    process_model_id TEXT NOT NULL REFERENCES process_models(id),
    rule_name TEXT NOT NULL,
    rule_type TEXT NOT NULL,
    source_activity TEXT,
    target_activity TEXT,
    severity TEXT NOT NULL,
    description TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS event_logs (
    id TEXT PRIMARY KEY,
    case_id TEXT NOT NULL,
    process_model_id TEXT NOT NULL REFERENCES process_models(id),
    activity_name TEXT NOT NULL,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    duration_seconds INTEGER NOT NULL,
    role TEXT NOT NULL,
    department TEXT NOT NULL,
    channel TEXT NOT NULL DEFAULT 'EMR',
    system_used TEXT NOT NULL DEFAULT 'CosmicHMS',
    is_official_step BOOLEAN DEFAULT TRUE,
    attributes JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_events_process_case ON event_logs(process_model_id, case_id, start_time);
CREATE INDEX IF NOT EXISTS idx_events_activity ON event_logs(activity_name);
CREATE INDEX IF NOT EXISTS idx_events_channel ON event_logs(channel);
CREATE INDEX IF NOT EXISTS idx_events_department ON event_logs(department);
CREATE INDEX IF NOT EXISTS idx_events_role ON event_logs(role);

CREATE TABLE IF NOT EXISTS process_variants (
    id TEXT PRIMARY KEY,
    process_model_id TEXT NOT NULL REFERENCES process_models(id),
    variant_hash TEXT NOT NULL,
    activity_sequence JSONB NOT NULL,
    case_count INTEGER NOT NULL,
    frequency_pct NUMERIC(5, 2) NOT NULL,
    median_duration_minutes NUMERIC(8, 2) NOT NULL,
    p90_duration_minutes NUMERIC(8, 2) NOT NULL,
    is_conforming BOOLEAN DEFAULT TRUE,
    conformance_notes JSONB DEFAULT '[]'::jsonb
);

CREATE TABLE IF NOT EXISTS findings (
    id TEXT PRIMARY KEY,
    process_model_id TEXT NOT NULL REFERENCES process_models(id),
    finding_type TEXT NOT NULL,
    title TEXT NOT NULL,
    severity TEXT NOT NULL,
    affected_roles JSONB DEFAULT '[]'::jsonb,
    department TEXT NOT NULL,
    evidence JSONB NOT NULL,
    root_cause_hypothesis TEXT NOT NULL,
    ai_confidence NUMERIC(4, 2) NOT NULL,
    requires_clinical_review BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS recommendations (
    id TEXT PRIMARY KEY,
    finding_id TEXT REFERENCES findings(id),
    process_model_id TEXT NOT NULL REFERENCES process_models(id),
    title TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'PROPOSED',
    owner_role TEXT NOT NULL,
    change_description TEXT NOT NULL,
    projected_minutes_saved NUMERIC(8, 2) DEFAULT 0,
    projected_cost_savings_inr NUMERIC(12, 2) DEFAULT 0,
    risk_level TEXT NOT NULL,
    success_metric TEXT NOT NULL,
    before_kpi_value NUMERIC(10, 2),
    after_kpi_value NUMERIC(10, 2),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS simulation_runs (
    id TEXT PRIMARY KEY,
    process_model_id TEXT NOT NULL REFERENCES process_models(id),
    name TEXT NOT NULL,
    input_parameters JSONB NOT NULL,
    baseline_results JSONB NOT NULL,
    projected_results JSONB NOT NULL,
    executed_by_role TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS kpi_metrics (
    id TEXT PRIMARY KEY,
    process_model_id TEXT NOT NULL REFERENCES process_models(id),
    kpi_name TEXT NOT NULL,
    current_value NUMERIC(10, 2) NOT NULL,
    baseline_value NUMERIC(10, 2) NOT NULL,
    target_value NUMERIC(10, 2) NOT NULL,
    unit TEXT NOT NULL,
    trend_data JSONB DEFAULT '[]'::jsonb,
    last_calculated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS audit_logs (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    user_role TEXT NOT NULL,
    action TEXT NOT NULL,
    resource_type TEXT NOT NULL,
    resource_id TEXT,
    ip_address TEXT,
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_audit_time ON audit_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_audit_action ON audit_logs(action);
`;
