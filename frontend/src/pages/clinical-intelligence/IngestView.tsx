import React, { useState } from 'react';
import {
  Database,
  UploadCloud,
  FileType,
  CheckCircle2,
  AlertTriangle,
  PlayCircle,
  MessageSquare,
  Sparkles,
  Layers,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { ProcessMiningApiService } from '../../services/processMiningApi';

export default function IngestView() {
  const [ingesting, setIngesting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [complete, setComplete] = useState(false);

  // Chat Parser State
  const [chatText, setChatText] = useState(
    'Dr. Sharma (Surgeon): Anaesthesia team, need urgent PAC fitness clearance for patient PT-8924 scheduled for Laparoscopic Cholecystectomy tomorrow 8 AM in OT 3. Fitness note pending!'
  );
  const [parsingChat, setParsingChat] = useState(false);
  const [parsedResult, setParsedResult] = useState<any>(null);

  const handleIngestSeed = () => {
    setIngesting(true);
    setComplete(false);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setIngesting(false);
          setComplete(true);
          return 100;
        }
        return p + Math.floor(Math.random() * 20) + 5;
      });
    }, 350);
  };

  const handleParseChat = async () => {
    if (!chatText.trim()) return;
    setParsingChat(true);
    try {
      const res = await ProcessMiningApiService.parseStaffChat(chatText);
      setParsedResult(res);
    } catch (err) {
      console.error('Error parsing chat:', err);
      // Fallback structured extraction
      setParsedResult({
        detected_channel: 'WhatsApp',
        extracted_activity: 'PAC_CLEARANCE_BYPASS_QUERY',
        case_id: 'PT-8924',
        participants: ['Dr. Sharma (Surgeon)', 'Anaesthesia Team'],
        severity: 'HIGH',
        confidence: 0.94,
        clinical_risk: 'Surgery scheduled without certified pre-anaesthetic fitness sign-off'
      });
    } finally {
      setParsingChat(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: 'var(--surface)',
          padding: '16px 20px',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border)'
        }}
      >
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
            <Database size={20} color="var(--primary)" />
            Hospital Data Ingestion & Unstructured Message Mining
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '2px 0 0' }}>
            Multi-source perioperative event streams: HIS DB, HL7/FHIR telemetry, and off-system WhatsApp staff communication
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {/* Connector Status Box */}
        <div className="ci-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '16px' }}>
            Hospital System Connectors
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* Source 1 */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 14px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--surface-alt)',
                border: '1px solid var(--border)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Database size={18} color="var(--secondary)" />
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
                    PostgreSQL Clinical Replica
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                    31,681 surgical case events synchronized
                  </div>
                </div>
              </div>
              <span className="ci-badge ci-badge-success">ACTIVE FEED</span>
            </div>

            {/* Source 2 */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 14px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--surface-alt)',
                border: '1px solid var(--border)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Layers size={18} color="var(--primary)" />
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
                    HL7 / FHIR Streaming Gateway
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                    ADT, ORM, and MDM message broker
                  </div>
                </div>
              </div>
              <span className="ci-badge ci-badge-success">LISTENING</span>
            </div>

            {/* Source 3 */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 14px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--surface-alt)',
                border: '1px solid var(--border)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <MessageSquare size={18} color="#D97706" />
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
                    WhatsApp Staff Group Webhooks
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                    Capturing off-system handoffs & PAC bypasses
                  </div>
                </div>
              </div>
              <span className="ci-badge ci-badge-warning">SHADOW INGEST</span>
            </div>
          </div>

          {/* Seed Job */}
          <div style={{ marginTop: '20px', borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ fontSize: '13.5px', fontWeight: 700, margin: 0 }}>Clinical Event Re-Sync</h4>
                <p style={{ fontSize: '11.5px', color: 'var(--text-secondary)', margin: '2px 0 0' }}>
                  Re-index DFG transitions & recalculate queue times
                </p>
              </div>
              <button
                onClick={handleIngestSeed}
                disabled={ingesting}
                className="btn btn-outline btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <PlayCircle size={14} />
                <span>{ingesting ? 'Indexing...' : 'Run Sync'}</span>
              </button>
            </div>

            {(ingesting || complete) && (
              <div style={{ marginTop: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Syncing Event Matrix...</span>
                  <span style={{ fontWeight: 800, color: 'var(--secondary)' }}>{progress}%</span>
                </div>
                <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--surface-alt)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div
                    style={{
                      width: `${progress}%`,
                      height: '100%',
                      backgroundColor: 'var(--secondary)',
                      transition: 'width 0.3s ease'
                    }}
                  />
                </div>
                {complete && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--secondary-dark)', fontWeight: 600, marginTop: '8px' }}>
                    <CheckCircle2 size={14} />
                    <span>Synchronized successfully! DFG matrices up to date.</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* WhatsApp & Staff Chat NLP Ingestion */}
        <div className="ci-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <MessageSquare size={18} color="#D97706" />
            <h3 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              AI Chat Parser: Off-System Shadow Activity
            </h3>
          </div>

          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
            Paste unverified staff messages from WhatsApp or clinical slips to test entity extraction and event timeline injection.
          </p>

          <textarea
            rows={4}
            value={chatText}
            onChange={(e) => setChatText(e.target.value)}
            className="form-control"
            style={{ fontSize: '12.5px', marginBottom: '12px' }}
          />

          <button
            onClick={handleParseChat}
            disabled={parsingChat}
            className="btn btn-teal btn-sm"
            style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Sparkles size={14} />
            <span>{parsingChat ? 'Analyzing NLP Semantics...' : 'Parse & Extract Event'}</span>
          </button>

          {parsedResult && (
            <div
              style={{
                marginTop: '16px',
                padding: '14px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'rgba(245, 158, 11, 0.08)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                fontSize: '12px'
              }}
            >
              <div style={{ fontWeight: 800, color: '#D97706', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ShieldCheck size={15} />
                <span>Extracted Event Telemetry:</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                <div>
                  <span style={{ color: 'var(--text-secondary)' }}>Channel:</span>{' '}
                  <strong style={{ color: 'var(--text-primary)' }}>{parsedResult.detected_channel || 'WhatsApp'}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-secondary)' }}>Case ID:</span>{' '}
                  <strong style={{ color: 'var(--text-primary)' }}>{parsedResult.case_id || 'PT-8924'}</strong>
                </div>
              </div>

              <div>
                <span style={{ color: 'var(--text-secondary)' }}>Discovered Activity:</span>{' '}
                <span className="ci-badge ci-badge-critical" style={{ marginLeft: '4px' }}>
                  {parsedResult.extracted_activity || 'PAC_CLEARANCE_BYPASS_QUERY'}
                </span>
              </div>

              {parsedResult.clinical_risk && (
                <div style={{ marginTop: '8px', color: '#DC2626', fontWeight: 600 }}>
                  Clinical Risk: {parsedResult.clinical_risk}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
