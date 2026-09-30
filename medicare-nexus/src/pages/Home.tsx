import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Calendar,
  User,
  HeartPulse,
  Activity,
  ShieldCheck,
  Clock,
  ArrowRight,
  Star,
  CheckCircle2,
  Stethoscope,
  PhoneCall,
  Sparkles,
  Award,
  ChevronRight,
  ShieldAlert,
  Brain,
  Baby,
  Bone,
  Layers,
  Search
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import {
  DOCTORS,
  DEPARTMENTS,
  HEALTH_ARTICLES,
  TESTIMONIALS,
  HOSPITAL_STATS
} from '../data/mockData';
import './Home.css';

export default function Home() {
  const { setBookingPrefill } = useApp();
  const navigate = useNavigate();

  // Doctor filtering states
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('All');
  const [onlyAvailableToday, setOnlyAvailableToday] = useState(false);
  const [minExp, setMinExp] = useState(0);

  // Animated counters
  const [counts, setCounts] = useState({ doctors: 0, depts: 0, patients: 0, emergency: 0 });

  useEffect(() => {
    const duration = 1600;
    const steps = 40;
    const stepTime = duration / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      setCounts({
        doctors: Math.floor(150 * progress),
        depts: Math.floor(25 * progress),
        patients: Math.floor(50 * progress),
        emergency: 24
      });
      if (step >= steps) {
        clearInterval(timer);
        setCounts({ doctors: 150, depts: 25, patients: 50, emergency: 24 });
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, []);

  const specialties = ['All', 'Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'Oncology'];

  const filteredDoctors = DOCTORS.filter((doc) => {
    if (selectedSpecialty !== 'All' && doc.specialty !== selectedSpecialty) return false;
    if (onlyAvailableToday && !doc.availableToday) return false;
    if (doc.experience < minExp) return false;
    return true;
  });

  const getDepartmentIcon = (iconName: string) => {
    switch (iconName) {
      case 'HeartPulse': return <HeartPulse size={26} color="var(--primary)" />;
      case 'Brain': return <Brain size={26} color="var(--primary)" />;
      case 'Bone': return <Bone size={26} color="var(--primary)" />;
      case 'Baby': return <Baby size={26} color="var(--primary)" />;
      case 'Sparkles': return <Sparkles size={26} color="var(--primary)" />;
      case 'ShieldAlert': return <ShieldAlert size={26} color="var(--primary)" />;
      case 'HeartHandshake': return <HeartPulse size={26} color="var(--primary)" />;
      default: return <Stethoscope size={26} color="var(--primary)" />;
    }
  };

  const handleBookDoctor = (doctorId: string, deptId: string) => {
    setBookingPrefill({ doctorId, departmentId: deptId });
    navigate('/book-appointment');
  };

  return (
    <div className="home-page">
      {/* 1. HERO SECTION */}
      <section className="hero-section">
        <div className="container">
          <div className="grid grid-cols-2 items-center" style={{ gap: '48px' }}>
            {/* Left Content */}
            <div className="hero-content">
              <div className="hero-badge">
                <Sparkles size={16} color="var(--secondary)" />
                <span>Next-Generation Multi-Specialty Healthcare</span>
              </div>

              <h1>
                Expert Care.<br />
                <span>Advanced Technology.</span><br />
                Better Health.
              </h1>

              <p className="hero-subtitle">
                Connect with experienced doctors, access advanced healthcare services, and manage your healthcare journey from one secure platform.
              </p>

              <div className="hero-actions flex gap-md flex-wrap">
                <Link to="/book-appointment" className="btn btn-primary btn-lg">
                  <Calendar size={18} />
                  Book an Appointment
                </Link>
                <Link to="/doctors" className="btn btn-secondary btn-lg">
                  <User size={18} />
                  Find a Doctor
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="trust-strip">
                <div className="trust-item">
                  <Clock size={18} color="var(--secondary)" />
                  <span>24/7 Emergency Care</span>
                </div>
                <div style={{ color: 'var(--border)' }}>•</div>
                <div className="trust-item">
                  <Award size={18} color="var(--secondary)" />
                  <span>150+ Specialists</span>
                </div>
                <div style={{ color: 'var(--border)' }}>•</div>
                <div className="trust-item">
                  <Activity size={18} color="var(--secondary)" />
                  <span>Advanced Diagnostics</span>
                </div>
              </div>
            </div>

            {/* Right Hospital / Doctor Visual */}
            <div className="hero-visual-wrapper">
              <img
                src="/hero-medical-team.jpg"
                alt="Hospital Medical Team in Surgery"
                className="hero-main-img"
              />

              {/* Floating Feature Tag 1 */}
              <div className="hero-floating-card-1">
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--primary-light)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--primary)'
                  }}
                >
                  <Stethoscope size={22} />
                </div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
                    Dr. Marcus Vance, MD
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--success-dark)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--success)' }}></span>
                    Available Today • 4.95 ★
                  </div>
                </div>
              </div>

              {/* Floating Feature Tag 2 */}
              <div className="hero-floating-card-2">
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--danger-light)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--danger)'
                  }}
                >
                  <PhoneCall size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700 }}>Level-1 Trauma Active</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Direct Helipad Access</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. QUICK ACTIONS (4 LARGE CARDS) */}
      <section className="quick-actions-section container">
        <div className="grid grid-cols-4">
          <Link to="/book-appointment" className="action-card">
            <div className="action-icon-box action-icon-blue">
              <Calendar size={28} />
            </div>
            <h3>Book Appointment</h3>
            <p>Schedule an in-person or video consultation with top specialists.</p>
            <span className="action-card-link">
              Book online <ArrowRight size={14} />
            </span>
          </Link>

          <Link to="/doctors" className="action-card">
            <div className="action-icon-box action-icon-teal">
              <User size={28} />
            </div>
            <h3>Find a Doctor</h3>
            <p>Browse our directory of 150+ board-certified medical experts.</p>
            <span className="action-card-link">
              Browse roster <ArrowRight size={14} />
            </span>
          </Link>

          <Link to="/departments" className="action-card">
            <div className="action-icon-box action-icon-blue">
              <HeartPulse size={28} />
            </div>
            <h3>View Departments</h3>
            <p>Explore 25+ specialized centers of clinical and surgical care.</p>
            <span className="action-card-link">
              All specialties <ArrowRight size={14} />
            </span>
          </Link>

          <Link to="/emergency" className="action-card emergency-action">
            <div className="action-icon-box action-icon-red">
              <Activity size={28} />
            </div>
            <h3 style={{ color: 'var(--danger)' }}>Emergency Care</h3>
            <p>24/7 Level-1 trauma response, cardiac arrest, and acute stroke code.</p>
            <span className="action-card-link" style={{ color: 'var(--danger)' }}>
              Call 24/7 Hotline <ArrowRight size={14} />
            </span>
          </Link>
        </div>
      </section>

      {/* 3. DEPARTMENTS GRID (8 DEPARTMENTS) */}
      <section className="section-padding" style={{ backgroundColor: 'var(--surface)' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Clinical Excellence</span>
            <h2 className="section-title">Specialized Medical Departments</h2>
            <p className="section-desc">
              World-class clinical divisions equipped with advanced medical robotics,
              hybrid operating theaters, and dedicated specialty ICU units.
            </p>
          </div>

          <div className="grid grid-cols-4">
            {DEPARTMENTS.map((dept) => (
              <div key={dept.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                <div
                  style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--primary-light)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '16px'
                  }}
                >
                  {getDepartmentIcon(dept.iconName)}
                </div>

                <h3 style={{ fontSize: '19px', marginBottom: '8px', color: 'var(--text-primary)' }}>
                  {dept.name}
                </h3>

                <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '20px', flex: 1 }}>
                  {dept.shortDesc}
                </p>

                <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '14px' }}>
                  <Link
                    to={`/department/${dept.id}`}
                    style={{
                      fontSize: '13px',
                      fontWeight: 600,
                      color: 'var(--primary)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    View Department <ChevronRight size={15} />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <Link to="/departments" className="btn btn-secondary">
              View All 25+ Hospital Departments
            </Link>
          </div>
        </div>
      </section>

      {/* 4. FEATURED DOCTORS WITH FILTERING */}
      <section className="section-padding">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Distinguished Faculty</span>
            <h2 className="section-title">Meet Our Medical Specialists</h2>
            <p className="section-desc">
              Consult with board-certified physicians, internationally trained surgeons, and leaders in preventive and interventional healthcare.
            </p>
          </div>

          {/* Filter Bar */}
          <div
            style={{
              backgroundColor: 'var(--surface)',
              borderRadius: 'var(--radius-lg)',
              padding: '16px 20px',
              border: '1px solid var(--border)',
              boxShadow: 'var(--shadow-sm)',
              marginBottom: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '16px'
            }}
          >
            {/* Specialty Pills */}
            <div className="flex items-center gap-xs flex-wrap">
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginRight: '6px' }}>
                Specialty:
              </span>
              {specialties.map((spec) => (
                <button
                  key={spec}
                  onClick={() => setSelectedSpecialty(spec)}
                  className={`btn btn-sm ${selectedSpecialty === spec ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ borderRadius: 'var(--radius-full)' }}
                >
                  {spec}
                </button>
              ))}
            </div>

            {/* Other filters */}
            <div className="flex items-center gap-md">
              <label className="flex items-center gap-xs" style={{ fontSize: '13px', cursor: 'pointer', fontWeight: 500 }}>
                <input
                  type="checkbox"
                  checked={onlyAvailableToday}
                  onChange={(e) => setOnlyAvailableToday(e.target.checked)}
                  style={{ accentColor: 'var(--primary)' }}
                />
                Available Today Only
              </label>

              <select
                value={minExp}
                onChange={(e) => setMinExp(Number(e.target.value))}
                className="form-select"
                style={{ width: 'auto', padding: '6px 12px', fontSize: '13px' }}
              >
                <option value={0}>Any Experience</option>
                <option value={12}>12+ Years</option>
                <option value={15}>15+ Years</option>
                <option value={18}>18+ Years</option>
              </select>
            </div>
          </div>

          {/* Doctor Cards Grid */}
          <div className="grid grid-cols-4">
            {filteredDoctors.slice(0, 4).map((doc) => (
              <div key={doc.id} className="doctor-card">
                <div className="doctor-card-img-wrap">
                  <img src={doc.image} alt={doc.name} className="doctor-card-img" />
                  {doc.availableToday && (
                    <span className="doctor-badge-today">
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'white' }}></span>
                      Available Today
                    </span>
                  )}
                  <span className="doctor-rating-pill">
                    <Star size={13} fill="#F59E0B" color="#F59E0B" />
                    {doc.rating}
                  </span>
                </div>

                <div className="doctor-card-body">
                  <h3 className="doctor-card-name">{doc.name}</h3>
                  <div className="doctor-card-specialty">{doc.specialty}</div>
                  <div className="doctor-card-qual">{doc.qualification}</div>

                  <div className="doctor-card-meta">
                    <span>{doc.experience} Years Exp.</span>
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                      ${doc.consultationFee} Fee
                    </span>
                  </div>

                  <div className="doctor-card-actions">
                    <Link to={`/doctor/${doc.id}`} className="btn btn-secondary btn-sm" style={{ textAlign: 'center' }}>
                      View Profile
                    </Link>
                    <button
                      onClick={() => handleBookDoctor(doc.id, doc.hospitalDepartment.toLowerCase())}
                      className="btn btn-primary btn-sm"
                    >
                      Book Visit
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '36px' }}>
            <Link to="/doctors" className="btn btn-secondary btn-lg">
              Explore All 150+ Doctors & Directory
            </Link>
          </div>
        </div>
      </section>

      {/* 5. WHY CHOOSE US (4 FEATURE CARDS) */}
      <section className="section-padding" style={{ backgroundColor: 'var(--surface)' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Clinical Distinction</span>
            <h2 className="section-title">Why Choose ShadowFlow MediCare Nexus</h2>
            <p className="section-desc">
              Pioneering safety benchmarks, minimal surgical trauma, and round-the-clock intensive clinical capabilities.
            </p>
          </div>

          <div className="grid grid-cols-4">
            <div className="card text-center" style={{ padding: '36px 24px' }}>
              <div
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--primary-light)',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px'
                }}
              >
                <ShieldCheck size={30} />
              </div>
              <h3 style={{ fontSize: '18px', marginBottom: '10px' }}>Experienced Specialists</h3>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                150+ internationally trained, board-certified clinicians with an average of 15+ years of tertiary experience.
              </p>
            </div>

            <div className="card text-center" style={{ padding: '36px 24px' }}>
              <div
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--secondary-light)',
                  color: 'var(--secondary-dark)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px'
                }}
              >
                <Activity size={30} />
              </div>
              <h3 style={{ fontSize: '18px', marginBottom: '10px' }}>Advanced Medical Tech</h3>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                da Vinci® Xi surgical robots, 3T MRI, 128-slice CT, and automated precision laboratory diagnostic tracks.
              </p>
            </div>

            <div className="card text-center" style={{ padding: '36px 24px' }}>
              <div
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--danger-light)',
                  color: 'var(--danger)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px'
                }}
              >
                <Clock size={30} />
              </div>
              <h3 style={{ fontSize: '18px', marginBottom: '10px' }}>24/7 Emergency Care</h3>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Level-1 trauma center with door-to-balloon time under 45 minutes and hyper-acute stroke code teams.
              </p>
            </div>

            <div className="card text-center" style={{ padding: '36px 24px' }}>
              <div
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--primary-light)',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px'
                }}
              >
                <HeartPulse size={30} />
              </div>
              <h3 style={{ fontSize: '18px', marginBottom: '10px' }}>Patient-Centered Care</h3>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Comprehensive digital portals, transparent billing, multi-lingual staff, and compassionate patient navigators.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. HEALTHCARE STATISTICS (ANIMATED COUNTERS) */}
      <section className="stats-section">
        <div className="container">
          <div className="grid grid-cols-4">
            <div className="stat-item">
              <div className="stat-number">{counts.doctors}+</div>
              <div className="stat-label">Doctors & Surgeons</div>
              <div className="stat-desc">Board-certified clinicians across 32 medical sub-specialties</div>
            </div>

            <div className="stat-item">
              <div className="stat-number">{counts.depts}+</div>
              <div className="stat-label">Departments</div>
              <div className="stat-desc">State-of-the-art specialized tertiary centers of excellence</div>
            </div>

            <div className="stat-item">
              <div className="stat-number">{counts.patients}K+</div>
              <div className="stat-label">Patients Served</div>
              <div className="stat-desc">Trusted by over 50,000 patients and families every year</div>
            </div>

            <div className="stat-item">
              <div className="stat-number">24/7</div>
              <div className="stat-label">Emergency Support</div>
              <div className="stat-desc">Continuous rapid resuscitation and trauma dispatch response</div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. APPOINTMENT CTA BANNER */}
      <section className="section-padding">
        <div className="container">
          <div className="cta-banner">
            <h2>Your Health Should Never Wait.</h2>
            <p>
              Don't delay crucial preventative screenings or symptom evaluations.
              Schedule a consultation with our experienced clinical team today.
            </p>
            <div className="flex justify-center gap-md flex-wrap">
              <Link
                to="/book-appointment"
                className="btn btn-secondary btn-lg"
                style={{
                  backgroundColor: '#FFFFFF',
                  color: 'var(--primary)',
                  fontWeight: 700,
                  boxShadow: '0 8px 20px rgba(0,0,0,0.15)'
                }}
              >
                <Calendar size={18} />
                Book an Appointment
              </Link>
              <Link
                to="/contact"
                className="btn btn-outline-primary btn-lg"
                style={{
                  color: '#FFFFFF',
                  borderColor: '#FFFFFF',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)'
                }}
              >
                <PhoneCall size={18} />
                Talk to Our Support Team
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 8. PATIENT TESTIMONIALS */}
      <section className="section-padding" style={{ backgroundColor: 'var(--surface)' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Real Patient Stories</span>
            <h2 className="section-title">Healing Through Compassion & Tech</h2>
            <p className="section-desc">
              Hear from our patients who have experienced our world-class medical interventions and post-operative recovery.
            </p>
          </div>

          <div className="grid grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <div key={t.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                <div className="flex items-center gap-xs" style={{ marginBottom: '14px' }}>
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} size={16} fill="#F59E0B" color="#F59E0B" />
                  ))}
                </div>

                <p style={{ fontSize: '14.5px', color: 'var(--text-primary)', fontStyle: 'italic', lineHeight: 1.6, marginBottom: '24px', flex: 1 }}>
                  "{t.review}"
                </p>

                <div className="flex items-center gap-md" style={{ borderTop: '1px solid var(--border-light)', paddingTop: '16px' }}>
                  <img
                    src={t.avatar}
                    alt={t.patientName}
                    style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {t.patientName}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: 500 }}>
                      {t.treatment}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. HEALTH ARTICLES & PREVENTIVE GUIDES */}
      <section className="section-padding">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Clinical Insights</span>
            <h2 className="section-title">Latest Medical & Health Articles</h2>
            <p className="section-desc">
              Evidence-based clinical guidelines, preventative cardiology, and health insights from our lead physicians.
            </p>
          </div>

          <div className="grid grid-cols-3">
            {HEALTH_ARTICLES.map((art) => (
              <div key={art.id} className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <img
                  src={art.image}
                  alt={art.title}
                  style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                />
                <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div className="flex items-center justify-between" style={{ marginBottom: '10px' }}>
                    <span className="badge badge-blue">{art.category}</span>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{art.readTime}</span>
                  </div>

                  <h3 style={{ fontSize: '17px', lineHeight: 1.4, marginBottom: '10px', color: 'var(--text-primary)' }}>
                    {art.title}
                  </h3>

                  <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '20px', flex: 1 }}>
                    {art.shortDesc}
                  </p>

                  <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                      By {art.author}
                    </span>
                    <Link
                      to="/blog"
                      style={{ fontSize: '13px', fontWeight: 600, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      Read More <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
