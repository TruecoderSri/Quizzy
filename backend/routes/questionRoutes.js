import express from "express";
import { createQuestion } from "../controllers/questionController.js";
import authenticateToken from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/", authenticateToken, createQuestion);
export default router;
