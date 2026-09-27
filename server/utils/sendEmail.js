import nodemailer from 'nodemailer';

// ─── Core Sender ─────────────────────────────────────────────────────────────
export const sendEmail = async ({ to, subject, html, text }) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT) || 587,
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: `"${process.env.FROM_NAME || 'PeopleFirst Platform'}" <${process.env.FROM_EMAIL || 'noreply@peoplefirst.lk'}>`,
      to,
      subject,
      text: text || '',
      html,
    });

    console.log(`✉️  Email sent → ${to} | ID: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`❌ Email error → ${to}:`, error.message);
    return { success: false, error: error.message };
  }
};

// ─── Shared Base Layout ───────────────────────────────────────────────────────
const baseLayout = (content) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>PeopleFirst</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #0a0a0a;
      color: #ffffff;
      padding: 32px 16px;
    }
    .wrapper {
      max-width: 580px;
      margin: 0 auto;
    }
    .card {
      background: #141414;
      border: 1px solid #2a2a2a;
      border-radius: 20px;
      overflow: hidden;
    }
    .header {
      background: linear-gradient(135deg, #1a0000 0%, #2d0000 50%, #1a0000 100%);
      border-bottom: 1px solid #3a0000;
      padding: 28px 32px;
      text-align: center;
    }
    .logo {
      font-size: 26px;
      font-weight: 900;
      color: #ffffff;
      letter-spacing: -0.5px;
    }
    .logo span { color: #ef4444; }
    .logo-sub {
      font-size: 11px;
      color: #9a9a9a;
      letter-spacing: 2px;
      text-transform: uppercase;
      margin-top: 4px;
    }
    .body { padding: 32px; }
    .greeting {
      font-size: 22px;
      font-weight: 800;
      color: #ffffff;
      margin-bottom: 8px;
    }
    .subtitle {
      font-size: 13px;
      color: #888;
      line-height: 1.6;
      margin-bottom: 24px;
    }
    .divider {
      border: none;
      border-top: 1px solid #2a2a2a;
      margin: 24px 0;
    }
    .info-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 14px;
      background: #1e1e1e;
      border: 1px solid #2a2a2a;
      border-radius: 10px;
      margin-bottom: 10px;
    }
    .info-label { font-size: 11px; color: #666; text-transform: uppercase; letter-spacing: 0.5px; }
    .info-value { font-size: 13px; color: #fff; font-weight: 600; }
    .btn {
      display: inline-block;
      padding: 14px 36px;
      background: linear-gradient(135deg, #dc2626, #ef4444);
      color: #ffffff !important;
      text-decoration: none;
      border-radius: 12px;
      font-weight: 700;
      font-size: 14px;
      letter-spacing: 0.3px;
      box-shadow: 0 6px 20px rgba(239, 68, 68, 0.35);
      margin: 8px 0;
    }
    .otp-box {
      background: linear-gradient(135deg, #1a0000, #2a0000);
      border: 2px solid #dc2626;
      border-radius: 16px;
      padding: 24px;
      text-align: center;
      margin: 24px 0;
    }
    .otp-label { font-size: 11px; color: #888; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 12px; }
    .otp-code {
      font-size: 42px;
      font-weight: 900;
      color: #ef4444;
      letter-spacing: 10px;
      text-shadow: 0 0 20px rgba(239,68,68,0.4);
    }
    .otp-expiry { font-size: 11px; color: #666; margin-top: 12px; }
    .alert-box {
      background: #1a1a1a;
      border: 1px solid #333;
      border-left: 4px solid #ef4444;
      border-radius: 8px;
      padding: 12px 16px;
      margin: 16px 0;
      font-size: 12px;
      color: #aaa;
      line-height: 1.6;
    }
    .badge {
      display: inline-block;
      padding: 4px 12px;
      background: rgba(239,68,68,0.15);
      border: 1px solid rgba(239,68,68,0.3);
      color: #ef4444;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 16px;
    }
    .footer {
      padding: 20px 32px;
      background: #0f0f0f;
      border-top: 1px solid #1e1e1e;
      text-align: center;
    }
    .footer p { font-size: 11px; color: #555; line-height: 1.7; }
    .footer a { color: #ef4444; text-decoration: none; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="card">
      <div class="header">
        <div class="logo">People<span>First</span></div>
        <div class="logo-sub">Sri Lankan Achievers Platform</div>
      </div>
      ${content}
      <div class="footer">
        <p>
          © ${new Date().getFullYear()} PeopleFirst Media Platform. All rights reserved.<br/>
          Celebrating Sri Lankan Achievers &amp; முதுசங்கள்<br/>
          <a href="#">Unsubscribe</a> &nbsp;·&nbsp; <a href="#">Privacy Policy</a>
        </p>
      </div>
    </div>
  </div>
</body>
</html>`;

// ─── 1. Welcome / Registration Email ─────────────────────────────────────────
export const getWelcomeEmailTemplate = (name, email) =>
  baseLayout(`
    <div class="body">
      <div class="badge">✨ Welcome to PeopleFirst</div>
      <div class="greeting">Hello, ${name}! 🎉</div>
      <p class="subtitle">
        Your account has been successfully created on the PeopleFirst Media Platform — Sri Lanka's premier civic recognition platform celebrating national achievers.
      </p>
      <hr class="divider" />
      <div class="info-row">
        <span class="info-label">Registered Email</span>
        <span class="info-value">${email}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Account Status</span>
        <span class="info-value" style="color:#22c55e;">✓ Active</span>
      </div>
      <div class="info-row">
        <span class="info-label">Member Since</span>
        <span class="info-value">${new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
      </div>
      <hr class="divider" />
      <p class="subtitle">
        You can now vote for your favourite Sri Lankan achievers, explore in-depth biographies, watch exclusive interview series, and nominate hidden heroes from your community.
      </p>
      <div class="alert-box">
        🔒 <strong style="color:#fff;">Security tip:</strong> PeopleFirst will never ask for your password via email. If you did not create this account, please contact us immediately.
      </div>
    </div>
  `);

// ─── 2. Login Notification Email ──────────────────────────────────────────────
export const getLoginNotificationTemplate = (name, email, ipAddress, device) =>
  baseLayout(`
    <div class="body">
      <div class="badge">🔐 New Sign-In Detected</div>
      <div class="greeting">New login to your account</div>
      <p class="subtitle">
        Hi <strong style="color:#fff;">${name}</strong>, we noticed a new sign-in to your PeopleFirst account. Here are the details:
      </p>
      <hr class="divider" />
      <div class="info-row">
        <span class="info-label">Email Address</span>
        <span class="info-value">${email}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Date &amp; Time</span>
        <span class="info-value">${new Date().toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
      </div>
      <div class="info-row">
        <span class="info-label">IP Address</span>
        <span class="info-value">${ipAddress || 'Unknown'}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Device / Browser</span>
        <span class="info-value" style="font-size:11px;">${device ? device.substring(0, 60) : 'Unknown Device'}</span>
      </div>
      <hr class="divider" />
      <div class="alert-box">
        ⚠️ <strong style="color:#fff;">Not you?</strong> If you did not sign in, your account may be compromised. Please reset your password immediately using the Forgot Password option on the login page.
      </div>
    </div>
  `);

// ─── 3. Registration OTP Email ────────────────────────────────────────────────
export const getRegistrationOtpTemplate = (name, otp) =>
  baseLayout(`
    <div class="body">
      <div class="badge">🛡️ Account Registration Verification</div>
      <div class="greeting">Verify your email address</div>
      <p class="subtitle">
        Hi <strong style="color:#fff;">${name}</strong>, thank you for joining PeopleFirst! Use the 6-digit verification code below to verify your email and complete your registration.
      </p>
      <div class="otp-box">
        <div class="otp-label">Your 6-Digit Registration OTP Code</div>
        <div class="otp-code">${otp}</div>
        <div class="otp-expiry">⏱ This code expires in <strong style="color:#ef4444;">15 minutes</strong></div>
      </div>
      <div class="alert-box">
        🔒 <strong style="color:#fff;">Never share this code.</strong> If you did not request this registration, you can safely ignore this email.
      </div>
    </div>
  `);

// ─── 4. Forgot Password OTP Email ─────────────────────────────────────────────
export const getForgotPasswordTemplate = (name, otp) =>
  baseLayout(`
    <div class="body">
      <div class="badge">🔑 Password Reset</div>
      <div class="greeting">Reset your password</div>
      <p class="subtitle">
        Hi <strong style="color:#fff;">${name}</strong>, we received a request to reset the password for your PeopleFirst account. Use the OTP code below to complete the reset.
      </p>
      <div class="otp-box">
        <div class="otp-label">Your 6-Digit OTP Code</div>
        <div class="otp-code">${otp}</div>
        <div class="otp-expiry">⏱ This code expires in <strong style="color:#ef4444;">15 minutes</strong></div>
      </div>
      <div class="alert-box">
        🔒 <strong style="color:#fff;">Never share this code.</strong> PeopleFirst support staff will never ask for your OTP. If you did not request a password reset, you can safely ignore this email — your password will remain unchanged.
      </div>
    </div>
  `);

// ─── 4. Email Verification Template (kept for compatibility) ──────────────────
export const getVerificationEmailTemplate = (name, verificationUrl) =>
  baseLayout(`
    <div class="body">
      <div class="badge">📧 Verify Your Email</div>
      <div class="greeting">Almost there, ${name}!</div>
      <p class="subtitle">
        Please click the button below to verify your email address and activate your PeopleFirst account.
      </p>
      <div style="text-align:center; margin: 28px 0;">
        <a href="${verificationUrl}" class="btn">Verify My Email Address</a>
      </div>
      <p class="subtitle" style="font-size:12px; text-align:center;">
        Or copy and paste this link into your browser:<br/>
        <a href="${verificationUrl}" style="color:#ef4444; word-break:break-all;">${verificationUrl}</a>
      </p>
      <div class="alert-box">
        ⚠️ This verification link expires in <strong style="color:#fff;">24 hours</strong>. If you did not create an account, please ignore this email.
      </div>
    </div>
  `);
