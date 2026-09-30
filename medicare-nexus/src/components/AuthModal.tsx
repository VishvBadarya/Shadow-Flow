import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X,
  User,
  Stethoscope,
  Shield,
  KeyRound,
  Mail,
  Lock,
  ArrowRight,
  CheckCircle2,
  Phone
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function AuthModal() {
  const {
    authModalOpen,
    setAuthModalOpen,
    authModalInitialRole,
    login,
    showToast
  } = useApp();

  const [activeTab, setActiveTab] = useState<'login' | 'signup' | 'forgot' | 'otp'>('login');
  const [role, setRole] = useState<'patient' | 'doctor' | 'admin'>(authModalInitialRole || 'patient');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [otpCode, setOtpCode] = useState(['4', '8', '2', '1', '9', '0']);

  const navigate = useNavigate();

  useEffect(() => {
    if (authModalInitialRole) {
      setRole(authModalInitialRole);
    }
  }, [authModalInitialRole]);

  if (!authModalOpen) return null;

  const handleRoleSelect = (r: 'patient' | 'doctor' | 'admin') => {
    setRole(r);
    if (r === 'patient') {
      setEmail('patient@shadowflow.health');
      setPassword('patient123');
    } else if (r === 'doctor') {
      setEmail('doctor@shadowflow.health');
      setPassword('doctor123');
    } else {
      setEmail('admin@shadowflow.health');
      setPassword('admin123');
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(role);
    setAuthModalOpen(false);
    if (role === 'admin') navigate('/portal/admin');
    else if (role === 'doctor') navigate('/portal/doctor');
    else navigate('/portal/patient');
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveTab('otp');
    showToast('6-digit verification code sent to your registered phone & email', 'info');
  };

  const handleOtpVerify = (e: React.FormEvent) => {
    e.preventDefault();
    login('patient');
    setAuthModalOpen(false);
    showToast('Account successfully verified & activated!', 'success');
    navigate('/portal/patient');
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showToast(`Password reset link transmitted to ${email || 'your email'}`, 'success');
    setActiveTab('login');
  };

  return (
    <div className="modal-overlay" onClick={() => setAuthModalOpen(false)}>
      <div
        className="modal-content"
        style={{ maxWidth: '520px', padding: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '24px 28px 16px',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'linear-gradient(to right, #F8FAFC, #FFFFFF)'
          }}
        >
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)' }}>
              {activeTab === 'login' && 'Sign In to Healthcare Portal'}
              {activeTab === 'signup' && 'Create Patient Account'}
              {activeTab === 'forgot' && 'Reset Account Password'}
              {activeTab === 'otp' && 'Two-Factor OTP Verification'}
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Secure enterprise healthcare authentication
            </p>
          </div>
          <button
            onClick={() => setAuthModalOpen(false)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Role Selector Tabs (Only on login) */}
        {activeTab === 'login' && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              padding: '16px 28px 8px',
              gap: '10px'
            }}
          >
            <button
              type="button"
              onClick={() => handleRoleSelect('patient')}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '6px',
                padding: '12px 8px',
                borderRadius: 'var(--radius-md)',
                border: role === 'patient' ? '2px solid var(--primary)' : '1px solid var(--border)',
                backgroundColor: role === 'patient' ? 'var(--primary-light)' : 'var(--surface)',
                color: role === 'patient' ? 'var(--primary-dark)' : 'var(--text-secondary)',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '13px'
              }}
            >
              <User size={20} color={role === 'patient' ? 'var(--primary)' : 'var(--text-secondary)'} />
              Patient
            </button>

            <button
              type="button"
              onClick={() => handleRoleSelect('doctor')}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '6px',
                padding: '12px 8px',
                borderRadius: 'var(--radius-md)',
                border: role === 'doctor' ? '2px solid var(--secondary)' : '1px solid var(--border)',
                backgroundColor: role === 'doctor' ? 'var(--secondary-light)' : 'var(--surface)',
                color: role === 'doctor' ? 'var(--secondary-dark)' : 'var(--text-secondary)',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '13px'
              }}
            >
              <Stethoscope size={20} color={role === 'doctor' ? 'var(--secondary)' : 'var(--text-secondary)'} />
              Doctor
            </button>

            <button
              type="button"
              onClick={() => handleRoleSelect('admin')}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '6px',
                padding: '12px 8px',
                borderRadius: 'var(--radius-md)',
                border: role === 'admin' ? '2px solid #073864' : '1px solid var(--border)',
                backgroundColor: role === 'admin' ? '#E2E8F0' : 'var(--surface)',
                color: role === 'admin' ? '#0F172A' : 'var(--text-secondary)',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '13px'
              }}
            >
              <Shield size={20} color={role === 'admin' ? '#0F172A' : 'var(--text-secondary)'} />
              Hospital Admin
            </button>
          </div>
        )}

        {/* Modal Form Body */}
        <div style={{ padding: '20px 28px 28px' }}>
          {/* TAB 1: LOGIN */}
          {activeTab === 'login' && (
            <form onSubmit={handleLoginSubmit}>
              <div
                style={{
                  padding: '10px 14px',
                  backgroundColor: 'var(--primary-50)',
                  border: '1px solid var(--primary-light)',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '16px',
                  fontSize: '12px',
                  color: 'var(--primary-dark)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <span>
                  Demo preset: <strong>{role.toUpperCase()}</strong> credentials loaded
                </span>
                <span className="badge badge-blue">Ready</span>
              </div>

              <div className="form-group">
                <label className="form-label">Email or Healthcare ID</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="email"
                    required
                    value={email || (role === 'patient' ? 'patient@shadowflow.health' : role === 'doctor' ? 'doctor@shadowflow.health' : 'admin@shadowflow.health')}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-input"
                    placeholder="Enter email"
                  />
                  <Mail size={16} style={{ position: 'absolute', right: '14px', top: '12px', color: 'var(--text-muted)' }} />
                </div>
              </div>

              <div className="form-group">
                <div className="flex justify-between items-center">
                  <label className="form-label">Password</label>
                  <button
                    type="button"
                    onClick={() => setActiveTab('forgot')}
                    style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '12px', cursor: 'pointer', fontWeight: 500 }}
                  >
                    Forgot password?
                  </button>
                </div>
                <div style={{ position: 'relative' }}>
                  <input
                    type="password"
                    required
                    value={password || '••••••••'}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-input"
                    placeholder="Enter password"
                  />
                  <Lock size={16} style={{ position: 'absolute', right: '14px', top: '12px', color: 'var(--text-muted)' }} />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-lg"
                style={{ width: '100%', marginTop: '8px' }}
              >
                Sign In as {role.charAt(0).toUpperCase() + role.slice(1)} →
              </button>

              <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                Don’t have a patient account?{' '}
                <button
                  type="button"
                  onClick={() => setActiveTab('signup')}
                  style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 600, cursor: 'pointer' }}
                >
                  Register Now
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: SIGN UP */}
          {activeTab === 'signup' && (
            <form onSubmit={handleSignupSubmit}>
              <div className="form-group">
                <label className="form-label">Full Legal Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sarah Jenkins"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="grid grid-cols-2" style={{ gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="patient@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Mobile Phone</label>
                  <input
                    type="tel"
                    required
                    placeholder="+1 (555) 000-0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Create Password</label>
                <input
                  type="password"
                  required
                  placeholder="Minimum 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input"
                />
              </div>

              <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: '8px' }}>
                Continue to Phone & Email Verification →
              </button>

              <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => setActiveTab('login')}
                  style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 600, cursor: 'pointer' }}
                >
                  Sign In
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: OTP VERIFICATION */}
          {activeTab === 'otp' && (
            <form onSubmit={handleOtpVerify}>
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <div
                  style={{
                    width: '54px',
                    height: '54px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--secondary-light)',
                    color: 'var(--secondary-dark)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 12px'
                  }}
                >
                  <Phone size={24} />
                </div>
                <h4 style={{ fontSize: '16px' }}>Enter 6-Digit Security Code</h4>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  We sent a code to your mobile device for HIPAA compliance verification.
                </p>
              </div>

              <div className="flex justify-center gap-sm" style={{ marginBottom: '24px' }}>
                {otpCode.map((digit, idx) => (
                  <input
                    key={idx}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => {
                      const newOtp = [...otpCode];
                      newOtp[idx] = e.target.value;
                      setOtpCode(newOtp);
                    }}
                    style={{
                      width: '45px',
                      height: '50px',
                      textAlign: 'center',
                      fontSize: '20px',
                      fontWeight: 700,
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border)',
                      outline: 'none'
                    }}
                  />
                ))}
              </div>

              <button type="submit" className="btn btn-teal btn-lg" style={{ width: '100%' }}>
                Verify & Open Patient Portal →
              </button>

              <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                Didn't receive code?{' '}
                <button
                  type="button"
                  onClick={() => showToast('New code re-sent to your device', 'info')}
                  style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 600, cursor: 'pointer' }}
                >
                  Resend SMS
                </button>
              </div>
            </form>
          )}

          {/* TAB 4: FORGOT PASSWORD */}
          {activeTab === 'forgot' && (
            <form onSubmit={handleForgotSubmit}>
              <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                Enter your registered healthcare email address and we will dispatch a secure password restoration link.
              </p>
              <div className="form-group">
                <label className="form-label">Registered Email</label>
                <input
                  type="email"
                  required
                  placeholder="patient@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input"
                />
              </div>

              <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: '8px' }}>
                Send Reset Link
              </button>

              <div style={{ textAlign: 'center', marginTop: '16px' }}>
                <button
                  type="button"
                  onClick={() => setActiveTab('login')}
                  style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '13px', cursor: 'pointer' }}
                >
                  ← Back to Sign In
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
