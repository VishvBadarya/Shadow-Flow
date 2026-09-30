import React, { useState } from 'react';
import { Clock, Calendar, Check, Save } from 'lucide-react';
import PortalLayout from '../../components/PortalLayout';
import { useApp } from '../../context/AppContext';

export default function DoctorSchedule() {
  const { showToast } = useApp();

  const [days, setDays] = useState([
    { day: 'Monday', active: true, morning: '09:00 AM - 01:00 PM', afternoon: '02:00 PM - 05:00 PM', maxPatients: 16 },
    { day: 'Tuesday', active: true, morning: '09:00 AM - 01:00 PM', afternoon: '02:00 PM - 05:00 PM', maxPatients: 16 },
    { day: 'Wednesday', active: true, morning: 'Cath Lab Operating Block', afternoon: '02:30 PM - 06:00 PM', maxPatients: 10 },
    { day: 'Thursday', active: true, morning: '09:00 AM - 01:00 PM', afternoon: '02:00 PM - 05:00 PM', maxPatients: 16 },
    { day: 'Friday', active: true, morning: '09:00 AM - 01:00 PM', afternoon: 'Telehealth Only (02:00 - 05:00)', maxPatients: 12 },
    { day: 'Saturday', active: false, morning: 'Emergency On-Call Duty', afternoon: 'Off', maxPatients: 0 },
    { day: 'Sunday', active: false, morning: 'Emergency On-Call Duty', afternoon: 'Off', maxPatients: 0 }
  ]);

  const handleToggle = (index: number) => {
    setDays((prev) =>
      prev.map((d, i) => (i === index ? { ...d, active: !d.active } : d))
    );
  };

  const handleSave = () => {
    showToast('Weekly clinical schedule updated & synced with OPD reception', 'success');
  };

  return (
    <PortalLayout
      role="doctor"
      title="Physician Availability & OPD Schedule"
      subtitle="Configure clinical consulting windows, operating block times, and daily patient intake quotas."
    >
      <div className="card" style={{ maxWidth: '880px', padding: '32px' }}>
        <div className="flex justify-between items-center" style={{ marginBottom: '24px' }}>
          <div>
            <h3 style={{ fontSize: '18px' }}>Weekly Consulting Blocks</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              Cardiology Consultation Suite 408 & Telemedicine Schedule
            </p>
          </div>
          <button onClick={handleSave} className="btn btn-primary">
            <Save size={16} /> Save Active Roster
          </button>
        </div>

        <div className="flex flex-col gap-sm">
          {days.map((item, idx) => (
            <div
              key={item.day}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 20px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border)',
                backgroundColor: item.active ? 'var(--surface)' : 'var(--surface-alt)',
                opacity: item.active ? 1 : 0.65
              }}
            >
              <div style={{ minWidth: '120px' }}>
                <strong style={{ fontSize: '15px' }}>{item.day}</strong>
                <div style={{ fontSize: '11px', color: item.active ? 'var(--success-dark)' : 'var(--text-muted)' }}>
                  {item.active ? '● Active OPD' : '○ Off-Duty / On-Call'}
                </div>
              </div>

              <div style={{ flex: 1, padding: '0 24px', fontSize: '13px' }}>
                <div><strong>Morning Window:</strong> {item.morning}</div>
                <div style={{ color: 'var(--text-secondary)', marginTop: '2px' }}>
                  <strong>Afternoon / Evening:</strong> {item.afternoon}
                </div>
              </div>

              <div style={{ textAlign: 'right', marginRight: '24px' }}>
                <span className="badge badge-blue">{item.maxPatients} Patients / Day</span>
              </div>

              <label className="flex items-center gap-xs" style={{ cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={item.active}
                  onChange={() => handleToggle(idx)}
                  style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }}
                />
              </label>
            </div>
          ))}
        </div>
      </div>
    </PortalLayout>
  );
}
