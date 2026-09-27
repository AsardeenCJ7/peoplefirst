import Award, { VotingConfig } from '../models/Award.js';

export const getAllAwards = async (req, res) => {
  try {
    const { category, search, status } = req.query;
    let query = {};
    if (category && category !== 'All') query.category = category;
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { nominee: { $regex: search, $options: 'i' } },
      ];
    }
    const awards = await Award.find(query).sort({ votes: -1, createdAt: -1 });
    res.status(200).json({ success: true, count: awards.length, data: awards });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAwardById = async (req, res) => {
  try {
    const award = await Award.findById(req.params.id);
    if (!award) return res.status(404).json({ success: false, message: 'Award not found' });
    res.status(200).json({ success: true, data: award });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createAward = async (req, res) => {
  try {
    const award = await Award.create(req.body);
    res.status(201).json({ success: true, data: award, message: 'Award created successfully!' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateAward = async (req, res) => {
  try {
    const award = await Award.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!award) return res.status(404).json({ success: false, message: 'Award not found' });
    res.status(200).json({ success: true, data: award, message: 'Award updated!' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteAward = async (req, res) => {
  try {
    const award = await Award.findByIdAndDelete(req.params.id);
    if (!award) return res.status(404).json({ success: false, message: 'Award not found' });
    res.status(200).json({ success: true, message: 'Award deleted successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const voteForAward = async (req, res) => {
  try {
    const userEmail = req.user.email;
    const targetAward = await Award.findById(req.params.id);
    if (!targetAward) return res.status(404).json({ success: false, message: 'Award not found' });

    // Enforce 1-Vote-Per-Category Permanent Lock: Check if user already voted in this category
    const categoryVote = await Award.findOne({
      category: targetAward.category,
      votedUsers: userEmail,
    });

    if (categoryVote) {
      if (String(categoryVote._id) === String(targetAward._id)) {
        return res.status(400).json({
          success: false,
          voted: true,
          locked: true,
          message: `Your vote for ${targetAward.nominee} in ${targetAward.category} is locked and final. Votes cannot be changed.`,
        });
      } else {
        return res.status(400).json({
          success: false,
          voted: false,
          locked: true,
          message: `You have already cast your 1 permitted vote for ${categoryVote.nominee} in ${targetAward.category}. Category votes are locked once cast.`,
        });
      }
    }

    // Cast single permanent vote for target award
    if (!targetAward.votedUsers) targetAward.votedUsers = [];
    targetAward.votedUsers.push(userEmail);
    targetAward.votes = (targetAward.votes || 0) + 1;
    await targetAward.save();

    res.status(200).json({
      success: true,
      voted: true,
      locked: true,
      votes: targetAward.votes,
      awardId: targetAward._id,
      category: targetAward.category,
      message: `Your vote for ${targetAward.nominee} in ${targetAward.category} was successfully registered and locked!`,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Voting Season Configuration
export const getVotingConfigData = async (req, res) => {
  try {
    let config = await VotingConfig.findOne();
    if (!config) {
      config = await VotingConfig.create({
        isActive: true,
        seasonTitle: 'National Excellence Awards 2026',
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      });
    }
    res.status(200).json({ success: true, data: config });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateVotingConfigData = async (req, res) => {
  try {
    let config = await VotingConfig.findOne();
    if (!config) {
      config = await VotingConfig.create(req.body);
    } else {
      config = await VotingConfig.findByIdAndUpdate(config._id, req.body, { new: true });
    }
    res.status(200).json({ success: true, data: config, message: 'Voting config updated!' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
