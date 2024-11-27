import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function QuizOfTheDay() {
  const [todaysAutoQuiz, setTodaysAutoQuiz] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchOrCreateQuizOfTheDay = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");

      const quizOfTheDayUrl = `${
        import.meta.env.VITE_APP_BASE_URL
      }/api/quizzes/qotd`;

      const response = await axios.get(quizOfTheDayUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Set the fetched or newly created quiz in state
      setTodaysAutoQuiz(response.data);
      console.log("Quiz of the Day fetched successfully:", response.data);
    } catch (err) {
      console.error("Error fetching or creating today's auto quiz:", err);
      setError("Failed to load today's auto quiz. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch the quiz on component mount
  useEffect(() => {
    fetchOrCreateQuizOfTheDay();
  }, []);

  const handleTakeQuiz = () => {
    if (todaysAutoQuiz) {
      navigate(`/takeQuiz/${todaysAutoQuiz._id}`);
    }
  };

  return (
    <div className=" m-2 p-6 bg-gray-50 rounded-lg shadow-lg ">
      <h2 className="md:text-2xl font-bold text-left text-stone-900 uppercase">
        Quiz of the Day
      </h2>
      {loading ? (
        <div className="text-center text-gray-500">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-500 font-bold">{error}</div>
      ) : todaysAutoQuiz ? (
        <div
          key={todaysAutoQuiz._id}
          className=" mt-2 px-4 py-3 flex bg-gradient-to-r from-blue-400 to-purple-400  rounded-lg shadow-xl transform transition-all hover:shadow-2xl md:flex flex-row justify-between align-middle"
        >
          <span className="text-sm md:text-2xl font-semibold text-white">
            {todaysAutoQuiz.title}
          </span>
          <button
            className="text-sm md:text-lg bg-blue-800 text-white px-4 py-2 rounded-lg font-semibold transition duration-300 ease-in-out transform hover:bg-blue-700 hover:scale-105"
            onClick={handleTakeQuiz}
          >
            Take Quiz
          </button>
        </div>
      ) : (
        <p className="text-center text-gray-500 italic mt-4">
          No auto-generated quiz available for today.
        </p>
      )}
    </div>
  );
}

export default QuizOfTheDay;
