import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Route, Routes, useNavigate } from "react-router-dom";
import axios from "axios";
import SubjectModal from "./SubjectModal";

const CourseSubjects = () => {
  const navigate = useNavigate();
  const { token, isAuthenticated } = useSelector((state) => state.auth);
  const [subjects, setSubjects] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);
  const [courseId, setCourseId] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth/login");
      return;
    }

    const fetchProfileData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/user/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData(response.data);
        setUserId(response.data._id); // Set userId from fetched user data
        setCourseId(response.data.course); // Set courseId from user data
      } catch (err) {
        console.error("Error fetching profile data:", err);
      }
    };

    fetchProfileData();
  }, [isAuthenticated, navigate, token]);

  useEffect(() => {
    if (userId && courseId) {
      const fetchSubjects = async () => {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/student/getCourseSubjects/${userId}/${courseId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          setSubjects(response.data);
          setLoading(false);
        } catch (err) {
          console.error("Error fetching subjects:", err);
          setError("Failed to load subjects.");
          setLoading(false);
        }
      };

      fetchSubjects();
    }
  }, [userId, courseId, token]);

  const handleCardClick = (subject) => {
    navigate(`subjectmodal/${subject._id}`);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedSubject(null);
  };

  return (
    <div className="flex flex-col gap-5 w-3/4">
      <Routes>
        <Route
          path=""
          element={
            <>
              <h2 className="text-2xl font-semibold border-b-2 border-blue-500 pb-2 text-white">
                Subject Progress
              </h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {loading ? (
                  <div className="text-center text-white">
                    Loading subjects...
                  </div>
                ) : error ? (
                  <div className="text-center text-red-500">{`Error: ${error}`}</div>
                ) : subjects.length === 0 ? (
                  <div className="text-center text-white">
                    No subjects available
                  </div>
                ) : (
                  subjects.map((subject, index) => (
                    <div
                      key={index}
                      className="bg-black bg-opacity-50 rounded-lg shadow-md p-5 cursor-pointer border border-white"
                      onClick={() => handleCardClick(subject)}
                    >
                      <h3 className="text-lg font-semibold text-white">
                        {subject.name}
                      </h3>
                      <p className="text-green-500 text-sm">
                        Completed: {subject.progress || 0}%
                      </p>
                      <div className="w-full h-2 bg-gray-200 rounded mt-2">
                        <div
                          className="h-full bg-blue-500 rounded"
                          style={{ width: `${subject.progress || 0}%` }}
                        ></div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          }
        />
        <Route path="/subjectmodal/:subjectId" element={<SubjectModal />} />
      </Routes>
    </div>
  );
  {/* {modalOpen && selectedSubject && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-5 rounded-lg w-96">
            <h2 className="m-0 text-xl  text-black">{selectedSubject.name}</h2>
            <p className="my-2  text-black">
              Completed: {selectedSubject.progress || 0}%
            </p>

            <div className="my-3">
              <p className="font-semibold  text-black">Topics:</p>
              <ul className="list-disc pl-5 text-black">
                {selectedSubject.topics?.length > 0 ? (
                  selectedSubject.topics.map((topic, index) => (
                    <li key={index}>{topic}</li>
                  ))
                ) : (
                  <li>No topics available</li>
                )}
              </ul>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleCloseModal}
                className="p-2 bg-red-500 text-white rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; */}
}

export default CourseSubjects;
