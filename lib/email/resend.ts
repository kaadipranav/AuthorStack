/**
 * Resend Email Service
 * Handles sending emails via Resend API
 */

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}

/**
 * Send email via Resend
 */
export async function sendEmail(options: EmailOptions): Promise<{ success: boolean; id?: string; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.error('RESEND_API_KEY not configured');
    return {
      success: false,
      error: 'Email service not configured',
    };
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: 'AuthorStack <noreply@authorstack.com>',
        to: options.to,
        subject: options.subject,
        html: options.html,
        reply_to: options.replyTo || 'support@authorstack.com',
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Resend API error:', error);
      return {
        success: false,
        error: error.message || 'Failed to send email',
      };
    }

    const data = await response.json();
    return {
      success: true,
      id: data.id,
    };
  } catch (error) {
    console.error('Error sending email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Generate reminder email HTML
 */
export function generateReminderEmailHTML(options: {
  taskName: string;
  bookTitle: string;
  dueDate: string;
  launchDate: string;
  daysUntilDue: number;
  launchUrl: string;
}): string {
  const dueDateFormatted = new Date(options.dueDate).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  const launchDateFormatted = new Date(options.launchDate).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      background-color: #f9fafb;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }
    .header {
      background: linear-gradient(135deg, #1E40AF 0%, #1e3a8a 100%);
      color: white;
      padding: 32px 24px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 28px;
      font-weight: bold;
    }
    .content {
      padding: 32px 24px;
    }
    .greeting {
      font-size: 16px;
      margin-bottom: 24px;
    }
    .task-card {
      background-color: #f3f4f6;
      border-left: 4px solid #F97316;
      padding: 16px;
      margin: 24px 0;
      border-radius: 4px;
    }
    .task-card h3 {
      margin: 0 0 8px 0;
      color: #1f2937;
      font-size: 18px;
    }
    .task-details {
      font-size: 14px;
      color: #6b7280;
      margin: 8px 0;
    }
    .task-details strong {
      color: #1f2937;
    }
    .cta-button {
      display: inline-block;
      background-color: #1E40AF;
      color: white;
      padding: 12px 24px;
      border-radius: 6px;
      text-decoration: none;
      font-weight: 600;
      margin: 24px 0;
    }
    .cta-button:hover {
      background-color: #1e3a8a;
    }
    .footer {
      background-color: #f9fafb;
      padding: 24px;
      text-align: center;
      font-size: 12px;
      color: #6b7280;
      border-top: 1px solid #e5e7eb;
    }
    .footer a {
      color: #1E40AF;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📚 Task Reminder</h1>
    </div>

    <div class="content">
      <div class="greeting">
        <p>Hi there!</p>
        <p>You have an upcoming task for your book launch. Here's a friendly reminder to keep you on track.</p>
      </div>

      <div class="task-card">
        <h3>✓ ${options.taskName}</h3>
        <div class="task-details">
          <p><strong>Book:</strong> ${options.bookTitle}</p>
          <p><strong>Due:</strong> ${dueDateFormatted}</p>
          <p><strong>Days until due:</strong> ${options.daysUntilDue} day${options.daysUntilDue !== 1 ? 's' : ''}</p>
          <p><strong>Launch date:</strong> ${launchDateFormatted}</p>
        </div>
      </div>

      <p>Completing this task on time will help ensure a smooth launch for "${options.bookTitle}". Click the button below to view your full launch checklist and mark this task as complete.</p>

      <center>
        <a href="${options.launchUrl}" class="cta-button">View Launch Checklist</a>
      </center>

      <p style="font-size: 14px; color: #6b7280; margin-top: 32px;">
        You're receiving this email because you enabled reminders for your book launch. You can disable reminders anytime from your launch settings.
      </p>
    </div>

    <div class="footer">
      <p>© 2025 AuthorStack. All rights reserved.</p>
      <p><a href="https://authorstack.com">Visit AuthorStack</a> | <a href="https://authorstack.com/settings">Manage Preferences</a></p>
    </div>
  </div>
</body>
</html>
  `;
}

/**
 * Generate launch day email HTML
 */
export function generateLaunchDayEmailHTML(options: {
  bookTitle: string;
  launchUrl: string;
}): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      background-color: #f9fafb;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }
    .header {
      background: linear-gradient(135deg, #F97316 0%, #ea580c 100%);
      color: white;
      padding: 32px 24px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 32px;
      font-weight: bold;
    }
    .content {
      padding: 32px 24px;
    }
    .celebration {
      text-align: center;
      font-size: 48px;
      margin: 24px 0;
    }
    .cta-button {
      display: inline-block;
      background-color: #F97316;
      color: white;
      padding: 12px 24px;
      border-radius: 6px;
      text-decoration: none;
      font-weight: 600;
      margin: 24px 0;
    }
    .cta-button:hover {
      background-color: #ea580c;
    }
    .footer {
      background-color: #f9fafb;
      padding: 24px;
      text-align: center;
      font-size: 12px;
      color: #6b7280;
      border-top: 1px solid #e5e7eb;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🚀 Launch Day!</h1>
    </div>

    <div class="content">
      <div class="celebration">🎉</div>

      <p style="font-size: 18px; text-align: center; margin: 24px 0;">
        Today is the day! Your book <strong>"${options.bookTitle}"</strong> is officially launching!
      </p>

      <p>This is an exciting moment. Make sure to:</p>
      <ul>
        <li>Post on all your social media channels</li>
        <li>Engage with readers and respond to comments</li>
        <li>Monitor your sales and page reads</li>
        <li>Share your launch checklist progress</li>
      </ul>

      <center>
        <a href="${options.launchUrl}" class="cta-button">View Your Launch Dashboard</a>
      </center>

      <p style="font-size: 14px; color: #6b7280; margin-top: 32px; text-align: center;">
        Congratulations on your launch! We're excited to see your book succeed. 🌟
      </p>
    </div>

    <div class="footer">
      <p>© 2025 AuthorStack. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
  `;
}
