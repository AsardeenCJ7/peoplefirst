import mongoose from 'mongoose';

const biographyPageSchema = new mongoose.Schema({
  title: { type: String, default: '' },
  icon: { type: String, default: '✨' },
  paragraphs: [{ type: String }],
});

const interviewEpisodeSchema = new mongoose.Schema({
  id: { type: String, default: () => `ep-${Date.now()}` },
  episode: { type: Number, default: 1 },
  title: { type: String, default: '' },
  videoId: { type: String, default: '' },
  duration: { type: String, default: '20:00' },
  date: { type: String, default: '' },
  description: { type: String, default: '' },
});

const achieverSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    title: { type: String, default: '' },
    category: { type: String, required: true },
    location: { type: String, default: 'Colombo District' },
    year: { type: String, default: '2026' },
    thumbnail: { type: String, required: true },
    videoId: { type: String, default: 'dQw4w9WgXcQ' },
    featured: { type: Boolean, default: false },
    verified: { type: Boolean, default: true },
    achievements: [{ type: String }],
    bio: { type: String, default: '' },
    biographyPages: [biographyPageSchema],
    interviewSeries: [interviewEpisodeSchema],
    tags: [{ type: String }],
  },
  { timestamps: true }
);

const Achiever = mongoose.model('Achiever', achieverSchema);
export default Achiever;
