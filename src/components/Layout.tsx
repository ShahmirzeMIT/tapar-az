import type { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
import AdRail from './AdRail';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background transition-colors duration-200">
      <Header />
      <main className="mx-auto flex w-full max-w-[1680px] flex-1 items-start gap-5 px-4 pb-20 md:pb-0">
        <AdRail side="left" />
        <div className="min-w-0">{children}</div>
        <AdRail side="right" />
      </main>
      <Footer />
    </div>
  );
}
