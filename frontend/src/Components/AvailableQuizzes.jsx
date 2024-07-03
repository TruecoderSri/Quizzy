import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AvailableQuizzes() {
  const [quizzes, setQuizzes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_APP_BASE_URL}/api/quizzes`
        );
        setQuizzes(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchQuizzes();
  }, []);
  return (
    <div className="dashboard-container h-fit mx-auto py-4 px-8 shadow-lg rounded-lg bg-white overflow-y-auto scrollbar-hidden">
      <h2 className="text-2xl md:text-4xl font-bold text-left m-4">
        Available Quizzes
      </h2>
      <div className="quiz-list">
        {quizzes.map((quiz) => (
          <div
            key={quiz._id}
            className="quiz-tile flex justify-between items-center p-4 mb-4 shadow-md rounded bg-gray-100 hover:bg-gray-200"
          >
            <span className="quiz-title text-lg font-semibold">
              {quiz.title}
            </span>
            <button
              className="take-button bg-blue-600 text-white py-1 px-4 rounded hover:bg-blue-800"
              onClick={() => navigate(`/takeQuiz/:${quiz._id}`)}
            >
              Take
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AvailableQuizzes;
