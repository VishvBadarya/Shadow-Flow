import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Stethoscope,
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
  X
} from 'lucide-react';
import PortalLayout from '../../components/PortalLayout';
import { DOCTORS } from '../../data/mockData';
import { useApp } from '../../context/AppContext';

export default function AdminDoctors() {
  const { showToast } = useApp();

  const [doctorsList, setDoctorsList] = useState(
    DOCTORS.map((d) => ({
      ...d,
      status: 'Active' as 'Active' | 'Disabled'
    }))
  );

  const [search, setSearch] = useState('');
  const [addModalOpen, setAddModalOpen] = useState(false);

  // New Doctor Form state
  const [newName, setNewName] = useState('');
  const [newSpecialty, setNewSpecialty] = useState('Cardiology');
  const [newExp, setNewExp] = useState('10');
  const [newFee, setNewFee] = useState('120');

  const filtered = doctorsList.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.specialty.toLowerCase().includes(search.toLowerCase()) ||
    d.hospitalDepartment.toLowerCase().includes(search.toLowerCase())
  );

  const handleToggleStatus = (id: string) => {
    setDoctorsList((prev) =>
      prev.map((d) =>
        d.id === id ? { ...d, status: d.status === 'Active' ? 'Disabled' : 'Active' } : d
      )
    );
    showToast('Doctor status updated', 'info');
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to remove ${name} from the medical registry?`)) {
      setDoctorsList((prev) => prev.filter((d) => d.id !== id));
      showToast(`${name} removed from registry`, 'warning');
    }
  };

  const handleAddDoctorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newDoc = {
      id: `doc-${Date.now()}`,
      name: newName,
      specialty: newSpecialty,
      qualification: 'MD, Board Certified',
      experience: Number(newExp),
      rating: 5.0,
      reviewsCount: 1,
      consultationFee: Number(newFee),
      nextAvailable: 'Tomorrow at 10:00 AM',
      availableToday: true,
      online: true,
      image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80',
      hospitalDepartment: newSpecialty,
      languages: ['English'],
      gender: 'Male' as const,
      consultationType: ['In-Person' as const],
      about: 'Newly appointed clinical consultant at ShadowFlow MediCare Nexus.',
      education: [{ degree: 'Doctor of Medicine', institution: 'Metro Medical School', year: '2014' }],
      experienceList: [{ role: 'Consultant', hospital: 'MediCare Nexus', duration: '2026 - Present' }],
      availableSlots: [{ date: '2026-10-02', slots: ['10:00 AM', '02:00 PM'] }],
      status: 'Active' as const
    };

    setDoctorsList([newDoc, ...doctorsList]);
    setAddModalOpen(false);
    setNewName('');
    showToast(`Dr. ${newName} successfully onboarded to hospital roster!`, 'success');
  };

  return (
    <PortalLayout
      role="admin"
      title="Doctor & Clinical Faculty Management"
      subtitle="Manage physician credentials, active hospital licensing, departments, and consultation fees."
    >
      {/* Top Action Bar */}
      <div className="flex justify-between items-center flex-wrap gap-md" style={{ marginBottom: '24px' }}>
        <div style={{ position: 'relative', width: '360px' }}>
          <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '11px' }} />
          <input
            type="text"
            placeholder="Search by doctor name or department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-input"
            style={{ paddingLeft: '38px', margin: 0 }}
          />
        </div>

        <button onClick={() => setAddModalOpen(true)} className="btn btn-primary">
          <Plus size={16} /> + Add Doctor
        </button>
      </div>

      {/* Doctor Management Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
          <table className="table">
            <thead>
              <tr>
                <th>Doctor</th>
                <th>Department</th>
                <th>Experience</th>
                <th>Availability</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((doc) => (
                <tr key={doc.id}>
                  <td>
                    <div className="flex items-center gap-sm">
                      <img
                        src={doc.image}
                        alt={doc.name}
                        style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <div>
                        <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{doc.name}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{doc.qualification}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-blue">{doc.hospitalDepartment}</span>
                  </td>
                  <td>{doc.experience} Years</td>
                  <td>
                    <span style={{ fontSize: '12.5px', color: doc.availableToday ? 'var(--success-dark)' : 'var(--text-secondary)', fontWeight: 500 }}>
                      {doc.availableToday ? '● Available Today' : '○ Scheduled Slots'}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${doc.status === 'Active' ? 'badge-green' : 'badge-red'}`}>
                      {doc.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div className="flex items-center justify-end gap-xs">
                      <Link to={`/doctor/${doc.id}`} className="btn btn-secondary btn-sm" title="View Profile">
                        <Eye size={13} /> View
                      </Link>
                      <button
                        onClick={() => handleToggleStatus(doc.id)}
                        className={`btn btn-sm ${doc.status === 'Active' ? 'btn-ghost' : 'btn-teal'}`}
                        title="Toggle Status"
                      >
                        {doc.status === 'Active' ? 'Disable' : 'Activate'}
                      </button>
                      <button
                        onClick={() => handleDelete(doc.id, doc.name)}
                        className="btn btn-ghost btn-sm"
                        style={{ color: 'var(--danger)' }}
                        title="Delete Doctor"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Doctor Modal */}
      {addModalOpen && (
        <div className="modal-overlay" onClick={() => setAddModalOpen(false)}>
          <div
            className="modal-content"
            style={{ maxWidth: '520px', padding: '32px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center" style={{ marginBottom: '20px' }}>
              <h3 style={{ fontSize: '19px' }}>Onboard New Physician to Roster</h3>
              <button onClick={() => setAddModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddDoctorSubmit}>
              <div className="form-group">
                <label className="form-label">Full Name & Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Robert Lang, MD"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Department / Specialty</label>
                <select
                  value={newSpecialty}
                  onChange={(e) => setNewSpecialty(e.target.value)}
                  className="form-select"
                >
                  <option value="Cardiology">Cardiology</option>
                  <option value="Neurology">Neurology</option>
                  <option value="Orthopedics">Orthopedics</option>
                  <option value="Pediatrics">Pediatrics</option>
                  <option value="Oncology">Oncology</option>
                  <option value="Dermatology">Dermatology</option>
                  <option value="Gynecology">Gynecology</option>
                  <option value="General Medicine">General Medicine</option>
                </select>
              </div>

              <div className="grid grid-cols-2" style={{ gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Experience (Years)</label>
                  <input
                    type="number"
                    required
                    value={newExp}
                    onChange={(e) => setNewExp(e.target.value)}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Consultation Fee ($)</label>
                  <input
                    type="number"
                    required
                    value={newFee}
                    onChange={(e) => setNewFee(e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-sm" style={{ marginTop: '24px' }}>
                <button type="button" onClick={() => setAddModalOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Register Physician →
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PortalLayout>
  );
}
