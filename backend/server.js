import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/dbConection.js";
import authRoutes from "./routes/authRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import teacherRoutes from "./routes/teacherRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import cors from "cors";
import storeRoutes from "./routes/storeRoutes.js"

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

app.use(cors());
// Middleware for JSON parsing
app.use(express.json());

// Use auth routes
app.use("/api/auth", authRoutes);

// Use profile routes
app.use("/api/user", profileRoutes);

// admin routes
app.use("/api/admin", adminRoutes);

// teacher routes
app.use("/api/teacher", teacherRoutes);

// student routes
app.use("/api/student", studentRoutes);

//store Routes
app.use("/api/store", storeRoutes);
// Other middleware and routes

// Root route
app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
