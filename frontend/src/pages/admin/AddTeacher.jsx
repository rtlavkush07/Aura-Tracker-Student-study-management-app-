
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddTeacher = ({ onSubmit, availableSubjects }) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [subjects, setSubjects] = useState([]);
    const navigate = useNavigate(); // Initialize useNavigate

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const teacherData = {
            name,
            email,
            password

        };
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/admin/addTeacher`, teacherData); // replace with correct endpoint
            console.log(response.data); // Check if teacher added successfully
            navigate('/admin'); // Redirect to teachers list or dashboard
        } catch (error) {
            console.error("Error adding teacher:", error);
        }
    };

    const handleSubjectChange = (subjectId) => {
        setSubjects((prevSubjects) =>
            prevSubjects.includes(subjectId)
                ? prevSubjects.filter((id) => id !== subjectId)
                : [...prevSubjects, subjectId]
        );
    };

    return (
        <form onSubmit={handleFormSubmit} className="max-w-lg ml-12 mt-12  border p-6 bg-black bg-opacity-40 rounded-lg shadow-lg " style={{marginTop: '120px', marginLeft:'120px'}}>
            <h2 className="text-2xl font-bold mb-4 text-white text-center">Add or Edit Professors</h2>

            {/* Name */}
            <div className="mb-4">
               
                <input
                    type="text"
                    placeholder='Name'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2 bg-transparent text-white border border-gray-300 rounded"
                    required
                />
            </div>

            {/* Email */}
            <div className="mb-4">
                <input
                    type="email"
                    placeholder='Email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 bg-transparent text-white border border-gray-300 rounded"
                    required
                />
            </div>

            {/* Password */}
            <div className="mb-4">
                <input
                    type="password"
                  placeholder='password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2 bg-transparent text-white border border-gray-300 rounded"
                    required
                />
            </div>


            {/* Submit Button */}
            <button
                type="submit"
                className="w-full p-2 bg-green-500 text-white rounded hover:bg-blue-600 transition duration-300"
            >
                Save Teacher
            </button>
        </form>
    );
};

export default AddTeacher;
