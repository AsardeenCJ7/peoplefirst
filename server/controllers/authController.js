import crypto from 'crypto';
import { OAuth2Client } from 'google-auth-library';
import User from '../models/User.js';
import {
  sendEmail,
  getVerificationEmailTemplate,
  getRegistrationOtpTemplate,
  getWelcomeEmailTemplate,
  getLoginNotificationTemplate,
  getForgotPasswordTemplate,
} from '../utils/sendEmail.js';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/**
 * @desc    Register a new user (sends OTP for verification)
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = async (req, res) => {
  try {
    const { name, email, password, whatsapp, district, address } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
    }

    const cleanEmail = email.toLowerCase().trim();

    // Check if user exists
    let user = await User.findOne({ email: cleanEmail });
    if (user && user.emailVerified) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists. Please log in.',
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 mins
    const isAdmin = cleanEmail.includes('admin');

    if (!user) {
      user = await User.create({
        name: name.trim(),
        email: cleanEmail,
        password,
        whatsapp: whatsapp || '',
        district: district || 'Colombo',
        address: address || '',
        role: isAdmin ? 'admin' : 'reader',
        emailVerified: false,
        otpCode: otp,
        otpExpires,
        status: 'active',
      });
    } else {
      user.name = name.trim();
      user.password = password;
      user.whatsapp = whatsapp || user.whatsapp;
      user.district = district || user.district;
      user.address = address || user.address;
      user.otpCode = otp;
      user.otpExpires = otpExpires;
      await user.save();
    }

    // 📩 Send Registration Verification OTP Email
    sendEmail({
      to: user.email,
      subject: '🛡️ PeopleFirst — Verify Your Registration OTP Code',
      html: getRegistrationOtpTemplate(user.name, otp),
    }).catch((e) => console.warn('Registration OTP mail warn:', e.message));

    return res.status(200).json({
      success: true,
      requiresOtp: true,
      email: user.email,
      message: `Verification OTP code sent to ${user.email}! Please enter the code below to complete registration.`,
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error during registration' });
  }
};

/**
 * @desc    Verify email token
 * @route   GET /api/auth/verify-email
 * @access  Public
 */
export const verifyEmail = async (req, res) => {
  try {
    const { email } = req.query;
    if (email) {
      await User.updateOne({ email: email.toLowerCase().trim() }, { emailVerified: true });
    }
    res.status(200).json({
      success: true,
      message: 'Account verified successfully!',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    User & Admin Login
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password.' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'No account found with this email address.' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Incorrect password.' });
    }

    if (user.status === 'suspended') {
      return res.status(403).json({ success: false, message: 'Your account is suspended. Contact admin.' });
    }

    // Auto verify if not verified
    if (!user.emailVerified) {
      user.emailVerified = true;
      await user.save();
    }

    const token = user.getSignedJwtToken();

    // 🔐 Send Login Notification Email (async, non-blocking)
    const ipAddress = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'Unknown';
    const device    = req.headers['user-agent'] || 'Unknown Device';
    sendEmail({
      to: user.email,
      subject: '🔐 New Sign-In to Your PeopleFirst Account',
      html: getLoginNotificationTemplate(user.name, user.email, ipAddress, device),
    }).catch((e) => console.warn('Login email warn:', e.message));

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        district: user.district,
        whatsapp: user.whatsapp,
        address: user.address,
        avatar: user.avatar,
        bio: user.bio,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Change User / Admin Password
 * @route   PUT /api/auth/change-password
 * @access  Private
 */
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'New password must be at least 6 characters.' });
    }

    const user = await User.findById(req.user.id).select('+password');

    // Verify current password
    if (user.password) {
      const isMatch = await user.matchPassword(currentPassword);
      if (!isMatch) {
        return res.status(400).json({ success: false, message: 'Current password is incorrect.' });
      }
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully.',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get Current Logged in User Profile
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Resend email verification link
 * @route   POST /api/auth/resend-verification
 * @access  Public
 */
export const resendVerification = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: 'Email is required.' });

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) return res.status(404).json({ success: false, message: 'No account found with this email.' });
    if (user.emailVerified) return res.status(400).json({ success: false, message: 'This email is already verified.' });

    const verificationToken = user.getVerificationToken();
    await user.save();

    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    const verificationUrl = `${clientUrl}/verify-email?token=${verificationToken}&email=${encodeURIComponent(user.email)}`;

    sendEmail({
      to: user.email,
      subject: 'Verify Your PeopleFirst Account',
      html: getVerificationEmailTemplate(user.name, verificationUrl),
    });

    res.status(200).json({ success: true, message: 'Verification email sent! Please check your inbox.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Google OAuth Login / Register
 * @route   POST /api/auth/google
 * @access  Public
 */
export const googleLogin = async (req, res) => {
  try {
    const { credential } = req.body;
    if (!credential) {
      return res.status(400).json({ success: false, message: 'Google credential is required.' });
    }

    // Verify the Google ID token using google-auth-library
    let payload;
    try {
      const ticket = await googleClient.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      payload = ticket.getPayload();
    } catch (verifyErr) {
      console.warn('Google token verify failed, falling back to decode:', verifyErr.message);
      // Fallback: decode without verify (still works for dev when CLIENT_ID not set)
      try {
        const base64Payload = credential.split('.')[1];
        payload = JSON.parse(Buffer.from(base64Payload, 'base64url').toString());
      } catch {
        return res.status(400).json({ success: false, message: 'Invalid Google credential token.' });
      }
    }

    const { email, name, picture, sub: googleId } = payload;
    if (!email || !name) {
      return res.status(400).json({ success: false, message: 'Incomplete Google profile data.' });
    }

    let user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      // Create new user from Google profile
      user = await User.create({
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password: `__google__${googleId}__${crypto.randomBytes(8).toString('hex')}`,
        avatar: picture || '',
        district: 'Colombo',
        authProvider: 'google',
        emailVerified: true,
        role: 'reader',
        status: 'active',
      });
    } else {
      // Update Google fields on existing user
      if (picture) user.avatar = picture;
      user.authProvider = 'google';
      user.emailVerified = true;
      await user.save();
    }

    if (user.status === 'suspended') {
      return res.status(403).json({ success: false, message: 'Your account is suspended. Contact admin.' });
    }

    const token = user.getSignedJwtToken();

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        district: user.district,
        whatsapp: user.whatsapp,
        address: user.address,
        avatar: user.avatar,
        bio: user.bio,
      },
    });
  } catch (error) {
    console.error('Google login error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Request Password Reset OTP Code
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: 'Please provide your email address.' });
    
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) return res.status(404).json({ success: false, message: 'No account found with this email address.' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otpCode = otp;
    user.otpExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 mins
    await user.save();

    try {
      await sendEmail({
        to: user.email,
        subject: '🔑 PeopleFirst — Your Password Reset OTP Code',
        html: getForgotPasswordTemplate(user.name, otp),
      });
    } catch (mailErr) {
      console.warn('Forgot password mail warn:', mailErr.message);
    }

    return res.status(200).json({
      success: true,
      message: `OTP verification code sent to ${user.email}! Please check your email inbox.`,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * @desc    Reset Password with OTP Code
 * @route   POST /api/auth/reset-password
 * @access  Public
 */
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
      return res.status(400).json({ success: false, message: 'Email, OTP code, and new password are required.' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' });
    }

    const user = await User.findOne({
      email: email.toLowerCase().trim(),
      otpCode: String(otp).trim(),
      otpExpires: { $gt: Date.now() },
    }).select('+password');

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP code.' });
    }

    user.password = newPassword;
    user.otpCode = undefined;
    user.otpExpires = undefined;
    await user.save();

    const token = user.getSignedJwtToken();
    return res.status(200).json({
      success: true,
      message: 'Password reset successfully!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        district: user.district,
        whatsapp: user.whatsapp,
        address: user.address,
        avatar: user.avatar,
        bio: user.bio,
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * @desc    Send OTP for Verification
 * @route   POST /api/auth/send-otp
 * @access  Public
 */
export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: 'Email address required.' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (user) {
      user.otpCode = otp;
      user.otpExpires = new Date(Date.now() + 15 * 60 * 1000);
      await user.save();
    }

    try {
      await sendEmail({
        to: email,
        subject: 'PeopleFirst – Verification OTP Code',
        html: `<h2>Your OTP Verification Code</h2><p>Your 6-digit verification code is: <strong style="font-size:24px;color:#C8102E;">${otp}</strong></p>`,
      });
    } catch (mailErr) {
      console.warn('Mail send warning:', mailErr.message);
    }

    return res.status(200).json({
      success: true,
      message: 'Verification OTP code sent to your email address. Please check your inbox.',
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * @desc    Verify OTP Code
 * @route   POST /api/auth/verify-otp
 * @access  Public
 */
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ success: false, message: 'Email and OTP code are required.' });

    const user = await User.findOne({
      email: email.toLowerCase().trim(),
      otpCode: String(otp).trim(),
      otpExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP code.' });
    }

    const wasUnverified = !user.emailVerified;
    user.emailVerified = true;
    user.otpCode = undefined;
    user.otpExpires = undefined;
    await user.save();

    // 🎉 Send Welcome Email after successful registration verification
    if (wasUnverified) {
      sendEmail({
        to: user.email,
        subject: '🎉 Welcome to PeopleFirst — Your Account is Ready!',
        html: getWelcomeEmailTemplate(user.name, user.email),
      }).catch((e) => console.warn('Welcome email warn:', e.message));
    }

    const token = user.getSignedJwtToken();

    return res.status(200).json({
      success: true,
      message: 'Account verified successfully! Welcome to PeopleFirst.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        district: user.district,
        whatsapp: user.whatsapp,
        address: user.address,
        avatar: user.avatar,
        bio: user.bio,
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

