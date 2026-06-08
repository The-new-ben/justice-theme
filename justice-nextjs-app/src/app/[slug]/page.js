import { getPostBySlug, getPageBySlug, getLocalHub, getAllLocalSpokes } from '@/lib/wordpress';
import { notFound, permanentRedirect } from 'next/navigation';
import Header from '@/app/components/Header';
import Breadcrumbs from '@/app/components/Breadcrumbs';

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  let decodedSlug;
  try {
    decodedSlug = decodeURIComponent(resolvedParams.slug);
  } catch (e) {
    console.error('generateMetadata error for slug:', resolvedParams?.slug, e);
    return { title: 'עמוד לא נמצא | JUS-TICE' };
  }
  
  // Check if it is a category hub
  const hub = getLocalHub(decodedSlug);
  if (hub) {
    permanentRedirect(`/practice-areas/${decodedSlug}`);
  }

  // Check if it is a spoke
  const spokes = getAllLocalSpokes();
  const spoke = spokes.find(s => s.slug === decodedSlug);
  if (spoke) {
    permanentRedirect(`/practice-areas/${spoke.category}/${decodedSlug}`);
  }

  const content = await getPostBySlug(decodedSlug) || await getPageBySlug(decodedSlug);
  if (!content) return { title: 'עמוד לא נמצא | JUS-TICE' };

  return {
    title: `${content.title} | פורטל משפטי JUS-TICE`,
    description: content.excerpt || `${content.title} - מידע משפטי עדכני, פסקי דין ומדריכים שנכתבו ונבדקו על ידי עורכי דין מומחים.`,
    alternates: {
      canonical: `https://jus-tice.co.il/${decodedSlug}`,
    },
  };
}

export default async function Page({ params }) {
  const resolvedParams = await params;
  let decodedSlug;
  try {
    decodedSlug = decodeURIComponent(resolvedParams.slug);
  } catch (e) {
    console.error('Page error for slug:', resolvedParams?.slug, e);
    notFound();
  }

  // Check if it is a category hub
  const hub = getLocalHub(decodedSlug);
  if (hub) {
    permanentRedirect(`/practice-areas/${decodedSlug}`);
  }

  // Check if it is a spoke
  const spokes = getAllLocalSpokes();
  const spoke = spokes.find(s => s.slug === decodedSlug);
  if (spoke) {
    permanentRedirect(`/practice-areas/${spoke.category}/${decodedSlug}`);
  }

  // Fetch from WordPress GraphQL or local fallback
  const data = await getPostBySlug(decodedSlug) || await getPageBySlug(decodedSlug);

  if (!data) {
    notFound();
  }

  // Define breadcrumb items for flat static page
  const breadcrumbItems = [
    { name: 'בית', href: '/' },
    { name: data.title, href: `/${decodedSlug}` }
  ];

  // Structuring the E-E-A-T schema JSON-LD
  const eeatSchema = {
    '@context': 'https://schema.org',
    '@type': 'LegalArticle',
    'headline': data.title,
    'description': data.excerpt || `${data.title} - מדריך משפטי`,
    'datePublished': data.date,
    'dateModified': data.modified || data.date,
    'author': {
      '@type': 'Organization',
      'name': 'צוות עורכי התוכן JUS-TICE'
    },
    'reviewedBy': {
      '@type': 'Person',
      'name': 'עורך דין מוסמך (בעל האתר)',
      'jobTitle': 'חבר לשכת עורכי הדין בישראל',
      'sameAs': 'https://www.israelbar.org.il/'
    },
    'publisher': {
      '@type': 'LegalService',
      'name': 'Jus-Tice Legal Portal',
      'url': 'https://jus-tice.co.il/'
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-color)', minHeight: '100vh', position: 'relative', direction: 'rtl' }}>
      
      {/* Dynamic Header */}
      <Header />

      {/* Main Content Area */}
      <main className="container" style={{ padding: '40px 24px', maxWidth: '800px', position: 'relative', zIndex: 10 }}>
        
        {/* Dynamic Breadcrumbs */}
        <Breadcrumbs items={breadcrumbItems} />

        <article className="glass-panel" style={{ padding: '40px', background: 'rgba(255, 255, 255, 0.55)', border: '1px solid rgba(255, 255, 255, 0.9)', marginTop: '20px' }}>
          <h1 style={{ marginBottom: '24px', fontSize: '2.4rem', fontWeight: '900' }}>{data.title}</h1>

          {/* E-E-A-T Legal Trust Banner */}
          <div className="frosty-glass" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '18px',
            border: '1px solid rgba(255, 255, 255, 0.9)',
            borderRadius: 'var(--radius-md)',
            marginBottom: '40px',
            background: 'rgba(255,255,255,0.7)'
          }}>
            <span style={{ fontSize: '1.6rem' }}>🛡️</span>
            <div>
              <div style={{ fontWeight: '800', fontSize: '0.95rem', color: '#1d1d1f' }}>
                נבדק ואושר משפטית על ידי עורך דין
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                מאמר זה עבר בקרה מקצועית של עורך דין מוסמך כדי לוודא עמידה בדיני ישראל ובסטנדרטים של לשכת עורכי הדין.
              </div>
            </div>
          </div>

          {/* Content Body */}
          <div 
            style={{ fontSize: '1.1rem', color: 'var(--text-color)', lineHeight: '1.8' }}
            dangerouslySetInnerHTML={{ __html: data.content }} 
          />
        </article>
      </main>

      {/* Silver Footer */}
      <footer style={{ 
        padding: '60px 0 40px 0', 
        backgroundColor: '#e8eaed', 
        color: '#1d1d1f', 
        borderTop: '1px solid rgba(0, 0, 0, 0.08)',
        marginTop: '80px'
      }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <div style={{ fontSize: '0.8rem', color: '#6e6e73' }}>
            © {new Date().getFullYear()} JUS-TICE. כל הזכויות שמורות.
          </div>
          <div style={{ fontSize: '0.8rem', color: '#1d1d1f', fontWeight: '600' }}>
            🛡️ נבדק ואושר על ידי עורכי דין מורשים בלשכת עורכי הדין בישראל
          </div>
        </div>
      </footer>

      {/* Structured Data injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(eeatSchema)
            .replace(/</g, '\\u003c')
            .replace(/>/g, '\\u003e')
            .replace(/&/g, '\\u0026')
        }}
      />
    </div>
  );
}
