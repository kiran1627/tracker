import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import nodemailer from 'nodemailer';
import { format } from 'date-fns';
import { today } from '@/lib/dates';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    // 1. Verify Vercel Cron request using secret (mandatory)
    const authHeader = req.headers.get('authorization');
    if (!process.env.CRON_SECRET || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
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

    // 3. Fetch only the two specified users
    const users = await prisma.user.findMany({
      where: { 
        email: { 
          in: ['kiranbabub18@gmail.com', 'sukanyal1627@gmail.com'] 
        } 
      }
    });
    
    // Always target Tomorrow's date
    let targetDate = new Date();
    targetDate.setUTCMinutes(targetDate.getUTCMinutes() + 330); // IST Offset
    targetDate.setUTCHours(targetDate.getUTCHours() - 8); // Rollover logic
    targetDate.setUTCDate(targetDate.getUTCDate() + 1); // Add 1 day for tomorrow
    targetDate = new Date(Date.UTC(targetDate.getUTCFullYear(), targetDate.getUTCMonth(), targetDate.getUTCDate()));
    
    let emailsSent = 0;

    for (const user of users) {
      if (!user.email) continue;

      // 4. Find pending tasks for today
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

      // If they have no tasks today, skip sending an email
      if (pendingTasks.length === 0) continue; 

      // 5. Build the email body
      const standaloneTasks = [];
      const habitGroups: Record<string, typeof pendingTasks> = {};
      
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
          <p style="color: #333; font-size: 16px;">Here are your pending tasks scheduled for tomorrow (${format(targetDate, 'EEEE, MMMM d')}):</p>
          
          <ul style="color: #333; font-size: 15px; padding-left: 20px; list-style-type: none; margin: 0; padding: 0;">
            ${taskListHtml}
          </ul>
          
          <br/>
          <p style="color: #555; font-size: 14px;">Log in to your <a href="${process.env.NEXTAUTH_URL}">HabitFlow Dashboard</a> to start checking them off!</p>
        </div>
      `;

      await transporter.sendMail({
        from: `"HabitFlow" <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: `📅 Your Tasks for ${format(targetDate, 'MMMM d')}`,
        html: htmlContent,
      });

      emailsSent++;
    }

    return NextResponse.json({ success: true, emailsSent });
  } catch (error: any) {
    console.error('Error in CRON job:', error);
    return new NextResponse(`Error: ${error.message || 'Unknown internal error'}`, { status: 500 });
  }
}
