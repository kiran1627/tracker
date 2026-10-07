import { prisma } from '@/lib/prisma';
import { getCurrentUserId } from '@/lib/auth';
import { Trophy, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function AchievementsPage() {
  const userId = await getCurrentUserId();

  const [achievements, userAchievements, tasksCompleted, habitLogs, goalsCompleted] =
    await Promise.all([
      prisma.achievement.findMany({ orderBy: { threshold: 'asc' } }),
      prisma.userAchievement.findMany({
        where: { userId },
        include: { achievement: true },
      }),
      prisma.task.count({ where: { userId, completed: true } }),
      prisma.habitLog.count({ where: { habit: { userId }, completed: true } }),
      prisma.goal.count({ where: { userId, status: 'COMPLETED' } }),
    ]);

  const unlockedIds = new Set(userAchievements.map((ua) => ua.achievementId));

  // Auto-check and unlock achievements
  for (const ach of achievements) {
    if (unlockedIds.has(ach.id)) continue;

    let qualify = false;
    if (ach.type === 'TASKS' && tasksCompleted >= ach.threshold) qualify = true;
    if (ach.type === 'HABIT_LOGS' && habitLogs >= ach.threshold) qualify = true;
    if (ach.type === 'GOALS' && goalsCompleted >= ach.threshold) qualify = true;

    if (qualify) {
      await prisma.userAchievement.upsert({
        where: { userId_achievementId: { userId, achievementId: ach.id } },
        create: { userId, achievementId: ach.id },
        update: {},
      });
      unlockedIds.add(ach.id);
    }
  }

  const unlockedMap = new Map(userAchievements.map((ua) => [ua.achievementId, ua.unlockedAt]));

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Achievements</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          {unlockedIds.size} of {achievements.length} unlocked
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {achievements.map((ach) => {
          const isUnlocked = unlockedIds.has(ach.id);
          const unlockedAt = unlockedMap.get(ach.id);

          return (
            <div
              key={ach.id}
              className={cn(
                'card p-5 transition-all duration-200',
                isUnlocked
                  ? 'border-indigo-200 bg-gradient-to-br from-indigo-50/50 to-violet-50/50 hover:shadow-md'
                  : 'opacity-60',
              )}
            >
              <div className="flex items-start gap-4">
                <div
                  className={cn(
                    'w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0',
                    isUnlocked ? 'gradient-achievement' : 'bg-slate-100',
                  )}
                >
                  {isUnlocked ? ach.icon : <Lock className="w-5 h-5 text-slate-400" />}
                </div>
                <div className="min-w-0">
                  <p className={cn('font-semibold text-sm', isUnlocked ? 'text-slate-800' : 'text-slate-500')}>
                    {ach.name}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">{ach.description}</p>
                  {isUnlocked && unlockedAt && (
                    <p className="text-[11px] text-indigo-500 mt-1.5 font-medium">
                      ✓ Unlocked {unlockedAt.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </p>
                  )}
                  {!isUnlocked && (
                    <p className="text-[11px] text-slate-400 mt-1.5">{ach.requirement}</p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Stats */}
      <div className="card p-5">
        <h2 className="section-title mb-4">Your Stats</h2>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-3xl font-bold text-slate-800">{tasksCompleted}</p>
            <p className="text-xs text-slate-500 mt-1">Tasks completed</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-slate-800">{habitLogs}</p>
            <p className="text-xs text-slate-500 mt-1">Habit completions</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-slate-800">{goalsCompleted}</p>
            <p className="text-xs text-slate-500 mt-1">Goals achieved</p>
          </div>
        </div>
      </div>
    </div>
  );
}
