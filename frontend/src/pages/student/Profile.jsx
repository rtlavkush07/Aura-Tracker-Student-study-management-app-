import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import api from "../../api.js";

const Profile = () => {
  const navigate = useNavigate();
  const { token, isAuthenticated } = useSelector((state) => state.auth);
  const [userData, setUserData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [courseName, setCourseName] = useState();
  const getCourseName = async (user) => {
    try {
      const response = await api.get(`/student/course/${user.course}`);
      setCourseName(response.data.courseName);
      console.log(response);
    } catch (error) {
      console.error("failed to fetch course name:", error);
    }
  };
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
        await getCourseName(response.data);
        setUserData(response.data);
        console.log(userData);
      } catch (err) {
        console.error("Error fetching profile data:", err);
      }
    };

    fetchProfileData();
  }, [isAuthenticated, navigate, token]);

  if (!userData) return <div>Loading...</div>;

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="w-full overflow-hidden">
      <div
        className="absolute inset-0 flex bg-cover bg-center"
        style={{
          backgroundImage: "url('../public/assets/s11.jpg')",
          width: "100%",
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      ></div>
      <div className="relative bg-black bg-opacity-30 text-white min-h-screen p-8">
        {/* Profile Header */}
        <div className="flex items-start mb-8 mx-10 justify-between">
          <img
            src={userData.profilePicture}
            alt="profile"
            className="w-40 h-40 rounded-full mr-8"
          />
          <div className="flex flex-col space-y-4 mt-12">
            <h2 className="text-2xl font-semibold">{userData.name}</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 mt-8">
            <div className="bg-black  bg-opacity-45 p-6 rounded-lg text-center">
              <h2 className="text-lg font-semibold">Rating</h2>
              <p className="text-2xl">{userData.userProfile.rating || 0}</p>
            </div>
            <div className="bg-black bg-opacity-45 p-6 rounded-lg text-center">
              <h2 className="text-lg font-semibold">Aura Coins</h2>
              <p className="text-2xl">{userData.userProfile.auraCoins || 0}</p>
            </div>
          </div>
        </div>

        {/* Profile Cards - Emails */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mx-10 mt-5">
          <div className="bg-black bg-opacity-45 p-4 rounded-lg">
            <h2 className="text-lg font-semibold">Email</h2>
            <p className="text-2xl">{userData.email}</p>
          </div>
          <div className="bg-black bg-opacity-45 p-4 rounded-lg">
            <h2 className="text-lg font-semibold">Course</h2>
            <p className="text-2xl">{courseName}</p>
          </div>
          <div className="bg-black bg-opacity-45 p-4 rounded-lg">
            <h2 className="text-lg font-semibold">Year</h2>
            <p className="text-2xl">{userData.year}</p>
          </div>
          <div className="bg-black bg-opacity-45 p-4 rounded-lg">
            <h2 className="text-lg font-semibold">Reg No. </h2>
            <p className="text-2xl">{userData.regNo}</p>
          </div>
        </div>

        {/* Rating and Aura Coins */}

        {/* Badges Section */}
        <div className="bg-black bg-opacity-45 p-6 rounded-lg mb-6 mt-5 overflow-x-auto whitespace-nowrap">
          <h2 className="text-2xl font-semibold mb-4">Badges</h2>
          <div className="flex gap-4">
            {userData.userProfile.badges &&
            userData.userProfile.badges.length > 0 ? (
              userData.userProfile.badges.map((badge, index) => (
                <div
                  key={index}
                  className="flex items-center w-50 px-10 py-10 rounded-full"
                >
                  {badge.icon && (
                    <img
                      src={"../../../public/badge/bronze.png"}
                      alt={badge.name}
                      className="w-20 h-20 mr-2"
                    />
                  )}
                  <span className="text-3xl">{badge.name}</span>
                </div>
              ))
            ) : (
              <p>No badges available</p>
            )}
          </div>
        </div>

        {/* badges section end  */}
        <button
          onClick={openModal}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg mb-6"
        >
          View Purchase History
        </button>

        {/* Purchase History Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 overflow-scroll">
            <div className="bg-black bg-opicity-40 text-white rounded-lg p-6 max-w-lg w-full relative">
              <h2 className="text-2xl font-semibold mb-4">Purchase History</h2>
              <button
                onClick={closeModal}
                className="text-red-500 absolute top-4 right-4"
              >
                &#10005;
              </button>
              <table className="w-full text-left">
                <thead>
                  <tr>
                    <th className="border-b border-gray-700 py-2">Item</th>
                    <th className="border-b border-gray-700 py-2">
                      Purchase Date
                    </th>
                    <th className="border-b border-gray-700 py-2">Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {userData.userProfile.purchaseHistory &&
                  userData.userProfile.purchaseHistory.length > 0 ? (
                    userData.userProfile.purchaseHistory.map((purchase) => (
                      <tr key={purchase.id}>
                        <td className="py-2">{purchase.itemName}</td>
                        <td className="py-2">{purchase.purchaseDate}</td>
                        <td className="py-2">{purchase.cost} Coins</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="py-2 text-center">
                        No purchase history available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
