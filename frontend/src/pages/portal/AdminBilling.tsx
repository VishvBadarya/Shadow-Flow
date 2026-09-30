import React, { useState } from 'react';
import { CreditCard, DollarSign, Download, Plus, CheckCircle2, ShieldCheck } from 'lucide-react';
import PortalLayout from '../../components/PortalLayout';
import { INITIAL_BILLS } from '../../data/mockData';
import { useApp } from '../../context/AppContext';

export default function AdminBilling() {
  const { showToast } = useApp();
  const [billsList, setBillsList] = useState(INITIAL_BILLS);

  return (
    <PortalLayout
      role="admin"
      title="Hospital Financial & Billing Operations"
      subtitle="Supervise revenue cycles, inpatient claim settlements, and private insurance pre-authorizations."
    >
      <div className="grid grid-cols-4" style={{ marginBottom: '28px' }}>
        <div className="card" style={{ padding: '20px' }}>
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Monthly Collected Revenue</div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--primary)', marginTop: '4px' }}>$1.84M</div>
          <div style={{ fontSize: '12px', color: 'var(--success-dark)', marginTop: '2px' }}>+8.4% vs last month</div>
        </div>

        <div className="card" style={{ padding: '20px' }}>
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Outstanding Accounts Receivable</div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--danger)', marginTop: '4px' }}>$142,500</div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>Average DSO: 24.2 days</div>
        </div>

        <div className="card" style={{ padding: '20px' }}>
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Insurance Claim Approval Rate</div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--success-dark)', marginTop: '4px' }}>96.8%</div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>Pre-auth turnaround: 2.1 hrs</div>
        </div>

        <div className="card" style={{ padding: '20px' }}>
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Cashless Payers Integrated</div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>38 TPAs</div>
          <div style={{ fontSize: '12px', color: 'var(--secondary-dark)', marginTop: '2px' }}>Direct API Settlement</div>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '17px' }}>Hospital Financial Ledger</h3>
          <button onClick={() => showToast('Dispatched financial ledger CSV report', 'success')} className="btn btn-secondary btn-sm">
            <Download size={14} /> Export Reconciliation
          </button>
        </div>

        <div className="table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
          <table className="table">
            <thead>
              <tr>
                <th>Invoice #</th>
                <th>Patient Name</th>
                <th>Clinical Specialty</th>
                <th>Billed Date</th>
                <th>Amount</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {billsList.map((b) => (
                <tr key={b.id}>
                  <td><strong>{b.invoiceNumber}</strong></td>
                  <td>{b.patientName}</td>
                  <td>{b.service}</td>
                  <td>{b.date}</td>
                  <td style={{ fontWeight: 700 }}>${b.amount.toFixed(2)}</td>
                  <td>
                    <span className={`badge ${b.status === 'Paid' ? 'badge-green' : 'badge-red'}`}>
                      {b.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      onClick={() => showToast(`Audit trail viewed for ${b.invoiceNumber}`, 'info')}
                      className="btn btn-secondary btn-sm"
                    >
                      Audit
                    </button>
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
