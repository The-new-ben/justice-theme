import React from 'react';

export default function Breadcrumbs({ items }) {
  const domain = 'https://jus-tice.co.il';
  
  // Format items for Schema.org BreadcrumbList
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': items.map((item, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'name': item.name,
      'item': item.href ? (item.href.startsWith('http') ? item.href : `${domain}${item.href}`) : domain,
    })),
  };

  return (
    <div style={{ direction: 'rtl', margin: '16px 0', fontSize: '0.85rem', color: '#6e6e73', fontWeight: '500' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <React.Fragment key={index}>
              {index > 0 && <span style={{ color: '#86868b' }}>&gt;</span>}
              {isLast ? (
                <span style={{ color: '#1d1d1f', fontWeight: '600' }}>{item.name}</span>
              ) : (
                <a href={item.href} style={{ color: '#0066cc', textDecoration: 'none' }}>
                  {item.name}
                </a>
              )}
            </React.Fragment>
          );
        })}
      </div>
      
      {/* Structured Data injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </div>
  );
}
