import React from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function ToastContainer() {
  const { toasts } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((t) => {
        let icon = <Info size={18} color="var(--primary)" />;
        if (t.type === 'success') icon = <CheckCircle2 size={18} color="var(--success)" />;
        if (t.type === 'error') icon = <AlertCircle size={18} color="var(--danger)" />;
        if (t.type === 'warning') icon = <AlertTriangle size={18} color="var(--warning)" />;

        return (
          <div key={t.id} className={`toast toast-${t.type}`}>
            {icon}
            <span style={{ color: 'var(--text-primary)', fontSize: '13.5px' }}>{t.message}</span>
          </div>
        );
      })}
    </div>
  );
}
