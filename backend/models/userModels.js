import mongoose from "mongoose";
import bcrypt from "bcrypt";
import userProfileSchema from "./userProfileModel.js";
const completedChapterSchema = new mongoose.Schema({
  subjectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subject",
    unique: "true",
  }, // Reference to the subject
  moduleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Module",
    unique: "true",
  }, // Reference to the module
  chapterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Chapter",
    unique: "true",
  }, // Reference to the chapter
  completedAt: { type: Date, default: Date.now }, // Date of completion
  rewards: {
    auraCoins: { type: Number, default: 0 },
    ratingPoints: { type: Number, default: 0 },
  },
});
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  profilePicture: { type: String },
  accessToken: { type: String },
  refreshToken: { type: String },
  createdAt: { type: Date, default: Date.now },
  password: { type: String, required: true },
  year: { type: Number, required: true },
  regNo: { type: String, required: true, unique: true },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Course",
  },
  userProfile: userProfileSchema, // Embed user profile schema
  completedChapters: [completedChapterSchema], // Array of completed chapters with rewards
});

// Hash password before saving user document
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    return next(error);
  }
});

// Method to compare passwords during login
userSchema.methods.comparePassword = async function (candidatePassword) {
  console.log("Password to compare:", candidatePassword); // Log the password to be compared

  const isMatch = await bcrypt.compare(candidatePassword, this.password); // Compare passwords
  console.log("Password Match Result:", isMatch); // Log the result of the comparison

  return isMatch; // Return the result
};

const userAuth = mongoose.model("User", userSchema);
export default userAuth;
