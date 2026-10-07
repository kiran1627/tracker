'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  CheckSquare,
  Target,
  Calendar,
  TrendingUp,
  BookOpen,
  Trophy,
  Settings,
  Flame,
  Zap,
  LogOut,
  LogIn,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSession, signIn, signOut } from 'next-auth/react';
import { FocusTimer } from '@/components/ui/FocusTimer';

const navItems = [
  { href: '/dashboard', label: 'Today', icon: LayoutDashboard },
  { href: '/habits', label: 'Habits', icon: Flame },
  { href: '/goals', label: 'Goals', icon: Target },
  { href: '/tasks', label: 'Tasks', icon: CheckSquare },
  { href: '/calendar', label: 'Calendar', icon: Calendar },
  { href: '/progress', label: 'Progress', icon: TrendingUp },
  { href: '/notes', label: 'Notes', icon: BookOpen },
  { href: '/achievements', label: 'Achievements', icon: Trophy },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  return (
    <aside className="hidden md:flex flex-col w-60 border-r border-slate-200 bg-white h-screen sticky top-0 flex-shrink-0">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl gradient-brand flex items-center justify-center flex-shrink-0">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800 leading-tight">HabitFlow</p>
            <p className="text-[11px] text-slate-400">Stay consistent. Win.</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn('nav-item', isActive && 'active')}
            >
              <Icon className={cn('w-4 h-4 flex-shrink-0', isActive ? 'text-indigo-600' : 'text-slate-400')} />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Focus Timer */}
      <FocusTimer />

      {/* Bottom user info */}
      <div className="px-5 py-4 border-t border-slate-100">
        {status === 'loading' ? (
          <div className="animate-pulse flex items-center gap-3">
            <div className="w-8 h-8 bg-slate-200 rounded-full" />
            <div className="space-y-2 flex-1">
              <div className="h-3 bg-slate-200 rounded w-1/2" />
              <div className="h-2 bg-slate-200 rounded w-3/4" />
            </div>
          </div>
        ) : session?.user ? (
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-3 min-w-0">
              {session.user.image ? (
                <img src={session.user.image} alt="User" className="w-8 h-8 rounded-full flex-shrink-0" />
              ) : (
                <div className="w-8 h-8 rounded-full gradient-brand flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                  {session.user.name?.[0]?.toUpperCase() || 'U'}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-700 truncate">{session.user.name}</p>
                <p className="text-[10px] text-slate-400 truncate">{session.user.email}</p>
              </div>
            </div>
            <button
              onClick={() => signOut()}
              className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => signIn('google')}
            className="w-full flex items-center justify-center gap-2 btn-primary py-2"
          >
            <LogIn className="w-4 h-4" /> Sign In
          </button>
        )}
      </div>
    </aside>
  );
}
