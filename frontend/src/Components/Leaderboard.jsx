import { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Typography,
} from "@mui/material";

import { PropTypes } from "prop-types";

const Leaderboard = ({ quizId }) => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${
            import.meta.env.VITE_APP_BASE_URL
          }/api/quizzes/${quizId}/leaderboard`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response.data);
        setLeaderboardData(response.data);
      } catch (err) {
        console.error("Error fetching leaderboard:", err);
        setError("Failed to load leaderboard. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [quizId]);

  if (loading) {
    return <CircularProgress sx={{ display: "block", margin: "20px auto" }} />;
  }

  if (error) {
    return (
      <Typography color="error" sx={{ textAlign: "center", mt: 2 }}>
        {error}
      </Typography>
    );
  }

  return (
    <>
      <Typography
        variant="h4"
        component="h2"
        sx={{ fontWeight: "bold", textAlign: "center", mb: 4 }}
      >
        Leaderboard
      </Typography>
      <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  textAlign: "left",
                  backgroundColor: "#f5f5f5",
                  padding: "12px",
                }}
              >
                Rank
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  textAlign: "left",
                  backgroundColor: "#f5f5f5",
                  padding: "12px",
                }}
              >
                Player Name
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  textAlign: "left",
                  backgroundColor: "#f5f5f5",
                  padding: "12px",
                }}
              >
                Time Taken
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  textAlign: "left",
                  backgroundColor: "#f5f5f5",
                  padding: "12px",
                }}
              >
                Score
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {leaderboardData.map((entry, index) => (
              <TableRow
                key={entry._id}
                className="hover:bg-gray-100 focus-within:bg-gray-200"
                sx={{ transition: "background-color 0.3s ease" }}
                aria-label={`Rank ${index + 1} - ${entry.playerName}`}
              >
                <TableCell sx={{ padding: "12px" }}>{index + 1}</TableCell>
                <TableCell sx={{ padding: "12px" }}>
                  {entry.playerName}
                </TableCell>
                <TableCell sx={{ padding: "12px" }}>
                  {Math.floor(entry.timeFinished / 60)}:
                  {entry.timeFinished % 60 < 10
                    ? `0${entry.timeFinished % 60}`
                    : entry.timeFinished % 60}
                </TableCell>
                <TableCell sx={{ padding: "12px" }}>{entry.score}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

Leaderboard.propTypes = {
  quizId: PropTypes.string.isRequired,
};

export default Leaderboard;
