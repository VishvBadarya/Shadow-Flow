import React from 'react';
import { Link } from 'react-router-dom';
import {
  HeartPulse,
  Brain,
  Bone,
  Baby,
  Sparkles,
  ShieldAlert,
  Stethoscope,
  ChevronRight,
  Bed,
  Users,
  Award
} from 'lucide-react';
import { DEPARTMENTS } from '../data/mockData';

export default function DepartmentsPage() {
  const getDepartmentIcon = (iconName: string) => {
    switch (iconName) {
      case 'HeartPulse': return <HeartPulse size={28} color="var(--primary)" />;
      case 'Brain': return <Brain size={28} color="var(--primary)" />;
      case 'Bone': return <Bone size={28} color="var(--primary)" />;
      case 'Baby': return <Baby size={28} color="var(--primary)" />;
      case 'Sparkles': return <Sparkles size={28} color="var(--primary)" />;
      case 'ShieldAlert': return <ShieldAlert size={28} color="var(--primary)" />;
      case 'HeartHandshake': return <HeartPulse size={28} color="var(--primary)" />;
      default: return <Stethoscope size={28} color="var(--primary)" />;
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-color)', minHeight: '100vh', paddingBottom: '80px' }}>
      {/* Header */}
      <section
        style={{
          background: 'radial-gradient(100% 100% at 50% 0%, #E8F3FC 0%, #F8FAFC 100%)',
          padding: '60px 0 40px',
          borderBottom: '1px solid var(--border)'
        }}
      >
        <div className="container text-center" style={{ maxWidth: '720px' }}>
          <span className="badge badge-blue">Multi-Specialty Excellence</span>
          <h1 style={{ fontSize: '38px', marginTop: '10px', marginBottom: '14px', letterSpacing: '-0.02em' }}>
            Clinical Departments & Centers of Care
          </h1>
          <p style={{ fontSize: '16px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Over 25 dedicated tertiary specialties featuring modern intensive care units,
            minimally invasive robotics, and accredited surgical faculty.
          </p>
        </div>
      </section>

      {/* Grid */}
      <div className="container" style={{ marginTop: '48px' }}>
        <div className="grid grid-cols-2" style={{ gap: '28px' }}>
          {DEPARTMENTS.map((dept) => (
            <div key={dept.id} className="card" style={{ display: 'flex', flexDirection: 'column', padding: '28px' }}>
              <div className="flex items-start justify-between" style={{ marginBottom: '16px' }}>
                <div className="flex items-center gap-md">
                  <div
                    style={{
                      width: '54px',
                      height: '54px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--primary-light)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {getDepartmentIcon(dept.iconName)}
                  </div>
                  <div>
                    <h2 style={{ fontSize: '20px', color: 'var(--text-primary)' }}>{dept.name}</h2>
                    <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                      Head: {dept.headOfDept}
                    </div>
                  </div>
                </div>

                <span className="badge badge-teal">Accredited Center</span>
              </div>

              <p style={{ fontSize: '14.5px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '20px', flex: 1 }}>
                {dept.longDesc}
              </p>

              {/* Department Statistics Ribbon */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  backgroundColor: 'var(--surface-alt)',
                  borderRadius: 'var(--radius-md)',
                  padding: '12px 16px',
                  marginBottom: '20px',
                  textAlign: 'center'
                }}
              >
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Bed Capacity</div>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)' }}>{dept.bedCapacity} Beds</div>
                </div>
                <div style={{ borderLeft: '1px solid var(--border)', borderRight: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Surgeries</div>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--primary)' }}>{dept.surgeriesCompleted}+</div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Specialists</div>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)' }}>{dept.doctorsCount} Clinicians</div>
                </div>
              </div>

              {/* Key Procedures Tags */}
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Key Procedures & Clinical Innovations
                </div>
                <div className="flex gap-xs flex-wrap">
                  {dept.keyProcedures.map((p, i) => (
                    <span key={i} className="badge badge-gray" style={{ fontSize: '12px', padding: '4px 10px' }}>
                      {p}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center" style={{ borderTop: '1px solid var(--border-light)', paddingTop: '16px' }}>
                <Link
                  to={`/department/${dept.id}`}
                  className="btn btn-outline-primary btn-sm"
                >
                  Department Details & Faculty →
                </Link>
                <Link
                  to={`/book-appointment`}
                  className="btn btn-primary btn-sm"
                >
                  Book Consultation
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
