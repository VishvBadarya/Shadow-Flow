import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Award,
  HeartPulse,
  Users,
  Building,
  Target,
  Clock,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { HOSPITAL_STATS } from '../data/mockData';

export default function AboutPage() {
  return (
    <div style={{ backgroundColor: 'var(--bg-color)', minHeight: '100vh', paddingBottom: '80px' }}>
      {/* Header Banner */}
      <section
        style={{
          background: 'radial-gradient(100% 100% at 50% 0%, #E8F3FC 0%, #F8FAFC 100%)',
          padding: '64px 0 44px',
          borderBottom: '1px solid var(--border)'
        }}
      >
        <div className="container text-center" style={{ maxWidth: '780px' }}>
          <span className="badge badge-blue">Our Mission & Heritage</span>
          <h1 style={{ fontSize: '40px', marginTop: '12px', marginBottom: '16px', letterSpacing: '-0.02em' }}>
            Advancing Human Health Through Clinical Excellence & Digital Precision
          </h1>
          <p style={{ fontSize: '16px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            ShadowFlow MediCare Nexus was founded on a simple yet unyielding philosophy:
            combining elite multi-specialty medical minds with state-of-the-art surgical technology
            to provide compassionate, transparent, and uncompromising clinical care.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="container" style={{ marginTop: '48px' }}>
        {/* Story & Image Grid */}
        <div className="grid grid-cols-2 items-center" style={{ gap: '48px', marginBottom: '64px' }}>
          <div>
            <span className="section-tag">Since Inception</span>
            <h2 style={{ fontSize: '28px', margin: '10px 0 16px', color: 'var(--text-primary)' }}>
              A Tertiary Healthcare Ecosystem Built on Evidence & Compassion
            </h2>
            <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '16px' }}>
              Recognized among the premier multi-specialty medical institutes, MediCare Nexus operates 25 specialized
              clinical divisions, a Level-1 24/7 Trauma and Acute Resuscitation Unit, and dual biplane catheterization laboratories.
            </p>
            <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '24px' }}>
              Every surgical and medical intervention follows standardized clinical pathways monitored in real time by
              our Clinical Intelligence System. This ensures minimal length of stay, sub-millimeter surgical accuracy,
              and near-zero infection rates across all inpatient suites.
            </p>

            <div className="grid grid-cols-2" style={{ gap: '16px' }}>
              <div style={{ padding: '16px', backgroundColor: 'var(--surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--primary)' }}>JCI Gold</div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Seal of International Approval</div>
              </div>
              <div style={{ padding: '16px', backgroundColor: 'var(--surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--secondary-dark)' }}>NABH</div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Highest Hospital Accreditation</div>
              </div>
            </div>
          </div>

          <div>
            <img
              src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80"
              alt="Hospital Architecture and Modern Building"
              style={{
                width: '100%',
                height: '420px',
                objectFit: 'cover',
                borderRadius: 'var(--radius-xl)',
                boxShadow: 'var(--shadow-card)'
              }}
            />
          </div>
        </div>

        {/* Core Pillars */}
        <div style={{ marginBottom: '64px' }}>
          <div className="section-header">
            <span className="section-tag">Foundational Principles</span>
            <h2 className="section-title">The Four Pillars of MediCare Nexus</h2>
          </div>

          <div className="grid grid-cols-4">
            <div className="card text-center" style={{ padding: '32px 20px' }}>
              <Target size={32} color="var(--primary)" style={{ margin: '0 auto 16px' }} />
              <h3 style={{ fontSize: '17px', marginBottom: '8px' }}>Clinical Precision</h3>
              <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Sub-millimeter robotic navigation and automated digital diagnostic validation.
              </p>
            </div>

            <div className="card text-center" style={{ padding: '32px 20px' }}>
              <HeartPulse size={32} color="var(--secondary-dark)" style={{ margin: '0 auto 16px' }} />
              <h3 style={{ fontSize: '17px', marginBottom: '8px' }}>Compassionate Care</h3>
              <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Treating the whole person, not merely symptoms. Family-centered healing spaces.
              </p>
            </div>

            <div className="card text-center" style={{ padding: '32px 20px' }}>
              <ShieldCheck size={32} color="var(--success)" style={{ margin: '0 auto 16px' }} />
              <h3 style={{ fontSize: '17px', marginBottom: '8px' }}>Total Transparency</h3>
              <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Clear itemized billing, instant digital record access, and zero hidden hospital charges.
              </p>
            </div>

            <div className="card text-center" style={{ padding: '32px 20px' }}>
              <Sparkles size={32} color="var(--warning)" style={{ margin: '0 auto 16px' }} />
              <h3 style={{ fontSize: '17px', marginBottom: '8px' }}>Continuous Innovation</h3>
              <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Active participation in international clinical trials and next-gen biomedical research.
              </p>
            </div>
          </div>
        </div>

        {/* Statistics Bar */}
        <div
          style={{
            backgroundColor: 'var(--primary)',
            borderRadius: 'var(--radius-xl)',
            padding: '48px',
            color: 'white',
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '24px',
            textAlign: 'center'
          }}
        >
          {HOSPITAL_STATS.map((st, i) => (
            <div key={i}>
              <div style={{ fontSize: '42px', fontWeight: 800 }}>{st.value}{st.suffix}</div>
              <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--secondary-light)', marginTop: '4px' }}>{st.label}</div>
              <div style={{ fontSize: '12px', opacity: 0.85, marginTop: '4px' }}>{st.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
