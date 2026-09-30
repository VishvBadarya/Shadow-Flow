import React from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  Phone,
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
  Award,
  HeartHandshake
} from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#0B132B', color: '#CBD5E1', paddingTop: '64px', paddingBottom: '32px' }}>
      <div className="container">
        {/* Top Emergency Ribbon */}
        <div
          style={{
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.25)',
            borderRadius: 'var(--radius-lg)',
            padding: '24px 32px',
            marginBottom: '56px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '20px'
          }}
        >
          <div className="flex items-center gap-md">
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                backgroundColor: 'rgba(239, 68, 68, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#EF4444'
              }}
            >
              <Phone size={24} />
            </div>
            <div>
              <div style={{ color: '#FFFFFF', fontSize: '18px', fontWeight: 700 }}>
                24/7 Rapid Emergency & Trauma Dispatch
              </div>
              <div style={{ color: '#94A3B8', fontSize: '13px' }}>
                Direct hotlines for acute stroke, cardiac arrest, and level-1 polytrauma dispatch.
              </div>
            </div>
          </div>
          <div className="flex items-center gap-md">
            <a
              href="tel:18006334227"
              className="btn btn-danger"
              style={{ padding: '12px 24px', fontSize: '15px' }}
            >
              <Phone size={18} />
              Call Hotline: 1-800-MEDICARE
            </a>
            <Link
              to="/emergency"
              className="btn btn-secondary"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: '#FFFFFF',
                borderColor: 'rgba(255, 255, 255, 0.2)'
              }}
            >
              Emergency Protocols
            </Link>
          </div>
        </div>

        {/* Main Footer Columns */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '40px',
            marginBottom: '48px'
          }}
        >
          {/* Brand Info */}
          <div>
            <div className="flex items-center gap-sm" style={{ marginBottom: '16px' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white'
                }}
              >
                <Activity size={22} />
              </div>
              <div>
                <div style={{ color: '#FFFFFF', fontSize: '18px', fontWeight: 800 }}>
                  ShadowFlow <span style={{ color: 'var(--secondary)' }}>MediCare</span>
                </div>
                <div style={{ color: '#64748B', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Enterprise Multi-Specialty
                </div>
              </div>
            </div>
            <p style={{ color: '#94A3B8', fontSize: '14px', lineHeight: 1.6, marginBottom: '20px' }}>
              A world-class tertiary medical and surgical institution committed to precision healthcare,
              evidence-based protocols, and patient-centered clinical excellence.
            </p>
            <div className="flex flex-col gap-sm" style={{ fontSize: '13px' }}>
              <div className="flex items-center gap-sm">
                <MapPin size={16} color="var(--secondary)" />
                <span>450 Healthcare Boulevard, Metro Medical District</span>
              </div>
              <div className="flex items-center gap-sm">
                <Mail size={16} color="var(--secondary)" />
                <span>care@shadowflow.health</span>
              </div>
              <div className="flex items-center gap-sm">
                <Clock size={16} color="var(--secondary)" />
                <span>Hospital open 24/7 | OPD: 8:00 AM - 8:00 PM</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '16px', marginBottom: '20px' }}>Quick Navigation</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px' }}>
              <li><Link to="/doctors" style={{ color: '#94A3B8' }}>Find a Specialist</Link></li>
              <li><Link to="/book-appointment" style={{ color: '#94A3B8' }}>Book an Appointment</Link></li>
              <li><Link to="/packages" style={{ color: '#94A3B8' }}>Preventive Health Packages</Link></li>
              <li><Link to="/services" style={{ color: '#94A3B8' }}>Diagnostic & Surgical Services</Link></li>
              <li><Link to="/emergency" style={{ color: '#94A3B8' }}>Emergency & Trauma Care</Link></li>
              <li><Link to="/about" style={{ color: '#94A3B8' }}>About Our Medical Centers</Link></li>
              <li><Link to="/contact" style={{ color: '#94A3B8' }}>Hospital Locations & Map</Link></li>
            </ul>
          </div>

          {/* Departments */}
          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '16px', marginBottom: '20px' }}>Clinical Specialties</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px' }}>
              <li><Link to="/department/cardiology" style={{ color: '#94A3B8' }}>Cardiology & Cath Labs</Link></li>
              <li><Link to="/department/neurology" style={{ color: '#94A3B8' }}>Neurology & Stroke Center</Link></li>
              <li><Link to="/department/orthopedics" style={{ color: '#94A3B8' }}>Robotic Orthopedic Surgery</Link></li>
              <li><Link to="/department/oncology" style={{ color: '#94A3B8' }}>Comprehensive Oncology Institute</Link></li>
              <li><Link to="/department/pediatrics" style={{ color: '#94A3B8' }}>Pediatric & Level IV NICU</Link></li>
              <li><Link to="/department/gynecology" style={{ color: '#94A3B8' }}>High-Risk Obstetrics & Gyn</Link></li>
              <li><Link to="/departments" style={{ color: 'var(--secondary)' }}>View All 25+ Departments →</Link></li>
            </ul>
          </div>

          {/* Patient Portals & Certifications */}
          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '16px', marginBottom: '20px' }}>Patient & Provider</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px', marginBottom: '24px' }}>
              <li><Link to="/portal/patient" style={{ color: '#94A3B8' }}>Patient Portal Dashboard</Link></li>
              <li><Link to="/portal/patient/records" style={{ color: '#94A3B8' }}>Medical History & Lab Results</Link></li>
              <li><Link to="/portal/patient/billing" style={{ color: '#94A3B8' }}>Online Billing & Insurance</Link></li>
              <li><Link to="/portal/doctor" style={{ color: '#94A3B8' }}>Doctor Workspace</Link></li>
              <li><Link to="/portal/admin" style={{ color: '#94A3B8' }}>Hospital Admin Console</Link></li>
            </ul>

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '16px' }}>
              <div style={{ color: '#64748B', fontSize: '11px', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.05em' }}>
                Accreditations
              </div>
              <div className="flex items-center gap-sm" style={{ flexWrap: 'wrap' }}>
                <span className="badge badge-teal" style={{ fontSize: '11px' }}>
                  <Award size={12} /> JCI Accredited
                </span>
                <span className="badge badge-blue" style={{ fontSize: '11px' }}>
                  <ShieldCheck size={12} /> NABH Excellence
                </span>
                <span className="badge badge-gray" style={{ fontSize: '11px' }}>
                  <HeartHandshake size={12} /> HIPAA Secure
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Legal & Accessibility */}
        <div
          style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            paddingTop: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
            fontSize: '13px',
            color: '#64748B'
          }}
        >
          <div>
            © {new Date().getFullYear()} ShadowFlow MediCare Nexus Healthcare System. All rights reserved.
          </div>
          <div className="flex items-center gap-md">
            <Link to="/faq" style={{ color: '#64748B' }}>Patient FAQ</Link>
            <span>•</span>
            <span style={{ color: '#64748B' }}>Privacy Policy</span>
            <span>•</span>
            <span style={{ color: '#64748B' }}>Terms of Service</span>
            <span>•</span>
            <span style={{ color: '#64748B' }}>Accessibility Statement</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
