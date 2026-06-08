import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      textAlign: 'center',
      fontFamily: 'sans-serif',
      direction: 'rtl',
      padding: '20px'
    }}>
      <h1 style={{ fontSize: '3rem', margin: '0 0 10px 0' }}>404</h1>
      <h2 style={{ fontSize: '1.5rem', margin: '0 0 20px 0' }}>העמוד לא נמצא</h2>
      <p style={{ margin: '0 0 20px 0', color: '#666' }}>מצטערים, העמוד שחיפשת אינו קיים במערכת.</p>
      <Link href="/" style={{
        color: '#0066cc',
        textDecoration: 'none',
        fontWeight: 'bold'
      }}>
        חזרה לדף הבית
      </Link>
    </div>
  );
}
