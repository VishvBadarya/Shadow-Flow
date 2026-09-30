import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  User,
  Heart,
  Calendar,
  FileText,
  Pill,
  Activity,
  Plus,
  Save,
  CheckCircle2,
  ChevronLeft,
  Download
} from 'lucide-react';
import PortalLayout from '../../components/PortalLayout';
import { useApp } from '../../context/AppContext';

export default function DoctorPatientDetail() {
  const { id } = useParams<{ id: string }>();
  const {
    medicalRecords,
    prescriptions,
    labReports,
    appointments,
    addMedicalRecord,
    addPrescription,
    showToast
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'prescriptions' | 'labs' | 'appointments' | 'notes'>('overview');

  // New Note Modal state
  const [newDiagnosis, setNewDiagnosis] = useState('');
  const [newTreatment, setNewTreatment] = useState('');
  const [newBp, setNewBp] = useState('130/82');
  const [newPulse, setNewPulse] = useState('76');

  // New Prescription Modal state
  const [medName, setMedName] = useState('');
  const [medDosage, setMedDosage] = useState('');
  const [medFrequency, setMedFrequency] = useState('Once daily');
  const [medDuration, setMedDuration] = useState('30 Days');
  const [medInstructions, setMedInstructions] = useState('Take with meals');

  const [noteAddedMsg, setNoteAddedMsg] = useState(false);
  const [rxAddedMsg, setRxAddedMsg] = useState(false);

  // Patient Info
  const patient = {
    id: id || 'p-101',
    name: 'Sarah Jenkins',
    age: 34,
    gender: 'Female',
    bloodGroup: 'A positive (A+)',
    contact: '+1 (555) 234-5678',
    email: 'sarah.jenkins@example.com',
    emergencyContact: 'David Jenkins (Spouse) - +1 (555) 876-5432',
    allergies: ['Penicillin', 'Sulfa drugs']
  };

  const handleAddClinicalNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDiagnosis || !newTreatment) return;

    addMedicalRecord({
      patientId: patient.id,
      visitDate: new Date().toISOString().split('T')[0],
      doctorName: 'Dr. Marcus Vance, MD',
      department: 'Cardiology',
      diagnosis: newDiagnosis,
      treatment: newTreatment,
      vitalSigns: {
        bp: newBp,
        pulse: `${newPulse} bpm`,
        temp: '98.6 °F',
        weight: '64.5 kg'
      },
      attachments: [{ name: `Clinical_Encounter_Note_${Date.now().toString().slice(-4)}.pdf`, size: '640 KB', type: 'PDF' }]
    });

    setNewDiagnosis('');
    setNewTreatment('');
    setNoteAddedMsg(true);
    setTimeout(() => setNoteAddedMsg(false), 3000);
  };

  const handleAddPrescription = (e: React.FormEvent) => {
    e.preventDefault();
    if (!medName || !medDosage) return;

    addPrescription({
      patientId: patient.id,
      patientName: patient.name,
      date: new Date().toISOString().split('T')[0],
      doctorName: 'Dr. Marcus Vance, MD',
      department: 'Cardiology',
      diagnosis: 'Hypertension follow-up & cardiac stabilization',
      medicines: [
        {
          name: medName,
          dosage: medDosage,
          frequency: medFrequency,
          duration: medDuration,
          instructions: medInstructions
        }
      ]
    });

    setMedName('');
    setMedDosage('');
    setRxAddedMsg(true);
    setTimeout(() => setRxAddedMsg(false), 3000);
  };

  return (
    <PortalLayout
      role="doctor"
      title={`Patient Clinical Chart — ${patient.name}`}
      subtitle={`Medical Record #SF-PT-10492 • Registered Outpatient`}
    >
      <div style={{ marginBottom: '20px' }}>
        <Link to="/portal/doctor" className="btn btn-secondary btn-sm">
          <ChevronLeft size={16} /> Back to Doctor Dashboard
        </Link>
      </div>

      {/* Patient Overview Card */}
      <div
        className="card"
        style={{
          padding: '28px',
          marginBottom: '28px',
          backgroundColor: 'var(--surface)',
          borderLeft: '5px solid var(--primary)'
        }}
      >
        <div className="flex justify-between items-start flex-wrap gap-md" style={{ marginBottom: '16px' }}>
          <div>
            <div className="flex items-center gap-sm">
              <h2 style={{ fontSize: '24px', color: 'var(--text-primary)' }}>{patient.name}</h2>
              <span className="badge badge-blue">Active Patient</span>
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
              MRN: SF-PT-10492 • Last visit: Aug 15, 2026
            </div>
          </div>

          <div className="flex items-center gap-xs">
            <span className="badge badge-red" style={{ fontSize: '12px', padding: '4px 10px' }}>
              Allergies: {patient.allergies.join(', ')}
            </span>
          </div>
        </div>

        {/* Demographics Row */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            backgroundColor: 'var(--bg-color)',
            borderRadius: 'var(--radius-md)',
            padding: '16px',
            gap: '12px',
            fontSize: '13px'
          }}
        >
          <div>
            <div style={{ color: 'var(--text-muted)' }}>Age / Gender</div>
            <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{patient.age} Yrs / {patient.gender}</div>
          </div>
          <div>
            <div style={{ color: 'var(--text-muted)' }}>Blood Group</div>
            <div style={{ fontWeight: 700, color: 'var(--primary)' }}>{patient.bloodGroup}</div>
          </div>
          <div>
            <div style={{ color: 'var(--text-muted)' }}>Contact Phone</div>
            <div style={{ fontWeight: 600 }}>{patient.contact}</div>
          </div>
          <div style={{ gridColumn: 'span 2' }}>
            <div style={{ color: 'var(--text-muted)' }}>Emergency Contact</div>
            <div style={{ fontWeight: 600 }}>{patient.emergencyContact}</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: 'flex',
          borderBottom: '2px solid var(--border)',
          gap: '8px',
          marginBottom: '24px'
        }}
      >
        {[
          { id: 'overview', label: 'Clinical Overview' },
          { id: 'history', label: 'Medical History' },
          { id: 'prescriptions', label: 'Prescriptions' },
          { id: 'labs', label: 'Lab Reports' },
          { id: 'appointments', label: 'Appointments' },
          { id: 'notes', label: 'Add Clinical Note & Rx' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            style={{
              padding: '12px 18px',
              fontSize: '13.5px',
              fontWeight: 600,
              background: 'none',
              border: 'none',
              borderBottom: activeTab === tab.id ? '3px solid var(--primary)' : '3px solid transparent',
              color: activeTab === tab.id ? 'var(--primary)' : 'var(--text-secondary)',
              cursor: 'pointer',
              transition: 'var(--transition)'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-2" style={{ gap: '24px' }}>
          <div className="card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '17px', marginBottom: '14px' }}>Active Clinical Diagnoses</h3>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13.5px' }}>
              <li className="flex items-center gap-sm">
                <CheckCircle2 size={16} color="var(--primary)" />
                <span>Stage 1 Essential Hypertension (Controlled on Telmisartan 20mg)</span>
              </li>
              <li className="flex items-center gap-sm">
                <CheckCircle2 size={16} color="var(--primary)" />
                <span>Borderline Hypercholesterolemia (LDL 138 mg/dL)</span>
              </li>
              <li className="flex items-center gap-sm">
                <CheckCircle2 size={16} color="var(--primary)" />
                <span>Occasional Sinus Tachycardia (Non-arrhythmic)</span>
              </li>
            </ul>
          </div>

          <div className="card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '17px', marginBottom: '14px' }}>Latest Vitals at Triage</h3>
            <div className="grid grid-cols-2" style={{ gap: '12px', fontSize: '13.5px' }}>
              <div style={{ padding: '12px', backgroundColor: 'var(--surface-alt)', borderRadius: 'var(--radius-sm)' }}>
                <strong>BP:</strong> 138/86 mmHg
              </div>
              <div style={{ padding: '12px', backgroundColor: 'var(--surface-alt)', borderRadius: 'var(--radius-sm)' }}>
                <strong>Pulse:</strong> 74 bpm
              </div>
              <div style={{ padding: '12px', backgroundColor: 'var(--surface-alt)', borderRadius: 'var(--radius-sm)' }}>
                <strong>SpO2:</strong> 99% Room Air
              </div>
              <div style={{ padding: '12px', backgroundColor: 'var(--surface-alt)', borderRadius: 'var(--radius-sm)' }}>
                <strong>BMI:</strong> 22.4 (Normal)
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: HISTORY */}
      {activeTab === 'history' && (
        <div className="flex flex-col gap-md">
          {medicalRecords.map((rec) => (
            <div key={rec.id} className="card" style={{ padding: '24px' }}>
              <div className="flex justify-between items-start" style={{ marginBottom: '8px' }}>
                <h4 style={{ fontSize: '16px', color: 'var(--text-primary)' }}>{rec.diagnosis}</h4>
                <span className="badge badge-blue">{rec.visitDate}</span>
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                Attending: {rec.doctorName} • Department of {rec.department}
              </div>
              <div style={{ padding: '12px', backgroundColor: 'var(--bg-color)', borderRadius: 'var(--radius-sm)', fontSize: '13.5px' }}>
                <strong>Treatment Plan:</strong> {rec.treatment}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: PRESCRIPTIONS */}
      {activeTab === 'prescriptions' && (
        <div className="flex flex-col gap-md">
          {prescriptions.map((rx) => (
            <div key={rx.id} className="card" style={{ padding: '24px' }}>
              <div className="flex justify-between items-start" style={{ marginBottom: '12px' }}>
                <div>
                  <h4 style={{ fontSize: '16px' }}>Diagnosis: {rx.diagnosis}</h4>
                  <div style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
                    Prescribed by {rx.doctorName} • Date: {rx.date}
                  </div>
                </div>
                <span className="badge badge-teal">Rx #{rx.id}</span>
              </div>
              <div className="flex flex-col gap-xs">
                {rx.medicines.map((m, i) => (
                  <div key={i} style={{ fontSize: '13px', padding: '6px 0', borderBottom: '1px solid var(--border-light)' }}>
                    <strong>{m.name} {m.dosage}</strong> — {m.frequency} for {m.duration} ({m.instructions})
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 4: LABS */}
      {activeTab === 'labs' && (
        <div className="flex flex-col gap-md">
          {labReports.map((lab) => (
            <div key={lab.id} className="card" style={{ padding: '20px' }}>
              <div className="flex justify-between items-center" style={{ marginBottom: '8px' }}>
                <h4 style={{ fontSize: '15px' }}>{lab.testName}</h4>
                <span className={`badge ${lab.status === 'Completed' ? 'badge-green' : 'badge-amber'}`}>
                  {lab.status}
                </span>
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                {lab.resultSummary}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 5: APPOINTMENTS */}
      {activeTab === 'appointments' && (
        <div className="flex flex-col gap-md">
          {appointments.map((apt) => (
            <div key={apt.id} className="card" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ fontSize: '15px' }}>{apt.doctorName} ({apt.department})</h4>
                <div style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginTop: '2px' }}>
                  {apt.date} at {apt.timeSlot} • {apt.consultationType}
                </div>
                <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  Reason: {apt.reason}
                </div>
              </div>
              <span className={`badge ${apt.status === 'Confirmed' ? 'badge-green' : 'badge-blue'}`}>
                {apt.status}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* TAB 6: ADD CLINICAL NOTE & PRESCRIPTION */}
      {activeTab === 'notes' && (
        <div className="grid grid-cols-2" style={{ gap: '28px' }}>
          {/* Add Note Form */}
          <div className="card" style={{ padding: '28px' }}>
            <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>Add Clinical Consultation Note</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
              Record findings and treatment advice directly into patient EMR.
            </p>

            {noteAddedMsg && (
              <div style={{ padding: '10px', backgroundColor: 'var(--success-light)', color: 'var(--success-dark)', borderRadius: 'var(--radius-sm)', marginBottom: '16px', fontSize: '13px' }}>
                ✓ Clinical encounter note successfully committed to patient record!
              </div>
            )}

            <form onSubmit={handleAddClinicalNote}>
              <div className="form-group">
                <label className="form-label">Clinical Impression / Diagnosis</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mild Angina Pectoris, improved BP control"
                  value={newDiagnosis}
                  onChange={(e) => setNewDiagnosis(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="grid grid-cols-2" style={{ gap: '10px' }}>
                <div className="form-group">
                  <label className="form-label">Current Blood Pressure</label>
                  <input
                    type="text"
                    value={newBp}
                    onChange={(e) => setNewBp(e.target.value)}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Heart Rate (bpm)</label>
                  <input
                    type="text"
                    value={newPulse}
                    onChange={(e) => setNewPulse(e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Detailed Treatment & Physician Advice</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Prescribe clinical advice, diagnostic tests ordered, or dietary modifications..."
                  value={newTreatment}
                  onChange={(e) => setNewTreatment(e.target.value)}
                  className="form-textarea"
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                <Save size={16} /> Save Clinical Note to EMR
              </button>
            </form>
          </div>

          {/* Add Prescription Form */}
          <div className="card" style={{ padding: '28px' }}>
            <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>Issue Digital Prescription</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
              Add a new pharmaceutical item to {patient.name}'s active medication chart.
            </p>

            {rxAddedMsg && (
              <div style={{ padding: '10px', backgroundColor: 'var(--secondary-light)', color: 'var(--secondary-dark)', borderRadius: 'var(--radius-sm)', marginBottom: '16px', fontSize: '13px' }}>
                ✓ New prescription successfully generated and sent to hospital pharmacy!
              </div>
            )}

            <form onSubmit={handleAddPrescription}>
              <div className="form-group">
                <label className="form-label">Medication Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Amlodipine Besylate"
                  value={medName}
                  onChange={(e) => setMedName(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="grid grid-cols-2" style={{ gap: '10px' }}>
                <div className="form-group">
                  <label className="form-label">Dosage</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 5 mg"
                    value={medDosage}
                    onChange={(e) => setMedDosage(e.target.value)}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Frequency</label>
                  <input
                    type="text"
                    value={medFrequency}
                    onChange={(e) => setMedFrequency(e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2" style={{ gap: '10px' }}>
                <div className="form-group">
                  <label className="form-label">Duration</label>
                  <input
                    type="text"
                    value={medDuration}
                    onChange={(e) => setMedDuration(e.target.value)}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Instructions</label>
                  <input
                    type="text"
                    value={medInstructions}
                    onChange={(e) => setMedInstructions(e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-teal" style={{ width: '100%', justifyContent: 'center' }}>
                <Plus size={16} /> Add to Patient Prescription Chart
              </button>
            </form>
          </div>
        </div>
      )}
    </PortalLayout>
  );
}
