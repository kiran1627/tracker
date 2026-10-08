const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const tasks = await prisma.task.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5,
    select: { title: true, date: true, createdAt: true, habitId: true }
  });
  console.log(tasks);
}
main().finally(() => prisma.$disconnect());
