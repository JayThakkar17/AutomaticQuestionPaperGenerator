const Question = require("../models/question");
const Faculty  = require("../models/faculty")
const QuestionPaper = require("../models/questionPaper");
const Cache = require('../models/cacheQuestions');




exports.getGenerateQuestionPaper = (req, res, next) => {
    let message = null;
    const id = req.user._id;
    const classId = req.params.classId;

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

            res.render('generateQuestionPaper', {
                mClass: {
                    classId: classId,
                    program: mmClass.program,
                    course: mmClass.course,
                    topics: mmClass.topics,
                }
            });
        })
        .catch(error => {
            console.log(`Error Fetching Class : ${error.message}`);
            message = "Opps! Something's wrong! Please try again later."
            res.render('noData', { message: message })
        });

}


exports.generateQuestionPaper = (req, res, next) => {

    console.log("Generating Questiona Paper Started!");

    let message = null;
    const classId = req.params.classId;

    const allTopic = req.body.allTopics;
    //if no topics is selected... select all topics.
    let topics = req.body.mTopics;
    if (!topics) {
        topics = allTopic
    }

    //if no type is seleceted.... selecte all type of questions...
    let types = req.body.mTypes;
    if (!types) {
        types =['theory', 'mcq', 'yes/no', 'true/false']
    }

    let nEasy = req.body.nEasy;
    let nMedium = req.body.nMedium;
    let nHard = req.body.nHard;

    const totalQuestion = parseInt(nEasy) + parseInt(nMedium) + parseInt(nHard);

    Question.find({ class: classId, topic:{$in:topics}, type: {$in:types}})
        .then(mQuestions => {
            if (!mQuestions) {
                console.log(mQuestions);
                message = 'No Questions'
            }

            const randomizedQuestions = [mQuestions[0]]
            randomizedQuestions.length = 0;
            //Randomize
            for (let i in mQuestions) {
                let randomIndex = Math.floor(Math.random() * mQuestions.length);
                while (randomizedQuestions.includes(mQuestions[randomIndex])) {
                    randomIndex = Math.floor(Math.random() * mQuestions.length);
                }
                randomizedQuestions[i] = mQuestions[randomIndex];
            }

            //An array to store final question that meets with the requirements...

            const finalQuestions = [mQuestions[0]]
            finalQuestions.length = 0;

            for (let i = 0; randomizedQuestions[i]; i++) {
                if (nEasy || nMedium || nHard) {
                    if ((randomizedQuestions[i].difficulty === 'easy') && nEasy > 0) {
                        nEasy--;
                        finalQuestions.push(randomizedQuestions[i]);
                    }
                    else if ((randomizedQuestions[i].difficulty === 'medium') && nMedium > 0) {
                        nMedium--;
                        finalQuestions.push(randomizedQuestions[i]);
                    }
                    else if ((randomizedQuestions[i].difficulty === 'hard') && nHard > 0){
                        nHard--;
                        finalQuestions.push(randomizedQuestions[i]);
                    }
                }
                else {
                    break;
                }
            }
            //console.log(finalQuestions);
            //console.log("Rendering the Questions...");
            if (finalQuestions.length < totalQuestion) {
                message = "Sorry! Not enough Questions for the speacified 'Constraints'!"
                console.log(message);
                res.render('noData', { feedBack: message })
            }


            console.log("Generating Questiona Paper Complete!");

            res.render('questionPaper', {
                mQuestions: finalQuestions,
                mTotalQuestion: totalQuestion,
                classId: classId,
                response_for: 'draft',
                feedBack : 'OK'
            });
        })
        .catch(error => {
            console.log(`Error Fetching Class : ${error.message}`);
            message = "Opps! Something's wrong! Please try again later."
            res.render('noData', { feedBack : message })
        });
}


exports.createQuestionPaper = (req, res, next) => {
    // const mCacheId = req.params.cacheId;
    // console.log(mCacheId);
    const id = req.user._id;
    const classId = req.body.classId;
    const mQuestionIds = req.body.finalQuestionIds;

    if (!mQuestionIds) {
        message = "No Qeustions Seleted"
        res.render('noData', { feedBack: message })
    }

    //Will do it using CacheQuestions....later...
    Question.find({ _id:{ "$in": mQuestionIds } })
        .then(mFinalQuestions => {

            //find class's Program ID and Course ID;
            let program = "";
            let course = "";
            Faculty.find({ "_id": id, "classes._id": classId })
                .then(classDetails => {

                    for (let i = 0; classDetails[0].classes[i]; i++) {
                        if (String(classDetails[0].classes[i]._id) === classId) {
                            program =classDetails[0].classes[i].program;
                            course = classDetails[0].classes[i].course;
                        }
                    }

                    const totalQuestion = mFinalQuestions.length
                    mEasy = mMedium = mHard = 0;
                    //find total Questions and Paper's difficulty..
                    let totalMarks = 0;
                    for (let i = 0; mFinalQuestions[i]; i++) {
                        totalMarks += mFinalQuestions[i].mark;
                        if (mFinalQuestions[i].difficulty === 'easy')
                            mEasy++;
                        else if (mFinalQuestions[i].difficulty === 'medium')
                            mMedium++;
                        else
                            mHard++;
                    }

                    let difficulty = ''
                    if (mEasy >= mMedium)
                        if (mEasy == mHard)
                            difficulty = 'medium'
                        else if (mEasy > mHard)
                            difficulty = 'easy'
                        else
                            difficulty = 'hard'
                    else
                        if (mMedium > mHard)
                            difficulty = 'medium'
                        else
                            difficulty = 'hard'

                    //Cache the Questions' Ids.
                    const mCache = new Cache({
                        questions: mFinalQuestions
                    })
                    cacheId = mCache._id;

                    mCache.save()
                        .then(result => {
                            console.log("Question Cached!");

                            res.render('questionPaper', {
                                mQuestions: mFinalQuestions,
                                mTotalQuestion: totalQuestion,
                                mProgramId: program,
                                mCourseId: course,
                                mCacheId: cacheId,
                                mtotalMarks: totalMarks,
                                mDifficulty: difficulty,
                                mClassId: classId,
                                response_for: 'final',
                                feedBack: 'OK'
                        })
                    })
                })
                .catch(error => {
                    console.log(`Error : ${error.message}`);
                    message = "Opps! Something's wrong! Please try again later."
                    res.render('noData', { feedBack: message })
                });
        })
        .catch(error => {
            console.log(`Error : ${error.message}`);
            message = "Opps! Something's wrong! Please try again later."
            res.render('noData', { feedBack: message })
        });
}



exports.saveQuestionPapaer = (req, res, next) => {

    const id = req.user._id;
    const classId = req.body.classId;
    const programId = req.body.programId;
    const courseId = req.body.courseId;
    const cacheId = req.body.cacheId;
    const difficulty = req.body.difficulty;
    const totalQuestion = req.body.totalQuestion;
    const totalMarks = req.body.totalMarks;
    const examDate = req.body.examDate;
    const timeDuration = req.body.timeDuration;
    const examName = req.body.examName;
    const instractions = req.body.instructions;

    //fetche the cached questions...
    Cache.findById(cacheId)
        .then(mQuestions => {
            if (!mQuestions) {
                res.render('noData', { feedBack: "No Questions" })
            }

            //save the question paper...
            
            const mQuestionPaper = new QuestionPaper({
                questions: mQuestions.questions,
                faculty: id,
                program: programId,
                course: courseId,
                class:classId,
                total_question: totalQuestion,
                total_mark: totalMarks,
                exam_date: examDate,
                difficulty: difficulty,
                instructions: instractions,
                time_duration: timeDuration,
                exam_name: examName,
            });
            mQuestionPaper.save()
                .then(result => {
                    res.redirect('/viewQuestionPaper/' + mQuestionPaper._id);
                })
                .catch(error => {
                    console.log(`Error Saving Questions Paper : ${error.message}`);
                    message = "Opps! Something's wrong! Please try again later."
                    res.render('noData', { feedBack: message })
                });
        })
        .catch(error => {
            console.log(`Error Fetching Data From Cache : ${error.message}`);
            message = "Opps! Something's wrong! Please try again later."
            res.render('noData', { feedBack: message })
        });
}


exports.listQuestionPaper = (req, res, next) => {

    let message = null;
    const classId = req.params.classId;

    QuestionPaper.find({ class: classId })
        .then(mQuestionPapers => {
            if (!mQuestionPapers.length) {
                console.log("NO QuestionsPapers");
                res.render('noData', {feedBack:"No QuestionPapers"})
            }
            // res.render('listQuestions', {
            //     mQuestions: mQuestions
            // });

            const QuestionPaparDetails = [' ']
            QuestionPaparDetails.length = 0;

            for (let i = 0; mQuestionPapers[i]; i++){
                const mQuestionDetails = {
                    qpid: mQuestionPapers[i].id,
                    examName: mQuestionPapers[i].exam_name,
                    examDate: mQuestionPapers[i].exam_date,
                    difficulty : mQuestionPapers[i].difficulty,
                    totalMarks: mQuestionPapers[i].time_duration,
                    noOfQuestions: mQuestionPapers[i].total_question,
                    program: mQuestionPapers[i].program,
                    course: mQuestionPapers[i].course,
                    public: mQuestionPapers[i].public
                }
                QuestionPaparDetails.push(mQuestionDetails)
            }

            res.render('listQuestionPapers', {
                mQuestionPapers: QuestionPaparDetails
            });

        })
        .catch(error => {
            console.log(`Error Fetching QuestionPapers : ${error.message}`);
            message = message || "Opps! Something's wrong! Please try again later."
            res.render('noData', { feedBack: message })
        });
}


exports.viewQuestionPaper = (req, res, next) => {

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

    const questionPaperId = req.params.qpId;
    QuestionPaper.findById(questionPaperId)
        .then(mQuestionPaper => {
            console.log(mQuestionPaper.questions[0]);
            res.render('questionPaper', {
                QuestionPaper: mQuestionPaper,
                response_for: 'view',
                feedBack: 'OK',
                errorMessage: mError,
                okMessage: mOk
            })
        })
        .catch(error => {
            console.log(`Error Fetching QuestionPapers : ${error.message}`);
            message = "Opps! Something's wrong! Please try again later."
            res.render('noData', { feedBack: message })
        });
}

exports.changeAccess = (req, res, next) => {
    //make sure that the entry is unique.
    const id = req.params.qpId;
    QuestionPaper.findById(id)
        .then(Q => {
            let public = false;
            if (!Q.public) {
                public = true
            }
            QuestionPaper.findByIdAndUpdate(id,
                {
                    $set: {
                        public:public
                    }
                })
                .then(result => {
                    req.flash('info', "Access Changed!")
                    res.redirect('/viewQuestionPaper/' + id);
                })
                .catch(error => {
                    console.log(`Error Changing Access : ${error.message}`);
                    req.flash('error', "Couldn't change the Access!")
                    res.redirect('/viewQuestionPaper/' + id);
                });
        }).catch(error => {
            console.log(`Error Changing Access : ${error.message}`);
            req.flash('error', "Couldn't change the Access!")
            res.redirect('/viewQuestionPaper/'+ id);
        });

}

exports.getQuestionStudents = (req, res, next) => {

    const fid = req.body.faculty;
    const pid = req.body.program;
    const cid = req.body.course;

    let difficulty = req.body.mDiff;
    if (!difficulty) {
        difficulty = ['easy', 'hard', 'medium']
    }

    QuestionPaper.find({
        faculty: fid,
        program: pid,
        course: cid,
        difficulty: difficulty,
        public: true
    })
        .then(mQuestionPapers => {
            if (mQuestionPapers.length < 1) {
                res.render('noData', {
                    feedBack: "No QuestionsPaper!"
                })
            }
            const QuestionPaparDetails = [' ']
            QuestionPaparDetails.length = 0;

            for (let i = 0; mQuestionPapers[i]; i++) {
                const mQuestionDetails = {
                    qpid: mQuestionPapers[i].id,
                    examName: mQuestionPapers[i].exam_name,
                    examDate: mQuestionPapers[i].exam_date,
                    difficulty: mQuestionPapers[i].difficulty,
                    totalMarks: mQuestionPapers[i].time_duration,
                    noOfQuestions: mQuestionPapers[i].total_question,
                    program: mQuestionPapers[i].program,
                    course: mQuestionPapers[i].course,
                }
                QuestionPaparDetails.push(mQuestionDetails)
            }
            res.render('ssListQuestionPaper', {
                mQuestionPapers: QuestionPaparDetails,
            });
        })
        .catch(error => {
            console.log(`Error Fetching Class : ${error.message}`);
            message = "Opps! Something's wrong! Please try again later."
            res.render('noData', { feedBack: message })
        });
}

