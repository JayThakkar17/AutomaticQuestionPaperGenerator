const bcrypt = require("bcryptjs");
/**Mail Service */
const nodemailer = require('nodemailer');

const User = require('../models/user');
const Faculty = require('../models/faculty');
const Student = require('../models/student');
const Question = require("../models/question");


// Add faculty and send email.
exports.addUser = (req, res, next) => {
    //const confirmPassword = req.body.confirmPassword;
    const id = req.body.email
    const password = req.body.password
    const name = req.body.name
    const role = req.body.role
    const program = req.params.pid
    const batch = req.body.batch

    console.log(id, password, name, role, program);

    User.findOne({ _id: id })
        .then((userDoc) => {
            if (userDoc) {
               req.flash(
                    "error",
                    "E-Mail exists already."
                );
                if (role === 'faculty')
                    return res.redirect("/getAddFaculty");
                else
                    return res.redirect('/getAddStudent/' + program)
            }
            return bcrypt
                .hash(password, 12)
                .then((hashedPassword) => {
                    const user = new User({
                        _id: id,
                        password: hashedPassword,
                        role: role,
                        name: name
                    });
                    if (role === 'faculty') {
                        //add reference to facutly
                        Faculty({ _id: id })
                            .save().catch((err) => {
                                console.log(err);
                                req.flash(
                                    "error",
                                    "Couldn't add faculty! Please try again!"
                                );
                                return res.redirect('/getAddFaculty')
                            })
                    }
                    else if (role === 'student') {
                        //add reference to facutly
                        Student({ _id: id, program:program, batch:batch})
                            .save().catch((err) => {
                                console.log(err);
                                req.flash(
                                    "error",
                                    "Couldn't add student! Please try again!"
                                );
                                return res.redirect('/getAddStudent/' + program)
                            })
                    }
                    return user.save();
                })
                .then((result) => {

                    //**Mailing Service. */
                    // const smtpTransport = nodemailer.createTransport({
                    //     service: 'gmail',
                    //     auth: {
                    //         user: "*****20@gmail.com",
                    //         pass: "*****@123"
                    //     }
                    // });
                    // const mailOptions = {
                    //     from: "mooseparmar20@gmail.com",
                    //     to: id,
                    //     subject: "Account Registerd!",
                    //     text: "Your account has been registered! Use given password to login!",
                    //     html: "<h5>Password :" + password + " .</h5>"
                    // }
                    // smtpTransport.sendMail(mailOptions, function (error, response) {
                    //     if (error) {
                    //         console.log(error);
                    //     } else {
                    //         console.log('email sent to : ' + id);
                    //     }
                    // });
                    if (role === 'faculty') {
                        req.flash(
                            "info",
                            "Faculty Added!"
                        );
                        res.redirect("/getAddFaculty");
                    }
                    else {
                        req.flash(
                            "info",
                            "Student Added!"
                        );
                        res.redirect('/getAddStudent/' + program)
                    }
                })
        })
        .catch((err) => {
            console.log(err);

            if (role === 'faculty') {
                req.flash(
                    "error",
                    "Couldn't add User! Please try again!"
                );
                res.redirect("/getAddFaculty");
            }
            else {
                req.flash(
                    "error",
                    "Couldn't add student! Please try again!"
                );
                res.redirect('/getAddStudent/' + program)
            }
        });
};

//Get Single Faculty
exports.getFacultyDetails = (req, res, next) => {

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

    User.findOne({ _id: req.params.id })
        .then((user) => {
            if (!user) {
                req.flash("error", "Coundn't open faculty");
                return res.redirect('/listFaculty')
            }
            //add if condition if Student of Facutly then based on the condition redirect.
            res.render('facultyDetails', {
                faculty: user,
                errorMessage: mError,
                okMessage:mOk
            })
        })
        .catch((err) => {
            console.log(err);
            req.flash(
                "error",
                "Couldn't find faculty! Please try again!"
            );
            //add if condition if Student of Facutly then based on the condition redirect.
            res.redirect("/listFaculty");
        });
}

//Update Faculty
exports.updateFaculty = (req, res, next) => {
    const id = req.params.id
    const name = req.body.fname
    const active = req.body.factive
    User.findByIdAndUpdate(id, {
        $set: {
            name: name,
            active: active
        }
    })
        .then(result => {
            //add if condition if Student of Facutly then based on the condition redirect.
            req.flash(
                "info",
                "Faculty Updated!"
            );
            return res.redirect('/listFaculty')
        })
        .catch(error => {
            console.log(`Error updating Faculty: ${error.message}`);
            req.flash(
                "error",
                "Couldn't update faculty! Please try again!"
            );
            res.redirect("/getShowFaculty/" + id);
        });
}

//Delete Faculty
exports.deleteFaculty = (req, res, next) => {
    const id = req.params.id;
    Question.deleteMany({ "faculty": id })
        .then(rres => {
        Faculty.findByIdAndDelete(id)
            .then(ress => {
                //add if condition if Student of Faculty then based on the condition redirect.
                User.findByIdAndDelete(id)
                    .then(resss => {
                        req.flash(
                            "info",
                            "Faculty Deleted!"
                        );
                        res.redirect('/listFaculty');
                    })
                    .catch(err => {
                        console.log(err.message);
                        req.flash(
                            "error",
                            "Couldn't delete faculty! Please try again!"
                        );
                        res.redirect("/getShowFaculty/" + id);
                    })
            }).catch(err => {
                console.log(err.message);
                req.flash(
                    "error",
                    "Couldn't delete faculty! Please try again!"
                );
                res.redirect("/getShowFaculty/" + id);
            })
    }).catch(err => {
        console.log(err.message);
        req.flash(
            "error",
            "Couldn't delete faculty! Please try again!"
        );
        res.redirect("/getShowFaculty/" + id);
    })

}

exports.getStudentsDetails = (req, res, next) => {

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
    const sid = req.params.sid;

    console.log(pid, sid);


    User.findOne({ _id: sid })
        .then((user) => {
            if (!user) {
                req.flash("error", "Coundn't open the students");
                return res.redirect('/listStudent/' + pid)
            }
            Student.findOne({ _id:sid })
                .then((suser) => {
                    if (!suser) {
                        req.flash("error", "Coundn't open the students");
                        return res.redirect('/listStudent/' + pid)
                    }

                    //add if condition if Student of Facutly then based on the condition redirect.
                    res.render('StudentDetails', {
                        student: user,
                        program: pid,
                        batch:suser.batch,
                        errorMessage: mError,
                        okMessage: mOk
                    })
                })
                .catch((err) => {
                    console.log(err);
                    req.flash(
                        "error",
                        "Couldn't find the student! Please try again later!"
                    );
                    //add if condition if Student of Facutly then based on the condition redirect.
                    res.redirect("/listStudent/" + pid);
                });
        })
        .catch((err) => {
            console.log(err);
            req.flash(
                "error",
                "Couldn't find the student! Please try again later!"
            );
            //add if condition if Student of Facutly then based on the condition redirect.
            res.redirect("/listStudent/"+ pid);
        });
}


exports.updateStudent = (req, res, next) => {

    const sid = req.params.sid
    const pid = req.params.pid
    const name = req.body.sname
    const active = req.body.sactive
    const batch = req.body.sbatch

    User.findByIdAndUpdate(sid, {
        $set: {
            name: name,
            active: active
        }
    })
        .then(result => {
            //add if condition if Student of Facutly then based on the condition redirect.
            Student.findByIdAndUpdate(sid, {
                $set: {
                    batch : batch,
                }
            })
                .then(ress => {
                    req.flash(
                        "info",
                        "Student Updated!"
                    );
                    return res.redirect('/listStudent/' + pid)
                })
                .catch(error => {
                    console.log(`Error updating Student: ${error.message}`);
                    req.flash(
                        "error",
                        "Couldn't update the Student! Please try again later!"
                    );
                    res.redirect("/getShowStudent/" + pid +"/"+ sid);
                })
        })
        .catch(error => {
            console.log(`Error updating Student: ${error.message}`);
            req.flash(
                "error",
                "Couldn't update student! Please try again later!"
            );
            res.redirect("/getShowFaculty/" + pid + "/" + sid);
        });
}



//Delete Faculty
exports.deleteStudent = (req, res, next) => {
    const sid = req.params.sid;
    const pid = req.params.pid

    Student.findByIdAndDelete(sid)
        .then(ress => {
            //add if condition if Student of Faculty then based on the condition redirect.
            User.findByIdAndDelete(sid)
                .then(resss => {
                    req.flash(
                        "info",
                        "Student Deleted!"
                    );
                    res.redirect('/listStudent/' + pid);
                })
                .catch(err => {
                    console.log(err.message);
                    req.flash(
                        "error",
                        "Couldn't delete the student! Please try again later!"
                    );
                    res.redirect("/getShowFaculty/" + pid + "/" + sid);
                })
        }).catch(err => {
            console.log(err.message);
            req.flash(
                "error",
                "Couldn't delete the student! Please try again later!"
            );
            res.redirect("/getShowFaculty/" + pid + "/" + sid);
        })
}