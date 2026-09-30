import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AppProvider } from './context/AppContext';

// Public Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import GlobalSearchModal from './components/GlobalSearchModal';
import AIAssistantWidget from './components/AIAssistantWidget';
import AuthModal from './components/AuthModal';
import ToastContainer from './components/ToastContainer';

// Public Pages
import Home from './pages/Home';
import DoctorsPage from './pages/DoctorsPage';
import DoctorProfilePage from './pages/DoctorProfilePage';
import DepartmentsPage from './pages/DepartmentsPage';
import DepartmentDetailPage from './pages/DepartmentDetailPage';
import ServicesPage from './pages/ServicesPage';
import AppointmentBookingPage from './pages/AppointmentBookingPage';
import EmergencyPage from './pages/EmergencyPage';
import HealthPackagesPage from './pages/HealthPackagesPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import FAQPage from './pages/FAQPage';
import BlogPage from './pages/BlogPage';

// Patient Portal Pages
import PatientDashboard from './pages/portal/PatientDashboard';
import PatientAppointments from './pages/portal/PatientAppointments';
import PatientRecords from './pages/portal/PatientRecords';
import PatientPrescriptions from './pages/portal/PatientPrescriptions';
import PatientLabReports from './pages/portal/PatientLabReports';
import PatientBilling from './pages/portal/PatientBilling';
import PatientProfile from './pages/portal/PatientProfile';

// Doctor Portal Pages
import DoctorDashboard from './pages/portal/DoctorDashboard';
import DoctorAppointments from './pages/portal/DoctorAppointments';
import DoctorPatients from './pages/portal/DoctorPatients';
import DoctorPatientDetail from './pages/portal/DoctorPatientDetail';
import DoctorSchedule from './pages/portal/DoctorSchedule';

// Admin Portal Pages
import AdminDashboard from './pages/portal/AdminDashboard';
import AdminDoctors from './pages/portal/AdminDoctors';
import AdminPatients from './pages/portal/AdminPatients';
import AdminAppointments from './pages/portal/AdminAppointments';
import AdminDepartments from './pages/portal/AdminDepartments';
import AdminBilling from './pages/portal/AdminBilling';
import AdminAnalytics from './pages/portal/AdminAnalytics';
import AdminSettings from './pages/portal/AdminSettings';
import AdminIntelligence from './pages/portal/AdminIntelligence';

// Clinical Intelligence Suite (ShadowFlow AI)
import ClinicalIntelligenceSuite from './pages/clinical-intelligence/ClinicalIntelligenceSuite';

import './index.css';

function MainApp() {
  const location = useLocation();
  const isPortalOrIntelligenceRoute = location.pathname.startsWith('/portal') || location.pathname.startsWith('/intelligence');

  return (
    <div className="app-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Public Navbar (Hidden on Portal & Intelligence views for clean full-screen command center UX) */}
      {!isPortalOrIntelligenceRoute && <Navbar />}

      <main style={{ flex: 1 }}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/doctors" element={<DoctorsPage />} />
          <Route path="/doctor/:id" element={<DoctorProfilePage />} />
          <Route path="/departments" element={<DepartmentsPage />} />
          <Route path="/department/:id" element={<DepartmentDetailPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/book-appointment" element={<AppointmentBookingPage />} />
          <Route path="/emergency" element={<EmergencyPage />} />
          <Route path="/packages" element={<HealthPackagesPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/blog" element={<BlogPage />} />

          {/* Standalone ShadowFlow AI Clinical Intelligence Suite */}
          <Route path="/intelligence" element={<ClinicalIntelligenceSuite />} />
          <Route path="/intelligence/:subview" element={<ClinicalIntelligenceSuite />} />

          {/* Patient Portal Routes */}
          <Route path="/portal/patient" element={<PatientDashboard />} />
          <Route path="/portal/patient/appointments" element={<PatientAppointments />} />
          <Route path="/portal/patient/records" element={<PatientRecords />} />
          <Route path="/portal/patient/prescriptions" element={<PatientPrescriptions />} />
          <Route path="/portal/patient/lab-reports" element={<PatientLabReports />} />
          <Route path="/portal/patient/billing" element={<PatientBilling />} />
          <Route path="/portal/patient/profile" element={<PatientProfile />} />

          {/* Doctor Portal Routes */}
          <Route path="/portal/doctor" element={<DoctorDashboard />} />
          <Route path="/portal/doctor/appointments" element={<DoctorAppointments />} />
          <Route path="/portal/doctor/patients" element={<DoctorPatients />} />
          <Route path="/portal/doctor/patient/:id" element={<DoctorPatientDetail />} />
          <Route path="/portal/doctor/schedule" element={<DoctorSchedule />} />

          {/* Hospital Admin Portal Routes */}
          <Route path="/portal/admin" element={<AdminDashboard />} />
          <Route path="/portal/admin/intelligence" element={<AdminIntelligence />} />
          <Route path="/portal/admin/intelligence/:subview" element={<AdminIntelligence />} />
          <Route path="/portal/admin/doctors" element={<AdminDoctors />} />
          <Route path="/portal/admin/patients" element={<AdminPatients />} />
          <Route path="/portal/admin/appointments" element={<AdminAppointments />} />
          <Route path="/portal/admin/departments" element={<AdminDepartments />} />
          <Route path="/portal/admin/billing" element={<AdminBilling />} />
          <Route path="/portal/admin/analytics" element={<AdminAnalytics />} />
          <Route path="/portal/admin/settings" element={<AdminSettings />} />

          {/* 404 Fallback */}
          <Route
            path="*"
            element={
              <div className="container" style={{ padding: '120px 24px', textAlign: 'center' }}>
                <h1 style={{ fontSize: '64px', color: 'var(--primary)', marginBottom: '8px' }}>404</h1>
                <h2 style={{ fontSize: '24px', marginBottom: '16px' }}>Page Not Found</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
                  The requested healthcare portal or public directory route does not exist.
                </p>
                <a href="/" className="btn btn-primary">
                  Return to Homepage
                </a>
              </div>
            }
          />
        </Routes>
      </main>

      {/* Public Footer */}
      {!isPortalOrIntelligenceRoute && <Footer />}

      {/* Global Interactive Overlays */}
      <GlobalSearchModal />
      <AIAssistantWidget />
      <AuthModal />
      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Router>
        <MainApp />
      </Router>
    </AppProvider>
  );
}
