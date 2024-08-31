import mongoose from "mongoose";
const { Schema, model } = mongoose;

const QuizSchema = new Schema(
  {
    category: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String },
    questions: [
      {
        question: { type: String, required: true },
        options: [String],
        correctAnswer: { type: String, required: true },
      },
    ],
    timer: { type: Number, required: false },
    score: { type: Number },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default model("Quiz", QuizSchema);
