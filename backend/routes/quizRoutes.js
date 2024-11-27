import { Router } from "express";
import {
  createQuiz,
  getUserQuizzes,
  getQuizById,
  filterQuizzes,
  submitQuiz,
  updateQuiz,
  deleteQuiz,
  quizOfTheDay,
  getLeaderboard,
} from "../controllers/quizController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const quizRoutes = Router();

quizRoutes.post("/", authMiddleware, createQuiz);
quizRoutes.get("/qotd", authMiddleware, quizOfTheDay);
quizRoutes.get("/filter", filterQuizzes);
quizRoutes.get("/", getUserQuizzes);
quizRoutes.get("/:id", getQuizById);
quizRoutes.post("/:id/submit", submitQuiz);
quizRoutes.put("/:id/update", updateQuiz);
quizRoutes.delete("/:id/delete", deleteQuiz);
quizRoutes.get("/:quizId/leaderboard", authMiddleware, getLeaderboard);

export default quizRoutes;
