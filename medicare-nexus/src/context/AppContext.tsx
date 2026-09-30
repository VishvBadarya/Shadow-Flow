import React, { createContext, useContext, useState, useEffect } from 'react';
import type {
  UserProfile,
  Appointment,
  MedicalRecord,
  Prescription,
  LabReport,
  BillInvoice,
  AppNotification
} from '../types';
import {
  INITIAL_USER,
  DEMO_USERS,
  INITIAL_APPOINTMENTS,
  INITIAL_MEDICAL_RECORDS,
  INITIAL_PRESCRIPTIONS,
  INITIAL_LAB_REPORTS,
  INITIAL_BILLS,
  NOTIFICATIONS
} from '../data/mockData';

interface ToastData {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

interface AppContextType {
  user: UserProfile | null;
  login: (role: 'patient' | 'doctor' | 'admin') => void;
  logout: () => void;
  appointments: Appointment[];
  addAppointment: (apt: Omit<Appointment, 'id' | 'createdAt'>) => Appointment;
  updateAppointmentStatus: (id: string, status: Appointment['status']) => void;
  rescheduleAppointment: (id: string, date: string, timeSlot: string) => void;
  medicalRecords: MedicalRecord[];
  addMedicalRecord: (rec: Omit<MedicalRecord, 'id'>) => void;
  prescriptions: Prescription[];
  addPrescription: (prescription: Omit<Prescription, 'id'>) => void;
  labReports: LabReport[];
  bills: BillInvoice[];
  payBill: (invoiceId: string) => void;
  notifications: AppNotification[];
  markNotificationRead: (id: string) => void;
  unreadNotificationsCount: number;
  toasts: ToastData[];
  showToast: (message: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
  searchModalOpen: boolean;
  setSearchModalOpen: (open: boolean) => void;
  aiModalOpen: boolean;
  setAiModalOpen: (open: boolean) => void;
  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  authModalInitialRole: 'patient' | 'doctor' | 'admin';
  setAuthModalInitialRole: (role: 'patient' | 'doctor' | 'admin') => void;
  bookingPrefill: { doctorId?: string; departmentId?: string } | null;
  setBookingPrefill: (prefill: { doctorId?: string; departmentId?: string } | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Current user state (defaults to patient for immediate rich experience, can be switched or logged out)
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('sf_user');
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem('sf_appointments');
    return saved ? JSON.parse(saved) : INITIAL_APPOINTMENTS;
  });

  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>(() => {
    const saved = localStorage.getItem('sf_records');
    return saved ? JSON.parse(saved) : INITIAL_MEDICAL_RECORDS;
  });

  const [prescriptions, setPrescriptions] = useState<Prescription[]>(() => {
    const saved = localStorage.getItem('sf_prescriptions');
    return saved ? JSON.parse(saved) : INITIAL_PRESCRIPTIONS;
  });

  const [labReports, setLabReports] = useState<LabReport[]>(() => {
    const saved = localStorage.getItem('sf_lab_reports');
    return saved ? JSON.parse(saved) : INITIAL_LAB_REPORTS;
  });

  const [bills, setBills] = useState<BillInvoice[]>(() => {
    const saved = localStorage.getItem('sf_bills');
    return saved ? JSON.parse(saved) : INITIAL_BILLS;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('sf_notifications');
    return saved ? JSON.parse(saved) : NOTIFICATIONS;
  });

  const [toasts, setToasts] = useState<ToastData[]>([]);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalInitialRole, setAuthModalInitialRole] = useState<'patient' | 'doctor' | 'admin'>('patient');
  const [bookingPrefill, setBookingPrefill] = useState<{ doctorId?: string; departmentId?: string } | null>(null);

  // Sync to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('sf_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('sf_user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('sf_appointments', JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem('sf_records', JSON.stringify(medicalRecords));
  }, [medicalRecords]);

  useEffect(() => {
    localStorage.setItem('sf_prescriptions', JSON.stringify(prescriptions));
  }, [prescriptions]);

  useEffect(() => {
    localStorage.setItem('sf_lab_reports', JSON.stringify(labReports));
  }, [labReports]);

  useEffect(() => {
    localStorage.setItem('sf_bills', JSON.stringify(bills));
  }, [bills]);

  useEffect(() => {
    localStorage.setItem('sf_notifications', JSON.stringify(notifications));
  }, [notifications]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const login = (role: 'patient' | 'doctor' | 'admin') => {
    const selectedUser = DEMO_USERS[role];
    setUser(selectedUser);
    showToast(`Logged in successfully as ${selectedUser.name} (${role.toUpperCase()})`, 'success');
  };

  const logout = () => {
    setUser(null);
    showToast('Logged out successfully', 'info');
  };

  const addAppointment = (aptData: Omit<Appointment, 'id' | 'createdAt'>): Appointment => {
    const newApt: Appointment = {
      ...aptData,
      id: `APT-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setAppointments((prev) => [newApt, ...prev]);

    // Also push a notification
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      title: 'Appointment Confirmed',
      message: `Appointment with ${newApt.doctorName} on ${newApt.date} at ${newApt.timeSlot} is confirmed.`,
      time: 'Just now',
      read: false,
      type: 'appointment',
      link: '/portal/patient/appointments'
    };
    setNotifications((prev) => [newNotif, ...prev]);

    showToast(`Appointment confirmed with ${newApt.doctorName}! ID: ${newApt.id}`, 'success');
    return newApt;
  };

  const updateAppointmentStatus = (id: string, status: Appointment['status']) => {
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === id ? { ...apt, status } : apt))
    );
    showToast(`Appointment ${id} status updated to ${status}`, 'info');
  };

  const rescheduleAppointment = (id: string, date: string, timeSlot: string) => {
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === id ? { ...apt, date, timeSlot, status: 'Confirmed' } : apt))
    );
    showToast(`Appointment ${id} rescheduled to ${date} at ${timeSlot}`, 'success');
  };

  const addMedicalRecord = (recData: Omit<MedicalRecord, 'id'>) => {
    const newRec: MedicalRecord = {
      ...recData,
      id: `REC-${Date.now().toString().slice(-4)}`
    };
    setMedicalRecords((prev) => [newRec, ...prev]);
    showToast('Consultation notes & clinical record saved', 'success');
  };

  const addPrescription = (rxData: Omit<Prescription, 'id'>) => {
    const newRx: Prescription = {
      ...rxData,
      id: `RX-${Math.floor(1000 + Math.random() * 9000)}`
    };
    setPrescriptions((prev) => [newRx, ...prev]);
    showToast(`Prescription ${newRx.id} successfully issued to ${newRx.patientName}`, 'success');
  };

  const payBill = (invoiceId: string) => {
    setBills((prev) =>
      prev.map((b) =>
        b.id === invoiceId
          ? { ...b, paidAmount: b.amount, status: 'Paid' as const }
          : b
      )
    );
    showToast(`Payment of invoice #${invoiceId} completed successfully!`, 'success');
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  return (
    <AppContext.Provider
      value={{
        user,
        login,
        logout,
        appointments,
        addAppointment,
        updateAppointmentStatus,
        rescheduleAppointment,
        medicalRecords,
        addMedicalRecord,
        prescriptions,
        addPrescription,
        labReports,
        bills,
        payBill,
        notifications,
        markNotificationRead,
        unreadNotificationsCount,
        toasts,
        showToast,
        searchModalOpen,
        setSearchModalOpen,
        aiModalOpen,
        setAiModalOpen,
        authModalOpen,
        setAuthModalOpen,
        authModalInitialRole,
        setAuthModalInitialRole,
        bookingPrefill,
        setBookingPrefill
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
