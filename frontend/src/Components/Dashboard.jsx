import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { CgProfile } from "react-icons/cg";
import MenuIcon from "@mui/icons-material/Menu";
import { jwtDecode } from "jwt-decode";
import AvailableQuizzes from "./AvailableQuizzes";
import Filters from "./Filters";
import AddIcon from "@mui/icons-material/Add";
import logo from "../assets/logo.png";
import QuizOfTheDay from "./QuizOfTheDay";

function Dashboard() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({ category: "", latest: "Latest" });
  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

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

  const handleMenuClick = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const toggleDrawer = () => setDrawerOpen(!drawerOpen);

  const handleProfile = () => {
    navigate(`/profile/${userId}`);
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleCreateQuiz = () => {
    navigate("/createQuiz");
  };

  return (
    <div className="dashboard">
      {/* Nav Bar */}
      <AppBar
        position="sticky"
        component="nav"
        elevation={0}
        sx={{
          bgcolor: "white",
          top: 0,
          overflow: "hidden",
          "&::after": {
            content: '""',
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "8px",
            background:
              "linear-gradient(to bottom, rgba(255, 255, 255, 0), rgba(0, 0, 0, 0.1))",
          },
        }}
      >
        <Toolbar
          sx={{
            justifyContent: {
              xs: "center",
              sm: "space-between",
            },
          }}
        >
          {/* Hamburger Menu Icon for mobile on the right */}
          <IconButton
            color="black"
            edge="end"
            onClick={toggleDrawer}
            sx={{
              display: { xs: "block", sm: "none" },
              position: "absolute",
              right: 0,
              top: 1,
            }}
            aria-label="Open menu"
          >
            <MenuIcon />
          </IconButton>

          {/* Logo, centered on smaller screens */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <img
              src={logo}
              alt="Quizzy Logo"
              style={{ width: "180px", height: "80px" }}
            />
          </Box>

          {/* Create Quiz Button and Profile Icon - Only visible on larger screens */}
          <Box
            sx={{ display: { xs: "none", sm: "flex" }, alignItems: "center" }}
          >
            <button
              className="text-lg md:text-2xl text-stone-800 font-bold px-3 py-2 bg-stone-200 hover:bg-stone-300 rounded-lg hover:ring-2 ring-offset-2 ring-stone-400"
              onClick={handleCreateQuiz}
              tabIndex="0"
              aria-label="Create a new quiz"
            >
              Create Quiz <AddIcon sx={{ marginTop: "-3px" }} />
            </button>

            {userId && (
              <IconButton
                onClick={handleMenuClick}
                aria-label="Profile options"
              >
                <CgProfile size={40} className="hover:cursor-pointer" />
              </IconButton>
            )}
          </Box>

          {/* Profile Menu */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            aria-label="User profile menu"
          >
            <MenuItem onClick={handleProfile} aria-label="Go to profile">
              Profile
            </MenuItem>
            <MenuItem onClick={handleLogout} aria-label="Log out">
              Log out
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Drawer for mobile menu */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={toggleDrawer}
        aria-label="Mobile navigation menu"
      >
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={toggleDrawer}
          onKeyDown={toggleDrawer}
        >
          <List>
            <ListItem
              button
              onClick={handleCreateQuiz}
              aria-label="Create a new quiz"
            >
              <ListItemText primary="Create Your Quiz" />
            </ListItem>
            {userId && (
              <>
                <ListItem
                  button
                  onClick={handleProfile}
                  aria-label="Go to profile"
                >
                  <ListItemText primary="Profile" />
                </ListItem>
                <ListItem button onClick={handleLogout} aria-label="Log out">
                  <ListItemText primary="Log out" />
                </ListItem>
              </>
            )}
          </List>
        </Box>
      </Drawer>

      <QuizOfTheDay />

      {/* Main Content */}
      <Box component="main" sx={{ marginTop: "2rem", padding: 2 }}>
        <div className="quiz-n-filters flex flex-col md:flex-row justify-between gap-12 items-center">
          <AvailableQuizzes filters={filters} />
          <Filters onFilterChange={setFilters} />
        </div>
      </Box>
    </div>
  );
}

export default Dashboard;
