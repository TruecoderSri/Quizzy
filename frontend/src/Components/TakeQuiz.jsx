import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import ConfettiExplosion from "react-confetti-explosion";
import { jwtDecode } from "jwt-decode";
import { Modal, Box, Typography, IconButton } from "@mui/material";
import { PiConfettiBold } from "react-icons/pi";
import Leaderboard from "./Leaderboard";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";

function TakeQuiz() {
  const token = localStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const userId = decodedToken.userId;

  const navigate = useNavigate();
  const { quizId } = useParams();
  const formattedQuizId = quizId.replace(/^:/, "");
  const [quiz, setQuiz] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [score, setScore] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [timeTaken, setTimeTaken] = useState(0);
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(false);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_APP_BASE_URL}/api/quizzes/${formattedQuizId}`
        );
        setQuiz(response.data); // Update state with fetched quiz data
      } catch (error) {
        console.error("Error fetching quiz:", error);
        setError("Failed to load quiz. Please try again.");
      }
    };

    fetchQuiz();
  }, [formattedQuizId]);

  useEffect(() => {
    let timer;
    if (isStarted && timeLeft !== null && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1, 0);
      }, 1000);
    } else if (timeLeft === 0 && isStarted && !submitted) {
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
    // If TTS is enabled and quiz has a timer, start the timer narrational
    if (isSpeechEnabled || quiz?.timer) {
      setTimeLeft(quiz.timer * 60); // Set the initial time
      // Narrate the time immediately after starting the quiz
      handleSpeech();
    }

    // Start the quiz
    setIsStarted(true);

    // If TTS is enabled, narrate the "Quiz Started" and the first set of questions and options
    if (isSpeechEnabled) {
      const startMsg = new SpeechSynthesisUtterance("Quiz Started");
      window.speechSynthesis.speak(startMsg);

      // Narrate the questions and their options
      quiz?.questions.forEach((question, index) => {
        const questionMsg = new SpeechSynthesisUtterance(
          `Question ${index + 1}: ${question.question}`
        );
        window.speechSynthesis.speak(questionMsg);

        // Narrate each option
        question.options.forEach((option, optionIndex) => {
          const optionMsg = new SpeechSynthesisUtterance(
            `Option ${optionIndex + 1}: ${option}`
          );
          window.speechSynthesis.speak(optionMsg);
        });
      });
    }
  };

  const handleSubmit = async () => {
    window.speechSynthesis.cancel();
    if (
      Object.keys(selectedAnswers).length !== quiz.questions.length &&
      timeLeft > 0
    ) {
      setError("Please answer all questions before submitting.");
      return;
    }

    const finalTimeTaken = quiz.timer * 60 - timeLeft;
    setTimeTaken(finalTimeTaken);
    try {
      const response = await axios.post(
        `${
          import.meta.env.VITE_APP_BASE_URL
        }/api/quizzes/${formattedQuizId}/submit`,
        {
          answer: selectedAnswers,
          userId,
          timeTaken: finalTimeTaken,
        }
      );
      const calculatedScore = response.data.score;
      setScore(calculatedScore);
      setTimeLeft(0);
      setSubmitted(true);
      setError("");
      // setTimeTaken(finalTimeTaken);

      // Calculate 60% of max score
      const maxScore = quiz.questions.length;
      const passingScore = maxScore * 0.6; // 60% of max score

      if (calculatedScore >= passingScore) {
        setShowConfetti(true); // Show confetti when the score is above or equal to 60%
        setTimeout(() => setShowConfetti(false), 3000);
      }
      setOpenModal(true);
    } catch (error) {
      console.error("Error submitting quiz:", error);
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    navigate("/dashboard"); // Navigate to dashboard after closing modal
  };

  const toggleSpeech = () => {
    if (isSpeechEnabled) {
      window.speechSynthesis.cancel(); // Stop any ongoing speech if toggled off
    } else {
      if (isStarted) {
        // Narrate the remaining time and current question/answers
        const timeMsg = new SpeechSynthesisUtterance(
          `Time Left: ${Math.floor(timeLeft / 60)} minutes and ${
            timeLeft % 60
          } seconds.`
        );
        window.speechSynthesis.speak(timeMsg);

        quiz?.questions.forEach((question, index) => {
          if (!selectedAnswers[question._id]) {
            const questionMsg = new SpeechSynthesisUtterance(
              `Question ${index + 1}: ${question.question}`
            );
            window.speechSynthesis.speak(questionMsg);

            question.options.forEach((option, optionIndex) => {
              const optionMsg = new SpeechSynthesisUtterance(
                `Option ${optionIndex + 1}: ${option}`
              );
              window.speechSynthesis.speak(optionMsg);
            });
          }
        });
      } else {
        // Narrate the quiz title and description if it hasn't started yet
        const titleMsg = new SpeechSynthesisUtterance(`Title: ${quiz.title}`);
        const descriptionMsg = new SpeechSynthesisUtterance(
          `Description: ${quiz.description}`
        );
        window.speechSynthesis.speak(titleMsg);
        window.speechSynthesis.speak(descriptionMsg);
      }
    }
    setIsSpeechEnabled(!isSpeechEnabled); // Toggle TTS state
  };

  // Function to handle time-based speech updates (e.g., timer, alerts)
  const handleSpeech = () => {
    if (!isSpeechEnabled) return;

    if (isStarted && timeLeft !== null && timeLeft > 0) {
      // Only narrate time-related events if TTS is enabled and quiz is running

      if (timeLeft === 60) {
        // Alert at the 1-minute mark
        const oneMinuteAlert = new SpeechSynthesisUtterance("1 minute left");
        window.speechSynthesis.speak(oneMinuteAlert);
      }

      if (timeLeft <= 10) {
        // Narrate countdown from 10 seconds
        const countdownMsg = new SpeechSynthesisUtterance(timeLeft.toString());
        window.speechSynthesis.speak(countdownMsg);
      }
    }
  };

  // Effect hook to trigger handleSpeech periodically based on quiz state or timer change
  useEffect(() => {
    if (isStarted && isSpeechEnabled) {
      // Ensure timer is narrated after everything else is done
      handleSpeech();
    }
  }, [isStarted, timeLeft]); // Trigger when quiz starts or time changes

  // In your component JSX (example for submit button)
  <button onClick={handleSubmit}>Submit</button>;

  if (!quiz) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div
        className="take-quiz-container mb-8 mx-auto max-w-4xl h-full p-8 rounded-xl shadow-xl bg-slate-50"
        aria-labelledby="quiz-title"
      >
        <div className="flex md:flex-row justify-between border-b-2">
          <h1
            id="quiz-title"
            className="text-4xl md:text-6xl font-bold md:text-left pb-4 mb-4 "
          >
            {quiz.title}
          </h1>
          <div className="">
            <IconButton
              onClick={() => {
                toggleSpeech();
                handleSpeech();
              }}
              aria-label="Toggle Speech"
              className="absolute"
            >
              <VolumeUpIcon />
            </IconButton>
            <p className="opacity-40">Read Aloud</p>
          </div>
        </div>
        <p
          className="text-lg md:text-xl p-4 mb-4 font-medium md:text-left"
          aria-describedby="quiz-description"
        >
          {quiz.description}
        </p>

        {isStarted ? (
          <div>
            <div
              id="timer"
              className="timer text-red-600 text-xl mb-4"
              aria-live="polite"
            >
              Time Left: {Math.floor(timeLeft / 60)}:
              {timeLeft % 60 < 10 ? `0${timeLeft % 60}` : timeLeft % 60}
            </div>
            {quiz.questions.map((question, index) => (
              <div
                key={question._id}
                className="mb-6"
                aria-labelledby={`question-${question._id}`}
              >
                <h2 className="text-2xl mb-2" id={`question-${question._id}`}>
                  {index + 1}. {question.question}
                </h2>
                <div className="options grid grid-cols-1 md:grid-cols-2 gap-4">
                  {question.options.map((option) => (
                    <label
                      key={option}
                      className="block bg-gray-100 p-2 rounded-md cursor-pointer hover:bg-gray-200"
                      htmlFor={`option-${question._id}-${option}`}
                    >
                      <input
                        type="radio"
                        id={`option-${question._id}-${option}`}
                        name={`question-${question._id}`}
                        value={option}
                        onChange={() =>
                          handleOptionChange(question._id, option)
                        }
                        className="mr-2"
                        aria-label={`Option ${option} for Question ${
                          index + 1
                        }`}
                      />
                      {option}
                    </label>
                  ))}
                </div>
              </div>
            ))}
            {timeLeft >= 0 && error && (
              <p className="text-red-500 text-sm" role="alert">
                {error}
              </p>
            )}
            <button
              onClick={handleSubmit}
              className={`submit-button py-2 px-4 rounded ${
                timeLeft > 0 && !submitted
                  ? "bg-green-600 text-white hover:bg-green-800"
                  : "bg-gray-400 text-gray-200 cursor-not-allowed"
              }`}
              aria-disabled={timeLeft <= 0 || submitted ? "true" : "false"}
              disabled={timeLeft <= 0 || submitted}
            >
              Submit
            </button>
          </div>
        ) : (
          <>
            <button
              onClick={handleStart}
              className="start-button bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-800"
              aria-label="Start the quiz"
            >
              Start Quiz
            </button>
          </>
        )}

        <Modal
          open={openModal}
          onClose={handleCloseModal}
          aria-labelledby="quiz-result-heading"
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "90%", // Adjust for smaller screens
              maxWidth: "500px", // Set a max width for larger screens
              bgcolor: "background.paper",
              borderRadius: 2,
              boxShadow: 24,
              p: 4,
              textAlign: "center",
            }}
          >
            <Typography
              variant="h4"
              component="h2"
              id="quiz-result-heading"
              sx={{
                fontSize: { xs: "1.5rem", sm: "2rem" }, // Responsive font sizes
                fontWeight: "bold",
                color: score >= quiz.questions.length * 0.6 ? "green" : "red",
                textAlign: "center",
                mb: 2,
                fontFamily: "Arial, sans-serif",
              }}
            >
              {score >= quiz.questions.length * 0.6 ? (
                <div className="flex flex-row justify-center items-center gap-2">
                  <span>Congratulations</span>
                  <PiConfettiBold className="color-neutral" />
                </div>
              ) : (
                "Keep trying!"
              )}
            </Typography>

            <Typography
              variant="body1"
              sx={{
                mt: 2,
                color: "black",
                fontSize: { xs: "1rem", sm: "1.2rem" }, // Responsive font size
              }}
            >
              {score >= quiz.questions.length * 0.6
                ? "You have passed the quiz!"
                : "Better luck next time."}
            </Typography>

            {/* Score display */}
            {score !== null && (
              <div
                className="score text-2xl font-bold mt-4"
                style={{
                  fontSize: "1.5rem", // Adjust font size for responsiveness
                }}
              >
                <h3>
                  Your Score: {score} / {quiz.questions.length}
                </h3>

                {/* Conditionally render the confetti effect */}
                {showConfetti && <ConfettiExplosion />}
              </div>
            )}

            {/* Navigation buttons */}
            <div className="mt-4">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-800 w-full sm:w-auto"
                aria-label="Go to Dashboard"
              >
                Go to Dashboard
              </button>
              {/* <button
                onClick={() => navigate(`/takeQuiz/${quiz._id}`)}
                className="px-4 py-2 bg-stone-700 text-white rounded-md hover:bg-stone-800 w-full sm:w-auto"
                aria-label="View Leaderboard"
              >
                View Leaderboard
              </button> */}
            </div>
          </Box>
        </Modal>
      </div>
      {!isStarted && <Leaderboard quizId={quizId} />}
    </>
  );
}

export default TakeQuiz;
