
const Faculty = require("../models/faculty");
const Course = require('../models/course');
const Program = require('../models/program');




//***********************************************************************************/
/** C-R-U-D Class and Topics */
//***********************************************************************************/


//provide create class page.
exports.getCreateClass = (req, res, next) => {

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

    const message = '';
    Program.find({active:true}).exec()
        .then((programs) => {
            if (!programs)
                message = message + 'No Programs! '

            Course.find({active:true}).exec()
                .then((courses) => {
                    if (!courses) {
                         message = message + 'No Courses!'
                    }
                    res.render('createClass', {
                        message: message + "OK",
                        courses: courses,
                        programs: programs,
                        errorMessage:mError,
                        okMessage :mOk
                    })
                })
                .catch((err) => {
                    console.log(err);
                    res.render('noData', {
                        feeBack: "Opps!Something's Wrong! Please Try again later."
                    })
                })
        })
        .catch((err) => {
            console.log(err);
            res.render('noData', {
                feedBack: "Opps!Something's Wrong! Please Try again later."
            })
        })
}

//create class in the Database by Updating the faculty table..
exports.createClass = (req, res, next) => {

    const id = req.body.fid;
    const programId = req.body.fprogram;
    const courseId = req.body.fcourse;
    let exist = false
    //check if the class alrealy exist!!
    Faculty.findById(id)
        .then(ress => {

        for (let i = 0; ress.classes[i]; i++){
            if (ress.classes[i].program === programId && ress.classes[i].course === courseId) {
                exist = true

            }
        }

    }).then(ress => {
        //make sure that the entry is unique.
        if (exist) {
            req.flash('error', "Class Exist Already!")
            res.redirect('/getCreateClass');
        }
        else {
            Faculty.findByIdAndUpdate(id,
                {
                    $push: {
                        classes: [{
                            program: programId,
                            course: courseId
                        }]
                    }
                })
                .then(result => {
                    req.flash('info', "Class Created!")
                    res.redirect('/getCreateClass');
                })
                .catch(error => {
                    console.log(`Error Creating Class : ${error.message}`);
                    req.flash('error', "Couldn't create the class!")
                    res.redirect('/getCreateClass');
                });
        }

    }).catch(error => {
        console.log(`Error Creating Class : ${error.message}`);
        req.flash('error', "Couldn't create the class!")
        res.redirect('/getCreateClass');
    });
}


//provide List class page.
exports.getListClass = (req, res, next) => {
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
    const id = req.user._id;    //user Id.

    Faculty.findById(id)
        .then(classes => {
            if (!classes)
                message = 'No Classes! '

            res.render('listClass', {
                classes: classes.classes,
                errorMessage: mError,
                okMessage: mOk,
                errorMessage: mError,
                okMessage: mOk
            });
        })
        .catch(error => {
            console.log(`Error Fetching Class : ${error.message}`);
            message = "Opps! Something's wrong! Please try again later."
            res.render('noData', { feedBack : message })
        });
}


//get Class Details...
exports.getDetailsClass = (req, res, next) => {

    let message = null;
    const id = req.user._id;
    const classId = req.params.cid;
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
            res.render('classDetails', {
                mClass: {
                    fid:id,
                    cid: classId,
                    program: mmClass.program,
                    course: mmClass.course,
                    topics:mmClass.topics,
                    errorMessage: mError,
                    okMessage: mOk
                }
            });
        })
        .catch(error => {
            console.log(`Error Fetching Class : ${error.message}`);
            message = "Opps! Something's wrong! Please try again later."
            res.render('noData', { feedBack: message })
        });
}


exports.deleteClass = (req, res, next) => {
    //Delete the Class
    const id = req.user._id;
    const classId = req.params.cid;

    Faculty.findByIdAndUpdate(id, {
        $pull: {
            classes: { _id: classId }
        }
    })
        .then(ress => {
            req.flash('error',"Class Deleted!")
            res.redirect('/listClasses');
        })
        .catch(error => {
            console.log(`Error Deleting Class : ${error.message}`);
            req.flash('error', "Couldn't Delete the class!")
            res.redirect('/classDetails/' + cid);
        });
}





//***********************************************************************************/
/** C-R-U-D Topics */
//***********************************************************************************/




exports.getCreateTopic = (req, res, next) => {

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
    const id = req.user._id;
    const classId = req.params.cid;

    Faculty.findById(id)
        .then(mClass => {
            if (!mClass) {
                console.log(mClass);
                message = 'No Classes'
            }
            let program = null;
            let course = null;
            for (let i = 0; mClass.classes[i]; i++) {
                if (String(mClass.classes[i]._id) === classId) {
                    program = mClass.classes[i].program;
                    course = mClass.classes[i].course;
                }
            }
            res.render('createTopic', {
                mClass: {
                    classId: classId,
                    program: program,
                    course: course

                },errorMessage: mError,
                okMessage: mOk
            })
        })
        .catch(error => {
            console.log(`Error Fetching Class : ${error.message}`);
            message = "Opps! Something's wrong! Please try again later."
            res.render('noData', { feedBack: message})
        });
}

exports.createTopic = (req, res, next) => {
    //code for adding data in the database.

    const id = req.user._id
    const classId = req.params.cid
    const topic = req.body.tname
    //make sure that the entry is unique.
    Faculty.updateOne({ "_id": id, "classes._id": classId },
        {
            "$push": {
                "classes.$.topics": topic
            }
        }
    )
        .then(result => {
            req.flash('info', "Topic Created!")
            const mRoutes = '/listTopics/' + classId
            res.redirect(mRoutes);
        })
        .catch(error => {
            console.log(`Error Creating Topic : ${error.message}`);
            req.flash('error', "Couldn't create the topic!")
            res.redirect('/getCreateTopic/' + classId)
        });
}


exports.listTopics = (req, res, next) => {
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
    const classId = req.params.cid

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
            res.render('listTopics', {
                mClass: {
                    classId: classId,
                    program: mmClass.program,
                    course: mmClass.course,
                    topics: mmClass.topics,
                    errorMessage: mError,
                    okMessage: mOk
                },
            });
        })
        .catch(error => {
            console.log(`Error Fetching Class : ${error.message}`);
            message = "Opps! Something's wrong! Please try again later."
            res.render('noData', { feedBack: message})
        });
}

exports.getTopicDetails = (req, res, next) => {

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

    const id = req.user._id;
    const classId = req.params.cid;
    const topic = req.params.tid;

    Faculty.findById(id)
        .then(mClass => {
            if (!mClass) {
                console.log(mClass);
                message = 'No Classes'
            }
            let program = null;
            let course = null;
            for (let i = 0; mClass.classes[i]; i++) {
                if (String(mClass.classes[i]._id) === classId) {
                    program = mClass.classes[i].program;
                    course = mClass.classes [i].course;
                }
            }
            res.render('topicDetails', {
                mTopic: {
                    classId: classId,
                    program: program,
                    course: course,
                    topic: topic,
                    },errorMessage: mError,
                    okMessage: mOk

            })
        })
        .catch(error => {
            console.log(`Error Fetching Class : ${error.message}`);
            message = "Opps! Something's wrong! Please try again later."
            res.render('noData', { message: message })
        });
}


exports.updateTopic = (req, res, next) => {
    const id = req.user._id
    const classId = req.params.cid
    const topic = req.params.tid
    const newTopic = req.body.tname

        Faculty.updateOne({ "_id": id, "classes._id": classId },
            {
                "$pull": {
                    "classes.$.topics": topic
                }
            }
        )
        .then(result => {
            //make sure that the entry is unique.
            Faculty.updateOne({ "_id": id, "classes._id": classId },
                {
                    "$push": {
                        "classes.$.topics": newTopic
                    }
                }
            )
            .then(result => {
                req.flash('info', "Topic Updated!")
                res.redirect('/getTopicDetails/' + classId + "/" + newTopic)
            })
            .catch(error => {
                console.log(`Error updating topic : ${error.message}`);
                req.flash('error', "Couldn't update the topic!")
                res.redirect('/getTopicDetails/' + classId + "/" + topic)
            });
        })
        .catch(error => {
            console.log(`Error updating topic : ${error.message}`);
            req.flash('error', "Couldn't update the topic!")
            res.redirect('/getTopicDetails/'+ classId + "/" + topic )
        });
}


exports.deleteTopic = (req, res, next) => {

    const id = req.user._id
    const classId = req.params.cid
    const topic = req.params.tid
    //make sure that the entry is unique.
    Faculty.updateOne({ "_id": id, "classes._id": classId },
        {
             "$pull": {
                "classes.$.topics": topic
            }
        }
    )
        .then(result => {
            console.log("Topic Deleted  -> " + topic);
            req.flash('info',"Topic Deleted")
            res.redirect('/listTopics/' + classId )
        })
        .catch(error => {
            console.log(`Error Creating Class : ${error.message}`);
            req.flash('error', "Couldn't delete the topic!")
            res.redirect('/getTopicDetails/'+ classId + "/" + topic )
        });
}




