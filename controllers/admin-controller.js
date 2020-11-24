
const Program = require("../models/program");
const Course = require("../models/course");
const Faculty = require("../models/faculty");
const Student = require("../models/student")
const User = require('../models/user');



//*********************************************************************************** */
/**Program Routes */
//*********************************************************************************** */

//render the AddProgram Page....
exports.getAddProgram = (req, res, next) => {

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

    res.render("AddProgram",{
        errorMessage: mError,
        okMessage:mOk
    });
};

// Fetch Program and render it in listProgram.ejs
exports.listPrograms = (req, res, next) => {

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

    Program.find({}).exec()
        .then((programs) => {
            if (programs.length < 1) {
                return res.render('noData', {
                    feedBack: "No Program Found",
                })
            }
            res.render('listProgram', {
                errorMessage: mError,
                okMessage:mOk,
                programs: programs,
            })
        })
        .catch((err) => {
            console.log("ERROR FETCHING PROGRAM : ", err);
            res.render('listProgram', {
                errorMessage: "Opps! Something's Wrong Please Try Again!",
                okMessage :null
            })
        })
};


// fetch fet Single program and fetch it in programDetails.ejs
exports.getProgramDetails = (req, res, next) => {

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

    Program.findOne({ _id: req.params.id })
        .then((program) => {
            if (!program) {
                req.flash("error", "Couldn't find the Program");
                return res.redirect("/listProgram");
            }
            res.render('programDetails', {
                program: program,
                errorMessage: mError,
                okMessage:mOk
            })
        })
        .catch((err) => {
            console.log(err);
            req.flash("error", "Couldn't open the Program");
            res.redirect("/listProgram");
        });
}


// Add the program in the Database.
exports.addProgram = (req, res, next) => {

    const id = req.body.pid
    const name = req.body.pname
    const duration = req.body.duration

    Program.findOne({ _id: id })
        .then((prog) => {
            if (prog) {
                req.flash(
                    "error",
                    "Program exists already."
                );
                return res.redirect('/getAddProgram')
            }
            else {
                const nProgram = new Program({
                    _id: id,
                    name: name,
                    duration: duration
                })
                nProgram.save((err) => {
                    message = null;
                    if (err) {
                        console.error(err);
                        req.flash("error", "Sorry! Could not Add the Program!");
                    } else {
                        req.flash("info", "Program Added!");
                    }
                    res.redirect('/getAddProgram')
                });
            }
        })
}

//Update the Program
exports.updateProgram = (req, res, next) => {

    const id = req.params.id
    const name = req.body.pname
    const duration = req.body.pduration
    const active = req.body.pactive

    Program.findByIdAndUpdate(id, {
        $set: {
            name: name,
            duration: duration,
            active: active
        }
    } )
        .then(result => {
            console.log("Program Updated!");
            req.flash('info', 'Program Updated!');
            res.redirect('/listProgram')
        })
        .catch(error => {
            console.log(`Error updating Program: ${error.message}`);
            req.flash('error', "Counldn't update the program");
            res.redirect('/getShowProgram/' + id )
    });
};

//Delete the Program
exports.deleteProgram = (req, res, next) => {
    const id = req.params.id;
    Program.findByIdAndDelete(id)
        .then(ress => {
        req.flash('info', 'Program Deleted!');
        res.redirect('/listProgram');
    }).catch(err => {
        console.log(err.message);
        req.flash('error', "Counldn't delete the program");
        res.redirect('/getShowProgram/' + id)
     })
};

//*********************************************************************************** */
/**Course Routes */

//*********************************************************************************** */


exports.getAddCourse = (req, res, next) => {
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
    res.render('AddCourse', {
        errorMessage: mError,
        okMessage: mOk
    })
}

//list course
exports.listCourses = (req, res, next) => {

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

    Course.find({}).exec()
        .then((courses) => {
            if (courses.length < 1) {
                return res.render('noData', {
                    feedBack: "No Course Found",
                    errorMessage: mError,
                    okMessage: mOk
                })
            }
            res.render('listCourse', {
                message: null,
                errorMessage: mError,
                okMessage: mOk,
                courses: courses
            })
        })
        .catch((err) => {
            console.log(err);
            res.render('listCourse', {
                message: "NO RECORD FOUND",
            })
        })
};

// Add course
exports.addCourse = (req, res, next) => {
    const id = req.body.ccode
    const name = req.body.cname

    const nCourse = new Course({
        _id: id,
        name: name,
    })

    nCourse.save((err) => {
        message = null;
        if (err) {
            console.error(err);
            req.flash("error", "Sorry! Could not Add the Course!");
            return res.redirect('/getAddCourse');
        }
        req.flash("info", "Course Added!");
        res.redirect('/getAddCourse')
    });
};

//Get Single program.
exports.getCourseDetails = (req, res, next) => {

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

    Course.findOne({ _id: req.params.id })
        .then((course) => {
            if (!course) {
                req.flash("error", "Couldn't find the Course");
                return res.redirect("/listCourses");
            }
            res.render('courseDetails', {
                course: course,
                errorMessage: mError,
                okMessage:mOk
            })
        })
        .catch((err) => {
            console.log(err);
            req.flash("error", "Counldn't open the Course");
            res.redirect("/listCourse");
        });
}

//updateCourse
exports.updateCourse = (req, res, next) => {
    const id = req.params.id
    const name = req.body.cname
    const optional = req.body.coptional
    const active = req.body.cactive

    Course.findByIdAndUpdate(id, {
        $set: {
            name: name,
            optional: optional,
            active: active
        }
    })
        .then(result => {
            req.flash('info', "Course Updated!")
            res.redirect('/listCourses')
        })
        .catch(error => {
            console.log(`Error updating Course: ${error.message}`);
            req.flash('error', "Couldn't updated the course!")
            res.redirect('/getShowCourse/' + id)
        });
};

//deleteCourse
exports.deleteCourse = (req, res, next) => {
    const id = req.params.id;
    Course.findByIdAndDelete(id)
        .exec().
        then(ress => {
            req.flash('error', "Course Deleted!")
            res.redirect('/listCourses');
        }).catch(err => {
            console.log(err.message);
            req.flash('error', "Couldn't updated the course!")
            res.redirect('/getShowCourse/' + id)
    })
};

//*********************************************************************************** */
/**Faculty Routes */

//*********************************************************************************** */


exports.getAddFaculty = (req, res, next) => {

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

    res.render('AddFaculty', {
        errorMessage: mError,
        okMessage: mOk
    });
}


//list Faculty
exports.listFaculty = (req, res, next) => {

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

  User.find()
    .where({ role: "faculty" })
    .then((faculties) => {
      if (faculties.length < 1) {
          return res.render('noData', {
              feedBack: "No Faculty Found",
              errorMessage: mError,
              okMessage: mOk
          })
      }
      res.render("listFaculty", {
          message: null,
          faculties: faculties,
          errorMessage: mError,
          okMessage:mOk
      });
    })
    .catch((err) => {
      res.render("listFaculty", {
          message: "NO RECORD FOUND",
          errorMessage: mError,
          okMessage: mOk
      });
    });
};









//*********************************************************************************** */
/**Student's Routes */

//*********************************************************************************** */

exports.getAddStudent = (req, res, next) => {
    const programId = req.params.pid;

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

    res.render('AddStudent', {
        errorMessage: mError,
        okMessage: mOk,
        programId: programId
    });

}

//list Student
exports.listStudents = (req, res, next) => {

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
    const pid = req.params.pid;

    Student.find({ program: pid })
        .then((students) => {
            if (students.length < 1) {
                return res.render('noData', {
                    feedBack: "No Students Found",
                    errorMessage: mError,
                    okMessage: mOk
                })
            }
            User.find({ _id: { $in: students } })
                .then((ustudents) => {
                    if (ustudents.length < 1) {
                        return res.render('noData', {
                            feedBack: "No Students Found",
                            errorMessage: mError,
                            okMessage: mOk
                        })
                    }
                    res.render("listStudents", {
                        message: null,
                        students: ustudents,
                        sProgram: pid,
                        errorMessage: mError,
                        okMessage: mOk
                    });
                })
                .catch((err) => {
                    res.render("listStudents", {
                        message: "NO RECORD FOUND",
                        errorMessage: mError,
                        okMessage: mOk
                    });
                });

        })
        .catch((err) => {
            res.render("listStudents", {
                message: "NO RECORD FOUND",
                errorMessage: mError,
                okMessage: mOk
            });
        });

};


