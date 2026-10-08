import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import nodemailer from 'nodemailer';
import { format } from 'date-fns';
import { today } from '@/lib/dates';

export async function GET(req: Request) {
  try {
    // 1. Verify Vercel Cron request using secret
    const authHeader = req.headers.get('authorization');
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // 2. Configure Nodemailer with Gmail SMTP
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD,
      },
    });

    // 3. Fetch all users who have an email
    const users = await prisma.user.findMany({
      where: { email: { not: null } }
    });

    const todayDate = today();
    let emailsSent = 0;

    for (const user of users) {
      if (!user.email) continue;

      // 4. Find pending tasks for today
      const pendingTasks = await prisma.task.findMany({
        where: {
          userId: user.id,
          completed: false,
          date: todayDate
        }
      });

      // If they have no tasks today, skip sending an email
      if (pendingTasks.length === 0) continue; 

      // 5. Build the email body
      const taskListHtml = pendingTasks
        .map(t => `<li style="margin-bottom: 8px;"><b>${t.title}</b> <span style="color: gray; font-size: 12px;">(${t.priority.toLowerCase()} priority)</span></li>`)
        .join('');
      
      const htmlContent = `
        <div style="font-family: sans-serif; max-w: 600px; margin: 0 auto;">
          <h2 style="color: #4F46E5;">Good morning, ${user.name || 'there'}! 👋</h2>
          <p style="color: #333; font-size: 16px;">Here are your pending tasks scheduled for today (${format(new Date(), 'EEEE, MMMM d')}):</p>
          
          <ul style="color: #333; font-size: 15px; padding-left: 20px;">
            ${taskListHtml}
          </ul>
          
          <br/>
          <p style="color: #555; font-size: 14px;">Log in to your <a href="${process.env.NEXTAUTH_URL}">HabitFlow Dashboard</a> to start checking them off!</p>
        </div>
      `;

      // 6. Send the email using Gmail
      await transporter.sendMail({
        from: `"HabitFlow" <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: `📅 Your Tasks for ${format(new Date(), 'MMMM d')}`,
        html: htmlContent,
      });

      emailsSent++;
    }

    return NextResponse.json({ success: true, emailsSent });
  } catch (error) {
    console.error('Error in CRON job:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
