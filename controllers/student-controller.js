

const Course = require('../models/course');
const Program = require('../models/program');
const User = require("../models/user")

exports.getPublicQuestions = (req, res, next) => {
    User.find({role:'faculty'},'name')
        .then((faculties) => {
            if (faculties.length < 1) {
                faculties = []
            }
            Program.find({})
                .then((programs) => {
                    if (programs.length < 1) {
                        programs = []
                    }
                    Course.find({})
                        .then((courses) => {
                            if (courses.length < 1) {
                                courses = []
                            }
                            res.render('sListQuestions', {
                                programs: programs,
                                courses: courses,
                                faculties: faculties
                            });
                        })
                })
        })
        .catch((err) => {
            console.log("ERROR FETCHING FACULTY, PROGRAM, COURSE : ", err);
            res.render('dashboard', {
                errorMessage: "Opps! Something's Wrong Please Try Again!",
                okMessage: null
            })
        })
}


exports.getQuestionPaperForStudent = (req, res, next) => {
    User.find({ role: 'faculty' }, 'name')
        .then((faculties) => {
            if (faculties.length < 1) {
                faculties = []
            }
            Program.find({})
                .then((programs) => {
                    if (programs.length < 1) {
                        programs = []
                    }
                    Course.find({})
                        .then((courses) => {
                            if (courses.length < 1) {
                                courses = []
                            }
                            res.render('sListQuestionPaper', {
                                programs: programs,
                                courses: courses,
                                faculties: faculties
                            });
                        })
                })
        })
        .catch((err) => {
            console.log("ERROR FETCHING FACULTY, PROGRAM, COURSE : ", err);
            res.render('dashboard', {
                errorMessage: "Opps! Something's Wrong Please Try Again!",
                okMessage: null
            })
        })
}