const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
   _id: {
    type: String,
    maxlength: 50,
    required: true,
    unique: true,
    //specify reg-ex.
  },
  password: {
    type: String,
    maxlength: 100,
    required: true,
    //spedify reg-ex.
  },
  name: {
    type: String,
    minlength: 3,
    maxlength: 50,
  },
  role: {
    type: String,
    enum: ["admin", "faculty", "student"],
    required: true,
  },
  reg_date: {
    type: Date,
    required: true,
    default: Date.now(),
  },
  active: {
    type: Boolean,
    required: true,
    default: true,
  },
  resetToken: String,
  resetTokenExpiration: Date 
});

//Export model
module.exports = mongoose.model("user", userSchema);
