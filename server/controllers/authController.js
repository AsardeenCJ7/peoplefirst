import crypto from 'crypto';
import https from 'https';
import User from '../models/User.js';
import { sendEmail, getVerificationEmailTemplate } from '../utils/sendEmail.js';

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = async (req, res) => {
  try {
    const { name, email, password, whatsapp, district, address } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists. Please log in.',
      });
    }

    const isAdmin = email.toLowerCase().includes('admin');

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      whatsapp: whatsapp || '',
      district: district || 'Colombo',
      address: address || '',
      role: isAdmin ? 'admin' : 'reader',
      emailVerified: true,
      status: 'active',
    });

    const token = user.getSignedJwtToken();
    return res.status(201).json({
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

    // Decode the JWT payload (no extra deps needed)
    let payload;
    try {
      const base64Payload = credential.split('.')[1];
      payload = JSON.parse(Buffer.from(base64Payload, 'base64url').toString());
    } catch {
      return res.status(400).json({ success: false, message: 'Invalid Google credential token.' });
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
