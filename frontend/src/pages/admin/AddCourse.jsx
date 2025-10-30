import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import api from "../../api.js";

const AddCourse = ({ onSubmit }) => {
  const [courseName, setCourseName] = useState("");
  const [courseCode, setCourseCode] = useState("");
  const [studentsEnrolled, setStudentsEnrolled] = useState([]);
  const navigate = useNavigate();

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const courseData = {
      courseName,
      courseCode

    };
    try {
      const response = await api.post("/admin/addCourse", courseData);
      console.log(response.data);
      navigate('/admin');
    } catch (error) {
      console.error("Error adding Course:", error);
    }
  };

  return (
    <div className="mt-12 p-8">
      <form onSubmit={handleFormSubmit} className="max-w-xl mx-auto p-6 bg-black bg-opacity-40 mt-12 rounded-lg shadow-lg my-9">
        <h2 className="text-2xl font-bold mb-4 mt- text-white text-center">Add or Edit Course</h2>

        {/* Course Name */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Course Name"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
            className="w-full p-2 bg-transparent text-white border border-gray-300 rounded"
            required
          />
        </div>

        {/* Course Code */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Course Code"
            value={courseCode}
            onChange={(e) => setCourseCode(e.target.value)}
            className="w-full p-2 bg-transparent text-white border border-gray-300 rounded"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full p-2 bg-green-500 text-white rounded hover:bg-blue-600 transition duration-300"
        >
          Add Course
        </button>
      </form>
    </div>
  );
};

export default AddCourse;
