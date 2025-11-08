import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { sendEmail, generateReminderEmailHTML, generateLaunchDayEmailHTML } from '@/lib/email/resend';

interface ReminderLog {
  timestamp: string;
  message: string;
  status: 'info' | 'success' | 'warning' | 'error';
}

export async function GET(request: NextRequest) {
  const logs: ReminderLog[] = [];

  function addLog(message: string, status: 'info' | 'success' | 'warning' | 'error' = 'info') {
    const log = {
      timestamp: new Date().toISOString(),
      message,
      status,
    };
    logs.push(log);
    console.log(`[${status.toUpperCase()}] ${message}`);
  }

  try {
    // Verify cron secret (optional but recommended)
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      addLog('Unauthorized cron request', 'error');
      return NextResponse.json({ error: 'Unauthorized', logs }, { status: 401 });
    }

    addLog('Starting reminder cron job');

    // Create Supabase client
    const supabase = createRouteHandlerClient({ cookies });

    // Get all active launches
    const { data: launches, error: launchesError } = await supabase
      .from('launch_checklists')
      .select(
        `
        id,
        launch_date,
        book_id,
        book:books(id, title, user_id),
        tasks:checklist_tasks(*)
      `
      )
      .eq('status', 'active');

    if (launchesError) {
      addLog(`Database error: ${launchesError.message}`, 'error');
      return NextResponse.json({ error: 'Database error', logs }, { status: 500 });
    }

    if (!launches || launches.length === 0) {
      addLog('No active launches found');
      return NextResponse.json({ success: true, emailsSent: 0, logs });
    }

    addLog(`Found ${launches.length} active launch(es)`);

    let emailsSent = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Process each launch
    for (const launch of launches) {
      const launchDate = new Date(launch.launch_date);
      launchDate.setHours(0, 0, 0, 0);

      const daysUntilLaunch = Math.ceil((launchDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

      // Check for launch day
      if (daysUntilLaunch === 0) {
        addLog(`Launch day for "${launch.book.title}"`);

        // Get user email
        const { data: profile } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', launch.book.user_id)
          .single();

        if (profile) {
          const { data: user } = await supabase.auth.admin.getUserById(launch.book.user_id);

          if (user?.email) {
            const html = generateLaunchDayEmailHTML({
              bookTitle: launch.book.title,
              launchUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/launches/${launch.id}`,
            });

            const result = await sendEmail({
              to: user.email,
              subject: `🚀 Launch Day! Your book "${launch.book.title}" is live!`,
              html,
            });

            if (result.success) {
              addLog(`Launch day email sent to ${user.email}`, 'success');
              emailsSent++;
            } else {
              addLog(`Failed to send launch day email: ${result.error}`, 'warning');
            }
          }
        }
      }

      // Check for task reminders (1, 3, 7 days)
      const reminderDays = [1, 3, 7];

      for (const task of launch.tasks || []) {
        if (task.completed) continue;

        const taskDueDate = new Date(task.due_date);
        taskDueDate.setHours(0, 0, 0, 0);

        const daysUntilDue = Math.ceil((taskDueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

        if (reminderDays.includes(daysUntilDue)) {
          addLog(`Task reminder: "${task.task_name}" due in ${daysUntilDue} day(s)`);

          // Get user email
          const { data: user } = await supabase.auth.admin.getUserById(launch.book.user_id);

          if (user?.email) {
            const html = generateReminderEmailHTML({
              taskName: task.task_name,
              bookTitle: launch.book.title,
              dueDate: task.due_date,
              launchDate: launch.launch_date,
              daysUntilDue,
              launchUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/launches/${launch.id}`,
            });

            const result = await sendEmail({
              to: user.email,
              subject: `📋 Reminder: "${task.task_name}" is due in ${daysUntilDue} day${daysUntilDue !== 1 ? 's' : ''}`,
              html,
            });

            if (result.success) {
              addLog(`Reminder email sent to ${user.email}`, 'success');
              emailsSent++;
            } else {
              addLog(`Failed to send reminder email: ${result.error}`, 'warning');
            }
          }
        }
      }
    }

    addLog(`Cron job completed. ${emailsSent} email(s) sent.`, 'success');

    return NextResponse.json({
      success: true,
      emailsSent,
      logs,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    addLog(`Cron job failed: ${errorMessage}`, 'error');

    return NextResponse.json(
      {
        error: 'Cron job failed',
        message: errorMessage,
        logs,
      },
      { status: 500 }
    );
  }
}
