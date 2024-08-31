import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AvailableQuizzes from "./AvailableQuizzes";
import CreateQuizEntry from "./CreateQuizEntry";
import { CgProfile } from "react-icons/cg";
import { jwtDecode } from "jwt-decode";
import Filters from "./Filters";

function Dashboard() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({ category: "", latest: "Latest" });

  const token = localStorage.getItem("token");
  let userId = "";
  try {
    if (token) {
      const decodedToken = jwtDecode(token);
      userId = decodedToken.userId;
    }
  } catch (error) {
    console.error("Failed to decode token:", error);
  }

  return (
    <div className="container">
      <div className="profile flex justify-end">
        {userId && (
          <CgProfile
            size={40}
            onClick={() => navigate(`/profile/${userId}`)}
            className="hover:cursor-pointer"
          />
        )}
      </div>
      <CreateQuizEntry />
      <div className="quiz-n-filters flex flex-col md:flex-row justify-between gap-12 items-center">
        <AvailableQuizzes filters={filters} />
        <Filters onFilterChange={setFilters} />
      </div>
    </div>
  );
}

export default Dashboard;
