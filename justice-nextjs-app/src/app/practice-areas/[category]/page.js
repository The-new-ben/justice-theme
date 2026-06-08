import { getLocalHub, getAllLocalHubs } from '@/lib/wordpress';
import { getApprovedReviews } from '@/lib/reviews';
import { notFound } from 'next/navigation';
import Header from '@/app/components/Header';
import Breadcrumbs from '@/app/components/Breadcrumbs';
import { experts } from '@/lib/experts';
import ReviewingExpert from '@/app/components/ReviewingExpert';


function getRoleLabel(role) {
  const mapping = {
    'Client': 'לקוח משרד',
    'Colleague': 'קולגה למקצוע',
    'Google': 'חוות דעת Google'
  };
  return mapping[role] || role;
}

export const dynamicParams = false;

// Generate static params for all 6 categories
export async function generateStaticParams() {
  const hubs = getAllLocalHubs();
  return hubs.map((hub) => ({
    category: hub.category,
  }));
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const hub = getLocalHub(resolvedParams.category);
  if (!hub) return { title: 'קטגוריה לא נמצאה | JUS-TICE' };

  return {
    title: `${hub.title} | פורטל משפטי JUS-TICE`,
    description: `מחפש ${hub.title}? מידע משפטי מקיף, בדיקת זכויות, מדריכים שעורכי דין מורשים כתבו ובדקו.`,
    alternates: {
      canonical: `https://jus-tice.co.il/practice-areas/${hub.category}`,
    },
  };
}

export default async function PracticeAreaHubPage({ params }) {
  const resolvedParams = await params;
  const hub = getLocalHub(resolvedParams.category);

  if (!hub) {
    notFound();
  }

  // Look up expert dynamically from our experts database
  const expert = experts.find((e) => e.category.includes(resolvedParams.category)) || hub.expert;

  // Get approved reviews to show on page
  const { reviews = [], aggregateRating = {} } = (await getApprovedReviews()) || {};

  // Define breadcrumb hierarchy
  const breadcrumbItems = [
    { name: 'בית', href: '/' },
    { name: 'תחומי התמחות', href: '/practice-areas' },
    { name: hub.title, href: `/practice-areas/${hub.category}` }
  ];

  const publisher = {
    '@type': 'LegalService',
    'name': 'Jus-Tice Legal Portal',
    'url': 'https://jus-tice.co.il/'
  };

  if (aggregateRating && aggregateRating.reviewCount > 0) {
    publisher.aggregateRating = {
      '@type': 'AggregateRating',
      'ratingValue': Number(aggregateRating.ratingValue),
      'reviewCount': Number(aggregateRating.reviewCount)
    };
  }

  if (reviews && reviews.length > 0) {
    publisher.review = reviews.slice(0, 3).map(r => ({
      '@type': 'Review',
      'author': {
        '@type': 'Person',
        'name': r.reviewer_name
      },
      'reviewRating': {
        '@type': 'Rating',
        'ratingValue': Number(r.rating)
      },
      'reviewBody': r.content,
      'datePublished': r.created_at
    }));
  }

  // Structuring E-E-A-T LegalArticle & reviewedBy JSON-LD schema
  const eeatSchema = {
    '@context': 'https://schema.org',
    '@type': 'LegalArticle',
    'headline': hub.title,
    'description': `${hub.title} - מדריך ומידע משפטי מוסמך`,
    'datePublished': hub.date,
    'dateModified': hub.modified || hub.date,
    'author': {
      '@type': 'Organization',
      'name': 'Jus-Tice Editorial'
    },
    'reviewedBy': {
      '@type': 'Person',
      'name': expert.name,
      'jobTitle': 'עורך דין מוסמך',
      'sameAs': expert.sameAs,
      'description': `${expert.credentials} - מספר רישיון לשכה ${expert.barId}`
    },
    'publisher': publisher
  };

  return (
    <div style={{ backgroundColor: '#f5f5f7', color: '#1d1d1f', minHeight: '100vh', direction: 'rtl' }}>
      <Header />
      
      <main style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 24px' }}>
        {/* Dynamic Breadcrumbs */}
        <Breadcrumbs items={breadcrumbItems} />

        {/* E-E-A-T Trust Banner */}
        <ReviewingExpert expert={expert} />

        {/* Article content */}
        <article style={{ background: '#ffffff', padding: '40px', borderRadius: '16px', border: '1px solid rgba(0, 0, 0, 0.04)' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '24px' }}>{hub.title}</h1>
          
          <div style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#1d1d1f' }}>
            {hub.content}
          </div>
        </article>

        {/* E-E-A-T Advisory Board Information */}
        <section style={{ marginTop: '48px', background: '#ffffff', padding: '32px', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.04)' }}>
          <h3 style={{ fontSize: '1.4rem', fontWeight: '900', marginBottom: '16px' }}>הוועדה המייעצת של פורטל JUS-TICE</h3>
          <p style={{ fontSize: '0.95rem', color: '#6e6e73', lineHeight: '1.6', marginBottom: '20px' }}>
            עורכי דין מורשים בלשכת עורכי הדין בישראל מבקרים את כל המידע המשפטי, מחשבוני הזכויות וסוכני הבינה המלאכותית באתר כדי להבטיח את הדיוק הגבוה ביותר.
          </p>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: '#e8eaed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: '#0066cc'
            }}>
              ⚖️
            </div>
            <div>
              <div style={{ fontWeight: '800', color: '#1d1d1f' }}>{expert.name}</div>
              <div style={{ fontSize: '0.8rem', color: '#6e6e73' }}>
                יועץ מומחה, חבר הוועדה המייעצת בתחום {hub.category}
              </div>
              <a href={`/lawyers/${expert.slug || expert.id}`} style={{ fontSize: '0.8rem', color: '#0066cc', textDecoration: 'none', display: 'inline-block', marginTop: '4px' }}>
                צפה בפרופיל המלא &larr;
              </a>
            </div>
          </div>
        </section>

        {/* Reviews Section */}
        <section style={{ marginTop: '48px' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '900', marginBottom: '24px' }}>המלצות וביקורות לקוחות</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {reviews.length > 0 ? (
              reviews.slice(0, 3).map((review) => (
                <div key={review.id} className="glass-panel" style={{ padding: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontWeight: '800', fontSize: '0.95rem' }}>{review.reviewer_name}</span>
                      <span style={{
                        fontSize: '0.75rem',
                        backgroundColor: 'rgba(0, 0, 0, 0.05)',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        color: '#1d1d1f',
                        fontWeight: '600'
                      }}>{getRoleLabel(review.reviewer_role)}</span>
                    </div>
                    <span style={{ color: '#3a3a3c' }}>{'★'.repeat(review.rating)}</span>
                  </div>
                  <p style={{ fontSize: '0.9rem', color: '#48484a', margin: 0, lineHeight: '1.6' }}>{review.content}</p>
                </div>
              ))
            ) : (
              <p style={{ color: '#6e6e73' }}>אין ביקורות להצגה בשלב זה.</p>
            )}
          </div>
        </section>
      </main>

      {/* Footer */}
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eeatSchema) }}
      />
    </div>
  );
}
