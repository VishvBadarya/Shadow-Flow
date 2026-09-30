import React, { useState } from 'react';
import { Calendar, Filter, CheckCircle2, XCircle, RefreshCw, Clock, Video } from 'lucide-react';
import PortalLayout from '../../components/PortalLayout';
import { useApp } from '../../context/AppContext';
import { DEPARTMENTS, DOCTORS } from '../../data/mockData';
import type { Appointment } from '../../types';

export default function AdminAppointments() {
  const { appointments, updateAppointmentStatus, rescheduleAppointment, showToast } = useApp();

  const [dateFilter, setDateFilter] = useState('All');
  const [deptFilter, setDeptFilter] = useState('All');
  const [doctorFilter, setDoctorFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Reschedule modal
  const [rescheduleModalApt, setRescheduleModalApt] = useState<Appointment | null>(null);
  const [newDate, setNewDate] = useState('2026-10-06');
  const [newSlot, setNewSlot] = useState('02:00 PM');

  const filtered = appointments.filter((apt) => {
    if (deptFilter !== 'All' && apt.department.toLowerCase() !== deptFilter.toLowerCase()) return false;
    if (doctorFilter !== 'All' && apt.doctorId !== doctorFilter) return false;
    if (statusFilter !== 'All' && apt.status !== statusFilter) return false;
    return true;
  });

  const handleConfirm = (id: string) => {
    updateAppointmentStatus(id, 'Confirmed');
    showToast(`Appointment ${id} confirmed`, 'success');
  };

  const handleCancel = (id: string) => {
    if (window.confirm('Cancel this scheduled hospital appointment?')) {
      updateAppointmentStatus(id, 'Cancelled');
      showToast(`Appointment ${id} cancelled`, 'warning');
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
      role="admin"
      title="Master Hospital Appointment Management"
      subtitle="Supervise multi-department booking slots, patient arrival logs, and provider allocations."
    >
      {/* Multi-Filter Bar */}
      <div className="card" style={{ padding: '20px', marginBottom: '24px' }}>
        <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '12px' }}>
          Filtering Parameters
        </div>
        <div className="grid grid-cols-4" style={{ gap: '14px' }}>
          {/* Status */}
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="form-select"
            >
              <option value="All">All Statuses</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          {/* Department */}
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Department</label>
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="form-select"
            >
              <option value="All">All Departments</option>
              {DEPARTMENTS.map((d) => (
                <option key={d.id} value={d.name}>{d.name}</option>
              ))}
            </select>
          </div>

          {/* Doctor */}
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Physician</label>
            <select
              value={doctorFilter}
              onChange={(e) => setDoctorFilter(e.target.value)}
              className="form-select"
            >
              <option value="All">All Doctors</option>
              {DOCTORS.map((doc) => (
                <option key={doc.id} value={doc.id}>{doc.name}</option>
              ))}
            </select>
          </div>

          {/* Date Filter */}
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Date Window</label>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="form-select"
            >
              <option value="All">All Scheduled Dates</option>
              <option value="Today">Today (Oct 01)</option>
              <option value="Tomorrow">Tomorrow (Oct 02)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Appointment Master Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '17px' }}>Active Appointments Master Log</h3>
          <span className="badge badge-blue">{filtered.length} Bookings Found</span>
        </div>

        <div className="table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
          <table className="table">
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Patient Details</th>
                <th>Doctor & Dept</th>
                <th>Date & Slot</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Admin Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((apt) => (
                <tr key={apt.id}>
                  <td><strong>{apt.id}</strong></td>
                  <td>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{apt.patientName}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{apt.patientPhone}</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{apt.doctorName}</div>
                    <div style={{ fontSize: '11.5px', color: 'var(--primary)' }}>{apt.department}</div>
                  </td>
                  <td>
                    <div>{apt.date}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{apt.timeSlot}</div>
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        apt.status === 'Confirmed'
                          ? 'badge-green'
                          : apt.status === 'Completed'
                          ? 'badge-blue'
                          : apt.status === 'Pending'
                          ? 'badge-amber'
                          : 'badge-red'
                      }`}
                    >
                      {apt.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div className="flex items-center justify-end gap-xs">
                      {apt.status === 'Pending' && (
                        <button
                          onClick={() => handleConfirm(apt.id)}
                          className="btn btn-teal btn-sm"
                        >
                          Confirm
                        </button>
                      )}
                      {apt.status !== 'Cancelled' && (
                        <>
                          <button
                            onClick={() => setRescheduleModalApt(apt)}
                            className="btn btn-secondary btn-sm"
                            title="Reschedule Booking"
                          >
                            <RefreshCw size={13} /> Reschedule
                          </button>
                          <button
                            onClick={() => handleCancel(apt.id)}
                            className="btn btn-ghost btn-sm"
                            style={{ color: 'var(--danger)' }}
                            title="Cancel Booking"
                          >
                            <XCircle size={15} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reschedule Modal */}
      {rescheduleModalApt && (
        <div className="modal-overlay" onClick={() => setRescheduleModalApt(null)}>
          <div
            className="modal-content"
            style={{ maxWidth: '480px', padding: '28px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>Admin Reschedule Override</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
              Override appointment for <strong>{rescheduleModalApt.patientName}</strong> with <strong>{rescheduleModalApt.doctorName}</strong>
            </p>

            <form onSubmit={handleRescheduleSubmit}>
              <div className="form-group">
                <label className="form-label">New Appointment Date</label>
                <select
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="form-select"
                >
                  <option value="2026-10-06">Oct 06, 2026</option>
                  <option value="2026-10-07">Oct 07, 2026</option>
                  <option value="2026-10-08">Oct 08, 2026</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">New Slot</label>
                <select
                  value={newSlot}
                  onChange={(e) => setNewSlot(e.target.value)}
                  className="form-select"
                >
                  <option value="09:30 AM">09:30 AM</option>
                  <option value="11:00 AM">11:00 AM</option>
                  <option value="02:00 PM">02:00 PM</option>
                  <option value="04:30 PM">04:30 PM</option>
                </select>
              </div>

              <div className="flex justify-end gap-sm" style={{ marginTop: '20px' }}>
                <button type="button" onClick={() => setRescheduleModalApt(null)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Commit Reschedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PortalLayout>
  );
}
