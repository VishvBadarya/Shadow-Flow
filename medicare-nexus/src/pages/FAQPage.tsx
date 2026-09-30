import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronUp, HelpCircle, Calendar, CreditCard, FileText, PhoneCall } from 'lucide-react';

interface FAQItem {
  q: string;
  a: string;
  category: string;
}

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FAQItem[] = [
    {
      category: 'Appointments',
      q: 'How do I schedule an in-person or video consultation?',
      a: 'You can use our online 6-step appointment booking wizard at any time. Simply choose your specialty or doctor, select an available date and time slot, and your consultation will be instantly confirmed in your Patient Portal.'
    },
    {
      category: 'Appointments',
      q: 'Can I reschedule or cancel my appointment without penalty?',
      a: 'Yes, appointments can be modified or cancelled through your Patient Dashboard up to 2 hours prior to the scheduled consultation time with full refund or rescheduling credits.'
    },
    {
      category: 'Billing',
      q: 'Which health insurance policies and TPAs are accepted?',
      a: 'We accept all major health insurance providers including Blue Cross Blue Shield, Aetna, Cigna, UnitedHealthcare, Medicare, and regional TPAs. Our pre-authorization desk coordinates cashless coverage directly with your insurer.'
    },
    {
      category: 'Billing',
      q: 'How can I view and pay my hospital medical bills online?',
      a: 'Log into your Patient Portal and navigate to "Bills & Payments". You can view itemized diagnostic and consultation invoices, download PDF receipts, and complete payments securely via Credit Card, Debit Card, or Bank Transfer.'
    },
    {
      category: 'Medical Records',
      q: 'How fast are diagnostic laboratory and imaging reports uploaded?',
      a: 'Routine hematology and biochemistry panels are verified and synchronized with your portal in 2 to 4 hours. High-resolution MRI and CT scans with radiologist impressions are published within 12 hours.'
    },
    {
      category: 'Emergency',
      q: 'What should I do if I am experiencing acute chest pain or stroke symptoms?',
      a: 'Do not attempt to drive yourself. Dial our 24/7 Emergency Line 1-800-MEDICARE immediately. Our Advanced Life Support ambulance will be dispatched to your location, and the emergency team will prep the cath lab or CT suite while you are in transit.'
    }
  ];

  const categories = ['All', 'Appointments', 'Billing', 'Medical Records', 'Emergency'];

  const filteredFaqs = activeCategory === 'All' ? faqs : faqs.filter((f) => f.category === activeCategory);

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
          <span className="badge badge-blue">Knowledge & Guidance</span>
          <h1 style={{ fontSize: '38px', marginTop: '10px', marginBottom: '14px', letterSpacing: '-0.02em' }}>
            Frequently Asked Questions
          </h1>
          <p style={{ fontSize: '16px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Clear answers to common questions regarding appointments, insurance pre-authorization,
            digital medical records, and hospital protocols.
          </p>
        </div>
      </section>

      <div className="container" style={{ maxWidth: '840px', marginTop: '40px' }}>
        {/* Category Pills */}
        <div className="flex justify-center gap-xs flex-wrap" style={{ marginBottom: '32px' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`btn btn-sm ${activeCategory === cat ? 'btn-primary' : 'btn-secondary'}`}
              style={{ borderRadius: 'var(--radius-full)', padding: '8px 18px' }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* FAQ Accordions */}
        <div className="flex flex-col gap-md">
          {filteredFaqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="card"
                style={{
                  padding: '24px',
                  cursor: 'pointer',
                  border: isOpen ? '1.5px solid var(--primary)' : '1px solid var(--border)'
                }}
                onClick={() => setOpenIndex(isOpen ? null : idx)}
              >
                <div className="flex justify-between items-center gap-md">
                  <div className="flex items-center gap-sm">
                    <span className="badge badge-blue" style={{ fontSize: '11px' }}>
                      {faq.category}
                    </span>
                    <h3 style={{ fontSize: '16px', color: 'var(--text-primary)', margin: 0 }}>
                      {faq.q}
                    </h3>
                  </div>
                  {isOpen ? <ChevronUp size={20} color="var(--primary)" /> : <ChevronDown size={20} color="var(--text-muted)" />}
                </div>

                {isOpen && (
                  <p
                    style={{
                      fontSize: '14.5px',
                      color: 'var(--text-secondary)',
                      lineHeight: 1.6,
                      marginTop: '16px',
                      paddingTop: '16px',
                      borderTop: '1px solid var(--border-light)'
                    }}
                  >
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* Still have questions */}
        <div className="card text-center" style={{ marginTop: '48px', padding: '36px' }}>
          <h3 style={{ fontSize: '19px', marginBottom: '8px' }}>Still have questions?</h3>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
            Our patient relations coordinators are on hand 24 hours a day to assist you.
          </p>
          <div className="flex justify-center gap-md">
            <Link to="/contact" className="btn btn-primary">
              Contact Hospital Support
            </Link>
            <Link to="/emergency" className="btn btn-danger">
              24/7 Emergency Line
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
