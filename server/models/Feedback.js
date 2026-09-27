import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema(
  {
    achieverId: { type: String, required: true },
    author: { type: String, required: true },
    email: { type: String, required: true },
    text: { type: String, required: true },
    rating: { type: Number, default: 5 },
    date: { type: String, default: () => new Date().toISOString() },
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'featured', 'flagged'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

const Feedback = mongoose.model('Feedback', feedbackSchema);
export default Feedback;
