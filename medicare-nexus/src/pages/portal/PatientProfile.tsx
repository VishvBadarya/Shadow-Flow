import React, { useState } from 'react';
import { User, Phone, Mail, ShieldAlert, Heart, Save } from 'lucide-react';
import PortalLayout from '../../components/PortalLayout';
import { useApp } from '../../context/AppContext';

export default function PatientProfile() {
  const { user, showToast } = useApp();

  const [name, setName] = useState(user?.name || 'Sarah Jenkins');
  const [email, setEmail] = useState(user?.email || 'sarah.jenkins@example.com');
  const [phone, setPhone] = useState(user?.phone || '+1 (555) 234-5678');
  const [bloodGroup, setBloodGroup] = useState(user?.bloodGroup || 'A positive (A+)');
  const [emergencyContact, setEmergencyContact] = useState(user?.emergencyContact || 'David Jenkins (Spouse) - +1 (555) 876-5432');
  const [allergies, setAllergies] = useState(user?.allergies?.join(', ') || 'Penicillin, Sulfa drugs');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Demographic & clinical profile saved successfully', 'success');
  };

  return (
    <PortalLayout
      role="patient"
      title="Patient Profile & Clinical Settings"
      subtitle="Manage your personal demographic information, verified emergency contacts, and allergy alerts."
    >
      <div className="card" style={{ maxWidth: '780px', padding: '36px' }}>
        <div className="flex items-center gap-md" style={{ marginBottom: '28px', borderBottom: '1px solid var(--border-light)', paddingBottom: '24px' }}>
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80'}
            alt="Profile Avatar"
            style={{ width: '84px', height: '84px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--primary-light)' }}
          />
          <div>
            <h2 style={{ fontSize: '22px', color: 'var(--text-primary)' }}>{name}</h2>
            <div style={{ fontSize: '13.5px', color: 'var(--text-secondary)' }}>
              Healthcare Patient ID: <strong>SF-PT-10492</strong> • Registered: Jan 2024
            </div>
            <div className="flex gap-xs" style={{ marginTop: '8px' }}>
              <span className="badge badge-green">HIPAA Consent Verified</span>
              <span className="badge badge-blue">A+ Blood Donor</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSave}>
          <div className="grid grid-cols-2" style={{ gap: '20px' }}>
            <div className="form-group">
              <label className="form-label">Full Legal Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Contact Phone</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Blood Group / Rh Factor</label>
              <input
                type="text"
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group" style={{ marginTop: '4px' }}>
            <label className="form-label">Verified Emergency Contact Person & Phone</label>
            <input
              type="text"
              value={emergencyContact}
              onChange={(e) => setEmergencyContact(e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Documented Clinical Allergies (Vital Alert)</label>
            <input
              type="text"
              value={allergies}
              onChange={(e) => setAllergies(e.target.value)}
              className="form-input"
            />
            <span style={{ fontSize: '11px', color: 'var(--danger)', marginTop: '2px' }}>
              * High priority clinical flag: Alerts anesthesia and ward nurses during triage.
            </span>
          </div>

          <button type="submit" className="btn btn-primary btn-lg" style={{ marginTop: '16px' }}>
            <Save size={18} /> Save Profile Updates
          </button>
        </form>
      </div>
    </PortalLayout>
  );
}
