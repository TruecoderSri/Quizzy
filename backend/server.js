import express, { json } from "express";
import connectDB from "./config/db.js";
import { config } from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import questionRoutes from "./routes/questionRoutes.js";
import quizRoutes from "./routes/quizRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import cors from "cors";

config();

const app = express();

app.use(cors());
connectDB();

app.use(json());

app.use("/api/auth", authRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/users", profileRoutes);

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

// module.exports = { app };
