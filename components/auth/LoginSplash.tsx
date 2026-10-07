'use client';

import { signIn } from 'next-auth/react';
import { Target, ArrowRight, CheckCircle2, Flame, BookOpen, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function LoginSplash() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Navigation */}
      <nav className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between animate-fade-in">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-sm">
            <Target className="w-5 h-5" />
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-900">HabitFlow</span>
        </div>
        <button 
          onClick={() => signIn('google')}
          className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors px-4 py-2"
        >
          Sign In
        </button>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 pt-20 pb-24 text-center animate-fade-in" style={{ animationDelay: '100ms' }}>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-semibold uppercase tracking-wider mb-8">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
          </span>
          Your Personal Command Center
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight max-w-4xl mx-auto mb-8 leading-[1.1]">
          Achieve your goals with <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-brand">relentless consistency.</span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-12 leading-relaxed">
          The premium planner that combines goal tracking, daily habits, and thoughtful reflections into one calm, focused workspace.
        </p>
        
        <button
          onClick={() => signIn('google')}
          className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-2xl font-semibold text-lg overflow-hidden transition-all hover:scale-105 hover:shadow-2xl hover:shadow-indigo-500/20"
        >
          <div className="absolute inset-0 bg-gradient-brand opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <svg className="w-5 h-5 relative z-10" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          <span className="relative z-10">Continue with Google</span>
          <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
        </button>

        {/* Feature Grid (Bento Box style) */}
        <div className="w-full max-w-5xl mx-auto mt-24 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <FeatureCard 
            icon={<Target className="w-6 h-6 text-indigo-500" />}
            title="Goal Mapping"
            description="Break down massive long-term goals into actionable daily tasks and repeatable habits."
          />
          <FeatureCard 
            icon={<Flame className="w-6 h-6 text-orange-500" />}
            title="Streak Tracking"
            description="Build unstoppable momentum. Our intelligent algorithm calculates your true consistency."
            delay="150ms"
          />
          <FeatureCard 
            icon={<BookOpen className="w-6 h-6 text-emerald-500" />}
            title="Daily Reflection"
            description="End each day with clarity. Journal your wins, track your mood, and prepare for tomorrow."
            delay="300ms"
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-slate-400 text-sm border-t border-slate-200">
        <p>© {new Date().getFullYear()} HabitFlow Tracker. All rights reserved.</p>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description, delay = '0ms' }: { icon: React.ReactNode, title: string, description: string, delay?: string }) {
  return (
    <div 
      className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow animate-fade-in"
      style={{ animationDelay: delay }}
    >
      <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center mb-6 border border-slate-100">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-800 mb-3">{title}</h3>
      <p className="text-slate-500 leading-relaxed">{description}</p>
    </div>
  );
}
