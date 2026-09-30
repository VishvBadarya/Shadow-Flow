import React, { useState } from 'react';
import { Activity, Download, Eye, Calendar, Clock, AlertTriangle, CheckCircle2, X } from 'lucide-react';
import PortalLayout from '../../components/PortalLayout';
import { useApp } from '../../context/AppContext';
import type { LabReport } from '../../types';

export default function PatientLabReports() {
  const { labReports, showToast } = useApp();
  const [selectedReport, setSelectedReport] = useState<LabReport | null>(null);

  const handleDownload = (testName: string) => {
    const text = `SHADOWFLOW MEDICARE NEXUS — CERTIFIED LABORATORY REPORT\nTest: ${testName}\nStatus: Verified Clinical Lab Specimen Analysis\nDigital Signature: Central Biochemistry Laboratory`;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Lab_Report_${testName.replace(/\s+/g, '_')}.txt`;
    link.click();
    showToast(`Downloading report for ${testName}`, 'success');
  };

  return (
    <PortalLayout
      role="patient"
      title="Diagnostic & Laboratory Reports"
      subtitle="Automated biochemistry, hematology, and cardiovascular imaging results."
    >
      <div className="flex flex-col gap-md">
        {labReports.map((report) => (
          <div key={report.id} className="card" style={{ padding: '24px' }}>
            <div className="flex justify-between items-start flex-wrap gap-md" style={{ marginBottom: '16px' }}>
              <div>
                <div className="flex items-center gap-sm" style={{ marginBottom: '6px' }}>
                  <span
                    className={`badge ${
                      report.status === 'Completed'
                        ? 'badge-green'
                        : report.status === 'Processing'
                        ? 'badge-amber'
                        : 'badge-gray'
                    }`}
                  >
                    {report.status}
                  </span>
                  <span className="badge badge-blue">{report.category}</span>
                  {report.flag && (
                    <span className={`badge ${report.flag === 'Elevated' ? 'badge-amber' : 'badge-green'}`}>
                      {report.flag}
                    </span>
                  )}
                </div>

                <h3 style={{ fontSize: '18px', color: 'var(--text-primary)' }}>
                  {report.testName}
                </h3>

                <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  Ordered by <strong>{report.doctorName}</strong> • Date of Collection: {report.date}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-sm">
                <button
                  onClick={() => setSelectedReport(report)}
                  className="btn btn-secondary btn-sm"
                  disabled={report.status === 'Pending'}
                >
                  <Eye size={15} /> View Report
                </button>
                <button
                  onClick={() => handleDownload(report.testName)}
                  className="btn btn-primary btn-sm"
                  disabled={report.status !== 'Completed'}
                >
                  <Download size={15} /> Download Report
                </button>
              </div>
            </div>

            {/* Results Preview */}
            <div
              style={{
                backgroundColor: 'var(--bg-color)',
                borderRadius: 'var(--radius-md)',
                padding: '14px 16px',
                fontSize: '13.5px',
                color: 'var(--text-secondary)',
                lineHeight: 1.5
              }}
            >
              <strong>Clinical Summary:</strong> {report.resultSummary}
              {report.normalRange && (
                <span style={{ marginLeft: '12px', color: 'var(--text-muted)' }}>
                  (Reference Range: {report.normalRange})
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Lab Report Detail Modal */}
      {selectedReport && (
        <div className="modal-overlay" onClick={() => setSelectedReport(null)}>
          <div
            className="modal-content"
            style={{ maxWidth: '620px', padding: '32px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start" style={{ marginBottom: '20px' }}>
              <div>
                <span className="badge badge-green">Diagnostic Report Result</span>
                <h3 style={{ fontSize: '20px', marginTop: '6px' }}>{selectedReport.testName}</h3>
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                  Category: {selectedReport.category} • Date: {selectedReport.date}
                </div>
              </div>
              <button onClick={() => setSelectedReport(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ padding: '16px', backgroundColor: 'var(--surface-alt)', borderRadius: 'var(--radius-md)', marginBottom: '20px', fontSize: '13.5px' }}>
              <div><strong>Referring Doctor:</strong> {selectedReport.doctorName}</div>
              <div style={{ marginTop: '4px' }}>
                <strong>Specimen Status:</strong> {selectedReport.status}
              </div>
              {selectedReport.normalRange && (
                <div style={{ marginTop: '4px' }}>
                  <strong>Standard Reference Baseline:</strong> {selectedReport.normalRange}
                </div>
              )}
            </div>

            <div style={{ padding: '16px', backgroundColor: 'var(--bg-color)', borderRadius: 'var(--radius-md)', marginBottom: '20px' }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
                Laboratory Impression & Values:
              </div>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                {selectedReport.resultSummary}
              </p>
            </div>

            <div className="flex justify-end gap-sm">
              <button onClick={() => setSelectedReport(null)} className="btn btn-secondary">
                Close
              </button>
              {selectedReport.status === 'Completed' && (
                <button onClick={() => handleDownload(selectedReport.testName)} className="btn btn-primary">
                  <Download size={16} /> Download Signed Diagnostic PDF
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </PortalLayout>
  );
}
