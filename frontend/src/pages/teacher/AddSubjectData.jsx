import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddSubjectData = () => {
    const [subjects, setSubjects] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState('');
    const [moduleName, setModuleName] = useState('');
    const [chapters, setChapters] = useState([]);
    const [chapterNameInput, setChapterNameInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [teacherId, setTeacherId] = useState("");



    useEffect(() => {
        const fetchTeacherProfile = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/user/teacher/profile`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`, // Add token for auth if required
                    },
                });
                setTeacherId(response.data._id);

            } catch (err) {
                setError("Error fetching teacher profile. Please try again later.");
                console.error(err);
            }
        };
        fetchTeacherProfile();

    }, []);
    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/teacher/getSubjects/${teacherId}`);


                setSubjects(response.data);
                // console.log("subjects in add subject data = " + JSON.stringify(subjects));
            } catch (error) {
                console.error('Error fetching subjects:', error);
            }
        };
        fetchSubjects();
    }, [teacherId]);




    const handleAddChapter = () => {
        if (chapterNameInput.trim()) {
            setChapters([...chapters, { chapterName: chapterNameInput, completed: false }]);
            setChapterNameInput('');
        }
    };

    const handleDeleteChapter = (index) => {
        const newChapters = chapters.filter((_, i) => i !== index);
        setChapters(newChapters);
    };

    const handleAddModule = async () => {
        if (!selectedSubject || !moduleName) {
            alert('Please select a subject and enter a module name.');
            return;
        }

        const moduleData = {
            moduleName,
            chapters,
        };

        try {
            setLoading(true);
            await axios.put(`${import.meta.env.VITE_API_URL}/teacher/${selectedSubject}/modules`, { modules: [moduleData] });
            alert('Module and chapters added successfully');
            setModuleName('');
            setChapters([]);
        } catch (error) {
            console.error('Error adding module:', error);
            alert('Failed to add module');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl h-full mx-auto bg-black bg-opacity-20 text-white p-8 rounded-md shadow-md">
            <h2 className="text-2xl font-semibold text-white mb-6">Add Modules and Chapters</h2>

            {/* Subject Dropdown */}
            <div className="mb-4">
                <label className="block text-white font-medium mb-2">Select Subject:</label>
                <select
                    className="w-full px-4 py-2 bg-transparent border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                >
                    <option value="" className='bg-black'>Select a subject</option>
                    {subjects.map((subject) => (
                        <option key={subject._id} className='bg-black' value={subject._id}>
                            {subject.subjectName}
                        </option>
                    ))}
                </select>
            </div>

            {/* Module Name Input */}
            <div className="mb-4">
                <label className="block text-white font-medium mb-2">Module Name:</label>
                <input
                    type="text"
                    className="w-full px-4 py-2 bg-transparent border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={moduleName}
                    onChange={(e) => setModuleName(e.target.value)}
                    placeholder="Enter module name"
                />
            </div>

            {/* Chapter Name Input */}
            <div className="mb-4">
                <label className="block text-white font-medium mb-2">Add Chapter Name:</label>
                <input
                    type="text"
                    className="w-full px-4 py-2 bg-transparent border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={chapterNameInput}
                    onChange={(e) => setChapterNameInput(e.target.value)}
                    placeholder="Enter chapter name"
                />
                <button
                    className="w-full px-4 py-2 mt-4 bg-transparent border border-white bg-green-500 text-white font-semibold rounded-md hover:bg-green-600 focus:outline-none"
                    onClick={handleAddChapter}
                    disabled={loading}
                >
                    Add Chapter
                </button>
            </div>

            {/* Chapters List */}
            <h3 className="text-xl font-semibold text-white mt-6 mb-4">Chapters</h3>
            <ul>
                {chapters.map((chapter, index) => (
                    <li key={index} className="flex items-center justify-between mb-2 p-2 border rounded-md bg-gray-50">
                        <span className="text-gray-700">{chapter.chapterName}</span>
                        <button
                            className="px-3 py-1 bg-red-500 text-white font-semibold rounded-md"
                            onClick={() => handleDeleteChapter(index)}
                        >
                            Delete
                        </button>
                    </li>
                ))}
            </ul>

            {/* Submit Button */}
            <button
                className="w-full px-4 py-2 mt-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none"
                onClick={handleAddModule}
                disabled={loading}
            >
                {loading ? 'Adding...' : 'Add Module with Chapters'}
            </button>
        </div>
    );
};

export default AddSubjectData;
