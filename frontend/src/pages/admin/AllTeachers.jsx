import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AllTeachers = () => {
  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/admin/getAllTeacher`);
        setTeachers(response.data);
        // console.log(response.data);
      } catch (error) {
        console.error('Failed to fetch teachers:', error);
      }
    };
    fetchTeachers();
  }, []);

  return (
    <div className="flex flex-col items-center p-8 bg-transparent  h-full w-full">
      <h1 className="text-3xl font-bold mb-4  text-white">Teachers</h1>
      <ul className="w-full max-w-2xl bg-black bg-opacity-40  text-white rounded-lg shadow-lg px-9 overflow-scroll" style={{height:'80vh'}}>
        {teachers.map((teacher, index) => (
          <li key={index} className="border-b border-gray-200 p-4 last:border-none">
            <p className="text-lg font-semibold text-white">
              <span className="font-bold text-white">Name:</span> {teacher.name}
            </p>
            <p className="text-lg font-semibold text-white">
              <span className="font-bold text-white">Email:</span> {teacher.email}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AllTeachers;
