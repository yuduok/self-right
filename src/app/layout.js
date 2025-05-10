import "./globals.css";
import { Inter } from 'next/font/google';

// Optimize font loading with proper subset
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata = {
  title: "Self-Right - Digital Identity Management",
  description: "A secure platform for digital identity management and verification",
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
  themeColor: '#ffffff',
};

export const viewport = {
  themeColor: '#ffffff',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={`font-sans ${inter.className}`}>
        {children}
      </body>
    </html>
  );
}
