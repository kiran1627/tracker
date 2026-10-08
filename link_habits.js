const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Find the goal
  const goal = await prisma.goal.findFirst({
    where: { title: { contains: 'job ready', mode: 'insensitive' } }
  });

  if (!goal) {
    console.log('Goal not found');
    return;
  }

  // Update all habits to link to this goal
  const updated = await prisma.habit.updateMany({
    where: { userId: goal.userId },
    data: { goalId: goal.id }
  });

  console.log(`Updated ${updated.count} habits to goal: ${goal.title}`);
}

main().finally(() => prisma.$disconnect());
