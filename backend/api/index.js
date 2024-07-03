import quizRoutes from "../routes/quizRoutes.js";
import profileRoutes from "../routes/profileRoutes.js";
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

export default app;