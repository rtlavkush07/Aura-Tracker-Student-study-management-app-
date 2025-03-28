import mongoose from "mongoose"; // Use import for ES modules

const userProfileSchema = new mongoose.Schema(
  {
    rating: { type: Number, default: 1000 }, // Starting rating for new users
    auraCoins: { type: Number, default: 0 }, // Coins that users can spend on rewards

    badges: [{
      iconId:{type:String,default:null},
      icon: { type: String, default: "" },
      name: {type:String,required:true},
      
    }], // Array of badge names or IDs
    vouchers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Voucher" }], // Array of acquired vouchers

    purchaseHistory: [
      {
        itemName:{type:String,default:""},
        purchaseDate: { type: Date, default: Date.now }, // Date of purchase

        cost: { type: Number, required: true }, // Cost in aura coins
      },
    ],
  },
  { _id: false }
);


export default userProfileSchema; // Export using ES module syntax
