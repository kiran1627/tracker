import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findUnique({
    where: { email: 'kiranbabub18@gmail.com' }
  });

  if (!user) {
    console.log('User not found. Please log in once first.');
    return;
  }

  // Create the 4 Goals
  const trackDsa = await prisma.goal.create({
    data: { userId: user.id, title: 'DSA', category: 'LEARNING', status: 'ACTIVE' },
  });
  const trackPython = await prisma.goal.create({
    data: { userId: user.id, title: 'Python + Backend', category: 'LEARNING', status: 'ACTIVE' },
  });
  const trackSystemDesign = await prisma.goal.create({
    data: { userId: user.id, title: 'System Design', category: 'LEARNING', status: 'ACTIVE' },
  });
  const trackAi = await prisma.goal.create({
    data: { userId: user.id, title: 'AI/ML', category: 'LEARNING', status: 'ACTIVE' },
  });

  // Create the Habits for those Goals
  await prisma.habit.createMany({
    data: [
      { userId: user.id, goalId: trackDsa.id, title: 'Solve 2 LeetCode Problems', icon: '🧠', color: '#8B5CF6', target: 2, unit: 'problems', frequency: 'DAILY' },
      { userId: user.id, goalId: trackPython.id, title: 'Build API Endpoints', icon: '🐍', color: '#22C55E', target: 1, unit: 'hour', frequency: 'DAILY' },
      { userId: user.id, goalId: trackSystemDesign.id, title: 'Read System Design Chapter', icon: '🏗️', color: '#F59E0B', target: 30, unit: 'mins', frequency: 'DAILY' },
      { userId: user.id, goalId: trackAi.id, title: 'Study ML Models', icon: '🤖', color: '#EC4899', target: 1, unit: 'hour', frequency: 'DAILY' }
    ],
  });

  console.log('Successfully seeded your 4 study tracks!');
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
