'use client';

import { useSession } from 'next-auth/react';
import { Sidebar } from '@/components/layout/Sidebar';
import { MobileNav } from '@/components/layout/MobileNav';

export function AppLayoutWrapper({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  
  if (status === 'loading') {
    return <div className="min-h-screen bg-[#F8FAFC]" />;
  }

  if (!session) {
    return (
      <main className="w-full h-full min-h-screen bg-[#F8FAFC]">
        {children}
      </main>
    );
  }

  return (
    <>
      <div className="flex h-screen overflow-hidden">
        {/* Desktop sidebar */}
        <Sidebar />

        {/* Main content */}
        <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 lg:py-8">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile bottom navigation */}
      <MobileNav />
    </>
  );
}
