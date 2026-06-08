'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Header() {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const pillars = [
    { name: 'דיני מקרקעין ונדל״ן', href: '/practice-areas/real-estate-law' },
    { name: 'רשלנות רפואית', href: '/practice-areas/medical-malpractice' },
    { name: 'דיני עבודה', href: '/practice-areas/labor-law' },
    { name: 'דין פלילי ומעצרים', href: '/practice-areas/criminal-law' },
    { name: 'דיני משפחה וגירושין', href: '/practice-areas/family-law' },
    { name: 'תאונות דרכים ונזקי גוף', href: '/practice-areas/personal-injury' },
  ];

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      background: 'rgba(255, 255, 255, 0.75)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
      padding: '12px 24px',
      direction: 'rtl'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        {/* Logo */}
        <Link href="/" style={{
          fontSize: '1.5rem',
          fontWeight: '900',
          color: '#1d1d1f',
          textDecoration: 'none',
          display: 'inline-flex',
          alignItems: 'center'
        }}>
          Jus<span style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: '#d93838',
            margin: '0 2px',
            display: 'inline-block',
            transform: 'translateY(1px)'
          }}></span>Tice
        </Link>

        {/* Menu Links */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '24px'
        }}>
          <Link href="/" style={{ color: '#1d1d1f', fontWeight: '600', textDecoration: 'none', fontSize: '0.9rem' }}>
            ראשי
          </Link>

          {/* Dropdown for Practice Areas */}
          <div style={{ position: 'relative' }} onMouseLeave={() => setDropdownOpen(false)}>
            <button 
              onClick={() => setDropdownOpen(!dropdownOpen)}
              onMouseEnter={() => setDropdownOpen(true)}
              style={{
                color: '#1d1d1f',
                fontWeight: '600',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              תחומי התמחות
              <span style={{ fontSize: '0.7rem' }}>▼</span>
            </button>
            {dropdownOpen && (
              <div style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                backgroundColor: '#ffffff',
                border: '1px solid rgba(0, 0, 0, 0.08)',
                boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)',
                borderRadius: '8px',
                padding: '8px 0',
                minWidth: '220px',
                display: 'flex',
                flexDirection: 'column',
                marginTop: '8px',
                zIndex: 1010
              }}>
                {pillars.map((pillar) => (
                  <Link
                    key={pillar.href}
                    href={pillar.href}
                    style={{
                      padding: '10px 16px',
                      color: '#1d1d1f',
                      textDecoration: 'none',
                      fontSize: '0.85rem',
                      fontWeight: '500',
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#f5f5f7'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                  >
                    {pillar.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link href="/lawyers" style={{ color: '#1d1d1f', fontWeight: '600', textDecoration: 'none', fontSize: '0.9rem' }}>
            אינדקס עורכי דין
          </Link>
          <Link href="/#workspace" style={{ color: '#1d1d1f', fontWeight: '600', textDecoration: 'none', fontSize: '0.9rem' }}>
            כלים דיגיטליים & AI
          </Link>
          <Link href="/about-us" style={{ color: '#1d1d1f', fontWeight: '600', textDecoration: 'none', fontSize: '0.9rem' }}>
            אודות
          </Link>
        </div>

        {/* Contact CTA */}
        <div>
          <Link 
            href="/contact" 
            style={{
              backgroundColor: '#0066cc',
              color: '#ffffff',
              padding: '8px 16px',
              borderRadius: '20px',
              textDecoration: 'none',
              fontWeight: '700',
              fontSize: '0.85rem',
              display: 'inline-block',
              transition: 'background 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#0055aa'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#0066cc'}
          >
            צור קשר
          </Link>
        </div>
      </div>
    </nav>
  );
}
