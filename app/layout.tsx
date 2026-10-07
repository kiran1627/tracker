import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/components/providers/AuthProvider';
import { AppLayoutWrapper } from '@/components/layout/AppLayoutWrapper';

export const metadata: Metadata = {
  title: 'HabitFlow — Track Goals, Habits & Progress',
  description:
    'A premium personal habit tracker. Build goals, track daily habits and tasks, measure progress, and write daily reflections.',
  keywords: ['habit tracker', 'goal tracker', 'productivity', 'daily tasks', 'streak'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#F8FAFC] text-slate-900 min-h-screen">
        <AuthProvider>
          <AppLayoutWrapper>
            {children}
          </AppLayoutWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}
