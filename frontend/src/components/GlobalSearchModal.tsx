import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, User, HeartPulse, Stethoscope, FileText, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DOCTORS, DEPARTMENTS, SERVICES, HEALTH_ARTICLES } from '../data/mockData';

export default function GlobalSearchModal() {
  const { searchModalOpen, setSearchModalOpen } = useApp();
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const results = useMemo(() => {
    if (!query.trim()) return { doctors: [], departments: [], services: [], articles: [] };
    const q = query.toLowerCase();

    return {
      doctors: DOCTORS.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.specialty.toLowerCase().includes(q) ||
          d.hospitalDepartment.toLowerCase().includes(q)
      ).slice(0, 4),
      departments: DEPARTMENTS.filter(
        (dep) =>
          dep.name.toLowerCase().includes(q) ||
          dep.shortDesc.toLowerCase().includes(q)
      ).slice(0, 4),
      services: SERVICES.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          s.category.toLowerCase().includes(q)
      ).slice(0, 3),
      articles: HEALTH_ARTICLES.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.category.toLowerCase().includes(q)
      ).slice(0, 3)
    };
  }, [query]);

  if (!searchModalOpen) return null;

  const totalResults =
    results.doctors.length +
    results.departments.length +
    results.services.length +
    results.articles.length;

  const handleSelect = (url: string) => {
    setSearchModalOpen(false);
    setQuery('');
    navigate(url);
  };

  return (
    <div className="modal-overlay" onClick={() => setSearchModalOpen(false)}>
      <div
        className="modal-content"
        style={{ maxWidth: '680px', padding: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}
        >
          <Search size={22} color="var(--primary)" />
          <input
            type="text"
            placeholder="Search doctors, clinical specialties, services, health articles..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              fontSize: '16px',
              fontFamily: 'inherit',
              color: 'var(--text-primary)'
            }}
          />
          <button
            onClick={() => setSearchModalOpen(false)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-secondary)'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Results Body */}
        <div style={{ padding: '20px 24px', maxHeight: '480px', overflowY: 'auto' }}>
          {!query.trim() ? (
            <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text-secondary)' }}>
              <p style={{ fontSize: '14px', marginBottom: '16px' }}>Try searching for:</p>
              <div className="flex justify-center gap-xs flex-wrap">
                {['Cardiology', 'Dr. Marcus Vance', 'Robotic Surgery', 'FAST stroke', 'Pediatrics', 'Lipid Panel'].map((t) => (
                  <button
                    key={t}
                    onClick={() => setQuery(t)}
                    className="badge badge-blue"
                    style={{ cursor: 'pointer', border: 'none', padding: '6px 12px' }}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          ) : totalResults === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-secondary)' }}>
              <p style={{ fontSize: '15px', fontWeight: 600 }}>No results found for "{query}"</p>
              <p style={{ fontSize: '13px', marginTop: '6px' }}>Please check your spelling or search by general department.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-lg">
              {/* Doctors Results */}
              {results.doctors.length > 0 && (
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
                    Specialist Doctors ({results.doctors.length})
                  </div>
                  <div className="flex flex-col gap-xs">
                    {results.doctors.map((d) => (
                      <div
                        key={d.id}
                        onClick={() => handleSelect(`/doctor/${d.id}`)}
                        className="flex items-center justify-between"
                        style={{
                          padding: '10px 12px',
                          borderRadius: 'var(--radius-md)',
                          cursor: 'pointer',
                          transition: 'var(--transition)',
                          backgroundColor: 'var(--surface-hover)'
                        }}
                      >
                        <div className="flex items-center gap-sm">
                          <img
                            src={d.image}
                            alt={d.name}
                            style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover' }}
                          />
                          <div>
                            <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                              {d.name}
                            </div>
                            <div style={{ fontSize: '12px', color: 'var(--primary)' }}>
                              {d.specialty} • {d.experience} yrs exp
                            </div>
                          </div>
                        </div>
                        <ArrowRight size={16} color="var(--text-muted)" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Departments Results */}
              {results.departments.length > 0 && (
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
                    Clinical Departments ({results.departments.length})
                  </div>
                  <div className="flex flex-col gap-xs">
                    {results.departments.map((dep) => (
                      <div
                        key={dep.id}
                        onClick={() => handleSelect(`/department/${dep.id}`)}
                        className="flex items-center justify-between"
                        style={{
                          padding: '10px 12px',
                          borderRadius: 'var(--radius-md)',
                          cursor: 'pointer',
                          backgroundColor: 'var(--surface-hover)'
                        }}
                      >
                        <div className="flex items-center gap-sm">
                          <div
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '8px',
                              backgroundColor: 'var(--secondary-light)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'var(--secondary-dark)'
                            }}
                          >
                            <HeartPulse size={18} />
                          </div>
                          <div>
                            <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                              {dep.name}
                            </div>
                            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                              {dep.shortDesc}
                            </div>
                          </div>
                        </div>
                        <ArrowRight size={16} color="var(--text-muted)" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Services Results */}
              {results.services.length > 0 && (
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
                    Healthcare Services ({results.services.length})
                  </div>
                  <div className="flex flex-col gap-xs">
                    {results.services.map((s) => (
                      <div
                        key={s.id}
                        onClick={() => handleSelect('/services')}
                        className="flex items-center justify-between"
                        style={{
                          padding: '10px 12px',
                          borderRadius: 'var(--radius-md)',
                          cursor: 'pointer',
                          backgroundColor: 'var(--surface-hover)'
                        }}
                      >
                        <div className="flex items-center gap-sm">
                          <Stethoscope size={18} color="var(--primary)" />
                          <div>
                            <div style={{ fontSize: '14px', fontWeight: 600 }}>{s.title}</div>
                            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{s.category}</div>
                          </div>
                        </div>
                        <ArrowRight size={16} color="var(--text-muted)" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Health Articles */}
              {results.articles.length > 0 && (
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
                    Health Articles & Guides ({results.articles.length})
                  </div>
                  <div className="flex flex-col gap-xs">
                    {results.articles.map((a) => (
                      <div
                        key={a.id}
                        onClick={() => handleSelect('/blog')}
                        className="flex items-center justify-between"
                        style={{
                          padding: '10px 12px',
                          borderRadius: 'var(--radius-md)',
                          cursor: 'pointer',
                          backgroundColor: 'var(--surface-hover)'
                        }}
                      >
                        <div className="flex items-center gap-sm">
                          <FileText size={18} color="var(--secondary)" />
                          <div>
                            <div style={{ fontSize: '14px', fontWeight: 600 }}>{a.title}</div>
                            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{a.category} • {a.readTime}</div>
                          </div>
                        </div>
                        <ArrowRight size={16} color="var(--text-muted)" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
