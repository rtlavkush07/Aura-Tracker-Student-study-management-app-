import React, { useEffect, useState } from "react";
import { FaCalendarAlt } from "react-icons/fa";
import { useSelector } from "react-redux";
import axios from "axios";
const CourseSchedules = () => {
  const [courseSchedule, setCourseSchedule] = useState(null);
  const [courseid, setCourseid] = useState();
  const { isAuthenticated, token } = useSelector((state) => state.auth);
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth/login");
      return;
    }

    const userData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/user/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log(response.data);
        setCourseid(response.data.course);
      } catch (err) {
        console.error("Error fetching courseId:", err);
      }
    };

    userData();
  }, [isAuthenticated, token]);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        if (courseid) {
          console.log("course id in course schedule = " + courseid);

          // Use POST request and send courseId in the request body
          const response = await axios.get(`${import.meta.env.VITE_API_URL}/student/course/${courseid}`);
          setCourseSchedule(response.data.courseSchedule);
          console.log(response.data.courseSchedule);
        }
      } catch (error) {
        setError("Failed to fetch course details");
        console.error(error);
      }
    };

    if (courseid) {
      fetchCourse();
    }
  }, [courseid]);


  return (
    <div className="mt-5">
      <h2 className="text-2xl font-semibold border-b-2 border-green-500 pb-2 text-white">
        Course Schedule
      </h2>
      <div className="flex flex-wrap justify-between mt-3">
        {courseSchedule?.map((course, index) => (
          <div key={index} className="flex items-center w-full lg:w-1/2 mb-4">
            <FaCalendarAlt className="text-green-600 mr-2 text-xl" />
            <div>
              <h3 className="text-lg font-semibold text-white">
                {course.subjectName}
              </h3>
              <p className="text-gray-500 text-sm">
                {course.schedules?.map((schedule) => (
                  <div>
                    <p className="text-white text-sm">
                      {schedule.dayOfWeek +
                        " " +
                        schedule.startTime +
                        " " +
                        schedule.endTime}
                    </p>
                  </div>
                ))}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseSchedules;
