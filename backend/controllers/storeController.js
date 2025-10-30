// server/controllers/storeController.js

import mongoose from "mongoose";
import User from "../models/userModels.js"; // Adjust import path as needed

export const redeemItem = async (req, res) => {
    const { userId, itemName, cost } = req.body;
    console.log(userId + " " + itemName + " " + cost);

  try {
    const user = await User.findById(userId);

      if (!user || user.userProfile.auraCoins < cost) {
        console.log("paise kam h")
      return res.status(400).json({ error: "Insufficient AuraCoins" });
    }
    console.log("paise poore h")
    // Deduct coins and add to purchase history
    user.userProfile.auraCoins -= cost;
    user.userProfile.purchaseHistory.push({
      itemName, // Convert itemId to ObjectId
      cost,
      purchaseDate: new Date(),
    });

    await user.save();
    res.status(200).json({ message: "Item redeemed successfully", user });
  } catch (error) {
    console.error("Redemption error:", error);
    res.status(500).json({ error: "Failed to redeem item" });
  }
};
