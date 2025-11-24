import mongoose from 'mongoose';

const studySessionSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    durationMinutes: { type: Number, required: true },
    mode: { type: String, enum: ['focus', 'break'], default: 'focus' },
    notes: String,
    completedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const StudySession = mongoose.model('StudySession', studySessionSchema);
