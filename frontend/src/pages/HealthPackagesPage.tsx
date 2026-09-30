import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Check,
  Calendar,
  Sparkles,
  Tag,
  Clock,
  ArrowRight
} from 'lucide-react';
import { HEALTH_PACKAGES } from '../data/mockData';
import { useApp } from '../context/AppContext';

export default function HealthPackagesPage() {
  const { setBookingPrefill, showToast } = useApp();
  const navigate = useNavigate();

  const handleBookPackage = (pkgName: string) => {
    showToast(`Preventive Package "${pkgName}" selected. Choose your diagnostic intake date.`, 'info');
    navigate('/book-appointment');
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
          <span className="badge badge-teal">Preventive Health Intelligence</span>
          <h1 style={{ fontSize: '38px', marginTop: '10px', marginBottom: '14px', letterSpacing: '-0.02em' }}>
            Comprehensive Health Screening Packages
          </h1>
          <p style={{ fontSize: '16px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Early detection saves lives. Our full-body wellness evaluations cover silent cardiovascular,
            metabolic, hormonal, and organ biomarkers with same-day digital specialist review.
          </p>
        </div>
      </section>

      {/* Packages Grid */}
      <div className="container" style={{ marginTop: '48px' }}>
        <div className="grid grid-cols-2" style={{ gap: '32px' }}>
          {HEALTH_PACKAGES.map((pkg) => (
            <div
              key={pkg.id}
              className="card"
              style={{
                padding: '36px',
                display: 'flex',
                flexDirection: 'column',
                border: pkg.popular ? '2px solid var(--primary)' : '1px solid var(--border)',
                position: 'relative',
                boxShadow: pkg.popular ? 'var(--shadow-card-hover)' : 'var(--shadow-card)'
              }}
            >
              {pkg.popular && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-12px',
                    right: '24px',
                    backgroundColor: 'var(--primary)',
                    color: 'white',
                    fontSize: '11px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    padding: '4px 12px',
                    borderRadius: 'var(--radius-full)',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  Most Popular Package
                </span>
              )}

              <div style={{ marginBottom: '16px' }}>
                <span className="badge badge-blue" style={{ fontSize: '12px' }}>
                  {pkg.targetGroup}
                </span>
                <h2 style={{ fontSize: '22px', color: 'var(--text-primary)', marginTop: '8px', marginBottom: '6px' }}>
                  {pkg.name}
                </h2>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                  {pkg.description}
                </p>
              </div>

              {/* Price Row */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: '10px',
                  padding: '16px 0',
                  borderTop: '1px solid var(--border-light)',
                  borderBottom: '1px solid var(--border-light)',
                  marginBottom: '20px'
                }}
              >
                <span style={{ fontSize: '36px', fontWeight: 800, color: 'var(--primary)' }}>
                  ${pkg.price}
                </span>
                <span style={{ fontSize: '18px', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                  ${pkg.originalPrice}
                </span>
                <span className="badge badge-green" style={{ marginLeft: 'auto', fontSize: '12px' }}>
                  Includes {pkg.testsCount} Lab & Diagnostic Parameters
                </span>
              </div>

              {/* Included Tests List */}
              <div style={{ marginBottom: '28px', flex: 1 }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '12px' }}>
                  Key Inclusions & Tests:
                </div>
                <div className="flex flex-col gap-sm">
                  {pkg.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-sm" style={{ fontSize: '13.5px', color: 'var(--text-primary)' }}>
                      <Check size={16} color="var(--secondary-dark)" style={{ marginTop: '2px', flexShrink: 0 }} />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => handleBookPackage(pkg.name)}
                className={`btn btn-lg ${pkg.popular ? 'btn-primary' : 'btn-secondary'}`}
                style={{ width: '100%', justifyContent: 'center' }}
              >
                <Calendar size={18} /> Book This Package (${pkg.price})
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
