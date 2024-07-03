import Quiz from "../models/Quiz.js";
import User from "../models/User.js";

export async function createQuiz(req, res) {
  const { title, description, questions, timer } = req.body;
  const userId = req.user.userId;
  console.log(req.user.userId);
  try {
    const quiz = new Quiz({
      title,
      description,
      questions,
      timer,
      createdBy: userId,
    });

    await User.findByIdAndUpdate(userId, { $push: { quizzes: quiz._id } });

    await quiz.save();
    res.status(201).json(quiz);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
}

export async function getQuizzes(req, res) {
  try {
    const quizzes = await Quiz.find().populate("createdBy", "username");
    res.json(quizzes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
}

export async function getQuizById(req, res) {
  try {
    const quiz = await Quiz.findById(req.params.id).populate(
      "createdBy",
      "username"
    );

    if (!quiz) {
      return res.status(404).json({ msg: "Quiz not found" });
    }

    res.json(quiz);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
}

export async function submitQuiz(req, res) {
  const { id } = req.params;
  const { answer, userId } = req.body;

  try {
    const quiz = await Quiz.findById(id);
    if (!quiz) {
      return res.status(404).json({ msg: "Quiz not found" });
    }

    let score = 0;
    quiz.questions.forEach((question) => {
      const selectedAnswer = answer[question._id];
      const correctAnswer = question.correctAnswer;

      if (selectedAnswer === correctAnswer) {
        score += 1;
      }
    });

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    user.scores.push({ quizId: id, score });
    await user.save();

    res.json({ score, total: quiz.questions.length });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
}

export async function updateQuiz(req, res) {
  const { id } = req.params;
  const { title, description, questions, timer } = req.body;

  try {
    const quiz = await Quiz.findById(id);
    if (!quiz) {
      return res.status(404).json({ msg: "Quiz not found" });
    }

    quiz.title = title;
    quiz.description = description;
    quiz.questions = questions;
    quiz.timer = timer;

    await quiz.save();

    res.json(quiz);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
}

export async function deleteQuiz(req, res) {
  const { id } = req.params;

  try {
    const quiz = await Quiz.findById(id);
    if (!quiz) {
      return res.status(404).json({ msg: "Quiz not found" });
    }

    await quiz.deleteOne();

    await User.findByIdAndUpdate(
      quiz.createdBy,
      { $pull: { quizzes: quiz._id } },
      { new: true }
    );

    await User.updateMany(
      { "scores.quizId": quiz._id },
      { $pull: { scores: { quizId: quiz._id } } }
    );

    res.json({ msg: "Quiz deleted successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
}
