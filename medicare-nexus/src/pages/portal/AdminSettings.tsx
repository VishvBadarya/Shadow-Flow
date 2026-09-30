import React, { useState } from 'react';
import { Settings, Save, ShieldCheck, Phone, Database, Bell } from 'lucide-react';
import PortalLayout from '../../components/PortalLayout';
import { useApp } from '../../context/AppContext';

export default function AdminSettings() {
  const { showToast } = useApp();

  const [hospitalName, setHospitalName] = useState('ShadowFlow MediCare Nexus Multi-Specialty Hospital');
  const [emergencyPhone, setEmergencyPhone] = useState('1-800-633-4227');
  const [address, setAddress] = useState('450 Healthcare Boulevard, Metro Medical District');
  const [hipaaLogging, setHipaaLogging] = useState(true);
  const [hl7Sync, setHl7Sync] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Hospital configuration parameters committed successfully', 'success');
  };

  return (
    <PortalLayout
      role="admin"
      title="Hospital Enterprise Configuration"
      subtitle="Operational parameters, emergency triage switchboard hotlines, and HL7/FHIR interoperability status."
    >
      <div className="card" style={{ maxWidth: '800px', padding: '36px' }}>
        <form onSubmit={handleSave}>
          <h3 style={{ fontSize: '18px', marginBottom: '20px' }}>Facility Information</h3>

          <div className="form-group">
            <label className="form-label">Hospital Legal Identity</label>
            <input
              type="text"
              value={hospitalName}
              onChange={(e) => setHospitalName(e.target.value)}
              className="form-input"
            />
          </div>

          <div className="grid grid-cols-2" style={{ gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">24/7 Emergency Dispatch Number</label>
              <input
                type="text"
                value={emergencyPhone}
                onChange={(e) => setEmergencyPhone(e.target.value)}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Campus Physical Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="form-input"
              />
            </div>
          </div>

          <div style={{ height: '1px', backgroundColor: 'var(--border-light)', margin: '24px 0' }}></div>

          <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>Security & EMR Interoperability</h3>

          <div className="flex flex-col gap-md" style={{ marginBottom: '28px' }}>
            <label className="flex items-center gap-sm" style={{ cursor: 'pointer', fontSize: '14px' }}>
              <input
                type="checkbox"
                checked={hipaaLogging}
                onChange={(e) => setHipaaLogging(e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }}
              />
              <span><strong>HIPAA Audit Logging:</strong> Maintain immutable access logs for all clinical chart views</span>
            </label>

            <label className="flex items-center gap-sm" style={{ cursor: 'pointer', fontSize: '14px' }}>
              <input
                type="checkbox"
                checked={hl7Sync}
                onChange={(e) => setHl7Sync(e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }}
              />
              <span><strong>HL7/FHIR Fast Sync:</strong> Synchronize biochemistry and CT diagnostic PACS in real-time</span>
            </label>
          </div>

          <button type="submit" className="btn btn-primary btn-lg">
            <Save size={18} /> Update Hospital Settings
          </button>
        </form>
      </div>
    </PortalLayout>
  );
}
