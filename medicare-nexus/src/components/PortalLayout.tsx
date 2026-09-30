import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Calendar,
  User,
  FileText,
  Pill,
  Activity,
  CreditCard,
  Settings,
  Bell,
  Search,
  LogOut,
  Stethoscope,
  Shield,
  Users,
  Building,
  BarChart3,
  Clock,
  Home,
  MessageSquare
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface PortalLayoutProps {
  children: React.ReactNode;
  role: 'patient' | 'doctor' | 'admin';
  title: string;
  subtitle?: string;
}

export default function PortalLayout({ children, role, title, subtitle }: PortalLayoutProps) {
  const {
    user,
    logout,
    login,
    unreadNotificationsCount,
    setSearchModalOpen
  } = useApp();

  const location = useLocation();
  const navigate = useNavigate();

  // Navigation Items per role
  const patientNav = [
    { label: 'Dashboard', path: '/portal/patient', icon: <LayoutDashboard size={18} /> },
    { label: 'My Appointments', path: '/portal/patient/appointments', icon: <Calendar size={18} /> },
    { label: 'Medical Records', path: '/portal/patient/records', icon: <FileText size={18} /> },
    { label: 'Prescriptions', path: '/portal/patient/prescriptions', icon: <Pill size={18} /> },
    { label: 'Lab Reports', path: '/portal/patient/lab-reports', icon: <Activity size={18} /> },
    { label: 'Bills & Payments', path: '/portal/patient/billing', icon: <CreditCard size={18} /> },
    { label: 'Profile & Settings', path: '/portal/patient/profile', icon: <User size={18} /> }
  ];

  const doctorNav = [
    { label: 'Doctor Dashboard', path: '/portal/doctor', icon: <LayoutDashboard size={18} /> },
    { label: 'Appointments Queue', path: '/portal/doctor/appointments', icon: <Calendar size={18} /> },
    { label: 'My Patients', path: '/portal/doctor/patients', icon: <Users size={18} /> },
    { label: 'Availability Schedule', path: '/portal/doctor/schedule', icon: <Clock size={18} /> }
  ];

  const adminNav = [
    { label: 'Admin Overview', path: '/portal/admin', icon: <LayoutDashboard size={18} /> },
    { label: 'ShadowFlow AI (Process Mining)', path: '/portal/admin/intelligence', icon: <Activity size={18} /> },
    { label: 'Doctor Management', path: '/portal/admin/doctors', icon: <Stethoscope size={18} /> },
    { label: 'Patient Management', path: '/portal/admin/patients', icon: <Users size={18} /> },
    { label: 'Appointments Admin', path: '/portal/admin/appointments', icon: <Calendar size={18} /> },
    { label: 'Departments', path: '/portal/admin/departments', icon: <Building size={18} /> },
    { label: 'Billing Operations', path: '/portal/admin/billing', icon: <CreditCard size={18} /> },
    { label: 'Reports & Analytics', path: '/portal/admin/analytics', icon: <BarChart3 size={18} /> },
    { label: 'Hospital Settings', path: '/portal/admin/settings', icon: <Settings size={18} /> }
  ];

  const currentNav = role === 'admin' ? adminNav : role === 'doctor' ? doctorNav : patientNav;

  return (
    <div className="portal-layout">
      {/* Sidebar */}
      <aside className="portal-sidebar">
        {/* Brand Header */}
        <div
          style={{
            padding: '20px 20px',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}
        >
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              backgroundColor: 'var(--primary)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {role === 'admin' ? <Shield size={20} /> : role === 'doctor' ? <Stethoscope size={20} /> : <Activity size={20} />}
          </div>
          <div>
            <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-primary)' }}>
              MediCare <span style={{ color: 'var(--primary)' }}>Nexus</span>
            </div>
            <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--secondary-dark)' }}>
              {role.toUpperCase()} PORTAL
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="portal-sidebar-nav">
          <Link
            to="/"
            className="portal-nav-item"
            style={{ marginBottom: '8px', color: 'var(--primary)' }}
          >
            <Home size={18} />
            <span>Public Website</span>
          </Link>

          <div style={{ height: '1px', backgroundColor: 'var(--border-light)', margin: '4px 0 10px' }}></div>

          {currentNav.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`portal-nav-item ${location.pathname === item.path ? 'active' : ''}`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* User Card at Bottom */}
        <div
          style={{
            padding: '16px',
            borderTop: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'var(--surface-alt)'
          }}
        >
          <div className="flex items-center gap-sm">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=128&q=80'}
              alt="User"
              style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
            />
            <div style={{ maxWidth: '120px' }}>
              <div style={{ fontSize: '13px', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user?.name || 'Active User'}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'capitalize' }}>
                {role}
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              logout();
              navigate('/');
            }}
            title="Sign Out"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--danger)',
              padding: '6px'
            }}
          >
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      {/* Main Portal View */}
      <div className="portal-main">
        {/* Top bar */}
        <header className="portal-topbar">
          <div>
            <h1 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)' }}>
              {title}
            </h1>
            {subtitle && (
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                {subtitle}
              </p>
            )}
          </div>

          <div className="flex items-center gap-md">
            {/* Quick Role Switcher Bar */}
            <div className="flex items-center gap-xs" style={{ backgroundColor: 'var(--surface-alt)', padding: '3px 6px', borderRadius: 'var(--radius-full)' }}>
              <button
                onClick={() => { login('patient'); navigate('/portal/patient'); }}
                className={`btn btn-sm ${role === 'patient' ? 'btn-primary' : 'btn-ghost'}`}
                style={{ padding: '4px 10px', fontSize: '11.5px', borderRadius: 'var(--radius-full)' }}
              >
                Patient
              </button>
              <button
                onClick={() => { login('doctor'); navigate('/portal/doctor'); }}
                className={`btn btn-sm ${role === 'doctor' ? 'btn-teal' : 'btn-ghost'}`}
                style={{ padding: '4px 10px', fontSize: '11.5px', borderRadius: 'var(--radius-full)' }}
              >
                Doctor
              </button>
              <button
                onClick={() => { login('admin'); navigate('/portal/admin'); }}
                className={`btn btn-sm ${role === 'admin' ? 'btn-primary' : 'btn-ghost'}`}
                style={{ padding: '4px 10px', fontSize: '11.5px', borderRadius: 'var(--radius-full)', backgroundColor: role === 'admin' ? '#0F172A' : 'transparent' }}
              >
                Admin
              </button>
            </div>

            {/* Global Search Button */}
            <button
              onClick={() => setSearchModalOpen(true)}
              className="icon-btn"
              title="Search"
            >
              <Search size={16} />
            </button>

            {/* Notification Bell */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => navigate('/portal/patient/appointments')}
                className="icon-btn"
                title="Notifications"
              >
                <Bell size={16} />
                {unreadNotificationsCount > 0 && (
                  <span className="icon-badge">{unreadNotificationsCount}</span>
                )}
              </button>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <div className="portal-content">
          {children}
        </div>
      </div>
    </div>
  );
}
