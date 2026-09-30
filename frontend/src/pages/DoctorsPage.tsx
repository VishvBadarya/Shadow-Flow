import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  Filter,
  Star,
  Calendar,
  Clock,
  Video,
  User,
  CheckCircle2,
  SlidersHorizontal,
  ChevronRight,
  ShieldCheck,
  Stethoscope
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DOCTORS, DEPARTMENTS } from '../data/mockData';

export default function DoctorsPage() {
  const { setBookingPrefill } = useApp();
  const navigate = useNavigate();

  // Search & Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState('All');
  const [availabilityFilter, setAvailabilityFilter] = useState('All');
  const [experienceFilter, setExperienceFilter] = useState('All');
  const [genderFilter, setGenderFilter] = useState('All');
  const [consultTypeFilter, setConsultTypeFilter] = useState('All');

  const specialties = ['All', ...DEPARTMENTS.map((d) => d.name)];

  const filteredDoctors = DOCTORS.filter((doc) => {
    // Search query
    if (
      searchTerm &&
      !doc.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !doc.specialty.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !doc.qualification.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }

    // Specialty filter
    if (specialtyFilter !== 'All' && doc.specialty !== specialtyFilter) {
      return false;
    }

    // Availability filter
    if (availabilityFilter === 'Today' && !doc.availableToday) {
      return false;
    }
    if (availabilityFilter === 'Online' && !doc.online) {
      return false;
    }

    // Experience filter
    if (experienceFilter === '15+' && doc.experience < 15) return false;
    if (experienceFilter === '18+' && doc.experience < 18) return false;

    // Gender filter
    if (genderFilter !== 'All' && doc.gender !== genderFilter) return false;

    // Consultation Type
    if (consultTypeFilter === 'Video' && !doc.consultationType.includes('Video Consultation')) {
      return false;
    }

    return true;
  });

  const handleBook = (doctorId: string, dept: string) => {
    setBookingPrefill({ doctorId, departmentId: dept.toLowerCase() });
    navigate('/book-appointment');
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-color)', minHeight: '100vh', paddingBottom: '80px' }}>
      {/* Page Header */}
      <section
        style={{
          background: 'radial-gradient(100% 100% at 50% 0%, #E8F3FC 0%, #F8FAFC 100%)',
          padding: '60px 0 40px',
          borderBottom: '1px solid var(--border)'
        }}
      >
        <div className="container">
          <div style={{ maxWidth: '720px', margin: '0 auto', textAlign: 'center' }}>
            <span className="badge badge-blue" style={{ marginBottom: '12px' }}>
              150+ Leading Specialists
            </span>
            <h1 style={{ fontSize: '38px', marginBottom: '14px', letterSpacing: '-0.02em' }}>
              Find the Right Doctor for Your Care
            </h1>
            <p style={{ fontSize: '16px', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '28px' }}>
              Search across multi-specialty clinicians, check available appointment slots,
              and schedule your clinic or video consultation in minutes.
            </p>

            {/* Search Bar */}
            <div
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                backgroundColor: 'var(--surface)',
                borderRadius: 'var(--radius-full)',
                padding: '6px 10px 6px 20px',
                boxShadow: 'var(--shadow-md)',
                border: '1px solid var(--border)'
              }}
            >
              <Search size={20} color="var(--primary)" />
              <input
                type="text"
                placeholder="Search by doctor name or specialty (e.g. Vance, Cardiology, Pediatrics)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  border: 'none',
                  outline: 'none',
                  flex: 1,
                  padding: '10px 14px',
                  fontSize: '15px',
                  fontFamily: 'inherit',
                  color: 'var(--text-primary)'
                }}
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', marginRight: '8px' }}
                >
                  Clear
                </button>
              )}
              <button className="btn btn-primary" style={{ borderRadius: 'var(--radius-full)', padding: '10px 22px' }}>
                Search
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area: Filters + Doctor Grid */}
      <div className="container" style={{ marginTop: '40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '32px' }}>
          {/* Left Filters Sidebar */}
          <aside>
            <div className="card" style={{ padding: '24px', position: 'sticky', top: '100px' }}>
              <div className="flex items-center justify-between" style={{ marginBottom: '20px', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px' }}>
                <div className="flex items-center gap-xs">
                  <SlidersHorizontal size={18} color="var(--primary)" />
                  <span style={{ fontWeight: 700, fontSize: '15px' }}>Filters</span>
                </div>
                {(specialtyFilter !== 'All' || availabilityFilter !== 'All' || experienceFilter !== 'All' || genderFilter !== 'All' || consultTypeFilter !== 'All') && (
                  <button
                    onClick={() => {
                      setSpecialtyFilter('All');
                      setAvailabilityFilter('All');
                      setExperienceFilter('All');
                      setGenderFilter('All');
                      setConsultTypeFilter('All');
                    }}
                    style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '12px', cursor: 'pointer', fontWeight: 600 }}
                  >
                    Reset All
                  </button>
                )}
              </div>

              {/* Specialty Filter */}
              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label className="form-label">Specialty</label>
                <select
                  value={specialtyFilter}
                  onChange={(e) => setSpecialtyFilter(e.target.value)}
                  className="form-select"
                >
                  {specialties.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              {/* Availability Filter */}
              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label className="form-label">Availability</label>
                <select
                  value={availabilityFilter}
                  onChange={(e) => setAvailabilityFilter(e.target.value)}
                  className="form-select"
                >
                  <option value="All">Any Time</option>
                  <option value="Today">Available Today</option>
                  <option value="Online">Online Now</option>
                </select>
              </div>

              {/* Experience Filter */}
              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label className="form-label">Experience</label>
                <select
                  value={experienceFilter}
                  onChange={(e) => setExperienceFilter(e.target.value)}
                  className="form-select"
                >
                  <option value="All">Any Years of Experience</option>
                  <option value="15+">15+ Years</option>
                  <option value="18+">18+ Years</option>
                </select>
              </div>

              {/* Consultation Type */}
              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label className="form-label">Consultation Mode</label>
                <select
                  value={consultTypeFilter}
                  onChange={(e) => setConsultTypeFilter(e.target.value)}
                  className="form-select"
                >
                  <option value="All">All Modes</option>
                  <option value="In-Person">In-Person Only</option>
                  <option value="Video">Video Consultation Available</option>
                </select>
              </div>

              {/* Gender */}
              <div className="form-group">
                <label className="form-label">Doctor Gender</label>
                <select
                  value={genderFilter}
                  onChange={(e) => setGenderFilter(e.target.value)}
                  className="form-select"
                >
                  <option value="All">Any Gender</option>
                  <option value="Male">Male Doctor</option>
                  <option value="Female">Female Doctor</option>
                </select>
              </div>
            </div>
          </aside>

          {/* Right Doctor Cards Grid */}
          <div>
            <div className="flex justify-between items-center" style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '15px', color: 'var(--text-secondary)' }}>
                Showing <strong>{filteredDoctors.length}</strong> available doctors
              </div>
            </div>

            {filteredDoctors.length === 0 ? (
              <div className="card text-center" style={{ padding: '60px 20px' }}>
                <Stethoscope size={48} color="var(--text-muted)" style={{ margin: '0 auto 16px' }} />
                <h3>No Doctors Found</h3>
                <p style={{ marginTop: '8px' }}>Try resetting your filter parameters or searching for a different keyword.</p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSpecialtyFilter('All');
                    setAvailabilityFilter('All');
                    setExperienceFilter('All');
                    setGenderFilter('All');
                    setConsultTypeFilter('All');
                  }}
                  className="btn btn-secondary"
                  style={{ marginTop: '20px' }}
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {filteredDoctors.map((doc) => (
                  <div
                    key={doc.id}
                    className="card"
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '24px',
                      padding: '24px',
                      alignItems: 'center'
                    }}
                  >
                    {/* Doctor Avatar */}
                    <div style={{ position: 'relative', width: '130px', height: '130px', flexShrink: 0 }}>
                      <img
                        src={doc.image}
                        alt={doc.name}
                        style={{
                          width: '100%',
                          height: '100%',
                          borderRadius: 'var(--radius-lg)',
                          objectFit: 'cover'
                        }}
                      />
                      <span
                        style={{
                          position: 'absolute',
                          bottom: '-4px',
                          right: '-4px',
                          width: '16px',
                          height: '16px',
                          borderRadius: '50%',
                          backgroundColor: doc.online ? 'var(--success)' : '#CBD5E1',
                          border: '2px solid white'
                        }}
                        title={doc.online ? 'Online now' : 'Offline'}
                      ></span>
                    </div>

                    {/* Middle Info */}
                    <div style={{ flex: 1, minWidth: '260px' }}>
                      <div className="flex items-center gap-sm flex-wrap" style={{ marginBottom: '6px' }}>
                        <h2 style={{ fontSize: '19px', color: 'var(--text-primary)' }}>{doc.name}</h2>
                        {doc.availableToday && (
                          <span className="badge badge-green" style={{ fontSize: '11px' }}>
                            Available Today
                          </span>
                        )}
                        <span className="badge badge-blue" style={{ fontSize: '11px' }}>
                          {doc.hospitalDepartment}
                        </span>
                      </div>

                      <div style={{ fontSize: '13.5px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                        {doc.qualification}
                      </div>

                      <div className="flex items-center gap-md flex-wrap" style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                        <span>
                          <strong>{doc.experience}</strong> Years Experience
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-xs">
                          <Star size={14} fill="#F59E0B" color="#F59E0B" />
                          <strong>{doc.rating}</strong> ({doc.reviewsCount} verified reviews)
                        </span>
                        <span>•</span>
                        <span>Languages: {doc.languages.join(', ')}</span>
                      </div>

                      <div className="flex items-center gap-sm flex-wrap" style={{ fontSize: '12.5px' }}>
                        <span style={{ color: 'var(--primary-dark)', backgroundColor: 'var(--primary-light)', padding: '4px 10px', borderRadius: 'var(--radius-sm)', fontWeight: 600 }}>
                          Next Slot: {doc.nextAvailable}
                        </span>
                        {doc.consultationType.includes('Video Consultation') && (
                          <span className="flex items-center gap-xs badge badge-teal">
                            <Video size={12} /> Video Consultation Ready
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Right Fee & Actions */}
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-end',
                        justifyContent: 'center',
                        gap: '12px',
                        borderLeft: '1px solid var(--border-light)',
                        paddingLeft: '24px',
                        minWidth: '160px'
                      }}
                    >
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Consultation Fee</div>
                        <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--primary)' }}>
                          ${doc.consultationFee}
                        </div>
                      </div>

                      <div className="flex flex-col gap-xs" style={{ width: '100%' }}>
                        <button
                          onClick={() => handleBook(doc.id, doc.hospitalDepartment)}
                          className="btn btn-primary btn-sm"
                          style={{ width: '100%', justifyContent: 'center' }}
                        >
                          <Calendar size={15} /> Book Appointment
                        </button>
                        <Link
                          to={`/doctor/${doc.id}`}
                          className="btn btn-secondary btn-sm"
                          style={{ width: '100%', justifyContent: 'center' }}
                        >
                          View Full Profile
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
