import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSignup = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_APP_BASE_URL}/api/auth/register`,
        {
          username,
          password,
        }
      );
      console.log(response.data);
      alert("Successfully Registered");
      setSuccess(response.data.message);
      setError(null);
      navigate("/login");
    } catch (err) {
      setError(err.response.data.msg);
      setSuccess(null);
    }
  };

  return (
    <>
      <div className="title text-center my-8">
        <h1 className="px-8 py-4 font-bold text-black text-6xl md:text-8xl">
          Quizzy
        </h1>
        <h2 className="px-8 mt-0 align-middle text-slate-600 font-semibold text-2xl md:text-4xl">
          Create & Take
        </h2>
      </div>
      <div className="signup-container max-w-md mx-auto p-8 shadow-2xl rounded-2xl bg-gray-50">
        <h2 className="text-3xl font-bold text-center mb-4 text-zinc-700">
          Signup
        </h2>
        {error && (
          <p className="error text-red-500 text-center mb-4">{error}</p>
        )}
        {success && (
          <p className="success text-green-500 text-center mb-4">{success}</p>
        )}
        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-left font-semibold text-gray-700">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-left font-semibold text-gray-700">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-left font-semibold text-gray-700">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-lg text-white py-2 rounded-md hover:bg-blue-600"
          >
            Register
          </button>
        </form>
      </div>
      <div className="text-center mt-4 flex flex-col justify-center md:flex-row">
        <p>Already have an account?</p>
        <button
          className="signup-btn -mt-2 underline-offset-2 py-2 px-4 rounded-md font-bold"
          onClick={() => navigate("/login")}
        >
          Log In
        </button>
      </div>
    </>
  );
}

export default Signup;
