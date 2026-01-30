import type { Metadata } from 'next';
import './globals.css';
import StoreProvider from '@/store/provider';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: 'E-Commerce Product Catalog',
  description: 'ALX ProDev Frontend Engineering capstone project',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <StoreProvider>
          <Toaster position="top-right" toastOptions={{ style: { background: '#2D2016', color: '#FAF7F2', fontSize: '14px', borderRadius: '12px' } }} />
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </StoreProvider>
      </body>
    </html>
  );
}
