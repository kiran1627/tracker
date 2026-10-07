import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Seed for the logged-in user
  const user = await prisma.user.upsert({
    where: { email: 'kiranbabub18@gmail.com' },
    update: {},
    create: {
      name: 'Kiran',
      email: 'kiranbabub18@gmail.com',
    },
  });

  console.log('Created user:', user.name);

  // Seed achievements
  const achievements = [
    {
      name: 'First Step',
      description: 'Complete your first task',
      icon: '🎯',
      requirement: 'Complete 1 task',
      type: 'TASKS',
      threshold: 1,
    },
    {
      name: 'Week Warrior',
      description: 'Maintain a 7-day streak',
      icon: '🔥',
      requirement: '7 day streak',
      type: 'STREAK',
      threshold: 7,
    },
    {
      name: 'Month Master',
      description: 'Maintain a 30-day streak',
      icon: '🏆',
      requirement: '30 day streak',
      type: 'STREAK',
      threshold: 30,
    },
    {
      name: 'Century Club',
      description: 'Complete 100 tasks',
      icon: '💯',
      requirement: 'Complete 100 tasks',
      type: 'TASKS',
      threshold: 100,
    },
    {
      name: 'Goal Crusher',
      description: 'Complete your first goal',
      icon: '🎯',
      requirement: 'Complete 1 goal',
      type: 'GOALS',
      threshold: 1,
    },
    {
      name: 'Consistency King',
      description: 'Achieve 90% weekly consistency',
      icon: '👑',
      requirement: '90% weekly completion rate',
      type: 'CONSISTENCY',
      threshold: 90,
    },
    {
      name: 'Habit Former',
      description: 'Complete a habit 30 times',
      icon: '💪',
      requirement: '30 habit completions',
      type: 'HABIT_LOGS',
      threshold: 30,
    },
    {
      name: 'Month Tracker',
      description: 'Track activity for 30 days',
      icon: '📅',
      requirement: '30 days tracked',
      type: 'DAYS_TRACKED',
      threshold: 30,
    },
  ];

  for (const achievement of achievements) {
    await prisma.achievement.upsert({
      where: { name: achievement.name },
      update: {},
      create: achievement,
    });
  }

  console.log('Seeded achievements:', achievements.length);

  // Create sample goals
  const goal1 = await prisma.goal.upsert({
    where: { id: 'goal-1' },
    update: {},
    create: {
      id: 'goal-1',
      userId: user.id,
      title: 'Become Job Ready',
      description: 'Prepare for software engineering interviews with DSA, Python, and system design.',
      category: 'CAREER',
      targetDate: new Date('2026-12-31'),
    },
  });

  const goal2 = await prisma.goal.upsert({
    where: { id: 'goal-2' },
    update: {},
    create: {
      id: 'goal-2',
      userId: user.id,
      title: 'Build Portfolio',
      description: 'Create 3 full-stack projects to showcase skills.',
      category: 'PROJECTS',
      targetDate: new Date('2026-11-30'),
    },
  });

  console.log('Created goals:', goal1.title, goal2.title);

  // Create sample habits
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const habits = [
    {
      id: 'habit-1',
      userId: user.id,
      goalId: goal1.id,
      title: 'Solve DSA Problems',
      description: 'Solve at least 2 problems on LeetCode',
      frequency: 'DAILY' as const,
      target: 2,
      unit: 'problems',
      color: '#6366F1',
      icon: '🧠',
    },
    {
      id: 'habit-2',
      userId: user.id,
      goalId: goal1.id,
      title: 'Study Python / FastAPI',
      description: 'Watch tutorials and build features',
      frequency: 'WEEKDAYS' as const,
      target: 60,
      unit: 'minutes',
      color: '#8B5CF6',
      icon: '🐍',
    },
    {
      id: 'habit-3',
      userId: user.id,
      goalId: goal1.id,
      title: 'System Design',
      description: 'Study one system design concept',
      frequency: 'WEEKDAYS' as const,
      target: 1,
      unit: 'concepts',
      color: '#3B82F6',
      icon: '🏗️',
    },
    {
      id: 'habit-4',
      userId: user.id,
      goalId: undefined,
      title: 'Exercise',
      description: 'Daily workout or walk',
      frequency: 'DAILY' as const,
      target: 30,
      unit: 'minutes',
      color: '#22C55E',
      icon: '🏃',
    },
  ];

  for (const habit of habits) {
    await prisma.habit.upsert({
      where: { id: habit.id },
      update: {},
      create: habit,
    });
  }

  console.log('Created habits:', habits.length);

  // Create sample tasks for today
  const todayDate = new Date();
  todayDate.setHours(0, 0, 0, 0);

  const tasks = [
    {
      id: 'task-1',
      userId: user.id,
      goalId: goal1.id,
      title: 'Solve Two Sum problem',
      description: 'LeetCode #1 - Practice array hashing',
      date: todayDate,
      priority: 'HIGH' as const,
      estimatedMin: 45,
    },
    {
      id: 'task-2',
      userId: user.id,
      goalId: goal1.id,
      title: 'Build FastAPI CRUD endpoint',
      description: 'Create a complete REST API with Pydantic validation',
      date: todayDate,
      priority: 'HIGH' as const,
      estimatedMin: 90,
    },
    {
      id: 'task-3',
      userId: user.id,
      goalId: goal2.id,
      title: 'Design habit tracker schema',
      description: 'Plan the PostgreSQL schema for the portfolio project',
      date: todayDate,
      priority: 'MEDIUM' as const,
      estimatedMin: 30,
    },
    {
      id: 'task-4',
      userId: user.id,
      goalId: undefined,
      title: 'Review yesterday\'s notes',
      description: 'Read session notes and identify weak areas',
      date: todayDate,
      priority: 'LOW' as const,
      estimatedMin: 15,
    },
  ];

  for (const task of tasks) {
    await prisma.task.upsert({
      where: { id: task.id },
      update: {},
      create: task,
    });
  }

  console.log('Created tasks:', tasks.length);
  console.log('✅ Seed complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
