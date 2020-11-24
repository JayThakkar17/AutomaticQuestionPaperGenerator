const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const studentSchema = new Schema({
  _id: {
    type: String,
    maxlength: 50,
    required: true,
    unique: true,
  },
  program: {
    type: String,
    ref: "program",
  },
  batch: {
    type: String,
  },
});

//Export model
module.exports = mongoose.model("student", studentSchema);
