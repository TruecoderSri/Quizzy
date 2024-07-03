import { Router } from "express";
import {
  getUserProfile,
  getUserScores,
  getUserQuizzes,
} from "../controllers/profileController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const profileRoutes = Router();

profileRoutes.get("/:userId/profile", authMiddleware, getUserProfile);
profileRoutes.get("/:userId/scores", authMiddleware, getUserScores);
profileRoutes.get("/:userId/quizzes", authMiddleware, getUserQuizzes);

export default profileRoutes;
