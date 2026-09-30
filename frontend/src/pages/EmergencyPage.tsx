import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  PhoneCall,
  Ambulance,
  MapPin,
  Clock,
  AlertTriangle,
  HeartPulse,
  Activity,
  ShieldCheck,
  Send,
  CheckCircle2,
  Compass,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function EmergencyPage() {
  const { showToast } = useApp();

  const [formSent, setFormSent] = useState(false);
  const [callerName, setCallerName] = useState('');
  const [callerPhone, setCallerPhone] = useState('');
  const [emergencyType, setEmergencyType] = useState('Cardiac Chest Pain');
  const [patientLocation, setPatientLocation] = useState('');

  const handleEmergencySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSent(true);
    showToast('Emergency alert triggered! Paramedic dispatch desk notified.', 'error');
  };

  const firstAidProtocols = [
    {
      title: 'Suspected Heart Attack',
      icon: <HeartPulse size={24} color="var(--danger)" />,
      badge: 'Immediate',
      steps: [
        'Call 1-800-MEDICARE immediately.',
        'Keep patient calm, seated, with knees bent to ease heart workload.',
        'Chew and swallow one full adult Aspirin (325mg) if not allergic.',
        'Loosen restrictive clothing around collar and chest.'
      ]
    },
    {
      title: 'Stroke (F.A.S.T. Protocol)',
      icon: <Activity size={24} color="var(--primary)" />,
      badge: 'Time Critical',
      steps: [
        'Face: Ask patient to smile — is one side drooping?',
        'Arms: Ask patient to raise both arms — does one drift downward?',
        'Speech: Ask them to repeat a simple phrase — is speech slurred?',
        'Time: Call emergency dispatch instantly. Do not give food or drink.'
      ]
    },
    {
      title: 'Choking & Airway Blockage',
      icon: <AlertTriangle size={24} color="var(--warning)" />,
      badge: 'Critical',
      steps: [
        'Confirm if patient cannot breathe or speak.',
        'Stand behind patient and administer 5 sharp back blows between shoulder blades.',
        'Deliver 5 quick abdominal thrusts (Heimlich maneuver) just above the navel.',
        'Alternate until airway clears or EMS paramedics arrive.'
      ]
    },
    {
      title: 'Severe Trauma & Bleeding',
      icon: <ShieldCheck size={24} color="var(--secondary-dark)" />,
      badge: 'Pressure',
      steps: [
        'Apply firm, continuous direct pressure with sterile gauze or clean cloth.',
        'Maintain pressure without lifting the cloth to inspect.',
        'Elevate injured limb above heart level if no fracture is suspected.',
        'Keep patient warm and still to avoid hypovolemic shock.'
      ]
    }
  ];

  return (
    <div style={{ backgroundColor: 'var(--bg-color)', minHeight: '100vh', paddingBottom: '80px' }}>
      {/* Emergency Top Banner */}
      <section
        style={{
          background: 'radial-gradient(100% 100% at 50% 0%, #FEF2F2 0%, #F8FAFC 100%)',
          padding: '64px 0 52px',
          borderBottom: '1px solid var(--border)'
        }}
      >
        <div className="container text-center" style={{ maxWidth: '800px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#FEE2E2',
              border: '1px solid #FECACA',
              color: '#DC2626',
              padding: '6px 16px',
              borderRadius: 'var(--radius-full)',
              fontSize: '13px',
              fontWeight: 700,
              marginBottom: '20px'
            }}
          >
            <span className="pulse-dot"></span> Level-1 Trauma & Resuscitation Center
          </div>

          <h1 style={{ fontSize: '42px', color: '#0F172A', marginBottom: '16px', letterSpacing: '-0.02em' }}>
            Emergency Care — Available 24/7
          </h1>

          <p style={{ fontSize: '17px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '32px' }}>
            If you or a loved one is experiencing a life-threatening medical emergency,
            our rapid-response trauma team, cardiac cath lab, and stroke center are on immediate alert 24 hours a day.
          </p>

          {/* Large Emergency CTA */}
          <div className="flex justify-center gap-md flex-wrap">
            <a
              href="tel:18006334227"
              className="btn btn-danger btn-lg"
              style={{
                fontSize: '18px',
                padding: '16px 36px',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-glow-danger)'
              }}
            >
              <PhoneCall size={22} />
              Call Emergency Services: 1-800-MEDICARE
            </a>
            <a
              href="#ambulance"
              className="btn btn-secondary btn-lg"
              style={{
                fontSize: '16px',
                padding: '16px 28px',
                backgroundColor: 'white'
              }}
            >
              <Ambulance size={20} color="var(--primary)" />
              Dispatch Ambulance
            </a>
          </div>
        </div>
      </section>

      {/* 4 Emergency Core Metric Cards */}
      <section className="container" style={{ marginTop: '-24px', marginBottom: '48px' }}>
        <div className="grid grid-cols-4">
          <div className="card text-center">
            <div style={{ color: 'var(--danger)', marginBottom: '10px' }}>
              <PhoneCall size={32} style={{ margin: '0 auto' }} />
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Direct Hotline</div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>
              1-800-633-4227
            </div>
            <div style={{ fontSize: '12px', color: 'var(--success-dark)', marginTop: '4px' }}>
              ● Zero Waiting Queue
            </div>
          </div>

          <div className="card text-center" id="ambulance">
            <div style={{ color: 'var(--primary)', marginBottom: '10px' }}>
              <Ambulance size={32} style={{ margin: '0 auto' }} />
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Ambulance Fleet</div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>
              Advanced Life Support (ALS)
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Average ETA: 9.4 minutes
            </div>
          </div>

          <div className="card text-center">
            <div style={{ color: 'var(--secondary)', marginBottom: '10px' }}>
              <MapPin size={32} style={{ margin: '0 auto' }} />
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>ER Location</div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>
              Gate 1, Emergency Bay
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
              450 Healthcare Blvd
            </div>
          </div>

          <div className="card text-center">
            <div style={{ color: 'var(--warning)', marginBottom: '10px' }}>
              <Clock size={32} style={{ margin: '0 auto' }} />
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Acute Response Time</div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>
              &lt; 3 Mins Triage
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Immediate doctor review
            </div>
          </div>
        </div>
      </section>

      {/* Two Column Layout: First Aid Guidance vs Emergency Contact Form */}
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '36px' }}>
          {/* Left: First Aid Critical Protocols */}
          <div>
            <div style={{ marginBottom: '24px' }}>
              <span className="section-tag">Essential Guidance</span>
              <h2 style={{ fontSize: '24px', marginTop: '6px' }}>First-Aid Protocol Before Paramedics Arrive</h2>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Clear steps to preserve life and stabilize symptoms while the ambulance is en route.
              </p>
            </div>

            <div className="flex flex-col gap-md">
              {firstAidProtocols.map((proto, idx) => (
                <div key={idx} className="card" style={{ padding: '24px' }}>
                  <div className="flex items-center justify-between" style={{ marginBottom: '14px' }}>
                    <div className="flex items-center gap-sm">
                      <div
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '8px',
                          backgroundColor: 'var(--surface-alt)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        {proto.icon}
                      </div>
                      <h3 style={{ fontSize: '17px', color: 'var(--text-primary)' }}>{proto.title}</h3>
                    </div>
                    <span className="badge badge-amber">{proto.badge}</span>
                  </div>

                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {proto.steps.map((st, i) => (
                      <li key={i} className="flex items-start gap-sm" style={{ fontSize: '13.5px', color: 'var(--text-secondary)' }}>
                        <span style={{ fontWeight: 700, color: 'var(--primary)', minWidth: '18px' }}>{i + 1}.</span>
                        <span>{st}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Emergency Contact Form & Directions */}
          <div className="flex flex-col gap-lg">
            {/* Rapid Dispatch Form */}
            <div className="card" style={{ padding: '32px', border: '2px solid #FECACA' }}>
              <div className="flex items-center gap-sm" style={{ marginBottom: '16px' }}>
                <Ambulance size={24} color="var(--danger)" />
                <h3 style={{ fontSize: '19px', color: '#0F172A' }}>Emergency Callback / Dispatch</h3>
              </div>

              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
                Submit details below for instant automated relay to our emergency triage switchboard.
              </p>

              {formSent ? (
                <div style={{ textAlign: 'center', padding: '32px 16px' }}>
                  <div
                    style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--success-light)',
                      color: 'var(--success-dark)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 16px'
                    }}
                  >
                    <CheckCircle2 size={32} />
                  </div>
                  <h4 style={{ fontSize: '18px' }}>Triage Dispatch Notified</h4>
                  <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', marginTop: '8px' }}>
                    Our emergency dispatch coordinator is dialing <strong>{callerPhone || 'your number'}</strong> right now. Keep phone line open!
                  </p>
                  <button
                    onClick={() => setFormSent(false)}
                    className="btn btn-secondary btn-sm"
                    style={{ marginTop: '20px' }}
                  >
                    Submit Another Emergency Update
                  </button>
                </div>
              ) : (
                <form onSubmit={handleEmergencySubmit}>
                  <div className="form-group">
                    <label className="form-label">Contact Person Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. David Jenkins"
                      value={callerName}
                      onChange={(e) => setCallerName(e.target.value)}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Callback Phone Number</label>
                    <input
                      type="tel"
                      required
                      placeholder="+1 (555) 000-0000"
                      value={callerPhone}
                      onChange={(e) => setCallerPhone(e.target.value)}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Emergency Category</label>
                    <select
                      value={emergencyType}
                      onChange={(e) => setEmergencyType(e.target.value)}
                      className="form-select"
                    >
                      <option value="Cardiac Chest Pain">Acute Chest Pain / Heart Symptoms</option>
                      <option value="Stroke / Numbness">Suspected Stroke / Facial Drooping</option>
                      <option value="Trauma / Fall / Fracture">Severe Trauma / Accident / Fall</option>
                      <option value="Pediatric Emergency">Pediatric High Fever / Respiratory</option>
                      <option value="Severe Bleeding">Severe Uncontrolled Bleeding</option>
                      <option value="Other Medical">Other Critical Emergency</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Current Location / Address for Ambulance</label>
                    <input
                      type="text"
                      required
                      placeholder="Street address, apartment, landmarks..."
                      value={patientLocation}
                      onChange={(e) => setPatientLocation(e.target.value)}
                      className="form-input"
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-danger btn-lg"
                    style={{ width: '100%', marginTop: '8px', justifyContent: 'center' }}
                  >
                    <Send size={18} /> Transmit Emergency Call Request
                  </button>
                </form>
              )}
            </div>

            {/* Directions & Hospital Map Card */}
            <div className="card" style={{ padding: '28px' }}>
              <div className="flex items-center gap-sm" style={{ marginBottom: '12px' }}>
                <Compass size={22} color="var(--primary)" />
                <h3 style={{ fontSize: '17px' }}>Hospital Directions & Access</h3>
              </div>

              <div style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '16px' }}>
                The Emergency Trauma Entrance is located at <strong>Gate 1</strong> with dedicated 4-lane ambulance bays and patient drop-off valet.
              </div>

              <div
                style={{
                  backgroundColor: 'var(--surface-alt)',
                  borderRadius: 'var(--radius-md)',
                  padding: '16px',
                  fontSize: '13px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  marginBottom: '16px'
                }}
              >
                <div><strong>Highway Access:</strong> Exit 24B off Metro Interstate 95</div>
                <div><strong>Helipad:</strong> Roof Tower C with direct trauma elevator</div>
                <div><strong>Parking:</strong> Free designated ER emergency bays</div>
              </div>

              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noreferrer"
                className="btn btn-outline-primary btn-sm"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                Open in Google Maps Navigation →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
