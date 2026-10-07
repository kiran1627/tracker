import { prisma } from '@/lib/prisma';
import { getCurrentUserId } from '@/lib/auth';
import { User, Database, Info } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  const userId = await getCurrentUserId();
  const user = await prisma.user.findFirst({ where: { id: userId } });

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Settings</h1>
        <p className="text-sm text-slate-500 mt-0.5">Manage your account and preferences</p>
      </div>

      {/* Profile */}
      <div className="card p-5">
        <div className="flex items-center gap-3 mb-4">
          <User className="w-4 h-4 text-indigo-500" />
          <h2 className="section-title">Profile</h2>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl gradient-brand flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
            {user?.name?.[0]?.toUpperCase() ?? 'U'}
          </div>
          <div>
            <p className="text-lg font-semibold text-slate-800">{user?.name}</p>
            <p className="text-sm text-slate-400">{user?.email}</p>
            <p className="text-xs text-slate-400 mt-1">
              Member since {user?.createdAt?.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>
      </div>

      {/* Database */}
      <div className="card p-5">
        <div className="flex items-center gap-3 mb-4">
          <Database className="w-4 h-4 text-indigo-500" />
          <h2 className="section-title">Database</h2>
        </div>
        <div className="space-y-2 text-sm text-slate-600">
          <p>Your data is stored in PostgreSQL via Prisma ORM.</p>
          <p className="text-xs text-slate-400">
            Run <code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs font-mono">npx prisma studio</code> to view raw data.
          </p>
        </div>
      </div>

      {/* Info */}
      <div className="card p-5">
        <div className="flex items-center gap-3 mb-4">
          <Info className="w-4 h-4 text-indigo-500" />
          <h2 className="section-title">About</h2>
        </div>
        <div className="space-y-1 text-sm text-slate-600">
          <p><span className="font-medium">App:</span> HabitFlow</p>
          <p><span className="font-medium">Stack:</span> Next.js 14 · TypeScript · Tailwind · Prisma · PostgreSQL</p>
          <p><span className="font-medium">Version:</span> 1.0.0</p>
        </div>
      </div>
    </div>
  );
}
