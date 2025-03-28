import userAuth from "../models/userModels.js"; // Assuming user model is in the correct path

export const getAllStudents = async (req, res) => {
  try {
    // Fetch all students and exclude the password field
    console.log("yahan");
    const users = await userAuth.find().select("-password");

    if (!users) {
      return res.status(404).json({ error: "No students found" });
    }

    res.status(200).json(users); // Respond with the list of students
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ error: "Failed to fetch students" }); // More appropriate error message
  }
};

export const getLeaderboard = async (req, res) => {
  try {
    // Fetch all students and exclude the password field
    const students = await userAuth
      .find()
      .select("name userProfile.rating profilePicture year");

    if (!students || students.length === 0) {
      return res.status(404).json({ error: "No students found" });
    }

    // Sort students by rating in descending order
    const sortedLeaderboard = students.sort(
      (a, b) => b.userProfile.rating - a.userProfile.rating
    );

    res.status(200).json(sortedLeaderboard); // Return the sorted leaderboard
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    res.status(500).json({ error: "Failed to fetch leaderboard" }); // Return a meaningful error message
  }
};
