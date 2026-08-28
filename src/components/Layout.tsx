import type { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background transition-colors duration-200">
      <Header />
      <main className="flex-1 pb-20 md:pb-0">{children}</main>
      <Footer />
    </div>
  );
}
