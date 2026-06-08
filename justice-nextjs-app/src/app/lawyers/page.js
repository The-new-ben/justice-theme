import { getAllLawyers } from '@/lib/wordpress';
import Header from '@/app/components/Header';
import Breadcrumbs from '@/app/components/Breadcrumbs';

export const metadata = {
  title: 'אינדקס עורכי דין מורשים | JUS-TICE',
  description: 'מדריך עורכי הדין המובילים והמורשים בישראל. מצא עורך דין מומחה לפי תחום התמחות משפטית.',
  alternates: {
    canonical: 'https://jus-tice.co.il/lawyers',
  },
};

export default async function LawyersDirectoryHubPage() {
  const lawyersList = await getAllLawyers();

  const breadcrumbItems = [
    { name: 'בית', href: '/' },
    { name: 'אינדקס עורכי דין', href: '/lawyers' }
  ];

  return (
    <div style={{ backgroundColor: '#f5f5f7', color: '#1d1d1f', minHeight: '100vh', direction: 'rtl' }}>
      <Header />
      
      <main style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 24px' }}>
        <Breadcrumbs items={breadcrumbItems} />

        <h1 style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '16px' }}>אינדקס עורכי דין מורשים</h1>
        <p style={{ color: '#6e6e73', fontSize: '1.1rem', marginBottom: '32px' }}>
          הקבוצה הנבחרת של עורכי הדין בפורטל JUS-TICE. כולם חברים פעילים בלשכת עורכי הדין בישראל ועוברים בקרת איכות תקופתית.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {lawyersList.map((lawyer) => (
            <div key={lawyer.slug} style={{ background: '#ffffff', padding: '30px', borderRadius: '16px', border: '1px solid rgba(0, 0, 0, 0.04)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
              <div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: '800', margin: '0 0 8px 0' }}>{lawyer.title}</h3>
                <p style={{ color: '#6e6e73', fontSize: '0.9rem', margin: '0 0 12px 0' }}>{lawyer.excerpt}</p>
              </div>
              <a href={`/lawyers/${lawyer.slug}`} style={{
                backgroundColor: '#0066cc',
                color: '#ffffff',
                padding: '10px 20px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: '700',
                fontSize: '0.9rem'
              }}>
                צפה בפרופיל
              </a>
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
