import React from 'react';
import Header from '@/app/components/Header';
import { experts } from '@/lib/experts';

export const metadata = {
  title: 'הוועדה המייעצת של פורטל JUS-TICE | סמכות ואמינות משפטית',
  description: 'חברי הוועדה המייעצת של JUS-TICE מוודאים כי התוכן המשפטי, מחשבוני הזכויות והכלים הדיגיטליים מבוקרים ומקצועיים. פגוש את המומחים שלנו.',
  alternates: {
    canonical: 'https://jus-tice.co.il/advisory-board',
  },
};

export default function AdvisoryBoardPage() {
  return (
    <div style={{ 
      backgroundColor: '#f5f5f7', 
      color: '#1d1d1f', 
      minHeight: '100vh', 
      direction: 'rtl', 
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' 
    }}>
      <Header />
      
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <span style={{ 
            fontSize: '0.85rem', 
            fontWeight: '700', 
            color: '#0066cc', 
            textTransform: 'uppercase', 
            letterSpacing: '1px',
            backgroundColor: 'rgba(0, 102, 204, 0.05)',
            padding: '6px 16px',
            borderRadius: '20px',
            display: 'inline-block',
            marginBottom: '16px'
          }}>
            בקרה מקצועית ועמידה בדין (E-E-A-T)
          </span>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '900', color: '#1d1d1f', margin: '0 0 16px 0', letterSpacing: '-0.5px' }}>
            הוועדה המייעצת של פורטל JUS-TICE
          </h1>
          <p style={{ fontSize: '1.15rem', color: '#6e6e73', maxWidth: '700px', margin: '0 auto', lineHeight: '1.6' }}>
            מערך המומחים שלנו מבצע פיקוח הדוק ומקצועי על המידע המשפטי, האלגוריתמים ומערכות הבינה המלאכותית באתר. אנו מציגים את נשות ואנשי המקצוע המובילים בתחומי המשפט, האופטימיזציה, האבטחה וחוויית המשתמש.
          </p>
        </div>

        {/* Responsive Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
          gap: '24px',
          padding: '12px 0'
        }}>
          {experts.map((expert) => {
            const isLawyer = !!expert.barId;
            return (
              <div 
                key={expert.id} 
                style={{
                  border: '1px solid rgba(255, 255, 255, 0.5)',
                  borderRadius: '20px',
                  padding: '28px',
                  background: 'rgba(255, 255, 255, 0.7)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '20px',
                  transition: 'transform 0.2s, box-shadow 0.2s'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div>
                      <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#1d1d1f', margin: '0 0 4px 0' }}>
                        {expert.name}
                      </h3>
                      <span style={{ 
                        fontSize: '0.85rem', 
                        color: '#0066cc', 
                        fontWeight: '700',
                        display: 'block'
                      }}>
                        {expert.specialty}
                      </span>
                    </div>
                    {isLawyer && (
                      <span style={{ 
                        backgroundColor: 'rgba(52, 199, 89, 0.1)', 
                        color: '#248a3d', 
                        fontSize: '0.75rem', 
                        fontWeight: '700', 
                        padding: '4px 10px', 
                        borderRadius: '12px'
                      }}>
                        רישיון לשכה #{expert.barId}
                      </span>
                    )}
                  </div>

                  <p style={{ 
                    fontSize: '0.9rem', 
                    color: '#48484a', 
                    lineHeight: '1.5',
                    margin: '12px 0 0 0'
                  }}>
                    {expert.credentials}
                  </p>
                </div>

                <div style={{ 
                  display: 'flex', 
                  gap: '10px',
                  borderTop: '1px solid rgba(0, 0, 0, 0.05)',
                  paddingTop: '16px',
                  marginTop: '8px'
                }}>
                  {expert.sameAs && (Array.isArray(expert.sameAs) ? expert.sameAs : [expert.sameAs]).map((link, idx) => {
                    let label = 'קישור חיצוני';
                    if (link.includes('wikipedia')) label = 'Wikipedia';
                    if (link.includes('linkedin')) label = 'LinkedIn';
                    if (link.includes('court.gov.il')) label = 'נט המשפט';
                    if (link.includes('israelbar.org.il')) label = 'לשכת עורכי הדין';
                    
                    return (
                      <a 
                        key={idx} 
                        href={link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{
                          fontSize: '0.75rem',
                          color: '#0066cc',
                          textDecoration: 'none',
                          fontWeight: '600',
                          backgroundColor: 'rgba(0, 102, 204, 0.05)',
                          padding: '4px 10px',
                          borderRadius: '6px'
                        }}
                      >
                        {label} &rarr;
                      </a>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <footer style={{ 
        padding: '40px 0', 
        backgroundColor: '#e8eaed', 
        color: '#1d1d1f', 
        borderTop: '1px solid rgba(0, 0, 0, 0.08)',
        marginTop: '80px',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '0.8rem', color: '#6e6e73' }}>
          © {new Date().getFullYear()} JUS-TICE. כל הזכויות שמורות.
        </div>
      </footer>
    </div>
  );
}
