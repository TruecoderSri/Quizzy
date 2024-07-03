import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

function TakeQuiz() {
  const token = localStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const userId = decodedToken.userId;

  const navigate = useNavigate();
  const { quizId } = useParams();
  const formattedQuizId = quizId.replace(/^:/, "");
  const [quiz, setQuiz] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(300);
  const [isStarted, setIsStarted] = useState(false);
  const [score, setScore] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_APP_BASE_URL}/api/quizzes/${formattedQuizId}`
        );
        setQuiz(response.data);
        if (response.data.timer) {
          setTimeLeft(response.data.timer * 60);
        }
      } catch (error) {
        console.error("Error fetching quiz:", error);
      }
    };

    fetchQuiz();
  }, [formattedQuizId]);

  useEffect(() => {
    let timer;
    if (isStarted && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0 && !submitted) {
      handleSubmit();
    }

    return () => clearInterval(timer);
  }, [isStarted, timeLeft, submitted]);

  const handleOptionChange = (questionId, option) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionId]: option,
    });
  };

  const handleStart = () => {
    setIsStarted(true);
  };

  const handleSubmit = async () => {
    if (Object.keys(selectedAnswers).length !== quiz.questions.length) {
      setError("Please answer all questions before submitting.");
      return;
    }

    try {
      const response = await axios.post(
        `${
          import.meta.env.VITE_APP_BASE_URL
        }/api/quizzes/${formattedQuizId}/submit`,
        {
          answer: selectedAnswers,
          userId,
        }
      );
      setScore(response.data.score);
      setTimeLeft(0);
      setSubmitted(true);
      setError("");
    } catch (error) {
      console.error("Error submitting quiz:", error);
    }
  };

  if (!quiz) {
    return <div>Loading...</div>;
  }

  return (
    <div className="take-quiz-container mx-auto max-w-4xl p-8 rounded-xl shadow-xl bg-slate-50">
      <h1 className="text-4xl md:text-6xl font-bold md:text-left pb-4 mb-4 border-b-2">
        {quiz.title}
      </h1>
      <p className=" text-lg md:text-xl p-4 mb-4 font-medium md:text-left">
        {quiz.description}
      </p>
      {isStarted ? (
        <div>
          <div className="timer text-red-600 text-xl mb-4">
            Time Left: {Math.floor(timeLeft / 60)}:
            {timeLeft % 60 < 10 ? `0${timeLeft % 60}` : timeLeft % 60}
          </div>
          {quiz.questions.map((question, index) => (
            <div key={question._id} className="mb-6">
              <h2 className="text-2xl mb-2">
                {index + 1}. {question.question}
              </h2>
              <div className="options grid grid-cols-1 md:grid-cols-2 gap-4">
                {question.options.map((option) => (
                  <label
                    key={option}
                    className="block bg-gray-100 p-2 rounded-md cursor-pointer hover:bg-gray-200"
                  >
                    <input
                      type="radio"
                      name={`question-${question._id}`}
                      value={option}
                      onChange={() => handleOptionChange(question._id, option)}
                      className="mr-2"
                    />
                    {option}
                  </label>
                ))}
              </div>
            </div>
          ))}
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            onClick={handleSubmit}
            className="submit-button bg-green-600 text-white py-2 px-4 rounded hover:bg-green-800"
          >
            Submit
          </button>
          {score !== null && (
            <>
              <div className="score text-2xl font-bold mt-4 flex flex-col">
                <h3 className="items-center">
                  Your Score: {score} / {quiz.questions.length}
                </h3>
              </div>
              <div className="score text-2xl font-bold mt-4 flex flex-col items-end">
                <button
                  onClick={() => navigate("/dashboard")}
                  className="m-4 px-4 py-2 w-fit text-blue-800 rounded-md hover:underline-offset-2"
                >
                  Go to Dashboard
                </button>
              </div>
            </>
          )}
        </div>
      ) : (
        <button
          onClick={handleStart}
          className="start-button bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-800"
        >
          Start Quiz
        </button>
      )}
    </div>
  );
}

export default TakeQuiz;
