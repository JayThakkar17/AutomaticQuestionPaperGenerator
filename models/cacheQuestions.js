const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// expire docs 3600 seconds after createdAt
const cacheQuestionsSchema = new Schema({
    questions: [],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

cacheQuestionsSchema.index({ createdAt : 1 }, { expireAfterSeconds: 3600 });

module.exports = mongoose.model("cacheQuestions", cacheQuestionsSchema);
