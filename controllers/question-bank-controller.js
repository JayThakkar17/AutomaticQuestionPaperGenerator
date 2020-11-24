

const Faculty = require("../models/faculty");
const Question = require("../models/question");

//***********************************************************************************/
/** C-R-U-D Questions... */
//***********************************************************************************/

exports.getCreateQuestion = (req, res, next) => {

    let mError = req.flash("error");
    let mOk = req.flash("info");

    if (mError.length > 0) {
        mError = mError[0];
        mOk = null
    } else if (mOk.length > 0) {
        mOk = mOk[0];
        mError = null
    }
    else {
        mError = mOk = null
    }


    let message = null;
    const id = req.user._id;
    const classId = req.params.classId

    Faculty.findById(id)
        .then(mClass => {
            if (!mClass) {
                console.log(mClass);
                message = 'No Classes'
            }
            let mmClass = null;
            for (let i = 0; mClass.classes[i]; i++) {
                if (String(mClass.classes[i]._id) === classId)
                    mmClass = mClass.classes[i];
            }
            res.render('AddQuestion', {
                mClass: {
                    classId: classId,
                    program: mmClass.program,
                    course: mmClass.course,
                    topics: mmClass.topics,
                },
                errorMessage: mError,
                okMessage:mOk
            });
        })
        .catch(error => {
            console.log(`Error Fetching Class : ${error.message}`);
            message = "Opps! Something's wrong! Please try again later."
            res.render('noData', { message: message })
        });
}


exports.createQuestion = (req, res, next) => {
    console.log("Question Created");
    //console.log(req.body);
    const facId = req.user._id;
    const programId = req.body.programId;
    const courseId = req.body.courseId;
    const classId = req.body.classId;
    const topic = req.body.mtopic;
    const difficutly = req.body.level;
    const mark = req.body.marks;
    const type = req.body.type;
    const question = req.body.question;
    const note = req.body.note;
    const answer = req.body.answer;
    const op1 = req.body.option1;
    const op2 = req.body.option2;
    const op3 = req.body.option3;
    const op4 = req.body.option4;
    const options = [];

    console.log(topic);

    if (type !== 'theory') {
        if (type === 'true/false') {
            options.push('true');
            options.push('false')
        }
        else if (type === 'yes/no') {
            options.push('yes');
            options.push('no')
        }
        else {
            options.push(op1);
            options.push(op2);
            options.push(op3);
            options.push(op4);
        }
    }

    const mQuestion = new Question({
        class: classId,
        faculty: facId,
        program: programId,
        course: courseId,
        topic: topic,
        text: question,
        note: note,
        difficulty: difficutly,
        mark: mark,
        type: type,
        options: options,
        answer: answer,
    })
    // console.log(mQuestion);

    mQuestion.save((err) => {
        message = null;
        if (err) {
            console.log(`Error Fetching Class : ${err.message}`);
            req.flash('error', "Couldn't add the question!");
            res.render('noData', { message: message })
        }
        req.flash('info', "Question Added!");
        res.redirect('/getCreateQuestion/' + classId);
    });
}


exports.getListQuestions = (req, res, next) => {

    let mError = req.flash("error");
    let mOk = req.flash("info");

    if (mError.length > 0) {
        mError = mError[0];
        mOk = null
    } else if (mOk.length > 0) {
        mOk = mOk[0];
        mError = null
    }
    else {
        mError = mOk = null
    }

    let message = null;
    const classId = req.params.classId;

    Question.find({class:classId})
        .then(mQuestions => {
            if (mQuestions.length < 1) {
                res.render('noData', {
                    feedBack: "No Questions!Please add Questions!"
                })
            }
            res.render('listQuestions', {
                mQuestions: mQuestions,
                errorMessage: mError,
                okMessage: mOk,
            });
        })
        .catch(error => {
            console.log(`Error Fetching Class : ${error.message}`);
            message = "Opps! Something's wrong! Please try again later."
            res.render('noData', { feedBack: message })
        });
}

exports.getDetailsQuestions = (req, res, next) => {

    let mError = req.flash("error");
    let mOk = req.flash("info");

    if (mError.length > 0) {
        mError = mError[0];
        mOk = null
    } else if (mOk.length > 0) {
        mOk = mOk[0];
        mError = null
    }
    else {
        mError = mOk = null
    }


    const questionId = req.params.questionId;
    const facId = req.user._id;
    let topics = null;

    Question.findById(questionId)
        .then(mQuestion => {
            if (!mQuestion) {
                console.log(mQuestion);
                message = 'No Classes'
            }
            console.log(mQuestion);
            //find class and return topics
            Faculty.findById(facId)
                .then(mClass => {
                    if (!mClass) {
                        console.log(mClass);
                        message = 'No Classes'
                    }
                    let mmClass = null;
                    for (let i = 0; mClass.classes[i]; i++) {
                        if (String(mClass.classes[i]._id) === mQuestion.class)
                            mmClass = mClass.classes[i];
                    }

                    res.render('questionDetails', {
                        mQuestion: mQuestion,
                        mTopics: mmClass.topics,
                        errorMessage: mError,
                        okMessage: mOk
                    })
                })
                .catch(error => {
                    console.log(`Error Fetching Class : ${error.message}`);
                    message = "Opps! Something's wrong! Please try again later."
                    res.render('noData', { message: message })
                });
        })
        .catch(error => {
            console.log(`Error Fetching Class : ${error.message}`);
            message = "Opps! Something's wrong! Please try again later."
            res.render('noData', { message: message })
        });
}


exports.updateQuestion = (req, res, next) => {
    console.log("Updating... ");

    const questionId = req.params.questionId;
    const classId = req.body.classId;
    //const topic = req.body.mtopic;
    // const difficutly = req.body.level;

    const type = req.body.type;
    const mark = req.body.marks;
    const question = req.body.question;
    const note = req.body.note;
    const answer = req.body.answer;
    const op1 = req.body.option1;
    const op2 = req.body.option2;
    const op3 = req.body.option3;
    const op4 = req.body.option4;
    const options = [];

    let isPublic = false;
    if (req.body.public === "public" ) {
        isPublic = true;
    }

    if (type !== 'theory') {
        if (type === 'true/false') {
            options.push('true');
            options.push('false')
        }
        else if (type === 'yes/no') {
            options.push('yes');
            options.push('no')
        }
        else {
            options.push(op1);
            options.push(op2);
            options.push(op3);
            options.push(op4);
        }
    }
    Question.findByIdAndUpdate(questionId, {
        $set: {
            text: question,
            note: note,
            mark: mark,
            options: options,
            answer: answer,
            public: isPublic,
        }
    })
        .then(result => {
            req.flash('info', "Question Updated!")
            res.redirect('/questionDetails/' + questionId)
        })
        .catch(error => {
            console.log(`Error Fetching Class : ${error.message}`);
            req.flash('error', "Counldn't Update the Question")
            res.redirect('/questionDetails/' + questionId)
        });
}


exports.deleteQuestion = (req, res, next) => {

    const questionId = req.params.questionId;
    const classId = req.params.classId;

    Question.findByIdAndDelete(questionId)
        .then(result => {
            req.flash('info', "Question Deleted!")
            res.redirect('/listQuestions/' + classId)
        }).catch(error => {
            console.log(`Error Fetching Class : ${error.message}`);
            req.flash('error', "Counldn't Delete the Question")
            res.redirect('/listQuestions/' + classId)
        });
}




exports.getPublicQuestionForStudents = (req, res, next) => {

    const fid = req.body.faculty;
    const pid = req.body.program;
    const cid = req.body.course;

    //if no type is seleceted.... selecte all type of questions...
    let types = req.body.mTypes;
    if (!types) {
        types = ['theory', 'mcq', 'yes/no', 'true/false']
    }
    let difficulty = req.body.mDiff;
    if (!difficulty) {
        difficulty = ['easy', 'hard', 'medium']
    }
    Question.find({
        faculty: fid,
        program: pid,
        course: cid,
        type: types,
        difficulty: difficulty,
        public: true
    })
        .then(mQuestions => {
            if (mQuestions.length < 1) {
                res.render('noData', {
                    feedBack: "No Questions!"
                })
            }
            res.render('listPublicQuestions', {
                mQuestions: mQuestions,
                errorMessage: null,
                okMessage: null,
            });
        })
        .catch(error => {
            console.log(`Error Fetching Class : ${error.message}`);
            message = "Opps! Something's wrong! Please try again later."
            res.render('noData', { feedBack: message })
        });
}


exports.getQuestionDetailsForStudents = (req, res, next) => {
    const questionId = req.params.qId;
    Question.findById(questionId)
        .then(mQuestion => {
            res.render('sQuestionDetails', {
                mQuestion: mQuestion,
            })
        })
        .catch(error => {
            console.log(`Error Fetching Class : ${error.message}`);
            message = "Opps! Something's wrong! Please try again later."
            res.render('noData', { message: message })
        });
}
