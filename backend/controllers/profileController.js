import User from "../models/User.js";
import Quiz from "../models/Quiz.js";

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select(
      "username password"
    );
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

export const getUserScores = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate(
      "scores.quizId",
      "title"
    );
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const scoresWithTitles = user.scores
      .filter((score) => score.quizId !== null && score.quizId !== undefined)
      .map((score) => ({
        quizId: score.quizId._id,
        title: score.quizId.title,
        score: score.score,
      }));
    res.json({ scores: scoresWithTitles });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

export const getUserQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find({ createdBy: req.params.userId }).select(
      "title"
    );
    res.json(quizzes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};
