import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";
import Login from "./Components/Login";
import Signup from "./Components/Signup";
import Dashboard from "./Components/Dashboard";
import CreateQuiz from "./Components/CreateQuiz";
import TakeQuiz from "./Components/TakeQuiz";
import Profile from "./Components/Profile";
import UpdateQuiz from "./Components/UpdateQuiz";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/login"
          element={<Login setIsAuthenticated={setIsAuthenticated} />}
        />
        <Route
          path="/dashboard"
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/createQuiz"
          element={isAuthenticated ? <CreateQuiz /> : <Navigate to="/login" />}
        />
        <Route
          path="/takeQuiz/:quizId"
          element={isAuthenticated ? <TakeQuiz /> : <Navigate to="/login" />}
        />
        <Route
          path="/profile/:userId"
          element={isAuthenticated ? <Profile /> : <Navigate to="/login" />}
        />
        <Route
          path="/update/:quizId"
          element={isAuthenticated ? <UpdateQuiz /> : <Navigate to="/login" />}
        />
        <Route path="/" element={<Navigate to="/signup" />} />
      </Routes>
    </Router>
  );
}

export default App;
