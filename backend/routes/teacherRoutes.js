import express from "express";
const router = express.Router();
import {
  getSubjects,
  addModule,
  addAssignment,
} from "../controllers/teacherDashboardController.js";
router.get("/getSubjects/:teacherId", getSubjects);
// Route to add modules and chapters to a subject
router.put("/:subjectId/modules", addModule);

router.post("/:teacherId/:subjectId/addAssignment", addAssignment);

export default router;
