import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import api from "../../api.js";

const SubjectModal = () => {
  const { subjectId } = useParams();
  const [subject, setSubject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);
  const [completedChapters, setCompletedChapters] = useState([]); // Track completed chapters
  const navigate = useNavigate();
  const { token, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchSubject = async () => {
      try {
        const response = await api.get("/student/getsubject/${subjectId}");
        setSubject(response.data);
        console.log("subject data =", JSON.stringify(response.data));
      } catch (err) {
        console.error("Failed to fetch subject data:", err);
        setError("Failed to fetch subject data");
      } finally {
        setLoading(false);
      }
    };

    fetchSubject();
  }, [subjectId]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth/login");
      return;
    }

    const fetchProfileData = async () => {
      try {
        const response = await api.get("/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserId(response.data._id);
      } catch (err) {
        console.error("Error fetching profile data:", err);
      }
    };

    fetchProfileData();
  }, [isAuthenticated, navigate, token]);

  // Fetch completed chapters to set the isCompleted state correctly
  useEffect(() => {
    const fetchCompletedChapters = async () => {
      try {
        const response = await api.get("/student/getCompletedChapters/${userId}");
        setCompletedChapters(response.data);
        console.log("completed chapter = " + completedChapters)
      } catch (err) {
        console.error("Failed to fetch completed chapters:", err);
      }
    };

    if (userId) {
      fetchCompletedChapters();
    }
  }, [userId]);

  const handleCompleteChapter = async (chapterId, moduleId, auracoin, ratingpoint) => {
    console.log(`Completing chapterID: ${chapterId}, Module ID: ${moduleId}, Subject ID: ${subjectId}, auracoin: ${auracoin}, ratingpoint: ${ratingpoint}`);
    try {
      const response = await api.post(`/student/completechapter/${userId}/${chapterId}/${moduleId}/${subjectId}/${auracoin}/${ratingpoint}`);
      console.log("Chapter completed successfully:", response.data);

      // Update the state to mark the chapter as completed
      setSubject((prevSubject) => {
        const updatedData = prevSubject.data.map((module) => ({
          ...module,
          chapters: module.chapters.map((chapter) =>
            chapter._id === chapterId ? { ...chapter, isCompleted: true } : chapter
          ),
        }));
        return { ...prevSubject, data: updatedData };
      });
    } catch (err) {
      console.error("Failed to complete chapter:", err);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="p-4 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-semibold mb-4 text-blue-700">
        Subject Details
      </h1>
      {subject ? (
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            {subject.subjectName}
          </h2>
          <p className="text-gray-600 mb-4">Code: {subject.subjectCode}</p>

          {subject.data.map((module, moduleIndex) => (
            <div key={moduleIndex} className="mb-6">
              <h3 className="text-lg font-semibold text-gray-700">
                {module.moduleName}
              </h3>
              <ul className="mt-2 space-y-4">
                {module.chapters.map((chapter, chapterIndex) => (
                  <li
                    key={chapterIndex}
                    className={`p-4 rounded-md flex justify-between items-center ${completedChapters.includes(chapter._id) ? "bg-green-100" : "bg-gray-100"
                      }`}
                  >
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {chapter.chapterName}
                      </h4>
                      <p className="text-gray-600">
                        Aura Coins: {chapter.rewards.auraCoins}
                      </p>
                      <p className="text-gray-600">
                        Rating Points: {chapter.rewards.ratingPoints}
                      </p>
                    </div>
                    {!completedChapters.includes(chapter._id) && (
                      <button
                        onClick={() =>
                          handleCompleteChapter(
                            chapter._id,
                            module._id,
                            chapter.rewards.auraCoins,
                            chapter.rewards.ratingPoints
                          )
                        }
                        className="px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600"
                      >
                        Complete Chapter
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : (
        <p>Subject not found</p>
      )}
    </div>
  );
};

export default SubjectModal;
