import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import PropTypes from "prop-types";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

function AvailableQuizzes({ filters }) {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1); // Current page number
  const [totalPages, setTotalPages] = useState(1); // Total pages for pagination
  const quizzesPerPage = 5; // Number of quizzes to display per page
  const navigate = useNavigate();

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");

      // Simulate delay of 5 seconds for smooth loading
      await new Promise((resolve) => setTimeout(resolve, 5000));

      let url = `${import.meta.env.VITE_APP_BASE_URL}/api/quizzes/filter`;
      const query = new URLSearchParams();
      if (filters.category && filters.category !== "All") {
        query.append("category", filters.category);
      }
      if (filters.latest) {
        query.append("sortBy", filters.latest === "Latest" ? "desc" : "asc");
      }

      if (query.toString()) {
        url = `${url}?${query.toString()}`;
      }

      console.log("Fetching from URL:", url);
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // If no quizzes are fetched, call the Open Trivia API
      if (!response.data.length) {
        console.log("No quizzes found. Fetching from Open Trivia API...");

        // Fetch quizzes from Open Trivia Database
        const opentdbUrl = "https://opentdb.com/api.php?amount=5&type=multiple"; // Adjust the number and type as needed
        const opentdbResponse = await axios.get(opentdbUrl);

        // Prepare the quizzes for posting to your backend
        const quizzesToPost = opentdbResponse.data.results.map((triviaQuiz) => {
          const options = [
            ...triviaQuiz.incorrect_answers,
            triviaQuiz.correct_answer,
          ];
          return {
            category: triviaQuiz.category,
            title: `Trivia: ${triviaQuiz.category}`, // Shorter title
            description: `A quiz about ${triviaQuiz.category}`,
            questions: [
              {
                question: triviaQuiz.question,
                options: options.sort(() => Math.random() - 0.5), // Shuffle options
                correctAnswer: triviaQuiz.correct_answer,
              },
            ],
            timer: 300,
          };
        });

        // Send the quizzes to your backend for storage
        const postUrl = `${import.meta.env.VITE_APP_BASE_URL}/api/quizzes`;
        await Promise.all(
          quizzesToPost.map((quiz) =>
            axios.post(postUrl, quiz, {
              headers: { Authorization: `Bearer ${token}` },
            })
          )
        );

        // Fetch the updated quizzes from the backend again
        const updatedResponse = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setQuizzes(updatedResponse.data);
        setTotalPages(Math.ceil(updatedResponse.data.length / quizzesPerPage));
      } else {
        // If quizzes were found in the DB, display them
        setQuizzes(response.data);
        setTotalPages(Math.ceil(response.data.length / quizzesPerPage)); // Set total pages based on the fetched quizzes
      }
    } catch (err) {
      console.error("Error fetching quizzes:", err.message);
      setError("Failed to load quizzes. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, [filters]);

  const formatTitle = (title) => {
    // Decode HTML entities
    const decodedTitle = title.replace(/&quot;/g, '"').replace(/&amp;/g, "&");

    const cleanedTitle = decodedTitle.replace(/^Trivia:\s*/, "");

    const capitalizedTitle = cleanedTitle
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    const maxLength = 60; // Set max length as needed
    return capitalizedTitle.length > maxLength
      ? capitalizedTitle.slice(0, maxLength) + "..." // Add ellipsis if truncated
      : capitalizedTitle;
  };

  if (loading)
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column", // Stack items vertically
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px",
          width: "100%",
        }}
      >
        <CircularProgress sx={{ display: "flex", alignItems: "center" }} />
        <p className="p-2 from-neutral-700 opacity-85">Hang Tight...</p>
      </Box>
    );
  if (error)
    return (
      <p
        style={{ display: "flex", justifyContent: "center", fontSize: "1rem" }}
      >
        {error}
      </p>
    );

  // Calculate the quizzes to display for the current page
  const startIndex = (page - 1) * quizzesPerPage;
  const currentQuizzes = quizzes.slice(startIndex, startIndex + quizzesPerPage);

  return (
    <div
      className="dashboard-container w-full h-fit mx-auto py-4 px-8 shadow-lg rounded-lg bg-white overflow-y-auto scrollbar-hidden"
      aria-labelledby="available-quizzes-heading"
    >
      <h2
        id="available-quizzes-heading"
        className="text-2xl md:text-4xl font-bold m-4"
      >
        Available Quizzes
      </h2>
      <div className="quiz-list">
        {currentQuizzes.length > 0 ? (
          currentQuizzes.map((quiz) => (
            <div
              key={quiz._id}
              className="quiz-tile flex justify-between gap-4 items-center p-4 mb-4 shadow-md rounded bg-gray-100 hover:bg-gray-200"
            >
              <span className="quiz-title text-lg font-semibold">
                {formatTitle(quiz.title)}
              </span>
              <button
                className="take-button bg-blue-600 text-white py-1 px-4 rounded hover:bg-blue-800 focus:outline focus:outline-blue-500"
                onClick={() => navigate(`/takeQuiz/${quiz._id}`)}
                aria-label={`Take quiz: ${quiz.title}`}
              >
                Take
              </button>
            </div>
          ))
        ) : (
          <p>No quizzes found.</p>
        )}
      </div>

      <Stack spacing={2} className="mt-4">
        <Pagination
          count={totalPages}
          page={page}
          variant="outlined"
          shape="rounded"
          className="flex justify-center"
          onChange={(event, value) => setPage(value)}
          aria-label="Quiz pagination"
        />
      </Stack>
    </div>
  );
}

AvailableQuizzes.propTypes = {
  filters: PropTypes.shape({
    category: PropTypes.string,
    latest: PropTypes.string,
  }).isRequired,
};

export default AvailableQuizzes;
