import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { logout } from "../features/authSlice";
import { useNavigate } from "react-router-dom";
import api from "../api.js";
const Navbar = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, token, role } = useSelector((state) => state.auth);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await api.get("/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data && response.data.userProfile) {
          setUser(response.data.userProfile);
        }
      } catch (err) {
        console.error("Error fetching profile data:", err);
      }
    };

    if (isAuthenticated && role === "student") {
      fetchProfileData();
    }
  }, [isAuthenticated, token, role]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  return (
    <nav className="bg-black bg-opacity-40 shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex justify-between items-center p-4">
        {/* Logo Section */}
        <div className="text-2xl font-bold text-blue-500">
          <Link to="/" className="flex items-center" aria-label="Aura Tracker">
            <img
              src="/logo/logo1.gif"
              className="w-12 h-12 mr-2"
              alt="Aura Tracker Logo"
            />
            <span style={{ fontSize: '30px', color: 'white' }}>Aura Tracker</span>
          </Link>
        </div>

        {/* Toggle Button for Small Screens */}
        <button
          onClick={toggleMenu}
          className="block md:hidden text-gray-700 focus:outline-none"
          aria-label="Toggle Menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16m-7 6h7"
            ></path>
          </svg>
        </button>

        {/* Menu Items */}
        <div
          className={`${isMenuOpen ? "block" : "hidden"
            } md:flex md:space-x-4 absolute md:relative bg-trasparent w-full md:w-auto top-16 md:top-0 left-0 md:left-auto md:items-center p-4 md:p-0 shadow-md md:shadow-none transition duration-300 ease-in-out`}
        >
          {isAuthenticated ? (
            <>
              {role === "student" && (
                <>
                  <Link
                    to="/student/dashboard"
                    className="block py-2 md:py-0 text-white hover:text-blue-500 transition duration-200"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/student/store"
                    className="block py-2 md:py-0 text-white hover:text-blue-500 transition duration-200"
                  >
                    Store
                  </Link>
                  <Link
                    to="/student/leaderboard"
                    className="block py-2 md:py-0 text-white hover:text-blue-500 transition duration-200"
                  >
                    Leaderboard
                  </Link>
                  <Link
                    to="/student/pomodoroTimer"
                    className="block py-2 md:py-0 text-white hover:text-blue-500 transition duration-200"
                  >
                    Pomodoro
                  </Link>
                  <Link to="/student/profile" className="block py-2 md:py-0">
                    <img
                      src={
                        user?.profilePicture || "/assets/default-profile.png"
                      }
                      alt="Profile"
                      className="w-8 h-8 rounded-full border-2 border-blue-500"
                    />
                  </Link>
                </>
              )}
              {role === "teacher" && (
                <>
                  <Link
                    to="/teacher"
                    className="block py-2 md:py-0 text-white hover:text-blue-500 transition duration-200"
                  >
                    Dashboard
                  </Link>
                  <Link to="/teacher/profile" className="block py-2 md:py-0">
                    <img
                      src={
                        user?.profilePicture || "/assets/default-profile.png"
                      }
                      alt="Profile"
                      className="w-8 h-8 rounded-full border-2 border-blue-500"
                    />
                  </Link>
                </>
              )}
              {role === "admin" && (
                <Link
                  to="/admin"
                  className="block py-2 md:py-0 text-white hover:text-blue-500 transition duration-200"
                >
                  Dashboard
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="block py-2 md:py-1.5 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">
                <button className="bg-transparent block py-2 md:py-1.5 text-white px-4 py-2 rounded-md hover:bg-black hover:text-white transition duration-300 text-2xl font-cursive">
                  Login
                </button>
              </Link>
              <Link to="/student/signup">
                <button className="bg-transparent block py-2 md:py-1.5 text-white px-4 py-2 rounded-md hover:bg-black hover:text-white transition duration-300 text-2xl font-cursive">
                  Signup
                </button>
              </Link>


            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
