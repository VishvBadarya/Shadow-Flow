import React from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Pill,
  Activity,
  CreditCard,
  Clock,
  ArrowRight,
  HeartPulse,
  TrendingUp,
  FileText,
  AlertCircle,
  CheckCircle2,
  Download
} from 'lucide-react';
import PortalLayout from '../../components/PortalLayout';
import { useApp } from '../../context/AppContext';

export default function PatientDashboard() {
  const { user, appointments, prescriptions, labReports, bills } = useApp();

  const upcomingAppointment = appointments.find(
    (a) => a.status === 'Confirmed' && a.date >= '2026-10-01'
  ) || appointments[0];

  const totalOutstanding = bills
    .filter((b) => b.status === 'Outstanding')
    .reduce((acc, curr) => acc + (curr.amount - curr.paidAmount), 0);

  const pendingReportsCount = labReports.filter((r) => r.status !== 'Completed').length;
  const activePrescriptionsCount = prescriptions.length;

  return (
    <PortalLayout
      role="patient"
      title={`Welcome back, ${user?.name || 'Sarah'} 👋`}
      subtitle="Here is your personal clinical summary, upcoming visits, and active medications."
    >
      {/* 4 Summary Dashboard Cards */}
      <div className="grid grid-cols-4" style={{ marginBottom: '28px' }}>
        {/* Card 1: Upcoming Appointment */}
        <div className="card" style={{ padding: '20px' }}>
          <div className="flex justify-between items-center" style={{ marginBottom: '12px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Next Appointment
            </span>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                backgroundColor: 'var(--primary-light)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Calendar size={18} />
            </div>
          </div>
          <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
            {upcomingAppointment ? upcomingAppointment.doctorName : 'None scheduled'}
          </div>
          <div style={{ fontSize: '12.5px', color: 'var(--primary)', fontWeight: 600 }}>
            {upcomingAppointment ? `${upcomingAppointment.date} at ${upcomingAppointment.timeSlot}` : 'Book now'}
          </div>
          <Link
            to="/portal/patient/appointments"
            style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            Manage visits <ArrowRight size={13} />
          </Link>
        </div>

        {/* Card 2: Active Prescriptions */}
        <div className="card" style={{ padding: '20px' }}>
          <div className="flex justify-between items-center" style={{ marginBottom: '12px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Active Prescriptions
            </span>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                backgroundColor: 'var(--secondary-light)',
                color: 'var(--secondary-dark)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Pill size={18} />
            </div>
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)' }}>
            {activePrescriptionsCount} Regimens
          </div>
          <div style={{ fontSize: '12.5px', color: 'var(--secondary-dark)', fontWeight: 600, marginTop: '2px' }}>
            All refills on schedule
          </div>
          <Link
            to="/portal/patient/prescriptions"
            style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            View medications <ArrowRight size={13} />
          </Link>
        </div>

        {/* Card 3: Pending Lab Reports */}
        <div className="card" style={{ padding: '20px' }}>
          <div className="flex justify-between items-center" style={{ marginBottom: '12px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Diagnostic Labs
            </span>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                backgroundColor: 'var(--warning-light)',
                color: 'var(--warning-dark)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Activity size={18} />
            </div>
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)' }}>
            {pendingReportsCount} Processing
          </div>
          <div style={{ fontSize: '12.5px', color: 'var(--warning-dark)', fontWeight: 600, marginTop: '2px' }}>
            Thyroid panel in progress
          </div>
          <Link
            to="/portal/patient/lab-reports"
            style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            Check status <ArrowRight size={13} />
          </Link>
        </div>

        {/* Card 4: Outstanding Bills */}
        <div className="card" style={{ padding: '20px' }}>
          <div className="flex justify-between items-center" style={{ marginBottom: '12px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Billing Balance
            </span>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                backgroundColor: totalOutstanding > 0 ? 'var(--danger-light)' : 'var(--success-light)',
                color: totalOutstanding > 0 ? 'var(--danger)' : 'var(--success-dark)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <CreditCard size={18} />
            </div>
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: totalOutstanding > 0 ? 'var(--danger)' : 'var(--success-dark)' }}>
            ${totalOutstanding.toFixed(2)}
          </div>
          <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginTop: '2px' }}>
            {totalOutstanding > 0 ? 'Due by Oct 12, 2026' : 'All accounts settled'}
          </div>
          <Link
            to="/portal/patient/billing"
            style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            Review invoices <ArrowRight size={13} />
          </Link>
        </div>
      </div>

      {/* Main Two-Column Dashboard Body */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '28px', marginBottom: '28px' }}>
        {/* Left Column: Upcoming Visit Detail & Health Vitals */}
        <div className="flex flex-col gap-lg">
          {/* Upcoming Appointment Card */}
          {upcomingAppointment && (
            <div className="card" style={{ padding: '24px' }}>
              <div className="flex justify-between items-center" style={{ marginBottom: '16px' }}>
                <div className="flex items-center gap-sm">
                  <span className="badge badge-green">Confirmed Upcoming Visit</span>
                </div>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  ID: {upcomingAppointment.id}
                </span>
              </div>

              <div className="flex items-center justify-between flex-wrap gap-md" style={{ marginBottom: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '18px', color: 'var(--text-primary)' }}>
                    {upcomingAppointment.doctorName}
                  </h3>
                  <div style={{ fontSize: '14px', color: 'var(--primary)', fontWeight: 600 }}>
                    {upcomingAppointment.doctorSpecialty} • {upcomingAppointment.department}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {upcomingAppointment.date}
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                    {upcomingAppointment.timeSlot} ({upcomingAppointment.consultationType})
                  </div>
                </div>
              </div>

              <div
                style={{
                  backgroundColor: 'var(--bg-color)',
                  borderRadius: 'var(--radius-md)',
                  padding: '12px 16px',
                  fontSize: '13px',
                  marginBottom: '16px'
                }}
              >
                <strong>Location:</strong> {upcomingAppointment.hospitalLocation}
                <div style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
                  <strong>Reason:</strong> {upcomingAppointment.reason}
                </div>
              </div>

              <div className="flex justify-between items-center">
                <Link to="/portal/patient/appointments" className="btn btn-secondary btn-sm">
                  View Full Schedule
                </Link>
                <Link to="/book-appointment" className="btn btn-primary btn-sm">
                  + Book Another Visit
                </Link>
              </div>
            </div>
          )}

          {/* Health Summary & Vitals */}
          <div className="card" style={{ padding: '24px' }}>
            <div className="flex justify-between items-center" style={{ marginBottom: '16px' }}>
              <div className="flex items-center gap-xs">
                <HeartPulse size={20} color="var(--primary)" />
                <h3 style={{ fontSize: '17px' }}>Health Vitals & Clinical Tracking</h3>
              </div>
              <span className="badge badge-blue">Last Checked: Aug 15</span>
            </div>

            <div className="grid grid-cols-4" style={{ gap: '12px', marginBottom: '20px' }}>
              <div style={{ padding: '14px', backgroundColor: 'var(--surface-alt)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Blood Pressure</div>
                <div style={{ fontSize: '17px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>138/86</div>
                <div style={{ fontSize: '10px', color: 'var(--warning-dark)' }}>Mild Stage 1</div>
              </div>

              <div style={{ padding: '14px', backgroundColor: 'var(--surface-alt)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Heart Rate</div>
                <div style={{ fontSize: '17px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>74 bpm</div>
                <div style={{ fontSize: '10px', color: 'var(--success-dark)' }}>Normal Sinus</div>
              </div>

              <div style={{ padding: '14px', backgroundColor: 'var(--surface-alt)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Body Weight</div>
                <div style={{ fontSize: '17px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>64.5 kg</div>
                <div style={{ fontSize: '10px', color: 'var(--success-dark)' }}>BMI: 22.4 (Optimal)</div>
              </div>

              <div style={{ padding: '14px', backgroundColor: 'var(--surface-alt)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Fasting Glucose</div>
                <div style={{ fontSize: '17px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>94 mg/dL</div>
                <div style={{ fontSize: '10px', color: 'var(--success-dark)' }}>Euglycemic</div>
              </div>
            </div>

            {/* Visual SVG Vitals Trend Sparkline */}
            <div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
                <span>Systolic Blood Pressure Trend (Last 6 Months)</span>
                <span style={{ fontWeight: 600, color: 'var(--success-dark)' }}>-12 mmHg Improvement</span>
              </div>
              <svg viewBox="0 0 500 80" style={{ width: '100%', height: '80px', overflow: 'visible' }}>
                <defs>
                  <linearGradient id="vitalGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0F6CBD" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#0F6CBD" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path
                  d="M 10,65 L 100,55 L 200,60 L 300,45 L 400,35 L 490,28 L 490,80 L 10,80 Z"
                  fill="url(#vitalGrad)"
                />
                <path
                  d="M 10,65 L 100,55 L 200,60 L 300,45 L 400,35 L 490,28"
                  fill="none"
                  stroke="#0F6CBD"
                  strokeWidth="3"
                />
                {[
                  { x: 10, y: 65, label: '148' },
                  { x: 100, y: 55, label: '144' },
                  { x: 200, y: 60, label: '146' },
                  { x: 300, y: 45, label: '140' },
                  { x: 400, y: 35, label: '136' },
                  { x: 490, y: 28, label: '132' }
                ].map((pt, i) => (
                  <circle key={i} cx={pt.x} cy={pt.y} r="4" fill="#0F6CBD" />
                ))}
              </svg>
            </div>
          </div>
        </div>

        {/* Right Column: Recent Records & Recent Lab Reports */}
        <div className="flex flex-col gap-lg">
          {/* Recent Lab Reports Card */}
          <div className="card" style={{ padding: '24px' }}>
            <div className="flex justify-between items-center" style={{ marginBottom: '16px' }}>
              <h3 style={{ fontSize: '17px' }}>Recent Lab Tests</h3>
              <Link to="/portal/patient/lab-reports" style={{ fontSize: '13px', color: 'var(--primary)', fontWeight: 600 }}>
                View All →
              </Link>
            </div>

            <div className="flex flex-col gap-md">
              {labReports.slice(0, 3).map((lab) => (
                <div
                  key={lab.id}
                  style={{
                    padding: '12px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-light)',
                    backgroundColor: 'var(--surface)'
                  }}
                >
                  <div className="flex justify-between items-start" style={{ marginBottom: '4px' }}>
                    <div style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {lab.testName}
                    </div>
                    <span className={`badge ${lab.status === 'Completed' ? 'badge-green' : lab.status === 'Processing' ? 'badge-amber' : 'badge-gray'}`} style={{ fontSize: '10.5px' }}>
                      {lab.status}
                    </span>
                  </div>
                  <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>
                    Ordered by {lab.doctorName} • {lab.date}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Support / Helpline Box */}
          <div
            className="card"
            style={{
              padding: '24px',
              backgroundColor: 'var(--primary-light)',
              border: '1px solid #BFDBFE'
            }}
          >
            <div className="flex items-center gap-sm" style={{ marginBottom: '8px' }}>
              <Clock size={20} color="var(--primary)" />
              <h3 style={{ fontSize: '16px', color: 'var(--primary-dark)' }}>24/7 Tele-Nurse Hotline</h3>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-primary)', lineHeight: 1.5, marginBottom: '16px' }}>
              Have questions regarding medication dosages or post-consultation symptoms? Connect directly with our on-duty nursing coordinators.
            </p>
            <a href="tel:18006334227" className="btn btn-primary btn-sm" style={{ width: '100%', justifyContent: 'center' }}>
              Dial Nurse Triage: Ext. 101
            </a>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
