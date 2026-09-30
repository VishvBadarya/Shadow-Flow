import React, { useState } from 'react';
import { CreditCard, Download, Eye, DollarSign, CheckCircle2, ShieldCheck, X } from 'lucide-react';
import PortalLayout from '../../components/PortalLayout';
import { useApp } from '../../context/AppContext';
import type { BillInvoice } from '../../types';

export default function PatientBilling() {
  const { bills, payBill, showToast } = useApp();
  const [selectedInvoice, setSelectedInvoice] = useState<BillInvoice | null>(null);
  const [payModalInvoice, setPayModalInvoice] = useState<BillInvoice | null>(null);
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  const totalOutstanding = bills
    .filter((b) => b.status === 'Outstanding')
    .reduce((sum, b) => sum + (b.amount - b.paidAmount), 0);

  const totalPaid = bills.reduce((sum, b) => sum + b.paidAmount, 0);

  const handlePayNow = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payModalInvoice) return;
    setPaymentProcessing(true);
    setTimeout(() => {
      payBill(payModalInvoice.id);
      setPaymentProcessing(false);
      setPayModalInvoice(null);
    }, 1000);
  };

  const handleDownloadInvoice = (invNum: string) => {
    const text = `===========================================================\nSHADOWFLOW MEDICARE NEXUS — OFFICIAL INVOICE RECEIPT\nInvoice Number: ${invNum}\nPatient: Sarah Jenkins\nPayment Gateway: Verified HIPAA Compliant PCI-DSS\n===========================================================`;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Invoice_${invNum}.txt`;
    link.click();
    showToast(`Receipt for ${invNum} downloaded`, 'success');
  };

  return (
    <PortalLayout
      role="patient"
      title="Bills, Payments & Invoices"
      subtitle="Transparent healthcare accounts, digital settlement, and downloadable itemized receipts."
    >
      {/* Financial Overview Cards */}
      <div className="grid grid-cols-3" style={{ marginBottom: '28px' }}>
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 600 }}>
            Total Outstanding Balance
          </div>
          <div style={{ fontSize: '32px', fontWeight: 800, color: totalOutstanding > 0 ? 'var(--danger)' : 'var(--success-dark)', marginTop: '4px' }}>
            ${totalOutstanding.toFixed(2)}
          </div>
          <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            {totalOutstanding > 0 ? '1 Invoice Pending Settlement' : 'All accounts fully settled'}
          </div>
        </div>

        <div className="card" style={{ padding: '24px' }}>
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 600 }}>
            Total Paid (YTD 2026)
          </div>
          <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--primary)', marginTop: '4px' }}>
            ${totalPaid.toFixed(2)}
          </div>
          <div style={{ fontSize: '12.5px', color: 'var(--success-dark)', marginTop: '4px', fontWeight: 600 }}>
            ✓ Verified cashless insurance co-pays
          </div>
        </div>

        <div className="card" style={{ padding: '24px' }}>
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 600 }}>
            Linked Insurance Policy
          </div>
          <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '6px' }}>
            Blue Cross Blue Shield
          </div>
          <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Policy #BC-99214 • 80% Inpatient Coverage
          </div>
        </div>
      </div>

      {/* Invoice Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)' }}>
          <h3 style={{ fontSize: '18px' }}>Recent Hospital Invoices & Statements</h3>
        </div>

        <div className="table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
          <table className="table">
            <thead>
              <tr>
                <th>Invoice ID</th>
                <th>Issue Date</th>
                <th>Service & Clinical Area</th>
                <th>Amount</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bills.map((inv) => (
                <tr key={inv.id}>
                  <td>
                    <strong>{inv.invoiceNumber}</strong>
                  </td>
                  <td>{inv.date}</td>
                  <td>{inv.service}</td>
                  <td style={{ fontWeight: 700 }}>
                    ${inv.amount.toFixed(2)}
                  </td>
                  <td>
                    <span className={`badge ${inv.status === 'Paid' ? 'badge-green' : 'badge-red'}`}>
                      {inv.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div className="flex items-center justify-end gap-xs">
                      <button
                        onClick={() => setSelectedInvoice(inv)}
                        className="btn btn-secondary btn-sm"
                      >
                        <Eye size={13} /> View Invoice
                      </button>
                      <button
                        onClick={() => handleDownloadInvoice(inv.invoiceNumber)}
                        className="btn btn-secondary btn-sm"
                      >
                        <Download size={13} /> Download
                      </button>
                      {inv.status === 'Outstanding' && (
                        <button
                          onClick={() => setPayModalInvoice(inv)}
                          className="btn btn-primary btn-sm"
                        >
                          Pay Now
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

      {/* View Invoice Modal */}
      {selectedInvoice && (
        <div className="modal-overlay" onClick={() => setSelectedInvoice(null)}>
          <div
            className="modal-content"
            style={{ maxWidth: '640px', padding: '32px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start" style={{ marginBottom: '20px' }}>
              <div>
                <span className={`badge ${selectedInvoice.status === 'Paid' ? 'badge-green' : 'badge-red'}`}>
                  {selectedInvoice.status}
                </span>
                <h3 style={{ fontSize: '20px', marginTop: '6px' }}>
                  Invoice {selectedInvoice.invoiceNumber}
                </h3>
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                  Issue Date: {selectedInvoice.date} • Due: {selectedInvoice.dueDate}
                </div>
              </div>
              <button onClick={() => setSelectedInvoice(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
                Itemized Breakdown
              </div>
              <div className="table-wrapper">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Description</th>
                      <th>Qty</th>
                      <th>Unit Rate</th>
                      <th style={{ textAlign: 'right' }}>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedInvoice.items.map((item, idx) => (
                      <tr key={idx}>
                        <td>{item.description}</td>
                        <td>{item.qty}</td>
                        <td>${item.unitPrice.toFixed(2)}</td>
                        <td style={{ textAlign: 'right', fontWeight: 600 }}>${item.total.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex justify-between items-center" style={{ borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
              <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                Total Due: <strong style={{ fontSize: '20px', color: 'var(--primary)' }}>${selectedInvoice.amount.toFixed(2)}</strong>
              </div>

              <div className="flex gap-sm">
                <button onClick={() => setSelectedInvoice(null)} className="btn btn-secondary">
                  Close
                </button>
                <button onClick={() => handleDownloadInvoice(selectedInvoice.invoiceNumber)} className="btn btn-primary">
                  <Download size={16} /> Download Slip
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pay Now Simulation Modal */}
      {payModalInvoice && (
        <div className="modal-overlay" onClick={() => setPayModalInvoice(null)}>
          <div
            className="modal-content"
            style={{ maxWidth: '480px', padding: '32px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center" style={{ marginBottom: '16px' }}>
              <h3 style={{ fontSize: '19px' }}>Settle Healthcare Invoice</h3>
              <button onClick={() => setPayModalInvoice(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ padding: '14px', backgroundColor: 'var(--primary-50)', borderRadius: 'var(--radius-md)', marginBottom: '20px' }}>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Invoice Amount:</div>
              <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--primary)' }}>
                ${payModalInvoice.amount.toFixed(2)}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{payModalInvoice.service}</div>
            </div>

            <form onSubmit={handlePayNow}>
              <div className="form-group">
                <label className="form-label">Payment Method</label>
                <select className="form-select">
                  <option>💳 Visa ending in 4022 (Saved Patient Card)</option>
                  <option>🏦 Bank ACH Transfer</option>
                  <option>📱 Apple Pay / Google Pay</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Billing Zip Code</label>
                <input type="text" defaultValue="02115" className="form-input" />
              </div>

              <button
                type="submit"
                disabled={paymentProcessing}
                className="btn btn-primary btn-lg"
                style={{ width: '100%', marginTop: '12px', justifyContent: 'center' }}
              >
                {paymentProcessing ? 'Processing Secure PCI Gateway...' : `Authorize & Pay $${payModalInvoice.amount.toFixed(2)}`}
              </button>
            </form>
          </div>
        </div>
      )}
    </PortalLayout>
  );
}
