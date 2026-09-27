import mongoose from 'mongoose';

const awardSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    category: { type: String, required: true },
    nominee: { type: String, required: true },
    nomineeId: { type: String, default: '' },
    description: { type: String, default: '' },
    status: { type: String, enum: ['Winner', 'Nominee'], default: 'Nominee' },
    year: { type: Number, default: () => new Date().getFullYear() },
    presenter: { type: String, default: '' },
    thumbnail: { type: String, default: '' },
    icon: { type: String, default: '🏆' },
    votes: { type: Number, default: 0 },
    votedUsers: [{ type: String }], // Array of user emails or IDs
  },
  { timestamps: true }
);

const votingConfigSchema = new mongoose.Schema({
  isActive: { type: Boolean, default: true },
  seasonTitle: { type: String, default: 'National Excellence Awards 2026' },
  deadline: { type: Date, default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
  categories: [{ type: String }],
});

export const VotingConfig = mongoose.model('VotingConfig', votingConfigSchema);
const Award = mongoose.model('Award', awardSchema);
export default Award;
