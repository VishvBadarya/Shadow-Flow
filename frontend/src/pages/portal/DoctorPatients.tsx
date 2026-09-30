import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Search, Eye, FileText, Activity } from 'lucide-react';
import PortalLayout from '../../components/PortalLayout';

export default function DoctorPatients() {
  const [search, setSearch] = useState('');

  const patientList = [
    { id: 'p-101', name: 'Sarah Jenkins', age: 34, gender: 'Female', blood: 'A+', condition: 'Hypertension & Palpitations', lastVisit: 'Aug 15, 2026', status: 'Stable' },
    { id: 'p-102', name: 'Robert Vance Jr.', age: 58, gender: 'Male', blood: 'O+', condition: 'Pre-Op PAC Clearance', lastVisit: 'Sept 28, 2026', status: 'In Review' },
    { id: 'p-103', name: 'Emily Watson', age: 42, gender: 'Female', blood: 'B+', condition: 'Refractory Migraine', lastVisit: 'Sept 20, 2026', status: 'Treatment Ongoing' },
    { id: 'p-104', name: 'Michael Chang', age: 29, gender: 'Male', blood: 'AB+', condition: 'Knee Post-Arthroscopy', lastVisit: 'Aug 30, 2026', status: 'Rehab' },
    { id: 'p-105', name: 'Eleanor Davis', age: 67, gender: 'Female', blood: 'O-', condition: 'Post-CABG Follow-up', lastVisit: 'Sept 14, 2026', status: 'Stable' }
  ];

  const filtered = patientList.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.condition.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <PortalLayout
      role="doctor"
      title="My Patient Directory"
      subtitle="Access longitudinal clinical histories, past admissions, and continuous remote vital tracking."
    >
      <div className="card" style={{ padding: '16px 20px', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ position: 'relative', width: '360px' }}>
          <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '11px' }} />
          <input
            type="text"
            placeholder="Search patient name, condition..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-input"
            style={{ paddingLeft: '38px', margin: 0 }}
          />
        </div>
        <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
          Showing <strong>{filtered.length}</strong> assigned patients
        </span>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
          <table className="table">
            <thead>
              <tr>
                <th>Patient Name</th>
                <th>Age / Gender</th>
                <th>Blood Type</th>
                <th>Primary Clinical Diagnosis</th>
                <th>Last Evaluation</th>
                <th>Clinical Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((pt) => (
                <tr key={pt.id}>
                  <td>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{pt.name}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>MRN: {pt.id}</div>
                  </td>
                  <td>{pt.age} / {pt.gender}</td>
                  <td><span className="badge badge-blue">{pt.blood}</span></td>
                  <td style={{ fontWeight: 500 }}>{pt.condition}</td>
                  <td>{pt.lastVisit}</td>
                  <td><span className="badge badge-green">{pt.status}</span></td>
                  <td style={{ textAlign: 'right' }}>
                    <Link to={`/portal/doctor/patient/${pt.id}`} className="btn btn-primary btn-sm">
                      <Eye size={13} /> Open Medical Chart
                    </Link>
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
