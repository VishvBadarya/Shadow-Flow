import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  User,
  CheckCircle2,
  Download,
  CalendarPlus,
  ArrowRight,
  ArrowLeft,
  HeartPulse,
  MapPin,
  FileCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DOCTORS, DEPARTMENTS } from '../data/mockData';
import type { Appointment } from '../types';

export default function AppointmentBookingPage() {
  const { user, addAppointment, bookingPrefill, setBookingPrefill, showToast } = useApp();
  const navigate = useNavigate();

  // Multi-step Wizard Step (1 to 6)
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form Selections
  const [selectedDeptId, setSelectedDeptId] = useState<string>(
    bookingPrefill?.departmentId || 'cardiology'
  );
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>(
    bookingPrefill?.doctorId || 'doc-1'
  );
  const [selectedDate, setSelectedDate] = useState<string>('2026-10-02');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('11:00 AM');
  const [consultationType, setConsultationType] = useState<'In-Person' | 'Video Consultation'>('In-Person');

  // Step 5 Patient Details
  const [patientName, setPatientName] = useState(user?.name || 'Sarah Jenkins');
  const [patientPhone, setPatientPhone] = useState(user?.phone || '+1 (555) 234-5678');
  const [patientEmail, setPatientEmail] = useState(user?.email || 'sarah.jenkins@example.com');
  const [visitReason, setVisitReason] = useState('Routine preventive consultation & review');
  const [insuranceProvider, setInsuranceProvider] = useState('Blue Cross Blue Shield (Policy #BC-99214)');

  // Step 6 Confirmed Appointment Record
  const [confirmedApt, setConfirmedApt] = useState<Appointment | null>(null);

  // If prefilled with doctor, advance to step 2 or 3
  useEffect(() => {
    if (bookingPrefill?.doctorId) {
      const doc = DOCTORS.find((d) => d.id === bookingPrefill.doctorId);
      if (doc) {
        setSelectedDoctorId(doc.id);
        setSelectedDeptId(doc.hospitalDepartment.toLowerCase());
        setCurrentStep(2);
      }
    }
  }, [bookingPrefill]);

  const selectedDept = DEPARTMENTS.find((d) => d.id === selectedDeptId) || DEPARTMENTS[0];
  const selectedDoctor = DOCTORS.find((d) => d.id === selectedDoctorId) || DOCTORS[0];

  const availableDoctorsInDept = DOCTORS.filter(
    (d) => d.hospitalDepartment.toLowerCase() === selectedDept.name.toLowerCase()
  );

  const doctorsList = availableDoctorsInDept.length > 0 ? availableDoctorsInDept : DOCTORS;

  const datesList = [
    { label: 'Today (Oct 01)', val: '2026-10-01' },
    { label: 'Tomorrow (Oct 02)', val: '2026-10-02' },
    { label: 'Friday (Oct 03)', val: '2026-10-03' },
    { label: 'Monday (Oct 06)', val: '2026-10-06' }
  ];

  const slotsList = ['09:30 AM', '11:00 AM', '02:00 PM', '03:30 PM', '04:45 PM', '05:30 PM'];

  const handleNextStep = () => {
    if (currentStep < 5) {
      setCurrentStep((prev) => prev + 1);
    } else if (currentStep === 5) {
      // Execute Booking & Step 6
      const created = addAppointment({
        patientId: user?.id || 'p-101',
        patientName,
        patientPhone,
        patientEmail,
        doctorId: selectedDoctor.id,
        doctorName: selectedDoctor.name,
        doctorSpecialty: selectedDoctor.specialty,
        department: selectedDept.name,
        date: selectedDate,
        timeSlot: selectedTimeSlot,
        status: 'Confirmed',
        reason: visitReason,
        consultationType,
        hospitalLocation: `${selectedDept.name} Institute, West Tower - Suite 408`
      });
      setConfirmedApt(created);
      setCurrentStep(6);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const downloadCalendarFile = () => {
    if (!confirmedApt) return;
    const icsContent = `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nSUMMARY:Medical Consultation with ${confirmedApt.doctorName}\nDESCRIPTION:${confirmedApt.reason}\nLOCATION:${confirmedApt.hospitalLocation}\nDTSTART:20261002T110000Z\nDTEND:20261002T114500Z\nEND:VEVENT\nEND:VCALENDAR`;
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Appointment_${confirmedApt.id}.ics`;
    link.click();
    showToast('Calendar (.ics) file downloaded', 'success');
  };

  const downloadConfirmationSlip = () => {
    if (!confirmedApt) return;
    const slip = `===========================================================\nSHADOWFLOW MEDICARE NEXUS — APPOINTMENT CONFIRMATION\n===========================================================\nAppointment ID: ${confirmedApt.id}\nPatient Name: ${confirmedApt.patientName}\nDoctor: ${confirmedApt.doctorName} (${confirmedApt.doctorSpecialty})\nDepartment: ${confirmedApt.department}\nDate & Time: ${confirmedApt.date} at ${confirmedApt.timeSlot}\nConsultation Mode: ${confirmedApt.consultationType}\nLocation: ${confirmedApt.hospitalLocation}\nStatus: ${confirmedApt.status}\n===========================================================\nPlease arrive 15 minutes before your scheduled appointment time.`;
    const blob = new Blob([slip], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Confirmation_${confirmedApt.id}.txt`;
    link.click();
    showToast('Appointment confirmation slip downloaded', 'success');
  };

  const stepsLabels = [
    'Department',
    'Doctor',
    'Date',
    'Time Slot',
    'Patient Info',
    'Confirmed'
  ];

  return (
    <div style={{ backgroundColor: 'var(--bg-color)', minHeight: '100vh', padding: '40px 0 80px' }}>
      <div className="container" style={{ maxWidth: '860px' }}>
        {/* Step Indicator */}
        <div style={{ marginBottom: '36px' }}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <span className="badge badge-blue">Enterprise Booking Gateway</span>
            <h1 style={{ fontSize: '32px', marginTop: '8px' }}>Schedule Your Medical Consultation</h1>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
              Follow our 6-step guided scheduling process with instant clinical confirmation
            </p>
          </div>

          {/* Progress Bar & Indicators */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              position: 'relative'
            }}
          >
            {stepsLabels.map((lbl, idx) => {
              const stepNum = idx + 1;
              const isPast = stepNum < currentStep;
              const isCurrent = stepNum === currentStep;

              return (
                <div
                  key={lbl}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '6px',
                    zIndex: 2,
                    cursor: isPast ? 'pointer' : 'default'
                  }}
                  onClick={() => {
                    if (isPast && currentStep < 6) setCurrentStep(stepNum);
                  }}
                >
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      backgroundColor: isCurrent ? 'var(--primary)' : isPast ? 'var(--success)' : 'var(--surface)',
                      color: isCurrent || isPast ? 'white' : 'var(--text-secondary)',
                      border: isCurrent || isPast ? 'none' : '2px solid var(--border)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '13px',
                      fontWeight: 700,
                      boxShadow: isCurrent ? 'var(--shadow-glow-primary)' : 'none',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {isPast ? <CheckCircle2 size={18} /> : stepNum}
                  </div>
                  <span
                    style={{
                      fontSize: '11.5px',
                      fontWeight: isCurrent ? 700 : 500,
                      color: isCurrent ? 'var(--primary)' : 'var(--text-secondary)'
                    }}
                  >
                    {lbl}
                  </span>
                </div>
              );
            })}

            {/* Connecting Bar */}
            <div
              style={{
                position: 'absolute',
                top: '18px',
                left: '20px',
                right: '20px',
                height: '2px',
                backgroundColor: 'var(--border)',
                zIndex: 1
              }}
            >
              <div
                style={{
                  height: '100%',
                  backgroundColor: 'var(--primary)',
                  width: `${((currentStep - 1) / 5) * 100}%`,
                  transition: 'width 0.3s ease'
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Wizard Main Card */}
        <div className="card" style={{ padding: '36px', boxShadow: 'var(--shadow-elevated)' }}>
          {/* STEP 1: SELECT DEPARTMENT */}
          {currentStep === 1 && (
            <div>
              <h2 style={{ fontSize: '20px', marginBottom: '8px' }}>Step 1: Select Clinical Department</h2>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '24px' }}>
                Choose the medical specialty related to your current symptoms or follow-up needs.
              </p>

              <div className="grid grid-cols-2" style={{ gap: '16px' }}>
                {DEPARTMENTS.map((dept) => (
                  <div
                    key={dept.id}
                    onClick={() => setSelectedDeptId(dept.id)}
                    style={{
                      padding: '16px 20px',
                      borderRadius: 'var(--radius-md)',
                      border: selectedDeptId === dept.id ? '2px solid var(--primary)' : '1px solid var(--border)',
                      backgroundColor: selectedDeptId === dept.id ? 'var(--primary-light)' : 'var(--surface)',
                      cursor: 'pointer',
                      transition: 'var(--transition)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px'
                    }}
                  >
                    <div
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: selectedDeptId === dept.id ? 'var(--primary)' : 'var(--surface-alt)',
                        color: selectedDeptId === dept.id ? 'white' : 'var(--primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}
                    >
                      <HeartPulse size={20} />
                    </div>
                    <div>
                      <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>
                        {dept.name}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                        {dept.doctorsCount} Specialists • Level-1 Center
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: SELECT DOCTOR */}
          {currentStep === 2 && (
            <div>
              <div className="flex justify-between items-center" style={{ marginBottom: '8px' }}>
                <h2 style={{ fontSize: '20px' }}>Step 2: Select Specialist Doctor</h2>
                <span className="badge badge-blue">Department: {selectedDept.name}</span>
              </div>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '24px' }}>
                Select an attending physician or senior director for your consultation.
              </p>

              <div className="flex flex-col gap-md">
                {doctorsList.map((doc) => (
                  <div
                    key={doc.id}
                    onClick={() => setSelectedDoctorId(doc.id)}
                    style={{
                      padding: '16px 20px',
                      borderRadius: 'var(--radius-md)',
                      border: selectedDoctorId === doc.id ? '2px solid var(--primary)' : '1px solid var(--border)',
                      backgroundColor: selectedDoctorId === doc.id ? 'var(--primary-light)' : 'var(--surface)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '16px',
                      transition: 'var(--transition)'
                    }}
                  >
                    <div className="flex items-center gap-md">
                      <img
                        src={doc.image}
                        alt={doc.name}
                        style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <div>
                        <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>
                          {doc.name}
                        </div>
                        <div style={{ fontSize: '13px', color: 'var(--primary)', fontWeight: 600 }}>
                          {doc.specialty} • {doc.experience} Years Exp.
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                          Next: {doc.nextAvailable}
                        </div>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--primary)' }}>
                        ${doc.consultationFee}
                      </div>
                      <span className="badge badge-green" style={{ fontSize: '11px' }}>
                        ★ {doc.rating}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: SELECT DATE */}
          {currentStep === 3 && (
            <div>
              <h2 style={{ fontSize: '20px', marginBottom: '8px' }}>Step 3: Choose Appointment Date</h2>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '24px' }}>
                Select an available clinical consultation day with {selectedDoctor.name}.
              </p>

              <div className="grid grid-cols-2" style={{ gap: '16px', marginBottom: '28px' }}>
                {datesList.map((d) => (
                  <div
                    key={d.val}
                    onClick={() => setSelectedDate(d.val)}
                    style={{
                      padding: '20px',
                      borderRadius: 'var(--radius-md)',
                      border: selectedDate === d.val ? '2px solid var(--primary)' : '1px solid var(--border)',
                      backgroundColor: selectedDate === d.val ? 'var(--primary-light)' : 'var(--surface)',
                      cursor: 'pointer',
                      textAlign: 'center',
                      transition: 'var(--transition)'
                    }}
                  >
                    <Calendar size={28} color={selectedDate === d.val ? 'var(--primary)' : 'var(--text-secondary)'} style={{ margin: '0 auto 10px' }} />
                    <div style={{ fontSize: '15px', fontWeight: 700 }}>{d.label}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                      4 Slots Available
                    </div>
                  </div>
                ))}
              </div>

              {/* Consultation Type Selector */}
              <div className="form-group">
                <label className="form-label">Consultation Mode</label>
                <div className="grid grid-cols-2" style={{ gap: '12px' }}>
                  <button
                    type="button"
                    onClick={() => setConsultationType('In-Person')}
                    className={`btn ${consultationType === 'In-Person' ? 'btn-primary' : 'btn-secondary'}`}
                  >
                    🏥 In-Person Hospital Visit
                  </button>
                  <button
                    type="button"
                    onClick={() => setConsultationType('Video Consultation')}
                    className={`btn ${consultationType === 'Video Consultation' ? 'btn-teal' : 'btn-secondary'}`}
                  >
                    💻 Telehealth Video Consultation
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: SELECT TIME SLOT */}
          {currentStep === 4 && (
            <div>
              <h2 style={{ fontSize: '20px', marginBottom: '8px' }}>Step 4: Select Convenient Time Slot</h2>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '24px' }}>
                Available consultation slots for {selectedDate} with {selectedDoctor.name}.
              </p>

              <div className="grid grid-cols-3" style={{ gap: '14px' }}>
                {slotsList.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedTimeSlot(slot)}
                    style={{
                      padding: '16px 12px',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '14px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      border: selectedTimeSlot === slot ? '2px solid var(--primary)' : '1px solid var(--border)',
                      backgroundColor: selectedTimeSlot === slot ? 'var(--primary)' : 'var(--surface)',
                      color: selectedTimeSlot === slot ? 'white' : 'var(--text-primary)',
                      boxShadow: selectedTimeSlot === slot ? 'var(--shadow-glow-primary)' : 'var(--shadow-xs)',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                  >
                    <Clock size={16} />
                    {slot}
                  </button>
                ))}
              </div>

              <div
                style={{
                  marginTop: '28px',
                  padding: '14px 18px',
                  backgroundColor: 'var(--primary-50)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--primary-light)',
                  fontSize: '13px',
                  color: 'var(--primary-dark)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}
              >
                <Clock size={18} />
                <span>Standard consultation slot duration is 30 minutes including clinical examination.</span>
              </div>
            </div>
          )}

          {/* STEP 5: PATIENT DETAILS */}
          {currentStep === 5 && (
            <div>
              <h2 style={{ fontSize: '20px', marginBottom: '8px' }}>Step 5: Patient Demographic & Visit Details</h2>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '24px' }}>
                Verify patient identity and indicate the primary reason for your visit.
              </p>

              <div className="grid grid-cols-2" style={{ gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Patient Legal Full Name</label>
                  <input
                    type="text"
                    required
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Contact Mobile Phone</label>
                  <input
                    type="tel"
                    required
                    value={patientPhone}
                    onChange={(e) => setPatientPhone(e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Email Address (For Confirmation & Reports)</label>
                <input
                  type="email"
                  required
                  value={patientEmail}
                  onChange={(e) => setPatientEmail(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Reason for Consultation / Symptoms</label>
                <textarea
                  rows={3}
                  value={visitReason}
                  onChange={(e) => setVisitReason(e.target.value)}
                  className="form-textarea"
                  placeholder="Describe your current symptoms, previous history, or reasons for this visit..."
                />
              </div>

              <div className="form-group">
                <label className="form-label">Health Insurance / Corporate Policy (Optional)</label>
                <input
                  type="text"
                  value={insuranceProvider}
                  onChange={(e) => setInsuranceProvider(e.target.value)}
                  className="form-input"
                />
              </div>

              {/* Summary recap box */}
              <div
                style={{
                  backgroundColor: 'var(--surface-alt)',
                  borderRadius: 'var(--radius-md)',
                  padding: '16px 20px',
                  marginTop: '16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Selected Appointment:</div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {selectedDoctor.name} • {selectedDate} at {selectedTimeSlot}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Total Fee</div>
                  <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--primary)' }}>
                    ${selectedDoctor.consultationFee}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: APPOINTMENT CONFIRMED (POST-CONFIRMATION DISPLAY) */}
          {currentStep === 6 && confirmedApt && (
            <div style={{ textAlign: 'center', padding: '16px 0' }}>
              <div
                style={{
                  width: '72px',
                  height: '72px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--success-light)',
                  color: 'var(--success)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px'
                }}
              >
                <CheckCircle2 size={42} />
              </div>

              <span className="badge badge-green" style={{ fontSize: '13px', padding: '6px 16px' }}>
                Booking ID: {confirmedApt.id}
              </span>

              <h2 style={{ fontSize: '28px', marginTop: '14px', marginBottom: '8px' }}>
                Appointment Confirmed
              </h2>

              <p style={{ fontSize: '15px', color: 'var(--text-secondary)', maxWidth: '520px', margin: '0 auto 32px' }}>
                Your appointment has been successfully scheduled and registered in the ShadowFlow hospital management system.
              </p>

              {/* Confirmation Details Card */}
              <div
                style={{
                  backgroundColor: 'var(--bg-color)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '24px 32px',
                  textAlign: 'left',
                  marginBottom: '32px',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '20px'
                }}
              >
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Doctor</div>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {confirmedApt.doctorName}
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--primary)' }}>{confirmedApt.doctorSpecialty}</div>
                </div>

                <div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Department</div>
                  <div style={{ fontSize: '15px', fontWeight: 700 }}>{confirmedApt.department}</div>
                </div>

                <div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Date & Time</div>
                  <div style={{ fontSize: '15px', fontWeight: 700 }}>
                    {confirmedApt.date} at {confirmedApt.timeSlot}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>({confirmedApt.consultationType})</div>
                </div>

                <div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Hospital Location</div>
                  <div style={{ fontSize: '14px', fontWeight: 600 }}>{confirmedApt.hospitalLocation}</div>
                </div>
              </div>

              {/* Required Post-Confirmation Action Buttons */}
              <div className="flex justify-center gap-md flex-wrap">
                <button
                  onClick={downloadCalendarFile}
                  className="btn btn-secondary"
                  style={{ gap: '8px' }}
                >
                  <CalendarPlus size={16} /> Add to Calendar
                </button>
                <Link
                  to="/portal/patient/appointments"
                  className="btn btn-primary"
                  style={{ gap: '8px' }}
                >
                  <FileCheck size={16} /> View Appointment in Portal
                </Link>
                <button
                  onClick={downloadConfirmationSlip}
                  className="btn btn-secondary"
                  style={{ gap: '8px' }}
                >
                  <Download size={16} /> Download Confirmation
                </button>
              </div>
            </div>
          )}

          {/* Navigation Buttons (Steps 1 to 5) */}
          {currentStep < 6 && (
            <div
              style={{
                marginTop: '36px',
                borderTop: '1px solid var(--border-light)',
                paddingTop: '20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              {currentStep > 1 ? (
                <button onClick={handlePrevStep} className="btn btn-secondary">
                  <ArrowLeft size={16} /> Back
                </button>
              ) : (
                <div></div>
              )}

              <button onClick={handleNextStep} className="btn btn-primary btn-lg">
                {currentStep === 5 ? 'Confirm Appointment →' : 'Continue Next Step →'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
