import mongoose from "mongoose";
const { Schema, model } = mongoose;
const QuestionSchema = new Schema(
  {
    question: { type: String, required: true },
    options: [{ type: String, required: true }],
    correctAnswer: { type: String, required: true },
  },
  { timestamps: true }
);

export default model("Question", QuestionSchema);
