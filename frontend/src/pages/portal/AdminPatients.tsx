import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Search, Filter, Eye, FileText, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import PortalLayout from '../../components/PortalLayout';

interface PatientRecordItem {
  id: string;
  name: string;
  age: number;
  gender: string;
  phone: string;
  status: 'Active' | 'Discharged' | 'Critical Inpatient';
  registeredDate: string;
  lastEncounter: string;
}

export default function AdminPatients() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const mockPatients: PatientRecordItem[] = [
    { id: 'SF-PT-101', name: 'Sarah Jenkins', age: 34, gender: 'Female', phone: '+1 (555) 234-5678', status: 'Active', registeredDate: '2024-01-15', lastEncounter: '2026-08-15' },
    { id: 'SF-PT-102', name: 'Robert Vance Jr.', age: 58, gender: 'Male', phone: '+1 (555) 345-6789', status: 'Active', registeredDate: '2025-04-10', lastEncounter: '2026-09-30' },
    { id: 'SF-PT-103', name: 'Emily Watson', age: 42, gender: 'Female', phone: '+1 (555) 456-7890', status: 'Active', registeredDate: '2025-11-20', lastEncounter: '2026-09-20' },
    { id: 'SF-PT-104', name: 'Michael Chang', age: 29, gender: 'Male', phone: '+1 (555) 567-8901', status: 'Discharged', registeredDate: '2026-02-04', lastEncounter: '2026-08-30' },
    { id: 'SF-PT-105', name: 'Eleanor Davis', age: 67, gender: 'Female', phone: '+1 (555) 678-9012', status: 'Critical Inpatient', registeredDate: '2024-08-19', lastEncounter: '2026-10-01' },
    { id: 'SF-PT-106', name: 'James Wilson', age: 51, gender: 'Male', phone: '+1 (555) 789-0123', status: 'Active', registeredDate: '2026-01-08', lastEncounter: '2026-09-12' },
    { id: 'SF-PT-107', name: 'Maria Rodriguez', age: 39, gender: 'Female', phone: '+1 (555) 890-1234', status: 'Discharged', registeredDate: '2025-06-22', lastEncounter: '2026-07-18' }
  ];

  const filtered = mockPatients.filter((p) => {
    if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.id.toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter !== 'All' && p.status !== statusFilter) return false;
    return true;
  });

  const totalPages = Math.ceil(filtered.length / pageSize);
  const displayedPatients = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <PortalLayout
      role="admin"
      title="Master Patient Registry & EMR Index"
      subtitle="Search, audit, and inspect longitudinal patient health records and episode histories."
    >
      {/* Search & Filter Bar */}
      <div className="card" style={{ padding: '16px 20px', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ position: 'relative', width: '360px' }}>
          <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '11px' }} />
          <input
            type="text"
            placeholder="Search patient by MRN or name..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            className="form-input"
            style={{ paddingLeft: '38px', margin: 0 }}
          />
        </div>

        <div className="flex items-center gap-sm">
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
            className="form-select"
            style={{ width: 'auto', margin: 0 }}
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active Outpatient</option>
            <option value="Critical Inpatient">Critical Inpatient</option>
            <option value="Discharged">Discharged</option>
          </select>
        </div>
      </div>

      {/* Patient Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
          <table className="table">
            <thead>
              <tr>
                <th>Patient ID</th>
                <th>Full Legal Name</th>
                <th>Age / Gender</th>
                <th>Phone Number</th>
                <th>Registration Date</th>
                <th>Clinical Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayedPatients.map((p) => (
                <tr key={p.id}>
                  <td><strong>{p.id}</strong></td>
                  <td>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{p.name}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Last: {p.lastEncounter}</div>
                  </td>
                  <td>{p.age} / {p.gender}</td>
                  <td>{p.phone}</td>
                  <td>{p.registeredDate}</td>
                  <td>
                    <span
                      className={`badge ${
                        p.status === 'Active'
                          ? 'badge-green'
                          : p.status === 'Critical Inpatient'
                          ? 'badge-red'
                          : 'badge-gray'
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div className="flex items-center justify-end gap-xs">
                      <Link to="/portal/doctor/patient/p-101" className="btn btn-secondary btn-sm" title="View Patient Profile">
                        <Eye size={13} /> View Profile
                      </Link>
                      <Link to="/portal/patient/records" className="btn btn-ghost btn-sm" title="Medical History">
                        <FileText size={13} />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            Showing <strong>{(currentPage - 1) * pageSize + 1}</strong> to <strong>{Math.min(currentPage * pageSize, filtered.length)}</strong> of <strong>{filtered.length}</strong> patients
          </div>

          <div className="flex items-center gap-xs">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="btn btn-secondary btn-sm"
            >
              <ChevronLeft size={14} /> Previous
            </button>
            <span style={{ fontSize: '13px', padding: '0 8px' }}>
              Page {currentPage} of {totalPages || 1}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="btn btn-secondary btn-sm"
            >
              Next <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
