import React from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  Crosshair,
  ScanLine,
  Layers,
  Video,
  Ambulance,
  CheckCircle2,
  Calendar,
  Clock,
  ArrowRight
} from 'lucide-react';
import { SERVICES } from '../data/mockData';

export default function ServicesPage() {
  const getServiceIcon = (iconName: string) => {
    switch (iconName) {
      case 'Ambulance': return <Ambulance size={32} color="var(--danger)" />;
      case 'Crosshair': return <Crosshair size={32} color="var(--primary)" />;
      case 'ScanLine': return <ScanLine size={32} color="var(--secondary)" />;
      case 'Activity': return <Activity size={32} color="var(--danger)" />;
      case 'Layers': return <Layers size={32} color="var(--primary)" />;
      case 'Video': return <Video size={32} color="var(--secondary)" />;
      default: return <Activity size={32} color="var(--primary)" />;
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
          <span className="badge badge-blue">Comprehensive Capabilities</span>
          <h1 style={{ fontSize: '38px', marginTop: '10px', marginBottom: '14px', letterSpacing: '-0.02em' }}>
            Hospital Services & Clinical Facilities
          </h1>
          <p style={{ fontSize: '16px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Explore our Level-1 Trauma response, computer-guided robotic surgery suites,
            24/7 automated pathology, and digital telehealth platform.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <div className="container" style={{ marginTop: '48px' }}>
        <div className="grid grid-cols-2" style={{ gap: '28px' }}>
          {SERVICES.map((srv) => (
            <div key={srv.id} className="card" style={{ padding: '32px', display: 'flex', flexDirection: 'column' }}>
              <div className="flex items-start justify-between" style={{ marginBottom: '16px' }}>
                <div
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--surface-alt)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {getServiceIcon(srv.iconName)}
                </div>
                <span className="badge badge-blue">{srv.category}</span>
              </div>

              <h2 style={{ fontSize: '20px', color: 'var(--text-primary)', marginBottom: '10px' }}>
                {srv.title}
              </h2>

              <p style={{ fontSize: '14.5px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '20px', flex: 1 }}>
                {srv.description}
              </p>

              {/* Feature Checklist */}
              <div style={{ marginBottom: '24px' }}>
                <div className="flex flex-col gap-xs">
                  {srv.features.map((feat, i) => (
                    <div key={i} className="flex items-center gap-sm" style={{ fontSize: '13.5px', color: 'var(--text-primary)' }}>
                      <CheckCircle2 size={16} color="var(--success)" style={{ flexShrink: 0 }} />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div
                style={{
                  borderTop: '1px solid var(--border-light)',
                  paddingTop: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '12.5px',
                  color: 'var(--text-secondary)'
                }}
              >
                <div className="flex items-center gap-xs">
                  <Clock size={15} color="var(--primary)" />
                  <span>{srv.operatingHours}</span>
                </div>
                <Link to="/book-appointment" className="btn btn-primary btn-sm">
                  Inquire / Book →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
