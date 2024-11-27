import Quiz from "../models/Quiz.js";
import User from "../models/User.js";
import axios from "axios";
import { JSDOM } from "jsdom";
import mongoose from "mongoose";

// export async function createQuiz(req, res) {
//   const { category, title, description, questions, timer } = req.body;
//   const userId = req.user.userId;
//   console.log(req.user.userId);
//   try {
//     const quiz = new Quiz({
//       category,
//       title,
//       description,
//       questions,
//       timer,
//       createdBy: userId,
//     });

//     await User.findByIdAndUpdate(userId, { $push: { quizzes: quiz._id } });

//     await quiz.save();
//     res.status(201).json(quiz);
//   } catch (error) {
//     console.error(error.message);
//     res.status(500).send("Server error");
//   }
// }

const opentdbCategoryMap = {
  Science: "Science",
  History: "History",
  Technology: "Science: Computers",
  Mathematics: "Science: Mathematics",
  Literature: "Entertainment: Books",
  Geography: "Geography",
  Sports: "Sports",
  Music: "Entertainment: Music",
  Art: "Entertainment: Art",
  "General Knowledge": "General Knowledge",
};

let lastCategoryIndex = 0; // Variable to track the last category used
const lastQuizCreationDate = {}; // Object to track quiz creation dates

function formatTriviaQuiz(results) {
  const decodeHtml = (text) => {
    const dom = new JSDOM("");
    const element = dom.window.document.createElement("div");
    element.innerHTML = text;
    return element.textContent || text;
  };

  return {
    questions: results.map((item) => {
      const options = [...item.incorrect_answers, item.correct_answer]
        .map(decodeHtml)
        .sort(() => Math.random() - 0.5);

      return {
        question: decodeHtml(item.question),
        options: options,
        correctAnswer: decodeHtml(item.correct_answer),
      };
    }),
    timer: 5,
  };
}

export async function createQuiz(req, res) {
  const { category, title, description, questions, timer } = req.body;
  const userId = req.user.userId;

  console.log(req.user.userId);

  try {
    // Check if required fields are provided
    if (!title || !description || !questions || questions.length === 0) {
      // No title, description, or questions provided, proceed with auto-load
      const selectedCategory = category || Object.keys(opentdbCategoryMap)[0]; // Fallback to first category if none provided
      const opentdbCategory = opentdbCategoryMap[selectedCategory];

      console.log(
        `Fetching trivia questions for category: ${selectedCategory}`
      );

      const triviaResponse = await axios.get("https://opentdb.com/api.php", {
        params: { amount: 5, category: opentdbCategory, type: "multiple" },
      });

      if (triviaResponse.data && triviaResponse.data.response_code === 0) {
        // Format trivia questions for saving
        const formattedQuiz = formatTriviaQuiz(triviaResponse.data.results);

        // Create a new quiz with the fetched trivia questions
        const quiz = new Quiz({
          category: selectedCategory,
          title: `Auto-generated Quiz - ${selectedCategory}`,
          description: "This quiz was automatically generated.",
          questions: formattedQuiz.questions,
          timer: formattedQuiz.timer,
          createdBy: userId,
        });

        // Save user quiz reference
        await User.findByIdAndUpdate(userId, { $push: { quizzes: quiz._id } });

        await quiz.save();
        return res.status(201).json(quiz); // Successfully created quiz
      } else {
        return res
          .status(400)
          .json({ message: "Failed to fetch trivia questions." });
      }
    }

    // Proceed with manual quiz creation if all fields are supplied
    const quiz = new Quiz({
      category,
      title,
      description,
      questions,
      timer,
      createdBy: userId,
    });

    await User.findByIdAndUpdate(userId, { $push: { quizzes: quiz._id } });

    await quiz.save();
    res.status(201).json(quiz); // Successfully created quiz
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
}

export async function quizOfTheDay(req, res) {
  const systemUserId = "667e8732d343992f57c3acf8";
  console.log("Received Token:", req.headers.authorization);
  const userId = req.user?.userId;
  if (!userId) {
    return res.status(401).json({ msg: "Unauthorized: Missing userId" });
  }

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const todaysAutoQuizzes = await Quiz.find({
      createdAt: { $gte: today, $lt: tomorrow },
      createdBy: systemUserId,
    }).exec();

    if (todaysAutoQuizzes.length === 0) {
      console.log("No quiz available for today, creating a new one...");

      let triviaResponse;
      try {
        triviaResponse = await axios.get("https://opentdb.com/api.php", {
          params: { amount: 5, type: "multiple" },
          responseType: "json",
        });
      } catch (error) {
        console.error(
          "Trivia API Error:",
          error.response?.data || error.message
        );
        return res
          .status(500)
          .json({ msg: "Trivia API error or rate-limited" });
      }

      if (triviaResponse.data && triviaResponse.data.response_code === 0) {
        const formattedQuiz = formatTriviaQuiz(triviaResponse.data.results);

        const quiz = new Quiz({
          category: "General Knowledge",
          title: `${today.toLocaleDateString()}`,
          description: "A mixed collection of questions across categories",
          questions: formattedQuiz.questions,
          timer: formattedQuiz.timer,
          createdBy: systemUserId,
        });

        await quiz.save();
        return res.status(201).json(quiz);
      } else {
        return res
          .status(400)
          .json({ msg: "Failed to fetch trivia questions" });
      }
    } else {
      return res.json(todaysAutoQuizzes[0]);
    }
  } catch (error) {
    console.error("Error fetching or creating quiz:", error.message);
    res.status(500).send("Server error");
  }
}

export async function getUserQuizzes(req, res) {
  const userId = req.params.userId;
  try {
    const quizzes = await Quiz.find({ createdBy: userId }).populate(
      "createdBy",
      "username"
    );
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

export async function filterQuizzes(req, res) {
  try {
    const { category, sortBy } = req.query;
    let filter = {};

    if (category) {
      filter.category = category;
    }

    let quizzesQuery = Quiz.find(filter);

    if (sortBy) {
      quizzesQuery = quizzesQuery.sort({
        createdAt: sortBy === "desc" ? -1 : 1,
      });
    }

    const quizzes = await quizzesQuery.exec();
    res.json(quizzes);
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    res.status(500).json({ message: "Error fetching quizzes" });
  }
}

// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx;
export const getLeaderboard = async (req, res) => {
  const { quizId } = req.params;

  try {
    // Check if the quiz exists
    const quiz = await Quiz.findById(quizId).populate("createdBy", "username");
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    // Fetch users and their scores for the specific quiz
    const users = await User.find().populate("scores.quizId");

    // Construct the leaderboard data
    const leaderboardData = users
      .map((user) => {
        // Check if user.scores is defined and is an array
        if (!user.scores || !Array.isArray(user.scores)) {
          return null; // No scores available for this user
        }

        const userScore = user.scores.find((score) => {
          // Ensure score.quizId is valid and then compare
          return (
            score.quizId &&
            score.quizId.equals(quizId) &&
            score.timeFinished != null
          ); // Check if timeFinished exists
        });

        return userScore && userScore.score > 0
          ? {
              playerName: user.username,
              score: userScore.score,
              timeFinished: userScore.timeFinished, // Only include if it exists
            }
          : null;
      })
      .filter(Boolean); // Filter out null entries

    // Sort the leaderboard based on score and time
    leaderboardData.sort((a, b) => {
      if (b.score === a.score) {
        return a.timeFinished - b.timeFinished; // Lower time has higher priority
      }
      return b.score - a.score; // Higher score has priority
    });

    // Add rank to each entry
    const rankedLeaderboard = leaderboardData.map((entry, index) => ({
      ...entry,
      rank: index + 1,
    }));

    // Send the ranked leaderboard data as a response
    res.json(rankedLeaderboard);
  } catch (error) {
    console.error("Error fetching leaderboard:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

export async function submitQuiz(req, res) {
  const { id } = req.params;
  const { answer, userId, timeTaken } = req.body;

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

    user.scores.push({ quizId: id, score, timeFinished: timeTaken });
    await user.save();

    res.json({ score, total: quiz.questions.length });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
}

export async function updateQuiz(req, res) {
  const { id } = req.params;
  const { category, title, description, questions, timer } = req.body;

  try {
    const quiz = await Quiz.findById(id);
    if (!quiz) {
      return res.status(404).json({ msg: "Quiz not found" });
    }
    quiz.category = category;
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
