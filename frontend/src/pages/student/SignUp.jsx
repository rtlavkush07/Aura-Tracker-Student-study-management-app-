// src/components/Signup.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [year, setYear] = useState("");
  const [regNo, setRegNo] = useState("");
  const [course, setCourse] = useState("");
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const navigate = useNavigate(); // Initialize useNavigate

  // profile picture handler
  const postDetails = (pics) => {
    // Check if the file is undefined or null
    if (!pics) {
      console.error("Profile picture is not defined");
      return;
    }

    // Ensure the file type is an image (jpeg or png)
    if (pics.type !== "image/jpeg" && pics.type !== "image/png") {
      console.error("Invalid file type. Only JPEG and PNG are supported.");
      return;
    }

    // Prepare the FormData for Cloudinary upload
    const data = new FormData();
    data.append("file", pics);
    data.append("upload_preset", "AuraTracker");
    data.append("cloud_name", "dqx48ke30");

    // Upload to Cloudinary
    fetch("https://api.cloudinary.com/v1_1/dqx48ke30/image/upload", {
      method: "POST",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        // Check if Cloudinary returned a valid URL
        if (data.secure_url) {
          setProfilePicture(data.secure_url);
          console.log("Image uploaded successfully:", data.secure_url);
        } else {
          console.error(
            "Failed to upload image to Cloudinary:",
            data.error.message
          );
        }
      })
      .catch((err) => {
        console.error("An error occurred while uploading the image:", err);
      });
  };

  // Separate function to fetch courses
  const fetchCourses = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/admin/getAllCourse`);
      setCourses(response.data);
      console.log(courses);
    } catch (error) {
      console.error("Failed to fetch courses:", error);
    }
  };

  // useEffect to call both functions on mount
  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([fetchCourses()]);
    };
    fetchData();
  }, []);

  //profile handler end
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/signup`, {
        email,
        name,
        profilePicture,
        password,
        year,
        regNo,
        course,
      });

      // Display success message or redirect to login
      alert("SignUp Successful: " + response.data.message);
      setError("");
      navigate("/login"); // Redirect to login page
    } catch (err) {
      setError(
        err.response?.data?.message || "Error signing up. Please try again."
      );
      console.error(err);
    }
  };

  return (
    <div className="flex items-center overflow-hidden w-full h-full " >
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('../public/assets/sp1.jpg')", // Use the correct path for your image
          height: '100%', // Ensure it covers the entire height of the parent div
          width: '100%',  // Ensure it covers the entire width of the parent div
        }}
      ></div>
      <div className="bg-black text-white mt-5 bg-opacity-30 shadow-lg rounded-lg p-7 w-2/4 max-w-md  transform transition-transform duration-300 hover:scale-105 border border-white " style={{ marginLeft: "250px" }}>
        <h2 className="text-4xl font-semibold text-center text-white mb-6">
          Signup
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full p-2 border bg-transparent border-gray-300 rounded-lg focus:outline-none transition duration-200 ease-in-out transform hover:scale-105"
            />
          </div>
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-2 border bg-transparent border-gray-300 rounded-lg focus:outline-none   transition duration-200 ease-in-out transform hover:scale-105"
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-2 border bg-transparent border-gray-300 rounded-lg focus:outline-none   transition duration-200 ease-in-out transform hover:scale-105"
            />
          </div>
          <div>
            <input
              type="number"
              placeholder="Year"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              required
              className="w-full p-2 border bg-transparent border-gray-300 rounded-lg focus:outline-none   transition duration-200 ease-in-out transform hover:scale-105"
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Registration Number"
              value={regNo}
              onChange={(e) => setRegNo(e.target.value)}
              required
              className="w-full p-2 border bg-transparent border-gray-300 rounded-lg focus:outline-none  transition duration-200 ease-in-out transform hover:scale-105"
            />
          </div>
          {/* Dropdown for courses */}
          <div>
            <select
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              required
              className="w-full p-2 border bg-transparent border-gray-300 rounded-lg focus:outline-none text-white transition duration-200 ease-in-out"
            >
              <option value="" className="text-gray-400">Select Course</option> {/* Placeholder option */}
              {courses.map((course) => (
                <option key={course._id} value={course._id} className="text-black">
                  {course.courseName} {/* Replace 'name' with the actual course name field */}
                </option>
              ))}
            </select>
          </div>

          {/* Profile picture div */}
          <div>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => postDetails(e.target.files[0])}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200 ease-in-out transform hover:scale-90"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-transparent border border-white py-3 rounded-lg border-white text-white rounded-lg shadow hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105"
          >
            Signup
          </button>
          {error && <p className="text-red-500 text-center">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default Signup;
