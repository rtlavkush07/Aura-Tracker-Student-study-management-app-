import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

const Leaderboard = () => {
  const [selectedYear, setSelectedYear] = useState("All Years");
  const [selfRank, setSelfRank] = useState();
  const { token, isAuthenticated, role } = useSelector((state) => state.auth);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [sortedData, setSortedData] = useState([]);
  const [userRank, setUserRank] = useState("-");
  const [courseName, setCourseName] = useState("");
  // Fetch user data
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/user/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data) {
          setSelfRank(response.data);
          const temp = await getCourseName(response.data)
        }
      } catch (err) {
        console.error("Error fetching profile data for leaderboard:", err);
      }
    };

    if (isAuthenticated && role === "student") {
      fetchProfileData();
    }
  }, [isAuthenticated, token, role]);

  const getCourseName = async (user) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/student/course/${user.course}`);
      setCourseName(response.data.courseName);
      console.log(response);
    } catch (error) {
      console.error("failed to fetch course name:", error);
    }


  };


  // Fetch all students
  useEffect(() => {
    const fetchAllStudents = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/student/getAllStudents`);
        setLeaderboardData(response.data);
      } catch (error) {
        console.error("Failed to fetch all students:", error);
      }
    };
    fetchAllStudents();
  }, []);

  // Filter and sort data by year and rating
  useEffect(() => {
    const filteredData = leaderboardData.filter((user) => {
      console.log(selectedYear + " " + user.year);
      if (selectedYear == user.year) console.log(" year  matched");
      return selectedYear === "All Years" || user.year == selectedYear;
    });
    console.log(filteredData);
    const sorted = filteredData.sort(
      (a, b) => b.userProfile.rating - a.userProfile.rating
    );
    setSortedData(sorted);
    const rankIndex = sorted.findIndex(
      (user) => user._id === selfRank?._id
    );
    if (rankIndex !== -1) {
      setUserRank(rankIndex + 1); // Rank starts from 1
    }
  }, [selectedYear, leaderboardData]);

  // Determine user's rank based on the selected year

  useEffect(() => {
    if (selectedYear === "All Years" || selectedYear === selfRank?.year) {
      const rankIndex = sortedData.findIndex(
        (user) => user._id === selfRank?._id
      );
      if (rankIndex !== -1) {
        setUserRank(rankIndex + 1); // Rank starts from 1
      }
    }
    console.log(userRank);
  }, [selectedYear, setSelectedYear, sortedData])


  return (
    <div className="flex items-center  overflow-hidden w-full h-full " >
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('../public/assets/sp3.jpg')", // Use the correct path for your image
          height: '100%', // Ensure it covers the entire height of the parent div
          width: '100%',  // Ensure it covers the entire width of the parent div
          backgroundSize: 'cover', // Ensure the image covers the entire div without stretching
          backgroundPosition: 'center', // Optionally, position the background image at the center
        }}
      ></div>
      <div className="relative p-4 w-full h-full mx-auto  bg-black bg-opacity-40 shadow-xl rounded-lg font-sans  ">
        <div className="flex h-full">
          <div className="w-1/3 p-5 border-r border-gray-300 text-center shadow-lg rounded-lg">

            <img
              src={selfRank?.profilePicture}
              alt="User"
              className="rounded-full w-28 h-28 mb-4 border-2 shadow-lg mx-auto"
            />
            <div>
              <p className="mt-4 text-3xl font-extrabold text-white shadow-md p-2 rounded-md text-white inline-block">
                Rank: {userRank}
              </p>
              <div className="mt-3 grid grid-cols-2 gap-5">
                <div className="bg-black bg-opacity-40 shadow-lg rounded-lg p-3 flex flex-col items-center h-24 w-30">
                  <p className="text-white text-lg font-semibold">
                    <strong className="text-white">Name</strong>
                  </p>
                  <p className="text-gray-400 font-bold">{selfRank?.name}</p>
                </div>
                <div className="bg-black bg-opacity-40 shadow-lg rounded-lg p-3 flex flex-col items-center h-24 w-30">
                  <p className="text-white text-lg font-semibold">
                    <strong className="text-white">Rating</strong>
                  </p>
                  <p className="text-green-500 font-bold">
                    {selfRank?.userProfile.rating}
                  </p>
                </div>
                <div className="bg-black bg-opacity-40 shadow-lg rounded-lg p-3 flex flex-col items-center h-24 w-30">
                  <p className="text-white text-lg font-semibold">
                    <strong className="text-white">Year</strong>
                  </p>
                  <p className="text-gray-400 font-bold">{selfRank?.year}</p>
                </div>
                <div className="bg-black bg-opacity-40 shadow-lg rounded-lg p-3 flex flex-col items-center h-24 w-30">
                  <p className="text-white text-lg font-semibold">
                    <strong className="text-white">Course</strong>
                  </p>
                  <p className="text-gray-400 font-bold">{courseName}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Leaderboard Section */}
          <div className="w-2/3 p-5 overflow-auto  shadow-lg rounded-lg">
            <h1 className="text-3xl text-center font-extrabold mb-5 text-white">
              Leaderboard
            </h1>
            <div className="flex justify-center mb-5">
              <select
                className="p-2 border border-gray-300 rounded-lg shadow-sm w-1/2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
              >
                <option value="All Years">All Years</option>
                <option value={selfRank?.year}>In Batch</option>
              </select>
            </div>
            <h2 className="mt-5 text-2xl text-white font-semibold">
              Filtered Leaderboard
            </h2>
            <div className="max-h-[50vh] overflow-y-auto overflow-scroll rounded-lg border border-gray-300 shadow-inner">
              <table className="min-w-full border-collapse border border-gray-200">
                <thead className="bg-white-600 text-white sticky top-0 z-10">
                  <tr>
                    <th className="border text-white border-gray-300 p-4 text-left">
                      Rank
                    </th>
                    <th className="border text-white border-gray-300 p-4 text-left">
                      Name
                    </th>
                    <th className="border text-white border-gray-300 p-4 text-left">
                      Year
                    </th>
                    <th className="border text-white border-gray-300 p-4 text-left">
                      Rating
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedData.map((user, index) => (
                    <tr
                      key={user._id}
                      className="hover:bg-black bg-opacity-30 transition-colors duration-300"
                    >
                      <td className="border border-gray-300 p-4 font-bold text-white">
                        {index + 1}
                      </td>
                      <td className="border text-white border-gray-300 p-4">
                        {user.name}
                      </td>
                      <td className="border text-white border-gray-300 p-4">
                        {user.year}
                      </td>
                      <td className="border text-white border-gray-300 p-4 font-bold text-green-600">
                        {user.userProfile.rating}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
