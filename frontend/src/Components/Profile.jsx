import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import "../App.css";
function Profile() {
  const token = localStorage.getItem("token");

  const navigate = useNavigate();
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [quizzesTaken, setQuizzesTaken] = useState([]);
  const [quizzesCreated, setQuizzesCreated] = useState([]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_APP_BASE_URL}/api/users/${userId}/profile`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    const fetchQuizzesTaken = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_APP_BASE_URL}/api/users/${userId}/scores`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log(response.data);

        setQuizzesTaken(response.data.scores);
      } catch (error) {
        console.error("Error fetching quizzes taken:", error);
      }
    };

    const fetchQuizzesCreated = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_APP_BASE_URL}/api/users/${userId}/quizzes`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setQuizzesCreated(response.data);
      } catch (error) {
        console.error("Error fetching quizzes created:", error);
      }
    };

    fetchUserProfile();
    fetchQuizzesTaken();
    fetchQuizzesCreated();
  }, [userId]);

  const handleDelete = async (quizId) => {
    if (!window.confirm("Are you sure you want to delete this quiz?")) {
      return;
    }

    try {
      await axios.delete(
        `${import.meta.env.VITE_APP_BASE_URL}/api/quizzes/${quizId}/delete`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Update local state to reflect deletion
      const updatedQuizzes = quizzesCreated.filter(
        (quiz) => quiz._id !== quizId
      );
      setQuizzesCreated(updatedQuizzes);
    } catch (error) {
      console.error("Error deleting quiz:", error);
    }
  };

  return (
    <div className="container mx-auto p-6 overflow-hidden">
      {user && (
        <div className="user-info mb-6 md:text-left bg-slate-100 rounded-md p-8 flex flex-col md:flex-row justify-between">
          <h1 className="text-4xl sm:text-6xl text-gray-700 font-extrabold m-4 mb-8">
            Profile
          </h1>
          <div className="info flex flex-col gap-2">
            <p className="text-xl sm:text-2xl m-4">
              <span className="font-bold">Username:</span> {user.username}
            </p>
            <p className="text-xl sm:text-2xl m-4">
              <span className="font-bold">Password:</span>{" "}
              {user.password ? `${user.password.slice(0, 0)}******` : ""}
            </p>
          </div>
        </div>
      )}
      {quizzesTaken.length === 0 && quizzesCreated.length === 0 ? (
        <div className="text-center h-96 text-4xl md:text-8xl font-bold text-slate-300 flex justify-center items-center bg-neutral-100 rounded-md italic">
          No Quizzes yet!
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-6 mx-4 my-8">
          {quizzesTaken.length === 0 ? (
            <div className="w-full h-96 text-center text-4xl md:text-6xl font-semibold text-slate-400 flex justify-center items-center rounded-md">
              No Quizzes Taken
            </div>
          ) : (
            <div className="quizzes-taken w-full md:w-1/2">
              <h2 className="text-3xl font-semibold mb-4">Quizzes Taken</h2>
              <div className="max-h-96 overflow-y-auto scrollbar-hidden">
                <ul>
                  {quizzesTaken.map((quiz) => (
                    <li
                      key={quiz._id}
                      className="mb-2 p-4 bg-white shadow rounded-md hover:bg-gray-200 flex flex-row justify-between"
                    >
                      <p className="text-lg font-medium">{quiz.title}</p>
                      <p>Score: {quiz.score}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          {quizzesCreated.length === 0 ? (
            <div className="w-full text-center h-96 text-3xl md:text-5xl font-semibold text-slate-400 flex justify-center items-center bg-neutral-100 rounded-md">
              No Quizzes Created
            </div>
          ) : (
            <div className="quizzes-created w-full md:w-1/2">
              <h2 className="text-3xl font-semibold mb-4">Quizzes Created</h2>
              <div className="max-h-96 overflow-y-auto scrollbar-hidden">
                <ul>
                  {quizzesCreated.map((quiz) => (
                    <li
                      key={quiz._id}
                      className="mb-2 p-4 bg-white shadow rounded-md hover:bg-gray-200 flex flex-row justify-between"
                    >
                      <p className="text-lg font-medium text-center">
                        {quiz.title}
                      </p>
                      <div className="icons flex flex-row gap-1">
                        <EditIcon
                          size={32}
                          onClick={() => {
                            navigate(`/update/${quiz._id}`);
                          }}
                          className="transform hover:translate-y-[-2px] transition-transform duration-200"
                        />
                        <DeleteIcon
                          size={32}
                          onClick={() => {
                            handleDelete(quiz._id);
                          }}
                          className="transform hover:translate-y-[-2px] transition-transform duration-200"
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Profile;
