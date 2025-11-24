import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema(
  {
    question: String,
    selectedAnswer: Number,
    correctAnswer: Number,
    isCorrect: Boolean,
  },
  { _id: false }
);

const quizResultSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    topic: { type: String, required: true },
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
    score: { type: Number, required: true },
    totalQuestions: { type: Number, required: true },
    percentage: { type: Number, required: true },
    questions: [questionSchema],
    startedAt: { type: Date, default: Date.now },
    finishedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const QuizResult = mongoose.model('QuizResult', quizResultSchema);
