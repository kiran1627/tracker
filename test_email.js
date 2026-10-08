require('dotenv').config({ path: '.env.local' }); // Load env vars if any
const { PrismaClient } = require('@prisma/client');
const nodemailer = require('nodemailer');

const prisma = new PrismaClient();

async function main() {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
  });

  const users = await prisma.user.findMany({
    where: { email: { not: null } }
  });

  // Force tomorrow's date for testing
  const targetDate = new Date('2026-10-09T00:00:00.000Z');

  for (const user of users) {
    if (!user.email) continue;

    const pendingTasks = await prisma.task.findMany({
      where: {
        userId: user.id,
        completed: false,
        date: targetDate
      },
      include: {
        habit: { select: { title: true } }
      }
    });

    if (pendingTasks.length === 0) {
      console.log(`No tasks for user ${user.email} on ${targetDate.toISOString()}`);
      continue;
    }

    const standaloneTasks = [];
    const habitGroups = {};
    
    for (const t of pendingTasks) {
      if (t.habit) {
        if (!habitGroups[t.habit.title]) habitGroups[t.habit.title] = [];
        habitGroups[t.habit.title].push(t);
      } else {
        standaloneTasks.push(t);
      }
    }
    
    let taskListHtml = '';
    if (standaloneTasks.length > 0) {
      taskListHtml += standaloneTasks.map(t => `<li style="margin-bottom: 8px;"><b>${t.title}</b> <span style="color: gray; font-size: 12px;">(${t.priority.toLowerCase()} priority)</span></li>`).join('');
    }
    
    for (const [habitName, hTasks] of Object.entries(habitGroups)) {
      taskListHtml += `<li style="margin-bottom: 8px; margin-top: 16px;"><b style="color: #c026d3;">⟳ ${habitName}</b>`;
      taskListHtml += `<ul style="margin-top: 8px; color: #333; font-size: 14px; padding-left: 15px;">`;
      taskListHtml += hTasks.map(t => `<li style="margin-bottom: 4px;">${t.title}</li>`).join('');
      taskListHtml += `</ul></li>`;
    }
    
    const htmlContent = `
      <div style="font-family: sans-serif; max-w: 600px; margin: 0 auto;">
        <h2 style="color: #4F46E5;">Good morning, ${user.name || 'there'}! 👋</h2>
        <p style="color: #333; font-size: 16px;">Here are your pending tasks scheduled for today (October 9th):</p>
        
        <ul style="color: #333; font-size: 15px; padding-left: 20px; list-style-type: none; margin: 0; padding: 0;">
          ${taskListHtml}
        </ul>
        
        <br/>
        <p style="color: #555; font-size: 14px;">Log in to your <a href="${process.env.NEXTAUTH_URL}">HabitFlow Dashboard</a> to start checking them off!</p>
      </div>
    `;

    console.log(`Sending email to ${user.email}...`);
    try {
      await transporter.sendMail({
        from: `"HabitFlow" <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: `📅 TEST: Your Tasks for October 9th`,
        html: htmlContent,
      });
      console.log('Email sent successfully!');
    } catch (err) {
      console.error('Failed to send email:', err);
    }
  }
}

main().finally(() => prisma.$disconnect());
