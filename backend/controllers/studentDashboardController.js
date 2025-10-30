import Course from "../models/courseModel.js";
import User from "../models/userModels.js";
import mongoose from "mongoose";
import Subject from "../models/subjectModel.js";

// Controller to handle assignment upload and submission

const badgeCriteria = [
  {
    ratingThreshold: 1000,
    badge: {
      iconId: "bronze",
      icon: "../../../public/badge/bronze.png",
      name: "Bronze",
    },
  },
  {
    ratingThreshold: 2000,
    badge: {
      iconId: "silver",
      icon: "../../../public/badge/silver.png",
      name: "Silver",
    },
  },
  {
    ratingThreshold: 3000,
    badge: {
      iconId: "gold",
      icon: "../../../public/badge/gold.png",
      name: "Gold",
    },
  },
  {
    ratingThreshold: 4000,
    badge: {
      iconId: "platinum",
      icon: "../../../public/badge/platinum.png",
      name: "Platinum",
    },
  },
  // Add more badges as needed
];


export const uploadAssignment = async (req, res) => {
  try {
    console.log("Entering upload controller");

    const { assignmentId, subjectId, submittedContent, userId } = req.body;
    console.log(`assignmentId in uploadAssignment controller: ${assignmentId}`);
    console.log(`subjectId in uploadAssignment controller: ${subjectId}`);

    // Assume req.user is populated by a middleware for authentication
    console.log("user id in controller = " + userId);

    const subject = await Subject.findById(subjectId);
    if (!subject) {
      console.log("Subject not found");
      return res.status(404).json({ message: "Subject not found" });
    }
    console.log("subject  = " + JSON.stringify(subject));
    console.log("subject assignment = " + JSON.stringify(subject.Assessments));

    // Find the assignment in the subject's Assessments array
    // Find the assignment in the subject's Assessments array
    const assignment = subject.Assessments.map((ass) => {
      // console.log("Ass id = " + ass._id);
      if (ass._id == assignmentId) {
        console.log("Found assignment in subject");
        return ass;
      }
    }).filter(Boolean)[0]; // Filter out undefined results from map

    if (!assignment) {
      console.log("Assignment not found");
      return res.status(404).json({ message: "Assignment not found" });
    }

    // Check if the user has already submitted this assignment
    const alreadySubmitted = assignment.submittedBy.some(
      (submission) => submission.student.toString() === userId.toString()
    );
    if (alreadySubmitted) {
      return res.status(400).json({ message: "Assignment already submitted" });
    }

    // Add the new submission to the assignment
    assignment.submittedBy.push({
      student: userId,
      submittedContent,
    });

    // Save the updated subject document
    await subject.save();

    res.status(200).json({ message: "Assignment submitted successfully" });
  } catch (error) {
    console.error("Error submitting assignment:", error);
    res.status(500).json({ message: "Failed to submit assignment" });
  }
};

export const getCompletedChapters = async (req, res) => {
  console.log("Coming to getCompletedChapters controller");
  const { userId } = req.params; // Extract the userId from the URL params

  try {
    // Find the user by userId
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Assuming the completed chapters are stored as an array of chapter objects or references
    const completedChapters = user.completedChapters || [];

    // Extract only the chapter IDs
    const completedChapterIds = completedChapters.map(
      (chapter) => chapter.chapterId
    );
    console.log("Completed chapters IDs = " + completedChapterIds);

    // Respond with the array of chapter IDs
    res.status(200).json(completedChapterIds);
  } catch (err) {
    console.error("Error fetching completed chapters:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const completeChapter = async (req, res) => {
  console.log("Entering completeChapter controller");

  const { userId, moduleId, chapterId, subjectId, auracoin, ratingpoint } =
    req.params;

  // Check if all required parameters are present
  if (!userId || !moduleId || !auracoin || !ratingpoint || !chapterId) {
    console.log("Missing required parameters");
    return res.status(400).json({ message: "Missing required parameters" });
  }

  console.log(
    `UserId: ${userId}, ModuleId: ${moduleId}, ChapterId: ${chapterId}, SubjectId: ${subjectId}, auracoin: ${auracoin}, Ratingpoint: ${ratingpoint}`
  );

  try {
    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      console.log("User not found in completeChapter controller");
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the chapter has already been completed by this user
    const isChapterCompleted = user.completedChapters.some(
      (chapter) =>
        chapter.subjectId &&
        chapter.moduleId &&
        chapter.chapterId &&
        chapter.subjectId.toString() === subjectId &&
        chapter.moduleId.toString() === moduleId &&
        chapter.chapterId.toString() === chapterId
    );

    if (isChapterCompleted) {
      return res.status(400).json({ message: "Chapter already completed" });
    }

    // Add the completed chapter with rewards to the user's completedChapters array
    const auraCoinsToAdd = parseInt(auracoin, 10) || 0;
    const ratingPointsToAdd = parseInt(ratingpoint, 10) || 0;

    user.completedChapters.push({
      subjectId,
      moduleId,
      chapterId,
      rewards: {
        auraCoins: auraCoinsToAdd,
        ratingPoints: ratingPointsToAdd,
      },
    });

    // Update user's profile with new auraCoins and ratingPoints
    user.userProfile.auraCoins =
      (user.userProfile.auraCoins || 0) + auraCoinsToAdd;
    user.userProfile.rating =
      (user.userProfile.rating || 0) + ratingPointsToAdd;

    // Save the user document with the updated completedChapters and profile info
    await user.save();
    //call badge insert function
   
    await updateUserBadges(user._id, user.userProfile.rating);
  
    
    console.log("Chapter completed successfully, and user profile updated");

    res.status(200).json({
      message: "Chapter completed successfully and user profile updated",
    });
  } catch (error) {
    console.error("Error in completing chapter:", error);
    res.status(500).json({ error: "Failed to complete chapter" });
  }
};

const updateUserBadges = async (userId, rating) => {
  try {
    // Fetch the user profile
    const user = await User.findById(userId);

    if (!user) return;

    // Determine new badges based on the rating
    const newBadges = badgeCriteria
      .filter((criteria) => rating >= criteria.ratingThreshold) // Only include badges for which the rating qualifies
      .map((criteria) => criteria.badge);

    // Only add badges that the user doesn't already have
    const uniqueBadges = newBadges.filter(
      (badge) =>
        !user.userProfile.badges.some(
          (existingBadge) => existingBadge.iconId === badge.iconId
        )
    );

    if (uniqueBadges.length > 0) {
      // Add new badges to user's profile
      user.userProfile.badges.push(...uniqueBadges);
      console.log(JSON.stringify(user));
      await user.save();
      console.log(JSON.stringify(user));
    }
  } catch (error) {
    console.error("Error updating badges:", error);
  }
};


export const getSubjectPendingAssessment = async (req, res) => {
  console.log("Coming to pending assessment controller");

  const { userId, courseId } = req.params;
  // var subjectId;

  try {
    // Ensure valid ObjectId format for userId and courseId
    console.log("userId: " + userId + " courseId: " + courseId);
    if (
      !mongoose.Types.ObjectId.isValid(userId) ||
      !mongoose.Types.ObjectId.isValid(courseId)
    ) {
      console.log("Invalid userId or courseId");
      return res.status(400).json({ error: "Invalid user or course ID" });
    }

    // Fetch user and course data
    const user = await User.findById(userId);
    const course = await Course.findById(courseId).populate("subjects"); // Populate subjects directly

    if (!user || !course) {
      console.log("User or Course not found");
      return res.status(404).json({ error: "User or Course not found" });
    }

    console.log("Coming after checking all");

    // Check if subjects is an array
    if (!Array.isArray(course.subjects)) {
      console.log("Invalid structure for course subjects");
      return res
        .status(500)
        .json({ error: "Invalid structure for course subjects" });
    }

    // Fetch pending assignments for each subject
    const pendingAssignments = await Promise.all(
      course.subjects.map(async (subject) => {
        // console.log("Subject ID in pending assignments: ", subjectId);
        // Fetch subject details using Subject model (if needed)
        const subjectAssessment = await Subject.findById(subject._id);
        if (!subjectAssessment) {
          console.log("Subject not found in course subjects controller");
          return { error: "Subject not found" };
        }

        console.log("Subject: ", subjectAssessment.subjectName);
        console.log("Assignments: ", subjectAssessment.Assessments);

        // Ensure that Assessments is an array before using .filter()
        const assessments = Array.isArray(subjectAssessment.Assessments)
          ? subjectAssessment.Assessments.filter(
              (assessment) => assessment.submittedBy.length !== -1 // Check if no one has submitted the assignment
            )
          : [];

        return {
          subjectId: subject._id,
          subjectName: subjectAssessment.subjectName,
          assessments, // Only include assessments if they are pending (i.e., no submissions)
        };
      })
    );

    // Filter out subjects with no pending assessments
    const filteredAssignments = pendingAssignments.filter(
      (subject) => subject.assessments && subject.assessments.length > 0
    );

    if (filteredAssignments.length === 0) {
      return res.status(200).json({ message: "No pending assessments found" });
    }

    return res.status(200).json(filteredAssignments);
  } catch (error) {
    console.error("Error fetching pending assessments:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while fetching assessments" });
  }
};

export const getCourse = async (req, res) => {
  console.log("comign toi stduebt dahsaboah xxontowr");
  const courseid = req.params.courseid;
  console.log("coourseID =" + courseid); // Extract courseId from request body

  try {
    const course = await Course.findById(courseid);

    if (!course) {
      console.log("course not founs iun controler");
      return res.status(404).json({ error: "Course not found" });
    }

    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch course" });
  }
};

export const getCourseSubjects = async (req, res) => {
  console.log("Coming to course subjects controller");

  const { userId, courseId } = req.params; // Extract userId and courseId from the URL params
  console.log("User ID in controller =", userId);
  console.log("Course ID in controller =", courseId);

  try {
    // Validate IDs
    if (
      !mongoose.Types.ObjectId.isValid(userId) ||
      !mongoose.Types.ObjectId.isValid(courseId)
    ) {
      console.log("Invalid user ID or course ID");
      return res.status(400).json({ error: "Invalid user or course ID" });
    }

    // Fetch the user by ID
    const user = await User.findById(userId);
    if (!user) {
      console.log("User not found in course subjects controller");
      return res.status(404).json({ message: "User not found" });
    }

    // Fetch the course details along with subjects and ensure modules are populated
    const course = await Course.findById(courseId).populate({
      path: "subjects",
      populate: {
        path: "data", // Ensure that modules are populated
        populate: {
          path: "chapters", // Ensure that chapters are populated
        },
      },
    });

    if (!course) {
      console.log("Course not found in course subjects controller");
      return res.status(404).json({ error: "Course not found" });
    }

    console.log("Course subjects:", course.subjects);

    // Calculate progress for each subject
    const subjectsWithProgress = await Promise.all(
      course.subjects.map(async (subject) => {
        // Ensure modules are properly populated and not empty
        console.log("subject name:", subject.subjectName);
        const modules =
          subject.data && Array.isArray(subject.data) ? subject.data : [];
        console.log("Modules:", modules);

        // Count the total chapters in the subject
        const totalChapters = modules.reduce(
          (acc, module) =>
            acc + (Array.isArray(module.chapters) ? module.chapters.length : 0),
          0
        );
        console.log("Total chapters:", totalChapters);

        // Count the chapters completed by the user in this subject
        const completedChapters = user.completedChapters.filter(
          (completed) => String(completed.subjectId) === String(subject._id)
        ).length;
        console.log("Completed chapters:", completedChapters);

        // Calculate progress
        const progress = totalChapters
          ? Math.round((completedChapters / totalChapters) * 100)
          : 0;
        console.log("Progress:", progress);

        return {
          _id: subject._id,
          name: subject.subjectName,
          progress,
          topics: modules.flatMap((module) =>
            module.chapters ? module.chapters.map((ch) => ch.chapterName) : []
          ), // List of chapter names
        };
      })
    );

    // Respond with the subjects and their progress
    res.status(200).json(subjectsWithProgress);
  } catch (error) {
    console.error("Error fetching course subjects:", error);
    res.status(500).json({ error: "Failed to fetch course subjects" });
  }
};

//get single subject by id
export const getOneSubject = async (req, res) => {
  console.log("comign toi stduent dahsaboah xxontowr");
  const subjectId = req.params.subjectId;
  console.log("subjectID =" + subjectId); // Extract courseId from request body

  try {
    const subject = await Subject.findById(subjectId);

    if (!subject) {
      console.log("subject not found controler");
      return res.status(404).json({ error: "Course not found" });
    }
    console.log(subject);
    res.status(200).json(subject);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch course" });
  }
};
