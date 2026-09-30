import React, { useState } from 'react';
import { Pill, Download, Eye, Calendar, User, Clock, FileText, CheckCircle2, X } from 'lucide-react';
import PortalLayout from '../../components/PortalLayout';
import { useApp } from '../../context/AppContext';
import type { Prescription } from '../../types';

export default function PatientPrescriptions() {
  const { prescriptions, showToast } = useApp();
  const [selectedRx, setSelectedRx] = useState<Prescription | null>(null);

  const handleDownload = (id: string) => {
    const slip = `===========================================================\nSHADOWFLOW MEDICARE NEXUS — DIGITAL PRESCRIPTION\n===========================================================\nRx Number: ${id}\nPatient: Sarah Jenkins\nInstitution: ShadowFlow MediCare Nexus Multi-Specialty Hospital\n===========================================================\nValid e-signed medical prescription document.`;
    const blob = new Blob([slip], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Prescription_${id}.txt`;
    link.click();
    showToast(`Prescription ${id} downloaded`, 'success');
  };

  return (
    <PortalLayout
      role="patient"
      title="Active Prescriptions & Medications"
      subtitle="Digital e-prescriptions issued by attending physicians with dosages and refill instructions."
    >
      <div className="flex flex-col gap-lg">
        {prescriptions.map((rx) => (
          <div key={rx.id} className="card" style={{ padding: '28px' }}>
            {/* Header */}
            <div className="flex justify-between items-start flex-wrap gap-md" style={{ marginBottom: '20px', borderBottom: '1px solid var(--border-light)', paddingBottom: '16px' }}>
              <div>
                <span className="badge badge-teal" style={{ marginBottom: '6px' }}>
                  {rx.department}
                </span>
                <h3 style={{ fontSize: '18px', color: 'var(--text-primary)' }}>
                  Diagnosis: {rx.diagnosis}
                </h3>
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  Prescribed by <strong>{rx.doctorName}</strong> on {rx.date} • Rx #{rx.id}
                </div>
              </div>

              <div className="flex items-center gap-sm">
                <button onClick={() => setSelectedRx(rx)} className="btn btn-secondary btn-sm">
                  <Eye size={15} /> View Prescription
                </button>
                <button onClick={() => handleDownload(rx.id)} className="btn btn-primary btn-sm">
                  <Download size={15} /> Download
                </button>
              </div>
            </div>

            {/* Medicines List Grid */}
            <div className="flex flex-col gap-sm">
              {rx.medicines.map((med, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '14px 18px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--surface-alt)',
                    border: '1px solid var(--border-light)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '12px'
                  }}
                >
                  <div className="flex items-center gap-md">
                    <div
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '8px',
                        backgroundColor: 'var(--primary-light)',
                        color: 'var(--primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Pill size={18} />
                    </div>
                    <div>
                      <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>
                        {med.name}
                      </div>
                      <div style={{ fontSize: '12.5px', color: 'var(--primary)' }}>
                        Dosage: <strong>{med.dosage}</strong> • Frequency: {med.frequency}
                      </div>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--text-primary)' }}>
                      Duration: {med.duration}
                    </div>
                    <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                      {med.instructions}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Prescription Detail Modal */}
      {selectedRx && (
        <div className="modal-overlay" onClick={() => setSelectedRx(null)}>
          <div
            className="modal-content"
            style={{ maxWidth: '600px', padding: '32px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start" style={{ marginBottom: '20px' }}>
              <div>
                <span className="badge badge-teal">Official Medical Rx</span>
                <h3 style={{ fontSize: '20px', marginTop: '6px' }}>Prescription Slip #{selectedRx.id}</h3>
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                  Doctor: {selectedRx.doctorName} ({selectedRx.department})
                </div>
              </div>
              <button onClick={() => setSelectedRx(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ padding: '12px 16px', backgroundColor: 'var(--surface-alt)', borderRadius: 'var(--radius-md)', marginBottom: '20px', fontSize: '13px' }}>
              <div><strong>Patient Name:</strong> {selectedRx.patientName}</div>
              <div><strong>Diagnosis:</strong> {selectedRx.diagnosis}</div>
              <div><strong>Date of Issue:</strong> {selectedRx.date}</div>
            </div>

            <div className="flex flex-col gap-sm">
              {selectedRx.medicines.map((m, i) => (
                <div key={i} style={{ borderBottom: '1px solid var(--border-light)', paddingBottom: '10px' }}>
                  <div style={{ fontWeight: 700, fontSize: '14px' }}>{i + 1}. {m.name} ({m.dosage})</div>
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    {m.frequency} • Duration: {m.duration}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--primary)', marginTop: '2px' }}>
                    Note: {m.instructions}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-sm" style={{ marginTop: '24px' }}>
              <button onClick={() => setSelectedRx(null)} className="btn btn-secondary">
                Close
              </button>
              <button onClick={() => handleDownload(selectedRx.id)} className="btn btn-primary">
                <Download size={16} /> Download Copy
              </button>
            </div>
          </div>
        </div>
      )}
    </PortalLayout>
  );
}
