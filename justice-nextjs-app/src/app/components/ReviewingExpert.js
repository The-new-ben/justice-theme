import React from 'react';

/**
 * Premium Reviewing Expert UI Component (E-E-A-T)
 * Milky glassmorphism style, displays verifications and credentials.
 */
export default function ReviewingExpert({ expert }) {
  if (!expert) return null;

  // Build social/professional links
  const socialLinks = [];
  if (expert.sameAs) {
    const links = Array.isArray(expert.sameAs) ? expert.sameAs : [expert.sameAs];
    links.forEach((link, idx) => {
      let label = 'פרופיל מקצועי';
      if (link.includes('linkedin.com')) {
        label = 'LinkedIn';
      } else if (link.includes('wikipedia.org')) {
        label = 'Wikipedia';
      } else if (link.includes('court.gov.il')) {
        label = 'נט המשפט';
      } else if (link.includes('israelbar.org.il')) {
        label = 'לשכת עורכי הדין';
      }
      
      socialLinks.push(
        <a
          key={idx}
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontSize: '0.8rem',
            color: '#0066cc',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            background: 'rgba(0, 102, 204, 0.05)',
            padding: '4px 10px',
            borderRadius: '6px',
            fontWeight: '600',
            transition: 'background 0.2s',
          }}
        >
          {label} &rarr;
        </a>
      );
    });
  }

  return (
    <div style={{
      padding: '24px',
      border: '1px solid rgba(255, 255, 255, 0.4)',
      borderRadius: '16px',
      marginBottom: '32px',
      background: 'rgba(255, 255, 255, 0.65)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.04)',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      direction: 'rtl'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: 'rgba(0, 102, 204, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.8rem',
          boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)'
        }}>
          🛡️
        </div>
        <div style={{ flex: '1', minWidth: '200px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <h4 style={{ margin: 0, fontWeight: '800', fontSize: '1.15rem', color: '#1d1d1f' }}>
              עורך הדין {expert.name} בדק ואישר משפטית את התוכן
            </h4>
            <span style={{
              fontSize: '0.75rem',
              backgroundColor: '#34c759',
              color: '#ffffff',
              padding: '2px 8px',
              borderRadius: '20px',
              fontWeight: '700',
              letterSpacing: '0.5px'
            }}>
              אימות עמידה בדין
            </span>
          </div>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.9rem', color: '#48484a', lineHeight: '1.4' }}>
            {expert.credentials} {expert.barId ? `(מספר רישיון לשכת עורכי הדין: ${expert.barId})` : ''}
          </p>
        </div>
      </div>

      <div style={{ 
        height: '1px', 
        background: 'rgba(0, 0, 0, 0.06)' 
      }} />

      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        flexWrap: 'wrap', 
        gap: '12px' 
      }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {socialLinks}
        </div>
        <div style={{ 
          fontSize: '0.8rem', 
          color: '#6e6e73', 
          fontWeight: '500',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          <span>⚖️</span>
          <span>בקרת איכות ועמידה בדיני מדינת ישראל</span>
        </div>
      </div>
    </div>
  );
}
