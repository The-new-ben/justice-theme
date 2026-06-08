import { getAllLocalHubs } from '@/lib/wordpress';
import Header from '@/app/components/Header';
import Breadcrumbs from '@/app/components/Breadcrumbs';
import Link from 'next/link';

export const metadata = {
  title: 'תחומי התמחות משפטית | JUS-TICE',
  description: 'ריכוז תחומי ההתמחות המשפטיים המובילים. קראו מדריכים מקיפים, חשבו את זכויותיכם וצרו קשר עם עורכי דין מומחים ומורשים.',
  alternates: {
    canonical: 'https://jus-tice.co.il/practice-areas',
  },
};

export default async function PracticeAreasIndexPage() {
  const hubs = getAllLocalHubs();

  const breadcrumbItems = [
    { name: 'בית', href: '/' },
    { name: 'תחומי התמחות', href: '/practice-areas' }
  ];

  return (
    <div style={{ backgroundColor: '#f5f5f7', color: '#1d1d1f', minHeight: '100vh', direction: 'rtl' }}>
      <Header />
      
      <main style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 24px' }}>
        <Breadcrumbs items={breadcrumbItems} />

        <h1 style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '16px' }}>תחומי התמחות משפטית</h1>
        <p style={{ color: '#6e6e73', fontSize: '1.1rem', marginBottom: '32px', lineHeight: '1.6' }}>
          אנו מציגים בפניכם את תחומי הטיפול המרכזיים של פורטל JUS-TICE. צוות האתר ועורכי הדין של הוועדה המייעצת מנגישים עבורכם מידע משפטי מדויק, מדריכים מפורטים ומחשבוני זכויות דיגיטליים.
        </p>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
          gap: '24px', 
          marginTop: '24px' 
        }}>
          {hubs.map((hub) => (
            <div 
              key={hub.category} 
              style={{ 
                background: '#ffffff', 
                padding: '30px', 
                borderRadius: '16px', 
                border: '1px solid rgba(0, 0, 0, 0.04)', 
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'space-between',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.01)',
                transition: 'transform 0.2s, box-shadow 0.2s'
              }}
            >
              <div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: '800', margin: '0 0 12px 0', color: '#1d1d1f' }}>
                  {hub.title}
                </h2>
                <p style={{ color: '#48484a', fontSize: '0.95rem', margin: '0 0 24px 0', lineHeight: '1.6' }}>
                  {hub.content}
                </p>
              </div>
              
              <Link 
                href={`/practice-areas/${hub.category}`} 
                style={{
                  alignSelf: 'flex-start',
                  backgroundColor: '#0066cc',
                  color: '#ffffff',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontWeight: '700',
                  fontSize: '0.9rem',
                  transition: 'background-color 0.2s'
                }}
              >
                קראו עוד וחשבו זכויות
              </Link>
            </div>
          ))}
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
