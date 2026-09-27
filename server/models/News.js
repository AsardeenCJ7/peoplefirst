import mongoose from 'mongoose';

const newsSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    category: { type: String, required: true, default: 'Local' },
    subcategory: { type: String, default: '' },
    author: { type: String, default: 'PeopleFirst Editorial Desk' },
    date: { type: String, default: () => new Date().toISOString().split('T')[0] },
    time: { type: String, default: () => new Date().toTimeString().slice(0, 5) },
    readTime: { type: String, default: '4 min read' },
    image: { type: String, required: true },
    tags: [{ type: String }],
    featured: { type: Boolean, default: false },
    summary: { type: String, required: true },
    content: { type: String, default: '' },
    likes: { type: Number, default: 0 },
    likedBy: [{ type: String }],
  },
  { timestamps: true }
);

const News = mongoose.model('News', newsSchema);
export default News;
