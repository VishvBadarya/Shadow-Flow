import React from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Calendar,
  Stethoscope,
  DollarSign,
  AlertTriangle,
  TrendingUp,
  Building,
  Activity,
  ArrowUpRight,
  ShieldCheck,
  Bed
} from 'lucide-react';
import PortalLayout from '../../components/PortalLayout';
import { useApp } from '../../context/AppContext';

export default function AdminDashboard() {
  const { appointments, bills } = useApp();

  return (
    <PortalLayout
      role="admin"
      title="Hospital Enterprise Administration Console"
      subtitle="Real-time multi-department operational telemetry, capacity tracking, and clinical throughput."
    >
      {/* 5 Enterprise Dashboard KPI Cards */}
      <div className="grid grid-cols-4" style={{ marginBottom: '28px' }}>
        {/* Total Patients */}
        <div className="card" style={{ padding: '20px' }}>
          <div className="flex justify-between items-center" style={{ marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Total Registered Patients
            </span>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={18} />
            </div>
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)' }}>
            52,480
          </div>
          <div style={{ fontSize: '12px', color: 'var(--success-dark)', fontWeight: 600, marginTop: '2px', display: 'flex', alignItems: 'center', gap: '3px' }}>
            <TrendingUp size={13} /> +12.4% this month
          </div>
        </div>

        {/* Today's Appointments */}
        <div className="card" style={{ padding: '20px' }}>
          <div className="flex justify-between items-center" style={{ marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Today's Bookings
            </span>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: 'var(--secondary-light)', color: 'var(--secondary-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Calendar size={18} />
            </div>
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)' }}>
            184 Visits
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
            92% Clinic Utilization Rate
          </div>
        </div>

        {/* Active Doctors */}
        <div className="card" style={{ padding: '20px' }}>
          <div className="flex justify-between items-center" style={{ marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Attending Physicians
            </span>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Stethoscope size={18} />
            </div>
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)' }}>
            148 On-Duty
          </div>
          <div style={{ fontSize: '12px', color: 'var(--success-dark)', marginTop: '2px', fontWeight: 600 }}>
            ● 25 Departments Active
          </div>
        </div>

        {/* Daily Revenue */}
        <div className="card" style={{ padding: '20px' }}>
          <div className="flex justify-between items-center" style={{ marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Today's Revenue Flow
            </span>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: 'var(--success-light)', color: 'var(--success-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <DollarSign size={18} />
            </div>
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--primary)' }}>
            $64,820
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Target: $58,000 (+11.7%)
          </div>
        </div>
      </div>

      {/* Emergency Active Ribbon */}
      <div
        style={{
          backgroundColor: '#FEF2F2',
          border: '1px solid #FECACA',
          borderRadius: 'var(--radius-lg)',
          padding: '16px 20px',
          marginBottom: '28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}
      >
        <div className="flex items-center gap-sm">
          <span className="pulse-dot"></span>
          <div>
            <strong style={{ color: '#DC2626', fontSize: '14px' }}>Live Emergency Status: 3 Active Resuscitation Cases</strong>
            <div style={{ fontSize: '12px', color: '#991B1B' }}>
              1 acute myocardial infarction in Cath Lab 2 • 2 trauma resuscitations in Bay A & B
            </div>
          </div>
        </div>
        <Link to="/emergency" className="btn btn-danger btn-sm">
          View ER Flow Console
        </Link>
      </div>

      {/* ShadowFlow AI Clinical Process Mining Alert Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(20, 184, 166, 0.1) 0%, rgba(15, 108, 189, 0.08) 100%)',
          border: '1px solid rgba(20, 184, 166, 0.35)',
          borderRadius: 'var(--radius-lg)',
          padding: '18px 24px',
          marginBottom: '28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: 'var(--secondary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(20, 184, 166, 0.3)' }}>
            <Activity size={22} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <strong style={{ fontSize: '15px', color: 'var(--text-primary)' }}>
                ShadowFlow AI Process Mining Engine: 3 Critical Friction Loops Detected
              </strong>
              <span className="badge badge-teal">Live Telemetry</span>
            </div>
            <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginTop: '2px' }}>
              38% PAC clearance bypass rate in general surgery • 3.0x CSSD re-indent loops • 31,681 surgical case events analyzed across 8 perioperative workflows.
            </div>
          </div>
        </div>

        <Link
          to="/portal/admin/intelligence"
          className="btn btn-teal btn-sm"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}
        >
          <span>Open Clinical Process Mining</span>
          <ArrowUpRight size={14} />
        </Link>
      </div>

      {/* Two Column Visual Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '28px', marginBottom: '28px' }}>
        {/* Chart 1: Appointment & Patient Trends */}
        <div className="card" style={{ padding: '24px' }}>
          <div className="flex justify-between items-center" style={{ marginBottom: '18px' }}>
            <div>
              <h3 style={{ fontSize: '17px' }}>Weekly Patient Registration & Admission Trends</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Mon through Sun volume comparisons</p>
            </div>
            <span className="badge badge-blue">Last 7 Days</span>
          </div>

          <svg viewBox="0 0 500 180" style={{ width: '100%', height: '180px' }}>
            <defs>
              <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0F6CBD" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#0F6CBD" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Grid lines */}
            <line x1="40" y1="20" x2="480" y2="20" stroke="#F1F5F9" strokeWidth="1" />
            <line x1="40" y1="60" x2="480" y2="60" stroke="#F1F5F9" strokeWidth="1" />
            <line x1="40" y1="100" x2="480" y2="100" stroke="#F1F5F9" strokeWidth="1" />
            <line x1="40" y1="140" x2="480" y2="140" stroke="#F1F5F9" strokeWidth="1" />

            {/* Area Path */}
            <path
              d="M 50,130 L 110,110 L 180,75 L 250,90 L 320,45 L 390,60 L 460,30 L 460,150 L 50,150 Z"
              fill="url(#chartGrad)"
            />

            {/* Line Path */}
            <path
              d="M 50,130 L 110,110 L 180,75 L 250,90 L 320,45 L 390,60 L 460,30"
              fill="none"
              stroke="#0F6CBD"
              strokeWidth="3"
            />

            {/* Dots */}
            {[
              { x: 50, y: 130, day: 'Mon', val: '120' },
              { x: 110, y: 110, day: 'Tue', val: '145' },
              { x: 180, y: 75, day: 'Wed', val: '190' },
              { x: 250, y: 90, day: 'Thu', val: '175' },
              { x: 320, y: 45, day: 'Fri', val: '230' },
              { x: 390, y: 60, day: 'Sat', val: '210' },
              { x: 460, y: 30, day: 'Sun', val: '245' }
            ].map((p, i) => (
              <g key={i}>
                <circle cx={p.x} cy={p.y} r="4" fill="#0F6CBD" stroke="#FFFFFF" strokeWidth="2" />
                <text x={p.x} y="165" fontSize="11" fill="#64748B" textAnchor="middle">{p.day}</text>
              </g>
            ))}
          </svg>
        </div>

        {/* Chart 2: Department Bed Utilization */}
        <div className="card" style={{ padding: '24px' }}>
          <div className="flex justify-between items-center" style={{ marginBottom: '18px' }}>
            <div>
              <h3 style={{ fontSize: '17px' }}>Department Bed Occupancy</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Capacity vs. Inpatient load</p>
            </div>
            <span className="badge badge-teal">Overall: 88%</span>
          </div>

          <div className="flex flex-col gap-sm">
            {[
              { name: 'Cardiology CCU', pct: 92, occupied: '59 / 64 Beds', color: 'var(--primary)' },
              { name: 'Orthopedics Step-down', pct: 85, occupied: '44 / 52 Beds', color: 'var(--secondary)' },
              { name: 'Neurology Acute Stroke', pct: 94, occupied: '45 / 48 Beds', color: '#DC2626' },
              { name: 'General Medicine Wards', pct: 80, occupied: '60 / 75 Beds', color: 'var(--primary)' },
              { name: 'Pediatrics Level IV NICU', pct: 88, occupied: '35 / 40 Beds', color: 'var(--secondary)' }
            ].map((d, idx) => (
              <div key={idx} style={{ marginBottom: '4px' }}>
                <div className="flex justify-between items-center" style={{ fontSize: '12.5px', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 600 }}>{d.name}</span>
                  <span style={{ color: 'var(--text-secondary)' }}>{d.occupied} ({d.pct}%)</span>
                </div>
                <div style={{ height: '8px', backgroundColor: 'var(--surface-alt)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${d.pct}%`,
                      backgroundColor: d.color,
                      borderRadius: '4px'
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Admin Actions Row */}
      <div className="card" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '17px', marginBottom: '16px' }}>Master Administration Controls</h3>
        <div className="grid grid-cols-4" style={{ gap: '14px' }}>
          <Link to="/portal/admin/doctors" className="btn btn-secondary btn-sm" style={{ padding: '12px', justifyContent: 'center' }}>
            <Stethoscope size={16} /> Manage Doctor Roster
          </Link>
          <Link to="/portal/admin/patients" className="btn btn-secondary btn-sm" style={{ padding: '12px', justifyContent: 'center' }}>
            <Users size={16} /> Patient Records Directory
          </Link>
          <Link to="/portal/admin/appointments" className="btn btn-secondary btn-sm" style={{ padding: '12px', justifyContent: 'center' }}>
            <Calendar size={16} /> Master Appointments
          </Link>
          <Link to="/portal/admin/analytics" className="btn btn-secondary btn-sm" style={{ padding: '12px', justifyContent: 'center' }}>
            <Activity size={16} /> Full Analytics Reports
          </Link>
        </div>
      </div>
    </PortalLayout>
  );
}
