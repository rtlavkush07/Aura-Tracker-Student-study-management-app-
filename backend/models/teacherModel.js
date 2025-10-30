import mongoose from "mongoose";
const teacheSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  subjects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Subject" }],
});
const Teacher = mongoose.model("Teacher", teacheSchema);
export default Teacher;
