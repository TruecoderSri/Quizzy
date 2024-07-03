import { useNavigate } from "react-router-dom";

function CreateQuizEntry() {
  const navigate = useNavigate();
  const handleCreateQuiz = () => {
    navigate("/createQuiz");
  };

  return (
    <div className="create-quiz m-8">
      <button
        className="text-2xl md:text-4xl text-gray-100 font-bold px-6 py-4 bg-sky-500 hover:bg-sky-700 rounded-md"
        onClick={handleCreateQuiz}
      >
        Create Your Quiz
      </button>
    </div>
  );
}

export default CreateQuizEntry;
