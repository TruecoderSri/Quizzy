import { Router } from "express";
import {
  createQuiz,
  getQuizzes,
  getQuizById,
  submitQuiz,
  updateQuiz,
  deleteQuiz,
} from "../controllers/quizController.js";
import authMiddleware from "../middleware/authMiddleware.js";
const quizRoutes = Router();

quizRoutes.post("/", authMiddleware,createQuiz);
quizRoutes.get("/", getQuizzes);
quizRoutes.get("/:id", getQuizById);
quizRoutes.post("/:id/submit", submitQuiz);
quizRoutes.put("/:id/update", updateQuiz);
quizRoutes.delete("/:id/delete", deleteQuiz);

export default quizRoutes;
