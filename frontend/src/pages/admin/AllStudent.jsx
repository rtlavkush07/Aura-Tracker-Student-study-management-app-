import React, { useEffect, useState } from 'react';
import axios from 'axios';
import api from "../../api.js";
const AllStudent = () => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchAllStudents = async () => {
      try {
        const response = await api.get("/student/getAllStudents");
        setStudents(response.data);
        // console.log(response.data)
      } catch (error) {
        console.error('Failed to fetch all students:', error);
      }
    };
    fetchAllStudents();
    // console.log(students)

  }, []);

  return (
    <div className="flex flex-col items-center p-8 h-full w-full overflow-hidden">
      <h1 className="text-3xl font-bold mb-8 mt-12 text-white">Students</h1>
      <ul className="w-full max-w-2xl bg-black bg-opacity-40  overflow-scroll rounded-lg shadow-lg px-9">
        {students.map((student, index) => (
          <li key={index} className="border-b border-gray-200 p-4 last:border-none">
            <p className="text-lg font-semibold text-white">
              <span className="font-bold text-white">Name:</span> {student.name}
            </p>
            <p className="text-lg font-semibold text-white">
              <span className="font-bold text-white">Email:</span> {student.email}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AllStudent;
