import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Calendar,
  Users,
  Activity,
  Clock,
  Video,
  FileText,
  Pill,
  CheckCircle2,
  Stethoscope,
  ChevronRight,
  Plus
} from 'lucide-react';
import PortalLayout from '../../components/PortalLayout';
import { useApp } from '../../context/AppContext';

export default function DoctorDashboard() {
  const { user, appointments, updateAppointmentStatus, showToast } = useApp();
  const navigate = useNavigate();

  // Active consultation simulation state
  const [activeConsultation, setActiveConsultation] = useState<string | null>(null);

  const todaysAppointments = appointments.filter((a) => a.date >= '2026-10-01').slice(0, 5);

  const handleStartConsultation = (patientName: string) => {
    setActiveConsultation(patientName);
    showToast(`Started consultation session with ${patientName}`, 'success');
  };

  return (
    <PortalLayout
      role="doctor"
      title={`Doctor Clinical Workspace — Dr. Marcus Vance, MD`}
      subtitle="Senior Director, Department of Cardiology & Cath Lab • Cosmic Surgical Wing"
    >
      {/* 4 Dashboard Statistics Cards */}
      <div className="grid grid-cols-4" style={{ marginBottom: '28px' }}>
        <div className="card" style={{ padding: '20px' }}>
          <div className="flex justify-between items-center" style={{ marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Today's Appointments
            </span>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Calendar size={18} />
            </div>
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)' }}>
            8 Visits
          </div>
          <div style={{ fontSize: '12px', color: 'var(--success-dark)', fontWeight: 600, marginTop: '2px' }}>
            ● 3 Completed • 5 Remaining
          </div>
        </div>

        <div className="card" style={{ padding: '20px' }}>
          <div className="flex justify-between items-center" style={{ marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Total Assigned Patients
            </span>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: 'var(--secondary-light)', color: 'var(--secondary-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={18} />
            </div>
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)' }}>
            142 Active
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Inpatient CCU & OPD Roster
          </div>
        </div>

        <div className="card" style={{ padding: '20px' }}>
          <div className="flex justify-between items-center" style={{ marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Pending Lab Reviews
            </span>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: 'var(--warning-light)', color: 'var(--warning-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Activity size={18} />
            </div>
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--warning-dark)' }}>
            4 Reports
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Requires physician sign-off
          </div>
        </div>

        <div className="card" style={{ padding: '20px' }}>
          <div className="flex justify-between items-center" style={{ marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Post-Op Follow-ups
            </span>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Stethoscope size={18} />
            </div>
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)' }}>
            3 Patients
          </div>
          <div style={{ fontSize: '12px', color: 'var(--primary)', marginTop: '2px' }}>
            TAVR & Angioplasty Day-3
          </div>
        </div>
      </div>

      {/* Main Grid: Today's Schedule Timeline & Patient Queue */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '28px' }}>
        {/* Left: Patient List with Clinical Action Triggers */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: '18px' }}>Today's Clinical Patient Queue</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Select a patient to review EMR history, initiate encounter, or issue e-prescriptions.
              </p>
            </div>
            <span className="badge badge-blue">OPD Room 408</span>
          </div>

          <div className="table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Patient Name</th>
                  <th>Age / Gen</th>
                  <th>Time Slot</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {todaysAppointments.map((apt) => (
                  <tr key={apt.id}>
                    <td>
                      <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                        {apt.patientName}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>ID: {apt.patientId}</div>
                    </td>
                    <td>34 / F</td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{apt.timeSlot}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{apt.date}</div>
                    </td>
                    <td style={{ maxWidth: '180px', fontSize: '12.5px' }}>
                      {apt.reason}
                    </td>
                    <td>
                      <span className={`badge ${apt.status === 'Confirmed' ? 'badge-green' : apt.status === 'Completed' ? 'badge-blue' : 'badge-amber'}`}>
                        {apt.status}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div className="flex items-center justify-end gap-xs">
                        <Link
                          to={`/portal/doctor/patient/${apt.patientId}`}
                          className="btn btn-secondary btn-sm"
                          title="Open Chart"
                        >
                          View Patient
                        </Link>
                        <button
                          onClick={() => handleStartConsultation(apt.patientName)}
                          className="btn btn-teal btn-sm"
                        >
                          Start Visit
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Today's Clinical Schedule Timeline */}
        <div className="flex flex-col gap-lg">
          <div className="card" style={{ padding: '24px' }}>
            <div className="flex justify-between items-center" style={{ marginBottom: '18px' }}>
              <div className="flex items-center gap-xs">
                <Clock size={18} color="var(--primary)" />
                <h3 style={{ fontSize: '17px' }}>Today's Timeline Schedule</h3>
              </div>
              <span className="badge badge-teal">Oct 01, 2026</span>
            </div>

            <div className="flex flex-col gap-md">
              {[
                { time: '08:30 AM', title: 'CCU Morning Rounds & PACU Handover', tag: 'Inpatient' },
                { time: '10:00 AM', title: 'Diagnostic Cath Lab (Coronary Stent)', tag: 'Cath Lab' },
                { time: '11:00 AM', title: 'Outpatient Clinic (Sarah Jenkins)', tag: 'OPD Visit' },
                { time: '01:30 PM', title: 'Inter-Disciplinary Tumor Board Case Review', tag: 'Conference' },
                { time: '02:30 PM', title: 'Pre-Op PAC Fitness (Robert Vance Jr.)', tag: 'OPD Visit' },
                { time: '04:00 PM', title: 'Telehealth Consultations Block', tag: 'Telehealth' }
              ].map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    borderLeft: '2px solid var(--primary)',
                    paddingLeft: '14px'
                  }}
                >
                  <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--primary)', minWidth: '65px' }}>
                    {item.time}
                  </div>
                  <div>
                    <div style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {item.title}
                    </div>
                    <span className="badge badge-gray" style={{ fontSize: '10.5px', marginTop: '4px' }}>
                      {item.tag}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Doctor Actions */}
          <div className="card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '16px', marginBottom: '14px' }}>Rapid Clinical Actions</h3>
            <div className="flex flex-col gap-sm">
              <Link to="/portal/doctor/patient/p-101" className="btn btn-outline-primary btn-sm" style={{ justifyContent: 'flex-start' }}>
                <FileText size={15} /> Add Consultation Note for Sarah Jenkins
              </Link>
              <Link to="/portal/doctor/patient/p-101" className="btn btn-outline-primary btn-sm" style={{ justifyContent: 'flex-start' }}>
                <Pill size={15} /> Issue New Digital Prescription
              </Link>
              <Link to="/portal/doctor/schedule" className="btn btn-secondary btn-sm" style={{ justifyContent: 'flex-start' }}>
                <Calendar size={15} /> Adjust Consultation Availability Slots
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
