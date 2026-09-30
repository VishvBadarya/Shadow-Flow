import React, { useState } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  Building,
  Calendar
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function ContactPage() {
  const { showToast } = useApp();
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [dept, setDept] = useState('General Inquiries');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    showToast('Your inquiry has been submitted. Our patient desk will contact you within 2 hours.', 'success');
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
          <span className="badge badge-blue">Hospital Directory & Inquiries</span>
          <h1 style={{ fontSize: '38px', marginTop: '10px', marginBottom: '14px', letterSpacing: '-0.02em' }}>
            Get in Touch with MediCare Nexus
          </h1>
          <p style={{ fontSize: '16px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Reach out to our clinical departments, patient relationship managers,
            or international medical coordinators.
          </p>
        </div>
      </section>

      <div className="container" style={{ marginTop: '48px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: '40px' }}>
          {/* Left Info & Directory */}
          <div>
            <div className="card" style={{ padding: '32px', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '20px', marginBottom: '16px' }}>Main Hospital Campus</h2>
              <div className="flex flex-col gap-md" style={{ fontSize: '14px' }}>
                <div className="flex items-start gap-sm">
                  <MapPin size={20} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong>Campus Address:</strong>
                    <div style={{ color: 'var(--text-secondary)', marginTop: '2px' }}>
                      450 Healthcare Boulevard, Metro Medical District, Suite 100
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-sm">
                  <Phone size={20} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong>24/7 Switchboard & Emergency:</strong>
                    <div style={{ color: 'var(--text-secondary)', marginTop: '2px' }}>
                      +1 (800) MEDICARE / +1 (555) 019-2831
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-sm">
                  <Mail size={20} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong>Digital Patient Relations:</strong>
                    <div style={{ color: 'var(--text-secondary)', marginTop: '2px' }}>
                      patientcare@shadowflow.health
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-sm">
                  <Clock size={20} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong>Operating Windows:</strong>
                    <div style={{ color: 'var(--text-secondary)', marginTop: '2px' }}>
                      Emergency & Inpatient: 24/7 / 365 Days<br />
                      Outpatient Consultations: 08:00 AM - 08:00 PM
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Department Hotlines */}
            <div className="card" style={{ padding: '28px' }}>
              <h3 style={{ fontSize: '17px', marginBottom: '12px' }}>Department Direct Dial Lines</h3>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
                <li className="flex justify-between">
                  <span>Cardiology & Cath Lab:</span>
                  <strong>Ext. 401</strong>
                </li>
                <li className="flex justify-between">
                  <span>Neurology & Stroke Unit:</span>
                  <strong>Ext. 402</strong>
                </li>
                <li className="flex justify-between">
                  <span>Pediatrics & NICU:</span>
                  <strong>Ext. 403</strong>
                </li>
                <li className="flex justify-between">
                  <span>Billing & Insurance Pre-Auth:</span>
                  <strong>Ext. 109</strong>
                </li>
                <li className="flex justify-between">
                  <span>Diagnostic Lab & Imaging:</span>
                  <strong>Ext. 204</strong>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Inquiry Form */}
          <div className="card" style={{ padding: '36px' }}>
            <h2 style={{ fontSize: '22px', marginBottom: '8px' }}>Send Us a Message</h2>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '24px' }}>
              Fill in your details below and a healthcare coordinator will connect with you.
            </p>

            {submitted ? (
              <div style={{ textAlign: 'center', padding: '48px 16px' }}>
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--success-light)',
                    color: 'var(--success-dark)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px'
                  }}
                >
                  <CheckCircle2 size={36} />
                </div>
                <h3 style={{ fontSize: '20px' }}>Inquiry Received!</h3>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '8px', maxWidth: '420px', margin: '8px auto 24px' }}>
                  Thank you, <strong>{name}</strong>. A patient relation officer from {dept} will follow up with your provided contact email.
                </p>
                <button onClick={() => setSubmitted(false)} className="btn btn-secondary">
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="john@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Target Department / Topic</label>
                  <select
                    value={dept}
                    onChange={(e) => setDept(e.target.value)}
                    className="form-select"
                  >
                    <option value="General Inquiries">General Information</option>
                    <option value="Cardiology">Cardiology</option>
                    <option value="Neurology">Neurology</option>
                    <option value="Orthopedics">Orthopedics & Joint Replacement</option>
                    <option value="Billing & Insurance">Billing & Insurance Queries</option>
                    <option value="Patient Records">Medical Records & Report Queries</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Your Message or Clinical Question</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="How can our clinical team assist you today?"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="form-textarea"
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-lg"
                  style={{ width: '100%', marginTop: '8px', justifyContent: 'center' }}
                >
                  <Send size={18} /> Submit Hospital Inquiry
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
