import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AllCourses = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/admin/getAllCourse`);
        setCourses(response.data);
      } catch (error) {
        console.error('Failed to fetch courses:', error);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className="flex flex-col items-center  p-3 w-full h-full
     overflow-x-hidden">
      <h1 className="text-3xl font-bold mb-8 mt-1 text-white">Courses</h1>
      <ul className="w-full max-w-2xl  rounded-lg bg-black bg-opacity-40 shadow-lg px-9 overflow-scroll overflow-x-hidden" style={{height:'600px'}}>
        {courses.map((course, index) => (
          <li key={index} className="border-b border-gray-200 p-4 last:border-none">
            <p className="text-lg font-semibold text-white
            ">
              <span className="font-bold text-white">Course Name:</span> {course.courseName}
            </p>
            <p className="text-lg font-semibold text-white">
              <span className="font-bold text-white">Course Code:</span> {course.courseCode}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AllCourses;
