import React, { useState, useEffect } from "react";
import axios from "axios";
import { Routes, Route, Link } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css"; 
import AddAssignment from "./AddAssignment";
import AddSubjectData from "./AddSubjectData";

const TeacherDashboard = () => {
  const [teacher, setTeacher] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTeacherProfile = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/user/teacher/profile`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setTeacher(response.data);
      } catch (err) {
        setError("Error fetching teacher profile. Please try again later.");
      }
    };

    fetchTeacherProfile();
  }, []);

  return (
    <div className=" flex bg-transparent h-full w-full" style={{height:'665px'}} >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{
          backgroundImage: "url('/assets/sp1.jpg')", // Fixed path to assets
          height: '100%',
          width: '100%',
        }}
      ></div>
      
      {/* Sidebar Navigation */}
      <aside className="relative w-2/5 bg-black bg-opacity-20  px-10 flex flex-col z-10">
        <div className="p-4">
          <h1 className="text-4xl font-bold text-green-500   ">Teacher Dashboard</h1>
        
        </div>
        <nav>
          <ul className="m-4 space-y-5 text-white">
            <li>
              <Link
                to="manageassignment"
                className="w-full text-left px-4 py-2 rounded-md hover:bg-gray-600 transition duration-300 ease-in-out transform hover:scale-105"
              >
                <i className="fas fa-tasks mr-2"></i> Manage Assignments
              </Link>
            </li>
            <li>
              <Link
                to="managestudymaterial"
                className="w-full text-left px-4 py-2 rounded-md hover:bg-gray-600 transition duration-300 ease-in-out transform hover:scale-105"
              >
                <i className="fas fa-book mr-2"></i> Manage Study Materials
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="relative flex-1 p-6 bg-black bg-opacity-20 overflow-y-auto z-10">
        <Routes>
          <Route path="/" element={<AddSubjectData />} />
          <Route path="manageassignment" element={<AddAssignment />} />
          <Route path="managestudymaterial" element={<AddSubjectData />} />
        </Routes>
      </main>
    </div>
  );
};

export default TeacherDashboard;
