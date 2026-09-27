import Achiever from '../models/Achiever.js';
import Feedback from '../models/Feedback.js';

export const getAllAchievers = async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = {};
    if (category && category !== 'All') query.category = category;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { title: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
      ];
    }
    const achievers = await Achiever.find(query).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: achievers.length, data: achievers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAchieverById = async (req, res) => {
  try {
    const achiever = await Achiever.findById(req.params.id);
    if (!achiever) return res.status(404).json({ success: false, message: 'Achiever not found' });
    res.status(200).json({ success: true, data: achiever });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createAchiever = async (req, res) => {
  try {
    const achiever = await Achiever.create(req.body);
    res.status(201).json({ success: true, data: achiever, message: 'Achiever profile published!' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateAchiever = async (req, res) => {
  try {
    const achiever = await Achiever.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!achiever) return res.status(404).json({ success: false, message: 'Achiever not found' });
    res.status(200).json({ success: true, data: achiever, message: 'Achiever profile updated!' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteAchiever = async (req, res) => {
  try {
    const achiever = await Achiever.findByIdAndDelete(req.params.id);
    if (!achiever) return res.status(404).json({ success: false, message: 'Achiever not found' });
    res.status(200).json({ success: true, message: 'Achiever profile deleted successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Feedback Handlers
export const getAllFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: feedback.length, data: feedback });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getFeedbackByAchiever = async (req, res) => {
  try {
    const { achieverId } = req.params;
    const feedback = await Feedback.find({ achieverId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: feedback.length, data: feedback });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addFeedback = async (req, res) => {
  try {
    const { achieverId, text, rating, author, email } = req.body;
    if (!achieverId || !text) {
      return res.status(400).json({ success: false, message: 'Achiever ID and comment text are required.' });
    }
    const commentAuthor = req.user ? req.user.name : (author || 'Community Member');
    const commentEmail = req.user ? req.user.email : (email || 'guest@peoplefirst.lk');

    const feedback = await Feedback.create({
      achieverId,
      text,
      rating: rating || 5,
      author: commentAuthor,
      email: commentEmail,
      status: 'pending',
    });
    res.status(201).json({ success: true, data: feedback, message: 'Feedback submitted successfully!' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateFeedbackStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const feedback = await Feedback.findByIdAndUpdate(id, { status }, { new: true });
    if (!feedback) return res.status(404).json({ success: false, message: 'Feedback not found.' });
    res.status(200).json({ success: true, data: feedback, message: `Feedback marked as ${status}` });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const feedback = await Feedback.findByIdAndDelete(id);
    if (!feedback) return res.status(404).json({ success: false, message: 'Feedback not found.' });
    res.status(200).json({ success: true, message: 'Feedback deleted successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
