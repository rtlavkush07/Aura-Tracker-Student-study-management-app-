import express from "express";
import mongoose from "mongoose";
import Teacher from "../models/teacherModel.js"; // Assuming you have the teacherModel in models folder
import Subject from "../models/subjectModel.js"; // Assuming you have the subjectModel

// Controller to get all subjects for a teacher
export const getSubjects = async (req, res) => {
  try {
    console.log("coming to getSubjects controller");
    // Get teacher ID from request parameters
    const teacherId = req.params.teacherId;
    console.log("teacher ID = " + teacherId);

    // Find the teacher by ID and populate the subjects field
    const teacher = await Teacher.findById(teacherId).populate("subjects");
    console.log("teacher found" + teacher);

    if (!teacher) {
      console.log("teacher not  found");
      return res.status(404).json({ message: "Teacher not found" });
    }

    // Send the populated subjects as a response
    res.status(200).json(teacher.subjects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// controller to add data as modules and chapter in subject schema

// Controller to add modules and chapters to a subject
export const addModule = async (req, res) => {
  try {
    // Extract the subjectId and module data from the request
    const { subjectId } = req.params;
    const { modules } = req.body;

    // Find the subject by ID
    const subject = await Subject.findById(subjectId);
    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    // Add the new modules to the subject
    subject.data.push(...modules); // Adding the modules array to the existing data array

    // Save the updated subject
    await subject.save();

    res
      .status(200)
      .json({ message: "Modules and chapters added successfully", subject });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to add modules and chapters" });
  }
};
// Controller to add an assignment to a teacher's subject
export const addAssignment = async (req, res) => {
  try {
    console.log("coming to assignment controller");

    // Extract teacherId, subjectId, and assignment data from the request
    const { teacherId, subjectId } = req.params;
    const {
      assessmentID,
      assessmentName,
      assessmentDate,
      assessmentLastDate,
      assessmentContent,
      auraCoins,
      ratingPoint,
    } = req.body;

    // Find the teacher by ID
    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
      console.log("Teacher not found in addAssignment controller");
      return res.status(404).json({ message: "Teacher not found" });
    }

    // Find the subject by ID
    const subjectData = await Subject.findById(subjectId);
    if (!subjectData) {
      console.log("Subject not found in addAssignment controller");
      return res.status(404).json({ message: "Subject not found" });
    }

    // Create a new assignment object
    const newAssignment = {
      assessmentID,
      assessmentName,
      assessmentDate,
      assessmentLastDate,
      assessmentContent,
      auraCoins,
      ratingPoint,
    };

    // Ensure assessments array exists and then push the new assignment
    if (!subjectData.Assessments) {
      subjectData.Assessments = [];
    }
    subjectData.Assessments.push(newAssignment);

    // Save the updated subject
    await subjectData.save();

    res.status(200).json({
      message: "Assignment added successfully",
      assignment: newAssignment,
    });
  } catch (error) {
    console.error("Error in addAssignment:", error);
    res.status(500).json({ message: "Failed to add assignment" });
  }
};
