import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Video, CheckCircle2, User, Stethoscope } from 'lucide-react';
import PortalLayout from '../../components/PortalLayout';
import { useApp } from '../../context/AppContext';

export default function DoctorAppointments() {
  const { appointments, updateAppointmentStatus, showToast } = useApp();
  const [filter, setFilter] = useState<'All' | 'Confirmed' | 'Completed'>('All');

  const filtered = appointments.filter((a) => (filter === 'All' ? true : a.status === filter));

  const handleMarkCompleted = (id: string, name: string) => {
    updateAppointmentStatus(id, 'Completed');
    showToast(`Consultation with ${name} marked as completed`, 'success');
  };

  return (
    <PortalLayout
      role="doctor"
      title="Doctor Appointments Queue"
      subtitle="Manage scheduled inpatient follow-ups, clinic appointments, and video telemedicine visits."
    >
      <div className="flex justify-between items-center" style={{ marginBottom: '24px' }}>
        <div className="flex items-center gap-xs">
          {(['All', 'Confirmed', 'Completed'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setFilter(st)}
              className={`btn btn-sm ${filter === st ? 'btn-primary' : 'btn-secondary'}`}
              style={{ borderRadius: 'var(--radius-full)' }}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
          <table className="table">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Encounter Date</th>
                <th>Time Slot</th>
                <th>Type</th>
                <th>Clinical Reason</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((apt) => (
                <tr key={apt.id}>
                  <td>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{apt.patientName}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>ID: {apt.patientId}</div>
                  </td>
                  <td>{apt.date}</td>
                  <td style={{ fontWeight: 600 }}>{apt.timeSlot}</td>
                  <td>
                    {apt.consultationType === 'Video Consultation' ? (
                      <span className="badge badge-teal"><Video size={11} /> Video</span>
                    ) : (
                      <span className="badge badge-blue">In-Person</span>
                    )}
                  </td>
                  <td style={{ maxWidth: '200px', fontSize: '13px' }}>{apt.reason}</td>
                  <td>
                    <span className={`badge ${apt.status === 'Confirmed' ? 'badge-green' : 'badge-blue'}`}>
                      {apt.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div className="flex items-center justify-end gap-xs">
                      <Link to={`/portal/doctor/patient/${apt.patientId}`} className="btn btn-secondary btn-sm">
                        Chart
                      </Link>
                      {apt.status === 'Confirmed' && (
                        <button
                          onClick={() => handleMarkCompleted(apt.id, apt.patientName)}
                          className="btn btn-teal btn-sm"
                        >
                          <CheckCircle2 size={13} /> Complete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </PortalLayout>
  );
}
