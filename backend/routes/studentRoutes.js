import express from "express";
import { getAllStudents } from "../controllers/studentController.js";
import {
  getCourse,
  getCourseSubjects,
  getOneSubject,
  getSubjectPendingAssessment,
  completeChapter,
  getCompletedChapters,
  uploadAssignment,
} from "../controllers/studentDashboardController.js";
import authMiddleware from "../src/middleware/authMiddleware.js";

const router = express.Router();

router.get("/getAllStudents", getAllStudents);
// router.get("/getLeaderboard", getLeaderboard);
router.get("/course/:courseid", getCourse);
router.get("/getCourseSubjects/:userId/:courseId", getCourseSubjects);
router.get("/getsubject/:subjectId", getOneSubject);
router.get(
  "/getSubjectPendingAssessment/:userId/:courseId",
  getSubjectPendingAssessment
);
router.post(
  "/completechapter/:userId/:chapterId/:moduleId/:subjectId/:auracoin/:ratingpoint",
  completeChapter
);
router.get("/getCompletedChapters/:userId", getCompletedChapters);

router.post("/uploadAssignment", authMiddleware, uploadAssignment);
export default router;
