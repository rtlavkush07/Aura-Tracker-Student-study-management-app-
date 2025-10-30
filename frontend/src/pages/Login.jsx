// pages/Login.js
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess, setError } from "../features/authSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../api.js";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userRole, setUserRole] = useState("");
  const error = useSelector((state) => state.auth.error);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const notify = (message) => toast.success(message);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/auth/login", { email, password, role: userRole });
      const { token, role, id } = response.data;
      
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      dispatch(loginSuccess({ token, role, id }));
      
      notify("Logged in Successfully!");

      // Redirect based on role after notification
      setTimeout(() => {
        if (role === "admin") navigate("/admin");
        else if (role === "teacher") navigate("/teacher/profile");
        else if (role === "student") navigate("/student/profile");
      }, 1000); // Delay for toast to display

    } catch (err) {
      notify(" invalid error");

      const errorMessage = err.response?.data?.message || "Invalid email or password";
      dispatch(setError(errorMessage));
      console.error(err);
    }
  };

  return (
    <div className="flex items-center overflow-hidden w-full h-full">
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} pauseOnHover theme="light" />

      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('../public/assets/sp1.jpg')",
          height: '100%',
          width: '100%',
        }}
      ></div>

      <div className="bg-black bg-opacity-30 mt-20 text-white p-8 rounded-lg shadow-lg w-96 transform transition-transform duration-300 hover:scale-105 border border-white" style={{ marginLeft: "250px" }}>
        <h2 className="text-2xl font-bold text-center text-white mb-6">Login</h2>
        
        <form className="mt-6" onSubmit={handleSubmit}>
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 border border-white bg-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out transform hover:scale-105"
            />
          </div>
          
          <div className="mt-4">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 border border-white bg-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out transform hover:scale-105"
            />
          </div>
          
          <div className="mt-4">
            <select
              value={userRole}
              onChange={(e) => setUserRole(e.target.value)}
              required
              className="w-full p-3 border border-white bg-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out transform hover:scale-105"
            >
              <option value="" disabled className="bg-transparent">Select your role</option>
              <option className="bg-transparent text-gray-700" value="student">Student</option>
              <option className="bg-transparent text-gray-700" value="teacher">Teacher</option>
              <option className="bg-transparent text-gray-700" value="admin">Admin</option>
            </select>
          </div>
          
          {error && (
            <p className="mt-2 text-red-600 text-sm text-center">{error}</p>
          )}
          
          <button
            type="submit"
            className="mt-6 w-full py-3 bg-transparent border border-white text-white rounded-lg shadow hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
