import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function CreateQuiz() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [timer, setTimer] = useState(5);
  const [category, setCategory] = useState("");
  const [questions, setQuestions] = useState([
    { question: "", options: ["", "", "", ""], correctAnswer: "" },
  ]);
  const [errors, setErrors] = useState({
    title: "",
    description: "",
    questions: "",
    category: "",
  });

  const categories = [
    "Math",
    "Science",
    "History",
    "Geography",
    "Literature",
    "Art",
    "Music",
    "Technology",
    "Sports",
    "General Knowledge",
  ];

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

    currentQuestion.correctAnswer =
      currentQuestion.correctAnswer === optionValue ? "" : optionValue;
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

    // Validate form inputs
    const newErrors = {
      title: !title ? "Title is required." : "",
      description: !description ? "Description is required." : "",
      category: !category ? "Category is required." : "",
      questions: questions.some((q) => !q.question || q.options.includes(""))
        ? "Please fill out all questions and options."
        : "",
    };

    // Check for errors
    if (Object.values(newErrors).some((error) => error)) {
      setErrors(newErrors);
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_APP_BASE_URL}/api/quizzes`,
        {
          category,
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
      alert("Quiz created successfully!");

      // Reset form fields
      setTitle("");
      setDescription("");
      setCategory("");
      setQuestions([
        { question: "", options: ["", "", "", ""], correctAnswer: "" },
      ]);
      setTimer(5);

      // Navigate to the dashboard
      navigate("/dashboard");
    } catch (error) {
      console.error("Error creating quiz:", error);

      // Enhanced error handling
      const errorMessage =
        error.response?.data?.message ||
        "There was an error creating the quiz. Please try again.";
      alert(errorMessage);
    }
  };

  return (
    <>
      <h1
        className="md:text-7xl text-4xl text-gray-900 p-4 opacity-80 font-bold"
        id="create-quiz-heading"
      >
        Create your own Quiz
      </h1>
      <div
        className="max-w-4xl mx-auto my-8 p-8 bg-gradient-to-r from-blue-200 to-purple-300 shadow-lg rounded-lg"
        aria-labelledby="create-quiz-heading"
      >
        <form onSubmit={handleSubmit} aria-describedby="error-summary">
          <div className="mb-4">
            <label
              htmlFor="category-select"
              className="block text-left mb-2 font-medium"
            >
              Category
            </label>
            <select
              id="category-select"
              name="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
              aria-required="true"
              aria-invalid={errors.category ? "true" : "false"}
            >
              <option value="" disabled>
                Select a category
              </option>
              {categories.map((categoryOption) => (
                <option key={categoryOption} value={categoryOption}>
                  {categoryOption}
                </option>
              ))}
            </select>
            {errors.category && (
              <p
                className="text-red-500 text-sm"
                id="error-category"
                role="alert"
              >
                {errors.category}
              </p>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="title" className="block text-left mb-2 font-medium">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
              aria-required="true"
              aria-invalid={errors.title ? "true" : "false"}
            />
            {errors.title && (
              <p className="text-red-500 text-sm" role="alert">
                {errors.title}
              </p>
            )}
          </div>

          <div className="mb-4">
            <label
              htmlFor="description"
              className="block text-left mb-2 font-medium"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
              aria-required="true"
              aria-invalid={errors.description ? "true" : "false"}
            />
            {errors.description && (
              <p className="text-red-500 text-sm" role="alert">
                {errors.description}
              </p>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="timer" className="block text-left mb-2 font-medium">
              Timer (in minutes)
            </label>
            <input
              type="number"
              id="timer"
              name="timer"
              value={timer}
              onChange={(e) => setTimer(Number(e.target.value))}
              className="w-full px-4 py-2 border rounded-lg"
              aria-required="true"
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
                aria-required="true"
              />
              <label
                htmlFor={`mark-${qIndex}`}
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
                    aria-label={`Option ${oIndex + 1} for Question ${
                      qIndex + 1
                    }`}
                    aria-required="true"
                  />
                  <input
                    type="checkbox"
                    id={`mark-${qIndex}`}
                    checked={q.correctAnswer === option}
                    onChange={() => handleCorrectAnswerChange(qIndex, oIndex)}
                    className="ml-4"
                    aria-label={`Correct answer for Question ${qIndex + 1}`}
                  />
                </div>
              ))}
            </div>
          ))}
          {errors.questions && (
            <p className="text-red-500 text-sm" role="alert">
              {errors.questions}
            </p>
          )}

          <div className="flex justify-evenly gap-4">
            <button
              type="button"
              onClick={handleAddQuestion}
              className="bg-sky-600 hover:ring-2 ring-offset-2 text-lg text-bold text-white py-2 px-4 rounded hover:bg-sky-800 focus:outline focus:outline-sky-500"
            >
              Add Question
            </button>
            <button
              type="submit"
              className="bg-indigo-600 hover:ring-2 ring-offset-2 ring-purple-300 text-lg text-bold text-white py-2 px-4 rounded hover:bg-indigo-800 focus:outline focus:outline-indigo-500"
            >
              Create Quiz
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default CreateQuiz;
