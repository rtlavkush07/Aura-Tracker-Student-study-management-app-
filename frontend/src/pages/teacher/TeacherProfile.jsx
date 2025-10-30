import React, { useState, useEffect } from "react";
import axios from "axios";
import api from "../../api.js";

const TeacherProfile = () => {
  const [teacher, setTeacher] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTeacherProfile = async () => {
      try {
        const response = await api.get("/user/teacher/profile", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Add token for auth if required
          },
        });
        setTeacher(response.data);
      } catch (err) {
        setError("Error fetching teacher profile. Please try again later.");
        console.error(err);
      }
    };

    fetchTeacherProfile();
  }, []);

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!teacher) {
    return <p>Loading teacher profile...</p>;
  }

  return (
    <div className="teacher-profile p-8  border border-white shadow-lg rounded-xl max-w-lg mx-auto mt-20  ">
       <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{
          backgroundImage: "url('/assets/sp1.jpg')", // Fixed path to assets
          height: '100%',
          width: '100%',
        }}
      ></div>
      <h2 className="relative text-3xl text-white bg-black bg-opacity-20 rounded-md font-bold mb-6 text-center border-b pb-4">{teacher.name}</h2>
      <div className="space-y-4">
       
        <div className="relative text-white flex items-center">
          <strong className="w-1/3  text-white">ID:</strong>
          <span className=" text-lg text-white font-semibold">{teacher._id}</span>
        </div>
        <div className="relative text-white flex items-center">
          <strong className="w-1/3 text-white">Email:</strong>
          <span className="text-lg text-white font-semibold">{teacher.email}</span>
        </div>
        {/* <div>
          <strong className="text-black">Subjects:</strong>
          {teacher.subjects.length > 0 ? (
            <ul className="list-inside list-disc mt-2 ml-4 text-lg">
              {teacher?.subjects.map((subject) => (
                // console.log(subject.name)
                <li  key={subject._id}>{subject.name}</li>
              ))}
            </ul>
          ) : (
            <p className="text-lg mt-2">No subjects assigned.</p>
          )}
        </div> */}
      </div>
    </div>
  );
};

export default TeacherProfile;
