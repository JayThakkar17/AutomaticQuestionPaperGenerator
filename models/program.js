const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const programSchema = new Schema({
  //if want to provide program code?
  _id: {
    type: String,
    maxlength: 10,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    maxlength: 100,
    required: true,
    unique: true,
  },
  duration: {
    type: Number,
    min: 1,
    max: 5,
    defualt: 1,
  },
  courses: [
    {
      type:String,
      ref: "course",
      unique: true,
    },
  ],
  active: {
    type: Boolean,
    default: true,
  },
  created_at: {
    type: Date,
    default: Date.now(),
  },
});

//Export model
module.exports = mongoose.model("program", programSchema);
