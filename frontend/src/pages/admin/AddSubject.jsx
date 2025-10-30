import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import api from "../../api.js";
const AddSubject = ({ onSubmit }) => {
    const [teachers, setTeachers] = useState([]);
    const [courses, setCourses] = useState([]);
    const [subjectName, setSubjectName] = useState("");
    const [subjectID, setSubjectID] = useState("");
    const [schedules, setSchedules] = useState([{ dayOfWeek: "", startTime: "", endTime: "" }]);
    const [selectedTeacher, setSelectedTeacher] = useState("");
    const [selectedCourse, setSelectedCourse] = useState("");
    const navigate = useNavigate();

    // Separate function to fetch teachers
    const fetchTeachers = async () => {
        try {
            const response = await api.get("/admin/getAllTeacher");
            setTeachers(response.data);
        } catch (error) {
            console.error("Failed to fetch teachers:", error);
        }
    };

    // Separate function to fetch courses
    const fetchCourses = async () => {
        try {
            const response = await api.get("/admin/getAllCourse");
            setCourses(response.data);
        } catch (error) {
            console.error("Failed to fetch courses:", error);
        }
    };

    // useEffect to call both functions on mount
    useEffect(() => {
        const fetchData = async () => {
            await Promise.all([fetchTeachers(), fetchCourses()]);
        };
        fetchData();
    }, []);

    const handleAddSchedule = () => {
        setSchedules([...schedules, { dayOfWeek: "", startTime: "", endTime: "" }]);
    };

    const handleScheduleChange = (index, field, value) => {
        const newSchedules = [...schedules];
        newSchedules[index][field] = value;
        setSchedules(newSchedules);
    };

    const handleRemoveSchedule = (index) => {
        setSchedules(schedules.filter((_, i) => i !== index));
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const subjectData = {
            subjectName,
            subjectID,
            schedules,
            selectedTeacher,
            selectedCourse,
        };
        try {
            const response = await api.post("/admin/addSubject", subjectData);
            console.log(response.data);
            navigate('/admin');
        } catch (error) {
            console.error("Error adding subjecrt:", error);
        }
    };

    return (
        <div className="mt-12 p-10 overflow-hidden overflow-x-hidden">
            <form onSubmit={handleFormSubmit} className="max-w-xl mx-auto  bg-black bg-opacity-40 rounded-lg shadow-lg py-9">
                <h2 className="text-2xl font-bold mb-4 text-center text-white">Add or Edit Subject</h2>

                <div className="overflow-scroll overflow-x-hidden p-5">
                    {/* Subject Name Input */}
                    <div className="mb-4">
                        <input
                            type="text"
                            placeholder="Subject Name"
                            value={subjectName}
                            onChange={(e) => setSubjectName(e.target.value)}
                            className="w-full p-2 bg-transparent text-white border border-gray-300 rounded"
                            required
                        />
                    </div>

                    {/* Subject ID Input */}
                    <div className="mb-4">
                        <input
                            type="text"
                            placeholder="Subject Id"
                            value={subjectID}
                            onChange={(e) => setSubjectID(e.target.value)}
                            className="w-full p-2 bg-transparent text-white border border-gray-300 rounded"
                            required
                        />
                    </div>

                    {/* Teacher Selection */}
                    <div className="mb-4">
                        <select
                            value={selectedTeacher}
                            onChange={(e) => setSelectedTeacher(e.target.value)}
                            className="w-full p-2 bg-transparent text-white border border-gray-300 rounded"
                            required
                        >
                            <option value="" className="text-white">Select a teacher</option>
                            {teachers.map((teacher) => (
                                <option key={teacher._id} value={teacher._id}>
                                   <p className="text-black"> {teacher.name}</p>
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Course Selection */}
                    <div className="mb-4">
                        <select
                            value={selectedCourse}
                            onChange={(e) => setSelectedCourse(e.target.value)}
                            className="w-full p-2 text-white bg-transparent border border-gray-300 rounded"
                            required
                        >
                            <option value="">Select a course</option>
                            {courses.map((course) => (
                                <option key={course._id} value={course._id}>
                                    {course.courseName}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Schedule Section */}
                    <div className="mb-4">
                        {schedules.map((schedule, index) => (
                            <div key={index} className="grid grid-cols-3 gap-2 mb-2">
                                <input
                                    type="text"
                                    value={schedule.dayOfWeek}
                                    onChange={(e) => handleScheduleChange(index, "dayOfWeek", e.target.value)}
                                    placeholder="Day of the Week"
                                    className="p-2 border bg-transparent text-white border-gray-300 rounded"
                                    required
                                />
                                <input
                                    type="time"
                                    value={schedule.startTime}
                                    onChange={(e) => handleScheduleChange(index, "startTime", e.target.value)}
                                    className="p-2 border bg-transparent text-white border-gray-300 rounded"
                                    required
                                />
                                <input
                                    type="time"
                                    value={schedule.endTime}
                                    onChange={(e) => handleScheduleChange(index, "endTime", e.target.value)}
                                    className="p-2 border bg-transparent text-white border-gray-300 rounded"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => handleRemoveSchedule(index)}
                                    className="text-red-500 hover:text-red-700 col-span-3"
                                >
                                    Remove Schedule
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={handleAddSchedule}
                            className="text-blue-500 hover:text-blue-700 text-sm mt-2"
                        >
                            + Add Another Schedule
                        </button>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full p-2 bg-green-500 text-white rounded hover:bg-blue-600 transition duration-300"
                    >
                        Add Subject
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddSubject;
