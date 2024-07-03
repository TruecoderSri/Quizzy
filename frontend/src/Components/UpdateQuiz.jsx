import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function UpdateQuiz() {
  const navigate = useNavigate();
  const { quizId } = useParams();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [timer, setTimer] = useState(5);
  const [questions, setQuestions] = useState([
    { question: "", options: ["", "", "", ""], correctAnswer: "" },
  ]);
  const [errors, setErrors] = useState({
    title: "",
    description: "",
    questions: "",
  });

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_APP_BASE_URL}/api/quizzes/${quizId}`
        );
        const quiz = response.data;
        setTitle(quiz.title);
        setDescription(quiz.description);
        setTimer(quiz.timer);
        setQuestions(quiz.questions);
      } catch (error) {
        console.error("Error fetching quiz:", error);
      }
    };

    fetchQuiz();
  }, [quizId]);

  const handleQuestionChange = (index, event) => {
    const newQuestions = [...questions];
    newQuestions[index][event.target.name] = event.target.value;
    setQuestions(newQuestions);
  };

  const handleOptionChange = (questionIndex, optionIndex, event) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options[optionIndex] = event.target.value;
    setQuestions(newQuestions);
  };

  const handleCorrectAnswerChange = (questionIndex, optionIndex) => {
    const newQuestions = [...questions];
    const currentQuestion = newQuestions[questionIndex];
    const optionValue = currentQuestion.options[optionIndex];

    if (currentQuestion.correctAnswer === optionValue) {
      currentQuestion.correctAnswer = "";
    } else {
      currentQuestion.correctAnswer = optionValue;
    }

    setQuestions(newQuestions);
  };

  const handleAddQuestion = () => {
    if (
      !questions[questions.length - 1].question ||
      questions[questions.length - 1].options.includes("")
    ) {
      setErrors({
        ...errors,
        questions:
          "Please fill out all fields for the current question before adding a new one.",
      });
      return;
    }
    setQuestions([
      ...questions,
      { question: "", options: ["", "", "", ""], correctAnswer: "" },
    ]);
    setErrors({ ...errors, questions: "" });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (
      !title ||
      !description ||
      questions.some((q) => !q.question || q.options.includes(""))
    ) {
      setErrors({
        ...errors,
        title: !title ? "Title is required." : "",
        description: !description ? "Description is required." : "",
        questions: questions.some((q) => !q.question || q.options.includes(""))
          ? "Please fill out all questions and options."
          : "",
      });
      return;
    }
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_APP_BASE_URL}/api/quizzes/${quizId}/update`,
        {
          title,
          description,
          questions,
          timer,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log(response.data);
      alert("Quiz Updated Successfully");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error updating quiz:", error);
    }
  };

  return (
    <>
      <h1 className="md:text-7xl text-4xl text-gray-900 p-4 opacity-80 font-bold">
        Update your Quiz
      </h1>
      <div className="max-w-4xl mx-auto my-8 p-8 bg-white shadow-lg rounded-lg">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-left mb-2 font-medium">Title</label>
            <input
              type="text"
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
            />
            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-left mb-2 font-medium">
              Description
            </label>
            <textarea
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
            />
            {errors.description && (
              <p className="text-red-500 text-sm">{errors.description}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-left mb-2 font-medium">
              Timer (in minutes)
            </label>
            <input
              type="number"
              name="timer"
              value={timer}
              onChange={(e) => setTimer(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          {questions.map((q, qIndex) => (
            <div key={qIndex} className="mb-6">
              <label className="block text-left mb-2 font-medium">
                Question {qIndex + 1}
              </label>
              <input
                type="text"
                name="question"
                value={q.question}
                onChange={(e) => handleQuestionChange(qIndex, e)}
                className="w-full px-4 py-2 mb-2 border rounded-lg"
              />
              <label
                htmlFor="mark"
                className="text-xs flex justify-end mb-1 -mr-6"
              >
                Mark answer
              </label>
              {q.options.map((option, oIndex) => (
                <div key={oIndex} className="flex items-center mb-2">
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => handleOptionChange(qIndex, oIndex, e)}
                    className="flex-grow px-4 py-2 border rounded-lg"
                  />
                  <input
                    type="checkbox"
                    checked={q.correctAnswer === option}
                    onChange={() => handleCorrectAnswerChange(qIndex, oIndex)}
                    className="ml-4"
                  />
                </div>
              ))}
            </div>
          ))}
          {errors.questions && (
            <p className="text-red-500 text-sm">{errors.questions}</p>
          )}
          <div className="flex justify-evenly">
            <button
              type="button"
              onClick={handleAddQuestion}
              className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-800"
            >
              Add Question
            </button>
            <button
              type="submit"
              className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-800"
            >
              Update Quiz
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default UpdateQuiz;
