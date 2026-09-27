import mongoose from 'mongoose';

const suggestedAchieverSchema = new mongoose.Schema(
  {
    // Who suggested
    submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    submitterName: { type: String, required: true, trim: true },
    submitterEmail: { type: String, required: true, trim: true },
    submitterPhone: { type: String, default: '' },

    // Achiever details
    name: { type: String, required: true, trim: true },
    title: { type: String, default: '' },         // e.g. "Principal, XYZ School"
    category: { type: String, required: true },
    district: { type: String, required: true },
    services: { type: String, default: '' },       // what services / contributions
    achievements: [{ type: String }],             // list of achievements
    bio: { type: String, default: '' },
    photo: { type: String, default: '' },         // URL or base64

    // Supporting documents (PDF uploads stored in /uploads)
    documents: [
      {
        filename: { type: String },
        originalName: { type: String },
        url: { type: String },
        uploadedAt: { type: Date, default: Date.now },
      },
    ],

    // Admin review fields
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'promoted'],
      default: 'pending',
    },
    adminNote: { type: String, default: '' },
    reviewedBy: { type: String, default: '' },
    reviewedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

const SuggestedAchiever = mongoose.model('SuggestedAchiever', suggestedAchieverSchema);
export default SuggestedAchiever;
