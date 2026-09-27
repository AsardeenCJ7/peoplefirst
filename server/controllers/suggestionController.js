import SuggestedAchiever from '../models/SuggestedAchiever.js';
import path from 'path';

// ── Submit a new suggestion (any logged-in user) ───────────────────────────
export const submitSuggestion = async (req, res) => {
  try {
    const {
      name, title, category, district, services, bio,
      achievements, submitterName, submitterEmail, submitterPhone,
      photo,
    } = req.body;

    if (!name || !category || !district || !submitterName || !submitterEmail) {
      return res.status(400).json({
        success: false,
        message: 'Name, category, district, and your contact details are required.',
      });
    }

    // Parse achievements from JSON string or array
    let achievementList = [];
    if (achievements) {
      try {
        achievementList = typeof achievements === 'string'
          ? JSON.parse(achievements)
          : achievements;
      } catch {
        achievementList = achievements.split('\n').map(a => a.trim()).filter(Boolean);
      }
    }

    // Build documents array from uploaded files
    const documents = (req.files || []).map(file => ({
      filename: file.filename,
      originalName: file.originalname,
      url: `/uploads/${file.filename}`,
      uploadedAt: new Date(),
    }));

    const suggestion = await SuggestedAchiever.create({
      submittedBy: req.user?._id || null,
      submitterName: submitterName || req.user?.name || 'Anonymous',
      submitterEmail: submitterEmail || req.user?.email || '',
      submitterPhone: submitterPhone || '',
      name,
      title: title || '',
      category,
      district,
      services: services || '',
      bio: bio || '',
      achievements: achievementList,
      photo: photo || '',
      documents,
      status: 'pending',
    });

    res.status(201).json({
      success: true,
      data: suggestion,
      message: 'Thank you! Your achiever suggestion has been submitted for admin review.',
    });
  } catch (error) {
    console.error('Submit suggestion error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── Get all suggestions (admin only) ──────────────────────────────────────
export const getAllSuggestions = async (req, res) => {
  try {
    const { status } = req.query;
    const query = status && status !== 'all' ? { status } : {};
    const suggestions = await SuggestedAchiever.find(query).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: suggestions.length, data: suggestions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── Get suggestions submitted by the logged-in user ───────────────────────
export const getMySuggestions = async (req, res) => {
  try {
    const suggestions = await SuggestedAchiever.find({
      $or: [
        { submittedBy: req.user._id },
        { submitterEmail: req.user.email },
      ],
    }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: suggestions.length, data: suggestions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── Review a suggestion (admin only): approve / reject / promote ───────────
export const reviewSuggestion = async (req, res) => {
  try {
    const { status, adminNote } = req.body;
    if (!['approved', 'rejected', 'promoted', 'pending'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status.' });
    }
    const suggestion = await SuggestedAchiever.findByIdAndUpdate(
      req.params.id,
      {
        status,
        adminNote: adminNote || '',
        reviewedBy: req.user?.name || 'Admin',
        reviewedAt: new Date(),
      },
      { new: true }
    );
    if (!suggestion) {
      return res.status(404).json({ success: false, message: 'Suggestion not found.' });
    }
    res.status(200).json({ success: true, data: suggestion, message: `Suggestion marked as ${status}.` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── Delete a suggestion (admin only) ──────────────────────────────────────
export const deleteSuggestion = async (req, res) => {
  try {
    const suggestion = await SuggestedAchiever.findByIdAndDelete(req.params.id);
    if (!suggestion) {
      return res.status(404).json({ success: false, message: 'Suggestion not found.' });
    }
    res.status(200).json({ success: true, message: 'Suggestion deleted.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
