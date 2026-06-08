import { getLocalLawyer, getAllLawyers } from '@/lib/wordpress';
import { notFound } from 'next/navigation';
import Header from '@/app/components/Header';
import Breadcrumbs from '@/app/components/Breadcrumbs';
import Link from 'next/link';

export const dynamicParams = false;

export async function generateStaticParams() {
  const lawyers = await getAllLawyers();
  return lawyers.map((lawyer) => ({
    slug: lawyer.slug,
  }));
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const lawyer = getLocalLawyer(resolvedParams.slug);
  if (!lawyer) return { title: 'עורך דין לא נמצא | JUS-TICE' };

  return {
    title: `${lawyer.title} | פורטל משפטי JUS-TICE`,
    description: `כרטיס ביקור ופרופיל מקצועי של ${lawyer.title}. פרטים, תחומי עיסוק ורישיון בלשכת עורכי הדין.`,
    alternates: {
      canonical: `https://jus-tice.co.il/lawyers/${lawyer.slug}`,
    },
  };
}

export default async function LawyerProfilePage({ params }) {
  const resolvedParams = await params;
  const lawyer = getLocalLawyer(resolvedParams.slug);

  if (!lawyer) {
    notFound();
  }

  const breadcrumbItems = [
    { name: 'בית', href: '/' },
    { name: 'אינדקס עורכי דין', href: '/lawyers' },
    { name: lawyer.title, href: `/lawyers/${lawyer.slug}` }
  ];

  // Structuring the E-E-A-T Person/LegalService schema
  const lawyerSchema = {
    '@context': 'https://schema.org',
    '@type': 'Attorney',
    'name': lawyer.title,
    'description': lawyer.content,
    'url': `https://jus-tice.co.il/lawyers/${lawyer.slug}`,
    'image': 'https://jus-tice.co.il/lawyer_male_premium.png', // Fallback image representation
    'address': {
      '@type': 'PostalAddress',
      'addressLocality': 'תל אביב',
      'addressCountry': 'IL'
    }
  };

  return (
    <div style={{ backgroundColor: '#f5f5f7', color: '#1d1d1f', minHeight: '100vh', direction: 'rtl' }}>
      <Header />
      
      <main style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 24px' }}>
        <Breadcrumbs items={breadcrumbItems} />

        <div style={{ background: '#ffffff', padding: '40px', borderRadius: '16px', border: '1px solid rgba(0, 0, 0, 0.04)', marginTop: '20px' }}>
          <div style={{ display: 'flex', gap: '24px', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap' }}>
            <div style={{
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              backgroundColor: '#0066cc',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2.5rem',
              fontWeight: '900'
            }}>
              ⚖️
            </div>
            <div>
              <h1 style={{ fontSize: '2.2rem', fontWeight: '900', margin: '0 0 8px 0' }}>{lawyer.title}</h1>
              <div style={{ color: '#0066cc', fontWeight: 'bold', fontSize: '1.1rem' }}>עורך דין מוסמך</div>
              <div style={{ color: '#6e6e73', fontSize: '0.9rem', marginTop: '4px' }}>חבר לשכת עורכי הדין בישראל</div>
            </div>
          </div>

          <h3 style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '16px' }}>ביוגרפיה וניסיון מקצועי</h3>
          <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#1d1d1f', margin: 0 }}>
            {lawyer.content}
          </p>

          <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
            <Link 
              href={`/contact?lawyer=${encodeURIComponent(lawyer.title)}`}
              style={{
                display: 'inline-block',
                backgroundColor: '#0066cc',
                color: '#ffffff',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '8px',
                fontWeight: '700',
                fontSize: '0.95rem',
                cursor: 'pointer',
                textDecoration: 'none'
              }}
            >
              צור קשר ישיר לייעוץ משפטי
            </Link>
          </div>
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

      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(lawyerSchema) }}
      />
    </div>
  );
}
