const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const questionSchema = new Schema({
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
    type: String,
  },
  topic: {
    type:String
  },
  created_at: {
    type: Date,
    default: Date.now(),
  },
  text: {
    type: String,
    required: true,
  },
  images: [ ],
  note: {
    type: String,
  },
  difficulty: {
    type: String,
    enum: ["easy", "medium", "hard"],
    default: "easy",
  },
  mark: {
    type: Number,
    min: 1,
    required: true,
  },
  type: {
    type: String,
    enum: ["theory", "mcq", "true/false", "yes/no" /**or any other*/],
    default: "theory",
  },
  options:[String],
  answer: {
    type: String,
  },
  public: {
    type: Boolean,
    default: false,
  },
});

//Export model
module.exports = mongoose.model("question", questionSchema);
