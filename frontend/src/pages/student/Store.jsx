import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";


const products = [
  {
    id: 1,
    title: "100 Rupee Voucher",
    description: "Money Reward",
    image: "../public/store/100-coupan.png",
    price: 1,
  },
  {
    id: 2,
    title: "500  rupee Voucher",
    description: "Money Rewards",
    image: "../public/store/500-coupan.png",
    price: 5000,
  },
  {
    id: 3,
    title: "Aura T-Shirt",
    description: "Redeem our high-quality t-shirts",
    image: "../public/store/tshirt.png",
    price: 6000,
  },
  {
    id: 4,
    title: "Aura Cap",
    description: "Redeem our high-quality Cap",
    image: "../public/store/cap.png",
    price: 4000,
  },
  {
    id: 5,
    title: "Hoodie",
    description: "Redeem our high-quality Hoodie ",
    image: "../public/store/hoodie.jpg",
    price: 15000,
  },
  {
    id: 6,
    title: "Aura Premium 1-Month",
    description: "Exprience With Premium verison of AuraTracker ",
    image: "../public/store/premium.jpg",
    price: 3000,
  },
  {
    id: 7,
    title: "Aura Premium 3-Month",
    description: "Exprience With Premium verison of AuraTracker ",
    image: "../public/store/premium.jpg",
    price: 6500,
  },
  {
    id: 8,
    title: "Aura Premium 6-Month",
    description: "Exprience With Premium verison of AuraTracker ",
    image: "../public/store/premium.jpg",
    price: 10000,
  },
  {
    id: 9,
    title: "Aura Premium 12-Month",
    description: "Exprience With Premium verison of AuraTracker ",
    image: "../public/store/premium.jpg",
    price: 15000,
  },
  // Add more products as needed
];

const Store = () => {
  const [coin, setCoins] = useState(0);
  const { token, isAuthenticated } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth/login");
      return;
    }

    const fetchProfileData = async () => {
      try {
        const response = await axios.get("/api/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Assuming response.data contains user profile
        if (response.data && response.data.userProfile) {
          setCoins(response.data.userProfile.auraCoins);
          setUserId(response.data._id)
        }
      } catch (err) {
        console.error("Error fetching profile data:", err);
      }
    };

    fetchProfileData();
  }, [isAuthenticated, navigate, token]);

  const handleRedeem = async (product) => {
    if (userId !== null) {
      try {
        console.log("start reedming")
        console.log("userid"+userId)
        const response = await axios.post(
          "/api/store/redeem",
          {
            userId /* add logic to get user ID */,
            itemName:product.title,
            cost: product.price,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.status === 200) {
          setCoins(response.data.user.userProfile.auraCoins); // Update coins
          alert("Item redeemed successfully!");
        }
      } catch (error) {
        console.error("Redemption error:", error);
        alert("Failed to redeem item. Make sure you have enough AuraCoins.");
      }
    }
  }
    

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-800 to-gray-900 text-white">
      <header className="flex flex-col items-center justify-center py-16">
        <img
          src="../public/logo/icon.gif"
          alt="Aura Store Logo"
          className="w-32 h-32 mb-6"
        />
        <h1 className="text-4xl font-bold">Aura Store</h1>
        <p className="mt-4 text-lg">Shop or redeem products using AuraCoins.</p>
        <div className="mt-8 space-x-4">
          <button className="px-4 py-2 bg-gray-700 rounded-full">
            {coin} AuraCoins
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-lg shadow-md text-black p-6"
          >
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-40 object-cover rounded"
            />
            <h2 className="text-xl font-bold mt-4">{product.title}</h2>
            <p className="text-gray-600 mt-2">{product.description}</p>
            <div className="flex justify-between items-center mt-4">
              <span className="text-yellow-500 font-bold">
                {product.price} Coins
              </span>
              <button
                onClick={() => handleRedeem(product)}
                className="px-4 py-2 bg-orange-500 text-white rounded"
              >
                Redeem
              </button>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
};

export default Store;
