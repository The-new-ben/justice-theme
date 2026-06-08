import { Rubik } from "next/font/google";
import "./globals.css";

const rubik = Rubik({
  variable: "--font-rubik",
  subsets: ["hebrew", "latin"],
});

export const metadata = {
  metadataBase: new URL('https://jus-tice.co.il'),
  title: "Jus-Tice | פורטל משפטי ופתרונות AI לעורכי דין ומיוצגים",
  description: "פורטל המשפט המוביל בישראל. הערכת סיכויי תביעה מבוססת בינה מלאכותית, חיבור מהיר לעורכי דין מומחים וייצוג משפטי מוביל.",
  alternates: {
    canonical: '/',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="he" dir="rtl" className={`${rubik.variable}`}>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
