import React, { useState } from 'react';
import { Building, Bed, Users, Activity, Edit, Plus, CheckCircle2 } from 'lucide-react';
import PortalLayout from '../../components/PortalLayout';
import { DEPARTMENTS } from '../../data/mockData';
import { useApp } from '../../context/AppContext';

export default function AdminDepartments() {
  const { showToast } = useApp();
  const [departments, setDepartments] = useState(
    DEPARTMENTS.map((d) => ({
      ...d,
      currentOccupancy: Math.floor(d.bedCapacity * 0.85)
    }))
  );

  const handleUpdateCapacity = (id: string, name: string) => {
    showToast(`Bed capacity allocation updated for Department of ${name}`, 'success');
  };

  return (
    <PortalLayout
      role="admin"
      title="Department & Clinical Bed Allocation"
      subtitle="Monitor hospital department occupancy ratios, intensive care units, and clinical bed staging."
    >
      <div className="grid grid-cols-2" style={{ gap: '24px' }}>
        {departments.map((dept) => {
          const occupancyPct = Math.round((dept.currentOccupancy / dept.bedCapacity) * 100);
          return (
            <div key={dept.id} className="card" style={{ padding: '24px' }}>
              <div className="flex justify-between items-start" style={{ marginBottom: '14px' }}>
                <div>
                  <h3 style={{ fontSize: '18px', color: 'var(--text-primary)' }}>{dept.name}</h3>
                  <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>
                    Director: {dept.headOfDept}
                  </div>
                </div>
                <span className="badge badge-blue">{dept.doctorsCount} Clinicians</span>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <div className="flex justify-between items-center" style={{ fontSize: '13px', marginBottom: '6px' }}>
                  <span>Bed Occupancy:</span>
                  <strong>{dept.currentOccupancy} / {dept.bedCapacity} Beds ({occupancyPct}%)</strong>
                </div>
                <div style={{ height: '8px', backgroundColor: 'var(--surface-alt)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${occupancyPct}%`,
                      backgroundColor: occupancyPct > 90 ? '#DC2626' : 'var(--primary)',
                      borderRadius: '4px'
                    }}
                  ></div>
                </div>
              </div>

              <div
                style={{
                  borderTop: '1px solid var(--border-light)',
                  paddingTop: '14px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>
                  Total Surgeries: <strong>{dept.surgeriesCompleted}+</strong>
                </div>
                <button
                  onClick={() => handleUpdateCapacity(dept.id, dept.name)}
                  className="btn btn-secondary btn-sm"
                >
                  <Edit size={13} /> Edit Capacity
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </PortalLayout>
  );
}
