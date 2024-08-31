import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import PropTypes from "prop-types";

function AvailableQuizzes({ filters }) {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        setLoading(true);
        setError(null);

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

        const response = await axios.get(url);
        setQuizzes(response.data);
      } catch (err) {
        console.error("Error fetching quizzes:", err.message);
        setError("Failed to load quizzes. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, [filters]);

  if (loading) return <p>Loading quizzes...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="dashboard-container w-full h-fit mx-auto py-4 px-8 shadow-lg rounded-lg bg-white overflow-y-auto scrollbar-hidden">
      <h2 className="text-2xl md:text-4xl font-bold text-left m-4">
        Available Quizzes
      </h2>
      <div className="quiz-list">
        {quizzes.length > 0 ? (
          quizzes.map((quiz) => (
            <div
              key={quiz._id}
              className="quiz-tile flex justify-between gap-4 items-center p-4 mb-4 shadow-md rounded bg-gray-100 hover:bg-gray-200"
            >
              <span className="quiz-title text-lg font-semibold">
                {quiz.title}
              </span>
              <button
                className="take-button bg-blue-600 text-white py-1 px-4 rounded hover:bg-blue-800"
                onClick={() => navigate(`/takeQuiz/${quiz._id}`)}
              >
                Take
              </button>
            </div>
          ))
        ) : (
          <p>No quizzes found.</p>
        )}
      </div>
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
