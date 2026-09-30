import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Star,
  Award,
  BookOpen,
  Calendar,
  Clock,
  MapPin,
  Globe,
  Video,
  CheckCircle2,
  Phone,
  ShieldCheck,
  ChevronLeft,
  ArrowRight
} from 'lucide-react';
import { DOCTORS } from '../data/mockData';
import { useApp } from '../context/AppContext';

export default function DoctorProfilePage() {
  const { id } = useParams<{ id: string }>();
  const { addAppointment, user } = useApp();
  const navigate = useNavigate();

  const doctor = DOCTORS.find((d) => d.id === id) || DOCTORS[0];

  const [activeTab, setActiveTab] = useState<'about' | 'experience' | 'education' | 'reviews' | 'slots'>('about');
  const [selectedDate, setSelectedDate] = useState(doctor.availableSlots[0]?.date || '2026-10-01');
  const [selectedSlot, setSelectedSlot] = useState(doctor.availableSlots[0]?.slots[0] || '10:00 AM');
  const [consultType, setConsultType] = useState<'In-Person' | 'Video Consultation'>('In-Person');
  const [bookingReason, setBookingReason] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const currentSlotObj = doctor.availableSlots.find((s) => s.date === selectedDate) || doctor.availableSlots[0];

  const handleDirectBooking = (e: React.FormEvent) => {
    e.preventDefault();
    addAppointment({
      patientId: user?.id || 'p-guest',
      patientName: user?.name || 'Sarah Jenkins',
      patientPhone: user?.phone || '+1 (555) 234-5678',
      patientEmail: user?.email || 'sarah.jenkins@example.com',
      doctorId: doctor.id,
      doctorName: doctor.name,
      doctorSpecialty: doctor.specialty,
      department: doctor.hospitalDepartment,
      date: selectedDate,
      timeSlot: selectedSlot,
      status: 'Confirmed',
      reason: bookingReason || 'Direct profile consultation request',
      consultationType: consultType,
      hospitalLocation: `${doctor.hospitalDepartment} Wing, Room 408`
    });
    setBookingSuccess(true);
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-color)', minHeight: '100vh', padding: '40px 0 80px' }}>
      <div className="container">
        {/* Breadcrumb */}
        <div style={{ marginBottom: '24px' }}>
          <Link
            to="/doctors"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '14px',
              color: 'var(--text-secondary)',
              fontWeight: 500
            }}
          >
            <ChevronLeft size={16} /> Back to Doctor Directory
          </Link>
        </div>

        {/* Doctor Header Banner Card */}
        <div
          className="card"
          style={{
            padding: '36px',
            marginBottom: '32px',
            display: 'flex',
            gap: '36px',
            alignItems: 'center',
            flexWrap: 'wrap'
          }}
        >
          <div style={{ position: 'relative', width: '160px', height: '160px', flexShrink: 0 }}>
            <img
              src={doctor.image}
              alt={doctor.name}
              style={{
                width: '100%',
                height: '100%',
                borderRadius: 'var(--radius-xl)',
                objectFit: 'cover',
                boxShadow: 'var(--shadow-md)'
              }}
            />
            {doctor.availableToday && (
              <span className="doctor-badge-today">
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'white' }}></span>
                Available Today
              </span>
            )}
          </div>

          <div style={{ flex: 1, minWidth: '300px' }}>
            <div className="flex items-center gap-sm flex-wrap" style={{ marginBottom: '8px' }}>
              <h1 style={{ fontSize: '26px', color: 'var(--text-primary)' }}>{doctor.name}</h1>
              <span className="badge badge-blue">{doctor.hospitalDepartment}</span>
            </div>

            <p style={{ fontSize: '15px', color: 'var(--primary)', fontWeight: 600, marginBottom: '6px' }}>
              {doctor.specialty} Specialist
            </p>

            <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              {doctor.qualification}
            </p>

            <div className="flex items-center gap-lg flex-wrap" style={{ fontSize: '13.5px', color: 'var(--text-secondary)' }}>
              <div className="flex items-center gap-xs">
                <Award size={16} color="var(--primary)" />
                <span><strong>{doctor.experience} Years</strong> Clinical Experience</span>
              </div>
              <div className="flex items-center gap-xs">
                <Star size={16} fill="#F59E0B" color="#F59E0B" />
                <span><strong>{doctor.rating}</strong> ({doctor.reviewsCount} reviews)</span>
              </div>
              <div className="flex items-center gap-xs">
                <Globe size={16} color="var(--secondary)" />
                <span>Languages: {doctor.languages.join(', ')}</span>
              </div>
            </div>
          </div>

          {/* Quick Fee & Availability Box */}
          <div
            style={{
              backgroundColor: 'var(--bg-color)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              padding: '20px 24px',
              textAlign: 'center',
              minWidth: '200px'
            }}
          >
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Consultation Fee
            </div>
            <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--primary)', margin: '4px 0' }}>
              ${doctor.consultationFee}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--success-dark)', fontWeight: 600 }}>
              ● {doctor.nextAvailable}
            </div>
          </div>
        </div>

        {/* Two Column Layout: Tabs on Left, Direct Booking on Right */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '32px' }}>
          {/* Left Tabs */}
          <div>
            {/* Tab Headers */}
            <div
              style={{
                display: 'flex',
                borderBottom: '2px solid var(--border)',
                gap: '8px',
                marginBottom: '24px'
              }}
            >
              {[
                { id: 'about', label: 'About' },
                { id: 'experience', label: 'Experience' },
                { id: 'education', label: 'Education' },
                { id: 'reviews', label: `Reviews (${doctor.reviewsCount})` },
                { id: 'slots', label: 'Available Slots' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  style={{
                    padding: '12px 20px',
                    fontSize: '14px',
                    fontWeight: 600,
                    background: 'none',
                    border: 'none',
                    borderBottom: activeTab === tab.id ? '3px solid var(--primary)' : '3px solid transparent',
                    color: activeTab === tab.id ? 'var(--primary)' : 'var(--text-secondary)',
                    cursor: 'pointer',
                    transition: 'var(--transition)'
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content 1: ABOUT */}
            {activeTab === 'about' && (
              <div className="card" style={{ padding: '32px' }}>
                <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>Doctor Biography & Clinical Focus</h3>
                <p style={{ fontSize: '15px', lineHeight: 1.7, color: 'var(--text-secondary)', marginBottom: '24px' }}>
                  {doctor.about}
                </p>

                <h4 style={{ fontSize: '16px', marginBottom: '12px' }}>Clinical Specialties & Scope of Care</h4>
                <div className="grid grid-cols-2" style={{ gap: '12px' }}>
                  {[
                    'Interventional & Preventative Protocols',
                    'Multi-Disciplinary Tumor Board Consensus',
                    'Evidence-Grounded Clinical Pathway Planning',
                    'Post-Operative Rapid Recovery Protocol'
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-sm" style={{ fontSize: '13.5px' }}>
                      <CheckCircle2 size={16} color="var(--success)" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab Content 2: EXPERIENCE */}
            {activeTab === 'experience' && (
              <div className="card" style={{ padding: '32px' }}>
                <h3 style={{ fontSize: '18px', marginBottom: '20px' }}>Professional Appointments & Clinical Roles</h3>
                <div className="flex flex-col gap-lg">
                  {doctor.experienceList.map((exp, i) => (
                    <div key={i} style={{ borderLeft: '3px solid var(--primary)', paddingLeft: '16px' }}>
                      <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>
                        {exp.role}
                      </div>
                      <div style={{ fontSize: '14px', color: 'var(--primary)', fontWeight: 500 }}>
                        {exp.hospital}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                        {exp.duration}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab Content 3: EDUCATION */}
            {activeTab === 'education' && (
              <div className="card" style={{ padding: '32px' }}>
                <h3 style={{ fontSize: '18px', marginBottom: '20px' }}>Academic Qualifications & Fellowships</h3>
                <div className="flex flex-col gap-lg">
                  {doctor.education.map((edu, i) => (
                    <div key={i} className="flex items-start gap-md">
                      <div
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '8px',
                          backgroundColor: 'var(--primary-light)',
                          color: 'var(--primary)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}
                      >
                        <BookOpen size={20} />
                      </div>
                      <div>
                        <div style={{ fontSize: '15px', fontWeight: 700 }}>{edu.degree}</div>
                        <div style={{ fontSize: '13.5px', color: 'var(--text-secondary)' }}>{edu.institution}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>Conferred: {edu.year}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab Content 4: REVIEWS */}
            {activeTab === 'reviews' && (
              <div className="card" style={{ padding: '32px' }}>
                <div className="flex justify-between items-center" style={{ marginBottom: '24px' }}>
                  <div>
                    <h3 style={{ fontSize: '18px' }}>Verified Patient Ratings & Feedback</h3>
                    <div className="flex items-center gap-xs" style={{ marginTop: '4px' }}>
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={16} fill="#F59E0B" color="#F59E0B" />
                      ))}
                      <span style={{ fontSize: '14px', fontWeight: 700, marginLeft: '6px' }}>{doctor.rating} out of 5.0</span>
                    </div>
                  </div>
                  <span className="badge badge-blue">{doctor.reviewsCount} Total Reviews</span>
                </div>

                <div className="flex flex-col gap-md">
                  {[
                    { name: 'Marcus Sterling', date: '3 weeks ago', text: 'Dr. Vance listened to all my cardiac symptoms with immense patience. His explanation of my echocardiogram gave me total peace of mind.' },
                    { name: 'Anita Patel', date: 'Last month', text: 'Outstanding bedside manner and highest level of technical expertise. Highly recommended!' },
                    { name: 'David G.', date: '2 months ago', text: 'Prompt consultation, zero waiting time, and accurate prescription adjustments. The patient portal makes follow-ups seamless.' }
                  ].map((r, i) => (
                    <div key={i} style={{ padding: '16px', backgroundColor: 'var(--bg-color)', borderRadius: 'var(--radius-md)' }}>
                      <div className="flex justify-between items-center" style={{ marginBottom: '6px' }}>
                        <span style={{ fontWeight: 700, fontSize: '13.5px' }}>{r.name}</span>
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{r.date}</span>
                      </div>
                      <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                        "{r.text}"
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab Content 5: SLOTS */}
            {activeTab === 'slots' && (
              <div className="card" style={{ padding: '32px' }}>
                <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>Upcoming Schedule & Consulting Windows</h3>
                <div className="flex flex-col gap-lg">
                  {doctor.availableSlots.map((slotGroup) => (
                    <div key={slotGroup.date} style={{ borderBottom: '1px solid var(--border-light)', paddingBottom: '16px' }}>
                      <div style={{ fontSize: '14px', fontWeight: 700, marginBottom: '10px', color: 'var(--primary)' }}>
                        Date: {slotGroup.date}
                      </div>
                      <div className="flex gap-xs flex-wrap">
                        {slotGroup.slots.map((t) => (
                          <span key={t} className="badge badge-teal" style={{ padding: '6px 14px', fontSize: '13px' }}>
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Direct Appointment Booking Widget */}
          <div className="card" style={{ padding: '28px', height: 'fit-content', position: 'sticky', top: '100px' }}>
            <h3 style={{ fontSize: '18px', marginBottom: '4px' }}>Book Consultation</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
              Schedule visit directly with {doctor.name}
            </p>

            {bookingSuccess ? (
              <div style={{ textAlign: 'center', padding: '24px 0' }}>
                <div
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--success-light)',
                    color: 'var(--success-dark)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px'
                  }}
                >
                  <CheckCircle2 size={32} />
                </div>
                <h4 style={{ fontSize: '17px', color: 'var(--text-primary)' }}>Appointment Confirmed!</h4>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '6px', lineHeight: 1.5 }}>
                  Your appointment for <strong>{selectedDate}</strong> at <strong>{selectedSlot}</strong> has been logged in your Patient Portal.
                </p>
                <div className="flex flex-col gap-xs" style={{ marginTop: '20px' }}>
                  <Link to="/portal/patient/appointments" className="btn btn-primary btn-sm">
                    View in Patient Portal
                  </Link>
                  <button
                    onClick={() => setBookingSuccess(false)}
                    className="btn btn-secondary btn-sm"
                  >
                    Book Another Slot
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleDirectBooking}>
                {/* Consultation Mode */}
                <div className="form-group">
                  <label className="form-label">Consultation Mode</label>
                  <div className="grid grid-cols-2" style={{ gap: '8px' }}>
                    <button
                      type="button"
                      onClick={() => setConsultType('In-Person')}
                      className={`btn btn-sm ${consultType === 'In-Person' ? 'btn-primary' : 'btn-secondary'}`}
                      style={{ fontSize: '12px' }}
                    >
                      In-Person Clinic
                    </button>
                    <button
                      type="button"
                      onClick={() => setConsultType('Video Consultation')}
                      className={`btn btn-sm ${consultType === 'Video Consultation' ? 'btn-teal' : 'btn-secondary'}`}
                      style={{ fontSize: '12px' }}
                    >
                      <Video size={13} /> Video Call
                    </button>
                  </div>
                </div>

                {/* Date Selection */}
                <div className="form-group">
                  <label className="form-label">Select Date</label>
                  <select
                    value={selectedDate}
                    onChange={(e) => {
                      setSelectedDate(e.target.value);
                      const group = doctor.availableSlots.find((s) => s.date === e.target.value);
                      if (group && group.slots.length > 0) setSelectedSlot(group.slots[0]);
                    }}
                    className="form-select"
                  >
                    {doctor.availableSlots.map((s) => (
                      <option key={s.date} value={s.date}>{s.date}</option>
                    ))}
                  </select>
                </div>

                {/* Slot Selection */}
                <div className="form-group">
                  <label className="form-label">Select Time Slot</label>
                  <div className="grid grid-cols-2" style={{ gap: '8px' }}>
                    {currentSlotObj.slots.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setSelectedSlot(slot)}
                        style={{
                          padding: '8px',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '12px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          border: selectedSlot === slot ? '2px solid var(--primary)' : '1px solid var(--border)',
                          backgroundColor: selectedSlot === slot ? 'var(--primary-light)' : 'var(--surface)',
                          color: selectedSlot === slot ? 'var(--primary-dark)' : 'var(--text-secondary)'
                        }}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Reason for Visit */}
                <div className="form-group">
                  <label className="form-label">Reason for Consultation</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Heart checkup, palpitations, second opinion"
                    value={bookingReason}
                    onChange={(e) => setBookingReason(e.target.value)}
                    className="form-input"
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-lg"
                  style={{ width: '100%', marginTop: '12px', justifyContent: 'center' }}
                >
                  Confirm Appointment (${doctor.consultationFee}) →
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
