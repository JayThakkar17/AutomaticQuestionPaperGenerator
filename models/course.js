const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const courseSchema = new Schema({
  //if want to provide program code?
  _id: {
    type: String,
    minlength: 3,
    maxlength: 6,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    maxlength: 50,
    required: true,
  },
  optional: {
    type: Boolean,
    default: false,
  },
  created_at: {
    type: Date,
    default: Date.now(),
  },
  active: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model("course", courseSchema);
