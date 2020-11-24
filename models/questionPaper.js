const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const questionPaperSchema = new Schema({
  faculty: {
    type: String,
    ref: "faculty",
  },
  program: {
    type: String,
    ref: "program",
  },
  course: {
    type: String,
    ref: "course",
  },
  class: {
    type:String,
  },
  created_at: {
    type: Date,
    default: Date.now(),
  },
  questions: [],
  total_question: {
    type: Number,
    required: true,
  },
  total_mark: {
    type: Number,
    required: true,
  },
  avg_mark: {
    type: Number,
  },
  exam_date: {
    type: String,
  },
  exam_name: {
    type:String
  },
  time_duration: {
    type: Number,
    required: true,
  },
  difficulty: {
    type: String,
    enum: ["easy", "medium", "hard"],
    default: "easy",
  },
  instructions: { type:String },
  public: {
    type: Boolean,
    default: false,
  },
});

//Export model
module.exports = mongoose.model("questionPaper", questionPaperSchema);
