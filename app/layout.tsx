import type { Metadata } from 'next';
import './globals.css';
import { Sidebar } from '@/components/layout/Sidebar';
import { MobileNav } from '@/components/layout/MobileNav';
import { AuthProvider } from '@/components/providers/AuthProvider';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const metadata: Metadata = {
  title: 'HabitFlow — Track Goals, Habits & Progress',
  description:
    'A premium personal habit tracker. Build goals, track daily habits and tasks, measure progress, and write daily reflections.',
  keywords: ['habit tracker', 'goal tracker', 'productivity', 'daily tasks', 'streak'],
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body className="bg-[#F8FAFC] text-slate-900 min-h-screen">
        <AuthProvider>
          {session ? (
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
          ) : (
            <main className="w-full h-full min-h-screen bg-[#F8FAFC]">
              {children}
            </main>
          )}
        </AuthProvider>
      </body>
    </html>
  );
}
