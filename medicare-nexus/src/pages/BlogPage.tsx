import React, { useState } from 'react';
import { FileText, Clock, User, ArrowRight, Share2, Bookmark } from 'lucide-react';
import { HEALTH_ARTICLES } from '../data/mockData';
import type { HealthArticle } from '../types';

export default function BlogPage() {
  const [selectedArticle, setSelectedArticle] = useState<HealthArticle | null>(null);

  return (
    <div style={{ backgroundColor: 'var(--bg-color)', minHeight: '100vh', paddingBottom: '80px' }}>
      {/* Header */}
      <section
        style={{
          background: 'radial-gradient(100% 100% at 50% 0%, #E8F3FC 0%, #F8FAFC 100%)',
          padding: '60px 0 40px',
          borderBottom: '1px solid var(--border)'
        }}
      >
        <div className="container text-center" style={{ maxWidth: '720px' }}>
          <span className="badge badge-teal">Clinical & Preventative Insights</span>
          <h1 style={{ fontSize: '38px', marginTop: '10px', marginBottom: '14px', letterSpacing: '-0.02em' }}>
            MediCare Health Journal & Articles
          </h1>
          <p style={{ fontSize: '16px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Evidence-based medical updates, preventive cardiometabolic guidelines, and clinical articles
            authored by our attending department heads.
          </p>
        </div>
      </section>

      <div className="container" style={{ marginTop: '48px' }}>
        <div className="grid grid-cols-3" style={{ gap: '32px' }}>
          {HEALTH_ARTICLES.map((art) => (
            <div
              key={art.id}
              className="card"
              style={{
                padding: 0,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer'
              }}
              onClick={() => setSelectedArticle(art)}
            >
              <img
                src={art.image}
                alt={art.title}
                style={{ width: '100%', height: '220px', objectFit: 'cover' }}
              />

              <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <div className="flex items-center justify-between" style={{ marginBottom: '12px' }}>
                  <span className="badge badge-blue">{art.category}</span>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{art.readTime}</span>
                </div>

                <h2 style={{ fontSize: '18px', color: 'var(--text-primary)', lineHeight: 1.4, marginBottom: '12px' }}>
                  {art.title}
                </h2>

                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '20px', flex: 1 }}>
                  {art.shortDesc}
                </p>

                <div
                  style={{
                    borderTop: '1px solid var(--border-light)',
                    paddingTop: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '12.5px'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{art.author}</div>
                    <div style={{ color: 'var(--primary)' }}>{art.authorRole}</div>
                  </div>
                  <span className="btn btn-sm btn-outline-primary">
                    Read Article →
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Article Reader Modal */}
      {selectedArticle && (
        <div className="modal-overlay" onClick={() => setSelectedArticle(null)}>
          <div
            className="modal-content"
            style={{ maxWidth: '760px', padding: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ position: 'relative' }}>
              <img
                src={selectedArticle.image}
                alt={selectedArticle.title}
                style={{ width: '100%', height: '280px', objectFit: 'cover' }}
              />
              <button
                onClick={() => setSelectedArticle(null)}
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  backgroundColor: 'rgba(0,0,0,0.6)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px'
                }}
              >
                ✕
              </button>
            </div>

            <div style={{ padding: '32px' }}>
              <div className="flex items-center gap-sm" style={{ marginBottom: '12px' }}>
                <span className="badge badge-blue">{selectedArticle.category}</span>
                <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>• {selectedArticle.date}</span>
                <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>• {selectedArticle.readTime}</span>
              </div>

              <h1 style={{ fontSize: '26px', color: 'var(--text-primary)', marginBottom: '16px' }}>
                {selectedArticle.title}
              </h1>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  backgroundColor: 'var(--surface-alt)',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '24px'
                }}
              >
                <div style={{ fontSize: '13.5px' }}>
                  Author: <strong>{selectedArticle.author}</strong> ({selectedArticle.authorRole})
                </div>
              </div>

              <div className="flex flex-col gap-md" style={{ fontSize: '15px', lineHeight: 1.8, color: 'var(--text-primary)' }}>
                {selectedArticle.content.map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}
              </div>

              <div style={{ marginTop: '32px', borderTop: '1px solid var(--border-light)', paddingTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
                <button onClick={() => setSelectedArticle(null)} className="btn btn-secondary">
                  Close Article
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
