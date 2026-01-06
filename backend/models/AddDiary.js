import mongoose from "mongoose";

const diarySchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  class: {
    type: String,
    required: true,
  },
  section: {
    type: String,
    required: true, // 🔥 IMPORTANT
  },
  subject: {
    type: String,
    required: true,
  },
  notes: {
    type: String,
    required: true,
  },
});

const AddDiary = mongoose.model("Diary", diarySchema);
export default AddDiary;
