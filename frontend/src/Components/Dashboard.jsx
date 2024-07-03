import { useNavigate } from "react-router-dom";
import AvailableQuizzes from "./AvailableQuizzes";
import CreateQuizEntry from "./CreateQuizEntry";
import { CgProfile } from "react-icons/cg";
import { jwtDecode } from "jwt-decode";

function Dashboard() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const userId = decodedToken.userId;

  return (
    <div className="container">
      <div className="profile flex justify-end">
        <CgProfile
          size={40}
          onClick={() => {
            navigate(`/profile/${userId}`);
          }}
          className="hover:cursor-pointer"
        />
      </div>
      <CreateQuizEntry />
      <AvailableQuizzes />
    </div>
  );
}

export default Dashboard;
