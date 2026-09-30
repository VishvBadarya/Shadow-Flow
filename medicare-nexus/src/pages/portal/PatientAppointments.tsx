import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  XCircle,
  AlertCircle,
  CalendarPlus,
  RefreshCw,
  Video
} from 'lucide-react';
import PortalLayout from '../../components/PortalLayout';
import { useApp } from '../../context/AppContext';
import type { Appointment } from '../../types';

export default function PatientAppointments() {
  const { appointments, updateAppointmentStatus, rescheduleAppointment, showToast } = useApp();

  const [filter, setFilter] = useState<'All' | 'Confirmed' | 'Completed' | 'Cancelled'>('All');
  const [rescheduleModalApt, setRescheduleModalApt] = useState<Appointment | null>(null);
  const [newDate, setNewDate] = useState('2026-10-05');
  const [newSlot, setNewSlot] = useState('02:30 PM');

  const filtered = appointments.filter((a) => (filter === 'All' ? true : a.status === filter));

  const handleCancel = (id: string) => {
    if (window.confirm('Are you sure you want to cancel this scheduled consultation?')) {
      updateAppointmentStatus(id, 'Cancelled');
      showToast(`Appointment ${id} has been cancelled`, 'info');
    }
  };

  const handleRescheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rescheduleModalApt) return;
    rescheduleAppointment(rescheduleModalApt.id, newDate, newSlot);
    setRescheduleModalApt(null);
  };

  return (
    <PortalLayout
      role="patient"
      title="My Appointments & Consultations"
      subtitle="View your scheduled outpatient visits, telehealth sessions, and visit histories."
    >
      {/* Top Filter and Book New CTA */}
      <div className="flex justify-between items-center flex-wrap gap-md" style={{ marginBottom: '24px' }}>
        <div className="flex items-center gap-xs">
          {(['All', 'Confirmed', 'Completed', 'Cancelled'] as const).map((st) => (
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

        <Link to="/book-appointment" className="btn btn-primary btn-sm">
          <CalendarPlus size={16} /> Book New Appointment
        </Link>
      </div>

      {/* Appointment Cards List */}
      <div className="flex flex-col gap-md">
        {filtered.length === 0 ? (
          <div className="card text-center" style={{ padding: '48px 16px' }}>
            <Calendar size={42} color="var(--text-muted)" style={{ margin: '0 auto 12px' }} />
            <h3 style={{ fontSize: '18px' }}>No Appointments Found</h3>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>
              You do not have any appointments under the "{filter}" filter.
            </p>
          </div>
        ) : (
          filtered.map((apt) => (
            <div
              key={apt.id}
              className="card"
              style={{
                padding: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '20px'
              }}
            >
              <div style={{ flex: 1, minWidth: '280px' }}>
                <div className="flex items-center gap-sm" style={{ marginBottom: '6px' }}>
                  <span
                    className={`badge ${
                      apt.status === 'Confirmed'
                        ? 'badge-green'
                        : apt.status === 'Completed'
                        ? 'badge-blue'
                        : 'badge-red'
                    }`}
                  >
                    {apt.status}
                  </span>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>ID: {apt.id}</span>
                  {apt.consultationType === 'Video Consultation' && (
                    <span className="badge badge-teal" style={{ fontSize: '11px' }}>
                      <Video size={12} /> Video Consultation
                    </span>
                  )}
                </div>

                <h3 style={{ fontSize: '18px', color: 'var(--text-primary)', marginBottom: '4px' }}>
                  {apt.doctorName}
                </h3>
                <div style={{ fontSize: '13.5px', color: 'var(--primary)', fontWeight: 600, marginBottom: '8px' }}>
                  {apt.doctorSpecialty} • Department of {apt.department}
                </div>

                <div className="flex items-center gap-md flex-wrap" style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                  <div className="flex items-center gap-xs">
                    <Calendar size={14} color="var(--primary)" />
                    <span>{apt.date}</span>
                  </div>
                  <div className="flex items-center gap-xs">
                    <Clock size={14} color="var(--primary)" />
                    <span>{apt.timeSlot}</span>
                  </div>
                  <div className="flex items-center gap-xs">
                    <MapPin size={14} color="var(--secondary)" />
                    <span>{apt.hospitalLocation}</span>
                  </div>
                </div>

                <div style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginTop: '8px' }}>
                  <strong>Reason:</strong> {apt.reason}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-sm flex-wrap">
                {apt.status === 'Confirmed' && (
                  <>
                    <button
                      onClick={() => setRescheduleModalApt(apt)}
                      className="btn btn-secondary btn-sm"
                    >
                      <RefreshCw size={14} /> Reschedule
                    </button>
                    <button
                      onClick={() => handleCancel(apt.id)}
                      className="btn btn-danger btn-sm"
                      style={{ backgroundColor: '#FEE2E2', color: '#DC2626', borderColor: '#FECACA' }}
                    >
                      Cancel Visit
                    </button>
                  </>
                )}

                {apt.status === 'Completed' && (
                  <Link to="/portal/patient/records" className="btn btn-secondary btn-sm">
                    View Clinical Record
                  </Link>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Reschedule Modal */}
      {rescheduleModalApt && (
        <div className="modal-overlay" onClick={() => setRescheduleModalApt(null)}>
          <div
            className="modal-content"
            style={{ maxWidth: '480px', padding: '28px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>Reschedule Appointment</h3>
            <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
              Change consultation timing with <strong>{rescheduleModalApt.doctorName}</strong>
            </p>

            <form onSubmit={handleRescheduleSubmit}>
              <div className="form-group">
                <label className="form-label">Select New Date</label>
                <select
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="form-select"
                >
                  <option value="2026-10-05">Monday, Oct 05, 2026</option>
                  <option value="2026-10-06">Tuesday, Oct 06, 2026</option>
                  <option value="2026-10-07">Wednesday, Oct 07, 2026</option>
                  <option value="2026-10-08">Thursday, Oct 08, 2026</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Select New Time Slot</label>
                <select
                  value={newSlot}
                  onChange={(e) => setNewSlot(e.target.value)}
                  className="form-select"
                >
                  <option value="10:00 AM">10:00 AM - Morning Slot</option>
                  <option value="11:30 AM">11:30 AM - Morning Slot</option>
                  <option value="02:30 PM">02:30 PM - Afternoon Slot</option>
                  <option value="04:15 PM">04:15 PM - Evening Slot</option>
                </select>
              </div>

              <div className="flex justify-end gap-sm" style={{ marginTop: '24px' }}>
                <button
                  type="button"
                  onClick={() => setRescheduleModalApt(null)}
                  className="btn btn-secondary"
                >
                  Close
                </button>
                <button type="submit" className="btn btn-primary">
                  Confirm Reschedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PortalLayout>
  );
}
