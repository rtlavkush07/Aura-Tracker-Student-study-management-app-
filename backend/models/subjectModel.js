import mongoose from "mongoose";

const chapterSchema = new mongoose.Schema({
  chapterName: { type: String, required: true },

  rewards: {
    auraCoins: { type: Number, default: 10 },
    ratingPoints: { type: Number, default: 1 },
  },
});

const moduleSchema = new mongoose.Schema({
  moduleName: { type: String, required: true },
  chapters: [chapterSchema], // Array of chapters within this module
});

const subjectSchema = new mongoose.Schema({
  subjectName: { type: String, required: true },
  subjectCode: { type: String, required: true, unique: true },
  data: [moduleSchema], // Array of modules within the subject
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher" },
  Assessments: [
    {
      assessmentID: String,
      assessmentName: String,
      assessmentDate: Date,
      assessmentLastDate: Date,
      assessmentContent: String,
      auraCoins: Number,
      ratingPoint: Number,
      submittedBy: [
        {
          student: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
          submittedContent: { type: String },
        },
      ],
    },
  ],
});

export default mongoose.model("Subject", subjectSchema);
