import React, { useState } from 'react';
import {
  FileText,
  Search,
  Download,
  Eye,
  Calendar,
  User,
  HeartPulse,
  Activity,
  X
} from 'lucide-react';
import PortalLayout from '../../components/PortalLayout';
import { useApp } from '../../context/AppContext';
import type { MedicalRecord } from '../../types';

export default function PatientRecords() {
  const { medicalRecords, showToast } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('All');
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);

  const filtered = medicalRecords.filter((rec) => {
    if (
      searchTerm &&
      !rec.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !rec.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !rec.department.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }
    if (dateFilter === '2026' && !rec.visitDate.startsWith('2026')) return false;
    if (dateFilter === 'Recent' && rec.visitDate < '2026-06-01') return false;
    return true;
  });

  const handleDownload = (name: string) => {
    const text = `SHADOWFLOW MEDICARE NEXUS — CLINICAL DOCUMENT\nDocument: ${name}\nCertified Electronic Health Record\nConfidential Patient Data`;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = name;
    link.click();
    showToast(`Downloading ${name}`, 'success');
  };

  return (
    <PortalLayout
      role="patient"
      title="Electronic Medical Records (EMR)"
      subtitle="Complete history of clinical encounters, physician diagnoses, treatments, and discharge notes."
    >
      {/* Search and Filters Header */}
      <div
        className="card"
        style={{
          padding: '16px 20px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px'
        }}
      >
        <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
          <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '11px' }} />
          <input
            type="text"
            placeholder="Search by diagnosis, doctor, or department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input"
            style={{ paddingLeft: '38px', margin: 0 }}
          />
        </div>

        <div className="flex items-center gap-sm">
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>Filter Date:</span>
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="form-select"
            style={{ width: 'auto', margin: 0 }}
          >
            <option value="All">All Encounters</option>
            <option value="Recent">Last 6 Months</option>
            <option value="2026">Year 2026</option>
          </select>
        </div>
      </div>

      {/* Medical Records Table & Cards */}
      <div className="flex flex-col gap-md">
        {filtered.map((rec) => (
          <div key={rec.id} className="card" style={{ padding: '24px' }}>
            <div className="flex justify-between items-start flex-wrap gap-md" style={{ marginBottom: '14px' }}>
              <div>
                <span className="badge badge-blue" style={{ marginBottom: '6px' }}>
                  {rec.department}
                </span>
                <h3 style={{ fontSize: '18px', color: 'var(--text-primary)' }}>
                  {rec.diagnosis}
                </h3>
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  Consultant: <strong>{rec.doctorName}</strong> • Encounter Date: {rec.visitDate}
                </div>
              </div>

              <div className="flex items-center gap-sm">
                <button
                  onClick={() => setSelectedRecord(rec)}
                  className="btn btn-secondary btn-sm"
                >
                  <Eye size={15} /> View Full Record
                </button>
                <button
                  onClick={() => handleDownload(`Clinical_Summary_${rec.id}.pdf`)}
                  className="btn btn-primary btn-sm"
                >
                  <Download size={15} /> Download PDF
                </button>
              </div>
            </div>

            {/* Treatment Summary */}
            <div
              style={{
                backgroundColor: 'var(--bg-color)',
                borderRadius: 'var(--radius-md)',
                padding: '14px 16px',
                fontSize: '13.5px',
                lineHeight: 1.5,
                color: 'var(--text-secondary)',
                marginBottom: '16px'
              }}
            >
              <strong style={{ color: 'var(--text-primary)' }}>Clinical Treatment & Advice:</strong> {rec.treatment}
            </div>

            {/* Vitals Recorded */}
            <div className="flex items-center gap-lg flex-wrap" style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>
              <span>BP: <strong>{rec.vitalSigns.bp}</strong></span>
              <span>Pulse: <strong>{rec.vitalSigns.pulse}</strong></span>
              <span>Temp: <strong>{rec.vitalSigns.temp}</strong></span>
              <span>Weight: <strong>{rec.vitalSigns.weight}</strong></span>
            </div>

            {/* Attachments */}
            {rec.attachments && rec.attachments.length > 0 && (
              <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '14px', marginTop: '14px' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Clinical Attachments & Scans ({rec.attachments.length})
                </div>
                <div className="flex gap-sm flex-wrap">
                  {rec.attachments.map((att, i) => (
                    <button
                      key={i}
                      onClick={() => handleDownload(att.name)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: 'var(--surface-alt)',
                        border: '1px solid var(--border)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '12px',
                        cursor: 'pointer'
                      }}
                    >
                      <FileText size={14} color="var(--primary)" />
                      <span>{att.name} ({att.size})</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Record Detail Modal */}
      {selectedRecord && (
        <div className="modal-overlay" onClick={() => setSelectedRecord(null)}>
          <div
            className="modal-content"
            style={{ maxWidth: '640px', padding: '32px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start" style={{ marginBottom: '20px' }}>
              <div>
                <span className="badge badge-blue">Clinical Encounter Record</span>
                <h3 style={{ fontSize: '20px', marginTop: '6px' }}>{selectedRecord.diagnosis}</h3>
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                  ID: {selectedRecord.id} • Date: {selectedRecord.visitDate}
                </div>
              </div>
              <button onClick={() => setSelectedRecord(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <div className="flex flex-col gap-md" style={{ fontSize: '14px' }}>
              <div>
                <strong>Attending Clinician:</strong> {selectedRecord.doctorName} ({selectedRecord.department})
              </div>

              <div style={{ padding: '16px', backgroundColor: 'var(--bg-color)', borderRadius: 'var(--radius-md)' }}>
                <strong>Documented Diagnosis & Pathology:</strong>
                <p style={{ marginTop: '6px', color: 'var(--text-secondary)' }}>{selectedRecord.diagnosis}</p>
              </div>

              <div style={{ padding: '16px', backgroundColor: 'var(--bg-color)', borderRadius: 'var(--radius-md)' }}>
                <strong>Treatment Plan & Interventions:</strong>
                <p style={{ marginTop: '6px', color: 'var(--text-secondary)' }}>{selectedRecord.treatment}</p>
              </div>

              <div>
                <strong>Vital Signs Recorded at Triage:</strong>
                <div className="grid grid-cols-4" style={{ gap: '10px', marginTop: '8px', textAlign: 'center' }}>
                  <div style={{ padding: '8px', background: 'var(--surface-alt)', borderRadius: '6px' }}>BP: {selectedRecord.vitalSigns.bp}</div>
                  <div style={{ padding: '8px', background: 'var(--surface-alt)', borderRadius: '6px' }}>Pulse: {selectedRecord.vitalSigns.pulse}</div>
                  <div style={{ padding: '8px', background: 'var(--surface-alt)', borderRadius: '6px' }}>Temp: {selectedRecord.vitalSigns.temp}</div>
                  <div style={{ padding: '8px', background: 'var(--surface-alt)', borderRadius: '6px' }}>Wt: {selectedRecord.vitalSigns.weight}</div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-sm" style={{ marginTop: '28px', borderTop: '1px solid var(--border-light)', paddingTop: '16px' }}>
              <button onClick={() => setSelectedRecord(null)} className="btn btn-secondary">
                Close
              </button>
              <button onClick={() => handleDownload(`Full_Encounter_${selectedRecord.id}.pdf`)} className="btn btn-primary">
                <Download size={16} /> Download Signed PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </PortalLayout>
  );
}
