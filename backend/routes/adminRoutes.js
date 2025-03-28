import express from "express";
const router = express.Router();
import {
  addTeacher,
  addCourse,
  getAllTeacher,
  getAllCourse,
  addSubject,
} from "../controllers/adminDashboardController.js";

router.post("/addTeacher", addTeacher);
router.post("/addCourse", addCourse);
router.get("/getAllTeacher", getAllTeacher);
router.get("/getAllCourse", getAllCourse);
router.post("/addSubject", addSubject);

export default router;
