import nodemailer from 'nodemailer';

export const sendEmail = async ({ to, subject, html, text }) => {
  try {
    // Configure transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT || 587,
      secure: process.env.SMTP_PORT == 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const message = {
      from: `"${process.env.FROM_NAME || 'PeopleFirst Platform'}" <${process.env.FROM_EMAIL || 'noreply@peoplefirst.lk'}>`,
      to,
      subject,
      text: text || '',
      html,
    };

    const info = await transporter.sendMail(message);
    console.log(`✉️ Email dispatched to: ${to} | Message ID: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`❌ Email sending error to ${to}:`, error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Returns formatted HTML template for email verification
 */
export const getVerificationEmailTemplate = (name, verificationUrl) => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0d0d0d; color: #ffffff; padding: 20px; }
          .container { max-width: 580px; margin: 0 auto; background: #161616; border: 1px solid #333333; border-radius: 16px; padding: 32px; text-align: center; }
          .logo { font-size: 24px; font-weight: 900; color: #ffffff; margin-bottom: 24px; }
          .logo span { color: #ef4444; }
          h2 { color: #ffffff; margin-bottom: 12px; }
          p { color: #a1a1aa; font-size: 14px; line-height: 1.6; margin-bottom: 24px; }
          .btn { display: inline-block; padding: 12px 32px; background: linear-gradient(135deg, #dc2626, #ef4444); color: #ffffff !important; text-decoration: none; border-radius: 12px; font-weight: bold; font-size: 14px; box-shadow: 0 4px 14px rgba(239, 68, 68, 0.4); }
          .footer { margin-top: 32px; font-size: 11px; color: #71717a; border-top: 1px solid #27272a; pt: 16px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo">People<span>First</span></div>
          <h2>Welcome, ${name}!</h2>
          <p>Thank you for joining PeopleFirst media platform. Please verify your email address to activate your account and access your dashboard, voting, and saved stories.</p>
          <a href="${verificationUrl}" class="btn">Verify My Email Address</a>
          <p style="margin-top: 24px; font-size: 12px;">Or copy and paste this link into your browser:<br><a href="${verificationUrl}" style="color: #ef4444;">${verificationUrl}</a></p>
          <div class="footer">
            &copy; 2026 PeopleFirst Media Platform. All rights reserved.
          </div>
        </div>
      </body>
    </html>
  `;
};
