import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Activity,
  Calendar,
  Search,
  Bell,
  User,
  LogOut,
  ChevronDown,
  Menu,
  X,
  PhoneCall,
  LayoutDashboard,
  FileText,
  Shield,
  Stethoscope
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import './Navbar.css';

export default function Navbar() {
  const {
    user,
    logout,
    login,
    unreadNotificationsCount,
    setSearchModalOpen,
    setAuthModalOpen,
    notifications,
    markNotificationRead
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Clinical AI (ShadowFlow)', path: '/intelligence', badge: 'AI' },
    { label: 'Doctors', path: '/doctors' },
    { label: 'Departments', path: '/departments' },
    { label: 'Services', path: '/services' },
    { label: 'Health Packages', path: '/packages' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' }
  ];

  const handlePortalRedirect = () => {
    setUserDropdownOpen(false);
    if (!user) {
      setAuthModalOpen(true);
      return;
    }
    if (user.role === 'admin') navigate('/portal/admin');
    else if (user.role === 'doctor') navigate('/portal/doctor');
    else navigate('/portal/patient');
  };

  return (
    <>
      {/* Enterprise Interactive Demo Role Bar for instant testing */}
      <div className="demo-role-banner">
        <div className="container flex items-center justify-between">
          <div className="flex items-center gap-sm">
            <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.85 }}>
              Enterprise Evaluation Mode:
            </span>
            <div className="flex items-center gap-xs">
              <button
                className={`demo-role-pill ${user?.role === 'patient' ? 'active' : ''}`}
                onClick={() => login('patient')}
                title="Switch to Sarah Jenkins (Patient)"
              >
                👤 Patient View
              </button>
              <button
                className={`demo-role-pill ${user?.role === 'doctor' ? 'active' : ''}`}
                onClick={() => login('doctor')}
                title="Switch to Dr. Marcus Vance (Chief Cardiologist)"
              >
                🩺 Doctor View
              </button>
              <button
                className={`demo-role-pill ${user?.role === 'admin' ? 'active' : ''}`}
                onClick={() => login('admin')}
                title="Switch to Hospital Operations Director"
              >
                ⚡ Admin View
              </button>
              <Link
                to="/intelligence"
                className="demo-role-pill"
                style={{ backgroundColor: 'rgba(20, 184, 166, 0.25)', color: '#2DD4BF', borderColor: 'rgba(20, 184, 166, 0.5)', display: 'inline-flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}
                title="Open ShadowFlow AI Clinical Intelligence & Process Mining Suite"
              >
                🔮 ShadowFlow AI Engine
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-md">
            <span style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <PhoneCall size={13} /> 24/7 Hotline: <strong>1-800-MEDICARE</strong>
            </span>
          </div>
        </div>
      </div>

      <header className="navbar">
        <div className="container navbar-container">
          {/* Brand Logo */}
          <Link to="/" className="brand-logo">
            <div className="brand-icon">
              <Activity size={24} />
            </div>
            <div className="brand-text">
              <div className="brand-title">
                ShadowFlow <span>MediCare</span>
              </div>
              <div className="brand-subtitle">Nexus Enterprise Health</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="nav-links">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                style={item.badge ? { display: 'flex', alignItems: 'center', gap: '6px' } : undefined}
              >
                <span>{item.label}</span>
                {item.badge && (
                  <span style={{ fontSize: '10px', padding: '1px 6px', borderRadius: '999px', backgroundColor: 'var(--secondary)', color: 'white', fontWeight: 800 }}>
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}
          </nav>

          {/* Right Action Items */}
          <div className="navbar-actions">
            {/* Global Search Button */}
            <button
              className="icon-btn"
              onClick={() => setSearchModalOpen(true)}
              title="Global Healthcare Search"
              aria-label="Search doctors, departments, and services"
            >
              <Search size={18} />
            </button>

            {/* Notifications Trigger */}
            <div style={{ position: 'relative' }}>
              <button
                className="icon-btn"
                onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                title="Notifications"
                aria-label="Notifications"
              >
                <Bell size={18} />
                {unreadNotificationsCount > 0 && (
                  <span className="icon-badge">{unreadNotificationsCount}</span>
                )}
              </button>

              {notifDropdownOpen && (
                <div className="dropdown-menu" style={{ width: '320px', right: 0 }}>
                  <div className="dropdown-header flex justify-between items-center">
                    <span className="dropdown-user-name">Notifications</span>
                    <span className="badge badge-blue">{unreadNotificationsCount} New</span>
                  </div>
                  <div style={{ maxHeight: '280px', overflowY: 'auto' }}>
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => {
                          markNotificationRead(n.id);
                          if (n.link) navigate(n.link);
                          setNotifDropdownOpen(false);
                        }}
                        style={{
                          padding: '12px 16px',
                          borderBottom: '1px solid var(--border-light)',
                          backgroundColor: n.read ? 'transparent' : 'var(--primary-50)',
                          cursor: 'pointer'
                        }}
                      >
                        <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                          {n.title}
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                          {n.message}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                          {n.time}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Emergency Care Quick Button */}
            <Link to="/emergency" className="btn-emergency-nav" title="24/7 Immediate Emergency Care">
              <span className="pulse-dot"></span>
              Emergency
            </Link>

            {/* Book Appointment CTA */}
            <Link to="/book-appointment" className="btn btn-primary" style={{ padding: '8px 16px' }}>
              <Calendar size={16} />
              Book Appointment
            </Link>

            {/* User Session / Portal Switch */}
            {user ? (
              <div className="user-nav-dropdown">
                <button
                  className="user-profile-trigger"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                >
                  <img
                    src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=128&q=80'}
                    alt={user.name}
                    className="user-avatar-sm"
                  />
                  <span className="user-name-label">{user.name}</span>
                  <ChevronDown size={14} color="var(--text-secondary)" />
                </button>

                {userDropdownOpen && (
                  <div className="dropdown-menu">
                    <div className="dropdown-header">
                      <div className="dropdown-user-role">{user.role} Portal</div>
                      <div className="dropdown-user-name">{user.name}</div>
                    </div>

                    <div className="dropdown-item" onClick={handlePortalRedirect}>
                      <LayoutDashboard size={16} />
                      Go to Dashboard
                    </div>

                    {user.role === 'patient' && (
                      <>
                        <Link
                          to="/portal/patient/appointments"
                          className="dropdown-item"
                          onClick={() => setUserDropdownOpen(false)}
                        >
                          <Calendar size={16} />
                          My Appointments
                        </Link>
                        <Link
                          to="/portal/patient/records"
                          className="dropdown-item"
                          onClick={() => setUserDropdownOpen(false)}
                        >
                          <FileText size={16} />
                          Medical Records
                        </Link>
                      </>
                    )}

                    {user.role === 'doctor' && (
                      <Link
                        to="/portal/doctor"
                        className="dropdown-item"
                        onClick={() => setUserDropdownOpen(false)}
                      >
                        <Stethoscope size={16} />
                        Doctor Workspace
                      </Link>
                    )}

                    {user.role === 'admin' && (
                      <Link
                        to="/portal/admin"
                        className="dropdown-item"
                        onClick={() => setUserDropdownOpen(false)}
                      >
                        <Shield size={16} />
                        Admin Console
                      </Link>
                    )}

                    <div className="dropdown-divider"></div>

                    <div
                      className="dropdown-item"
                      style={{ color: 'var(--danger)' }}
                      onClick={() => {
                        logout();
                        setUserDropdownOpen(false);
                      }}
                    >
                      <LogOut size={16} />
                      Sign Out
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                className="btn btn-secondary"
                style={{ padding: '8px 16px' }}
                onClick={() => setAuthModalOpen(true)}
              >
                <User size={16} />
                Portal Login
              </button>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              className="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div
            style={{
              backgroundColor: 'var(--surface)',
              borderBottom: '1px solid var(--border)',
              padding: '16px 24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}
          >
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  fontSize: '15px',
                  fontWeight: 600,
                  color: location.pathname === item.path ? 'var(--primary)' : 'var(--text-primary)',
                  padding: '8px 0'
                }}
              >
                {item.label}
              </Link>
            ))}
            <div style={{ height: '1px', backgroundColor: 'var(--border)' }}></div>
            <Link
              to="/emergency"
              onClick={() => setMobileMenuOpen(false)}
              className="btn btn-danger"
              style={{ justifyContent: 'center' }}
            >
              Emergency Care (24/7)
            </Link>
            <Link
              to="/book-appointment"
              onClick={() => setMobileMenuOpen(false)}
              className="btn btn-primary"
              style={{ justifyContent: 'center' }}
            >
              Book an Appointment
            </Link>
            {user ? (
              <button
                onClick={handlePortalRedirect}
                className="btn btn-secondary"
                style={{ justifyContent: 'center' }}
              >
                Go to {user.role.toUpperCase()} Dashboard
              </button>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setAuthModalOpen(true);
                }}
                className="btn btn-secondary"
                style={{ justifyContent: 'center' }}
              >
                Sign In to Portal
              </button>
            )}
          </div>
        )}
      </header>
    </>
  );
}
