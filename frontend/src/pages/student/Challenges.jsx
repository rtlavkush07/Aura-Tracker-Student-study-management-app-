import React, { useState, useRef } from 'react';

const Challenges = () => {
    const [goals, setGoals] = useState('');
    const [goalType, setGoalType] = useState('Academics');
    const [modalOpen, setModalOpen] = useState(false);
    const [courseName, setCourseName] = useState('');
    const [subject, setSubject] = useState('');
    const [courses, setCourses] = useState([]);
    const [activeSection, setActiveSection] = useState('Academics');
    const scrollRef = useRef(null);

    const handleAddGoal = () => {
        if (goals.trim()) {
            setCourses((prevCourses) => [
                ...prevCourses,
                { name: goals, type: goalType, subjects: [], progress: 0 }
            ]);
            setGoals('');
        }
    };

    const handleAddSubject = () => {
        if (subject.trim()) {
            setCourses((prevCourses) => {
                return prevCourses.map((course) => {
                    if (course.name === courseName) {
                        return {
                            ...course,
                            subjects: [...course.subjects, { name: subject, completed: false }],
                            progress: course.progress
                        };
                    }
                    return course;
                });
            });
            setSubject('');
        }
    };

    const handleManageSubjects = (course) => {
        setCourseName(course.name);
        setModalOpen(true);
    };

    const handleDeleteCourse = (courseToDelete) => {
        setCourses((prevCourses) => prevCourses.filter((course) => course.name !== courseToDelete.name));
    };

    const handleConfirm = () => {
        setModalOpen(false);
        setCourseName('');
        setSubject('');
    };

    const toggleSubjectCompletion = (subjectName) => {
        setCourses((prevCourses) => {
            return prevCourses.map((course) => {
                if (course.name === courseName) {
                    const updatedSubjects = course.subjects.map((subj) =>
                        subj.name === subjectName ? { ...subj, completed: !subj.completed } : subj
                    );

                    const completedCount = updatedSubjects.filter((subj) => subj.completed).length;
                    const newProgress = (completedCount / updatedSubjects.length) * 100;

                    return {
                        ...course,
                        subjects: updatedSubjects,
                        progress: newProgress
                    };
                }
                return course;
            });
        });
    };

    const filteredCourses = courses.filter((course) => course.type === activeSection);

    const handleScrollLeft = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: -200, behavior: 'smooth' });
        }
    };

    const handleScrollRight = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: 200, behavior: 'smooth' });
        }
    };

    return (
        <>
            <div className="font-sans p-5 w-full h-screen mx-auto bg-black text-white rounded-lg shadow-md">
                <div className="mb-5">
                    <div className="mx-6 relative">
                        <button onClick={handleScrollLeft} aria-label="Scroll Left" className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white rounded px-2 z-10">
                            &lt;
                        </button>
                        <button onClick={handleScrollRight} aria-label="Scroll Right" className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white rounded px-2 z-10">
                            &gt;
                        </button>

                        <div className="overflow-x-hidden whitespace-nowrap mx-10 my-10" ref={scrollRef}>
                            {filteredCourses.map((course) => (
                                <div key={course.name} className="inline-block p-5 w-64 h-32 border border-gray-300 rounded-lg bg-black mr-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-lg font-bold">{course.name}</span>
                                        <div className="flex gap-2">
                                            <button onClick={() => handleManageSubjects(course)} className="text-blue-500 rounded px-2">
                                                <i className="fas fa-pencil-alt"></i>
                                            </button>
                                            <button onClick={() => handleDeleteCourse(course)} className="text-red-500 rounded px-2">
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                    <p className="m-0">Completed: {course.progress.toFixed(2)}%</p>
                                    <div className="w-full h-2 bg-gray-300 rounded mt-1">
                                        <div className="h-full bg-blue-500 rounded" style={{ width: `${course.progress}%` }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="my-5">
                    <h3 className="text-2xl mb-2">Set Your Goals</h3>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Enter your goal"
                            value={goals}
                            onChange={(e) => setGoals(e.target.value)}
                            className="p-2 text-lg flex-1 border rounded text-black"
                        />
                        <button onClick={handleAddGoal} className="p-2 bg-blue-500 text-white rounded">Set Goals</button>
                    </div>
                </div>

                {modalOpen && (
                    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
                        <div className="bg-white p-5 rounded-lg w-96">
                            <h2 className="m-0 text-xl">{courseName}</h2>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Enter Topic"
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    className="flex-1 p-2 border rounded text-black"
                                />
                                <button
                                    onClick={handleAddSubject}
                                    className="p-2 bg-blue-500 text-white rounded"
                                    disabled={!subject.trim()}
                                >
                                    Add
                                </button>
                            </div>
                            <ul className="list-none p-0 my-2">
                                {courses.find((course) => course.name === courseName)?.subjects.map((subj, index) => (
                                    <li key={index} className={`py-1 ${subj.completed ? 'text-green-600' : 'text-black'}`}>
                                        <input
                                            type="checkbox"
                                            checked={subj.completed}
                                            onChange={() => toggleSubjectCompletion(subj.name)}
                                            className="mr-2"
                                        />
                                        {subj.name}
                                    </li>
                                ))}
                            </ul>
                            <button onClick={handleConfirm} className="p-2 bg-blue-500 text-white rounded w-full">Confirm</button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default Challenges;
