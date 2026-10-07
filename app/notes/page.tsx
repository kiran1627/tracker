import { prisma } from '@/lib/prisma';
import { getCurrentUserId } from '@/lib/auth';
import { NotesClient } from '@/components/notes/NotesClient';

export const dynamic = 'force-dynamic';

export default async function NotesPage() {
  const userId = await getCurrentUserId();

  const notes = await prisma.dailyNote.findMany({
    where: { userId },
    orderBy: { date: 'desc' },
    take: 30,
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Daily Notes</h1>
        <p className="text-sm text-slate-500 mt-0.5">Your reflections and learnings</p>
      </div>
      <NotesClient notes={notes} />
    </div>
  );
}
