import React from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  HeartPulse,
  Brain,
  Bone,
  Baby,
  Sparkles,
  ShieldAlert,
  Stethoscope,
  CheckCircle2,
  Calendar,
  ChevronLeft,
  Award,
  Users,
  Bed,
  ArrowRight
} from 'lucide-react';
import { DEPARTMENTS, DOCTORS } from '../data/mockData';

export default function DepartmentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const department = DEPARTMENTS.find((d) => d.id === id) || DEPARTMENTS[0];

  const affiliatedDoctors = DOCTORS.filter(
    (doc) => doc.hospitalDepartment.toLowerCase() === department.name.toLowerCase()
  );

  return (
    <div style={{ backgroundColor: 'var(--bg-color)', minHeight: '100vh', padding: '40px 0 80px' }}>
      <div className="container">
        {/* Breadcrumb */}
        <div style={{ marginBottom: '24px' }}>
          <Link
            to="/departments"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '14px',
              color: 'var(--text-secondary)'
            }}
          >
            <ChevronLeft size={16} /> Back to Departments
          </Link>
        </div>

        {/* Main Header Card */}
        <div
          className="card"
          style={{
            padding: '36px',
            marginBottom: '36px',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div className="flex justify-between items-start flex-wrap gap-md" style={{ marginBottom: '20px' }}>
            <div>
              <span className="badge badge-teal" style={{ marginBottom: '8px' }}>
                Center of Clinical Excellence
              </span>
              <h1 style={{ fontSize: '32px', color: 'var(--text-primary)' }}>
                Department of {department.name}
              </h1>
              <p style={{ fontSize: '15px', color: 'var(--text-secondary)', marginTop: '6px' }}>
                Director: <strong>{department.headOfDept}</strong>
              </p>
            </div>

            <Link to="/book-appointment" className="btn btn-primary btn-lg">
              <Calendar size={18} /> Schedule Department Consultation
            </Link>
          </div>

          <p style={{ fontSize: '16px', lineHeight: 1.7, color: 'var(--text-secondary)', maxWidth: '900px', marginBottom: '28px' }}>
            {department.longDesc}
          </p>

          {/* Operational Metrics */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              backgroundColor: 'var(--surface-alt)',
              borderRadius: 'var(--radius-lg)',
              padding: '20px 24px',
              gap: '16px',
              textAlign: 'center'
            }}
          >
            <div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Bed Capacity</div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>{department.bedCapacity}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Dedicated ICU & Step-down</div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Surgeries Completed</div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--primary)', marginTop: '4px' }}>{department.surgeriesCompleted}+</div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>99.2% Clinical Success</div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Faculty Roster</div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>{department.doctorsCount}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Board Certified Specialists</div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Emergency Response</div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--success-dark)', marginTop: '4px' }}>24/7</div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Code Protocol Ready</div>
            </div>
          </div>
        </div>

        {/* Two Column Layout: Key Procedures vs Attending Specialists */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
          {/* Key Clinical Procedures */}
          <div className="card" style={{ padding: '32px' }}>
            <h2 style={{ fontSize: '20px', marginBottom: '16px' }}>Core Procedures & Technologies</h2>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
              Advanced procedural standards supported by computer-navigation and minimally invasive surgical suites.
            </p>

            <div className="flex flex-col gap-md">
              {department.keyProcedures.map((proc, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '14px 18px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--bg-color)',
                    border: '1px solid var(--border)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}
                >
                  <CheckCircle2 size={18} color="var(--primary)" style={{ flexShrink: 0 }} />
                  <span style={{ fontSize: '14.5px', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {proc}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Department Faculty */}
          <div className="card" style={{ padding: '32px' }}>
            <h2 style={{ fontSize: '20px', marginBottom: '16px' }}>Attending Specialists</h2>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
              Consult directly with senior physicians accredited with this division.
            </p>

            <div className="flex flex-col gap-md">
              {affiliatedDoctors.map((doc) => (
                <div
                  key={doc.id}
                  style={{
                    padding: '16px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border)',
                    backgroundColor: 'var(--surface)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px'
                  }}
                >
                  <div className="flex items-center gap-md">
                    <img
                      src={doc.image}
                      alt={doc.name}
                      style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <div>
                      <div style={{ fontSize: '15px', fontWeight: 700 }}>{doc.name}</div>
                      <div style={{ fontSize: '12.5px', color: 'var(--primary)' }}>{doc.specialty} • {doc.experience} yrs exp</div>
                      <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>Fee: ${doc.consultationFee}</div>
                    </div>
                  </div>

                  <Link to={`/doctor/${doc.id}`} className="btn btn-secondary btn-sm">
                    Profile
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
