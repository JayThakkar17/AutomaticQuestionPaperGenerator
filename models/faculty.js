const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const facultySchema = new Schema({
    _id: {
        type: String,
        maxlength: 50,
        required: true,
        unique: true,
    },
    classes: [
        {
            program: {
                type: String,
                ref: 'program',
                default: null,
            },
            course:
            {
                type: String,
                ref: 'course',
                default: null,
            },
            topics:[String]
        },
    ],
});

//Export model
module.exports = mongoose.model('faculty', facultySchema);


