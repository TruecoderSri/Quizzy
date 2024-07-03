import Question from "../models/Question.js";

export async function createQuestion(req, res) {
  const { question, options, correctAnswer } = req.body;

  try {
    const newQuestion = new Question({
      question,
      options,
      correctAnswer,
    });
    await newQuestion.save();
    res.status(201).json(newQuestion);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
}
