const { check, validationResult } = require('express-validator');
const student = require('../controllers/student-controller');

exports.createValidationFor = (route)=> {
    switch (route) {
        case '/':
            return [
                check('email').isEmail().normalizeEmail().withMessage('Enter valid email address.'),
                check('password').not().isEmpty().trim().escape().withMessage('Invalid password.')
            ];
        case '/getAddProgram':
            return [
                check('pid').not().isEmpty().trim().escape().withMessage('Invalid Program ID.'),
                check('pname').not().isEmpty().trim().escape().withMessage('Program name cannot be empty.'),
                check('duration').not().isEmpty().trim().escape().withMessage('Duration cannot be empty.')
                .isNumeric().withMessage('Duration must be numberic value (Number of year)')
            ];
        case '/getShowProgram/updateProgram/:id':
            return[
                check('pname').not().isEmpty().trim().escape().withMessage('Program name cannot be empty.')
                .isLength({min: 2}).withMessage('Program name must be of 2 or more character.'),
                check('pduration').not().isEmpty().trim().escape().withMessage('Duration cannot be empty.')
                .isNumeric().withMessage('Duration must be numberic value (Number of year)'),
                check('pactive').not().isEmpty().trim().escape().withMessage('Active status can not be empty')
                .isIn(['true', 'false','TRUE','FLASE']).withMessage('Active status can be "true" or "false".')
            ];
        case '/addCourse':
            return[
                check('ccode').not().isEmpty().trim().escape().withMessage('Course code cannot be empty.')
                .isLength({min: 3,max: 6}).withMessage('Course code must be of 3 to 6 characters.'),
                check('cname').not().isEmpty().trim().escape().withMessage('Course Name cannot be empty.')
            ];
        case '/getShowCourse/updateCourse/:id':
            return[
                check('cname').not().isEmpty().trim().escape().withMessage('Program name cannot be empty.')
                .isLength({min: 2}).withMessage('Program name must be of 2 or more character.'),
                check('coptional').not().isEmpty().trim().escape().withMessage('Optional can not be empty')
                .isIn(['true', 'false','TRUE','FLASE']).withMessage('Optional status can be "true" or "false".'),
                check('cactive').not().isEmpty().trim().escape().withMessage('Active status can not be empty')
                .isIn(['true', 'false','TRUE','FLASE']).withMessage('Active status can be "true" or "false".')
            ];
        case '/addFaculty':
            return[
                check('name').not().isEmpty().trim().escape().withMessage('Name cannot be empty.')
                .isLength({min: 3}).withMessage('Name must be of atleast 3 characters.')
                .isLength({max: 50}).withMessage('Name must can be atmost of 50 charcters'),
                check('password').not().isEmpty().trim().escape().withMessage('Password cannot be empty'),
                check('email').isEmail().normalizeEmail().withMessage('Invalid email address.'),
                check('role').not().isEmpty().trim().escape()
                .isIn(['faculty']).withMessage('You cannot change role of user')
            ];
            case '/getShowFaculty/updateFaculty/:id':
                return[
                    check('fname').not().isEmpty().trim().escape().withMessage('Faculty name cannot be empty.')
                    .isLength({min: 3}).withMessage('Faculty name must be of atleast 3 or more character.')
                    .isLength({max: 50}).withMessage('Faculty name must can be atmost of 50 charcters'),
                    check('factive').not().isEmpty().trim().escape().withMessage('Active status can not be empty')
                    .isIn(['true', 'false','TRUE','FLASE']).withMessage('Active status can be "true" or "false".')
                ];
            case '/addStudent':
            return[
                check('name').not().isEmpty().trim().escape().withMessage('Name cannot be empty.')
                .isLength({min: 3}).withMessage('Name must be of atleast 3 characters.')
                .isLength({max: 50}).withMessage('Name must can be atmost of 50 charcters'),
                check('password').not().isEmpty().trim().escape().withMessage('Password cannot be empty'),
                check('email').isEmail().normalizeEmail().withMessage('Invalid email address.'),
                check('role').not().isEmpty().trim().escape()
                .isIn(['student']).withMessage('You cannot change role of user'),
                check('batch').not().isEmpty().trim().escape().withMessage('Batch cannot be empty.')
            ];
            case '/updateStudent/:pid/:sid':
            return[
                check('sname').not().isEmpty().trim().escape().withMessage('Name cannot be empty.')
                .isLength({min: 3}).withMessage('Name must be of atleast 3 characters.')
                .isLength({max: 50}).withMessage('Name must can be atmost of 50 charcters'),
                check('sbatch').not().isEmpty().trim().escape().withMessage('Batch cannot be empty.'),
                check('sactive').not().isEmpty().trim().escape().withMessage('Active status can not be empty')
                    .isIn(['true', 'false','TRUE','FLASE']).withMessage('Active status can be "true" or "false".')
            ];
        case '/createClass':
            return[
                check('fid').not().isEmpty().trim().escape().withMessage('Faculty ID cannot be empty.'),
                check('fprogram').not().isEmpty().trim().escape().withMessage('Program cannot be empty'),
                check('fcourse').not().isEmpty().trim().escape().withMessage('Course cannot be empty')
            ];
        case '/createTopic/:cid':
            return[
                check('tname').not().isEmpty().trim().escape().withMessage('Topic name cannot be empty.')
            ];
        case '/updateTopic/:cid/:tid':
            return[
                check('tname').not().isEmpty().trim().escape().withMessage('Topic name cannot be empty.')
            ];
        case '/createQuestion/:classId':
            return[
                check('mtopic').not().isEmpty().trim().escape().withMessage('Question must belong to a topic.'),
                check('level').not().isEmpty().trim().escape().withMessage('Difficulty level of a question must be selected.')
                .isIn(['easy','medium','hard']).withMessage('Difficulty level of a question must be either easy, medium or hard'),
                check('marks').not().isEmpty().trim().escape().withMessage('Question must have marks assigned.')
                .isNumeric().withMessage('Marks must be numberic value'),
                check('type').not().isEmpty().trim().escape().withMessage('Type of question must be selected.')
                .isIn(["theory", "mcq", "true/false", "yes/no"]).withMessage('Type of question must be either "theory", "mcq", "true/false", "yes/no"'),
                check('question').not().isEmpty().trim().escape().withMessage('Question text cannot be empty.'),
                check('answer').not().isEmpty().trim().escape().withMessage('Answer cannot be empty.')
            ];
        case '/updateQuestion/:questionId':
            return[
                check('marks').not().isEmpty().trim().escape().withMessage('Question must have marks assigned.')
                .isNumeric().withMessage('Marks must be numberic value'),
                check('question').not().isEmpty().trim().escape().withMessage('Question text cannot be empty.'),
                check('answer').not().isEmpty().trim().escape().withMessage('Answer cannot be empty.')
            ];
    case '/findPublicQuestions':
        return[
            check('faculty').not().isEmpty().trim().escape().withMessage('Select Faculty'),
            check('program').not().isEmpty().trim().escape().withMessage('Select Program'),
            check('course').not().isEmpty().trim().escape().withMessage('Select course')
        ];
    case '/findQuestionPaper':
        return[
            check('faculty').not().isEmpty().trim().escape().withMessage('Select Faculty'),
            check('program').not().isEmpty().trim().escape().withMessage('Select Program'),
            check('course').not().isEmpty().trim().escape().withMessage('Select course')
        ];
        default:
            return [];
    }
}

//display error for public questions
exports.checkValidationPublicQuestion = (req, res, next)=> {
    const result = validationResult(req);
    if (result.isEmpty()) {
        return next();
    }
    let mError="";
    const errors =result.array()
    errors.forEach(err => {
        mError += "     " + err.param.toUpperCase() + " : " + err.msg + "        ";
    });
    req.flash(
        "error",
        mError
    );
    student.getPublicQuestions;

}

exports.checkValidationPublicQuestionPaper = (req, res, next)=> {
    const result = validationResult(req);
    if (result.isEmpty()) {
        return next();
    }
    let mError="";
    const errors =result.array()
    errors.forEach(err => {
        mError += "     " + err.param.toUpperCase() + " : " + err.msg + "        ";
    });
    req.flash(
        "error",
        mError
    );
    student.getQuestionPaperForStudent;

}

//display error for add Question
exports.checkValidationQuestion = (req, res, next)=> {
    const result = validationResult(req);
    if (result.isEmpty()) {
        return next();
    }
    let mError="";
    const errors =result.array()
    errors.forEach(err => {
        mError += "     " + err.param.toUpperCase() + " : " + err.msg + "        ";
    });
    req.flash(
        "error",
        mError
    );
    res.redirect('/getCreateQuestion/' + req.params.classId);

}

//display error for update Question
exports.checkValidationUpdateQuestion = (req, res, next)=> {
    const result = validationResult(req);
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
    if (result.isEmpty()) {
        return next();
    }
    let errs = "";
    const errors =result.array()
    errors.forEach(err => {
        errs += "     " + err.param.toUpperCase() + " : " + err.msg + "        ";
    });
    req.flash("error", errs);
    res.redirect('/questionDetails/' + req.params.questionId)

}





//display error for update Topic
exports.checkValidationUpdateTopic = (req, res, next)=> {
    const result = validationResult(req);
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
    if (result.isEmpty()) {
        return next();
    }
    let errs = "";
    const errors =result.array()
    errors.forEach(err => {
        errs += "     " + err.param.toUpperCase() + " : " + err.msg + "        ";
    });
    req.flash("error", errs);
    res.redirect('/getTopicDetails/' + req.params.cid + "/" + req.params.tid);
}



//display error for add topic
exports.checkValidationTopic = (req, res, next)=> {
    const result = validationResult(req);
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
    if (result.isEmpty()) {
        return next();
    }
    let errs="";
    const errors =result.array()
    errors.forEach(err => {
        errs += "     " + err.param.toUpperCase() + " : " + err.msg + "        ";
    });
    req.flash(
        "error",
        errs
    );
    res.redirect('/getCreateTopic/' + req.params.cid)

}

//display error for add class
exports.checkValidationClass = (req, res, next)=> {
    const result = validationResult(req);
    if (result.isEmpty()) {
        return next();
    }
    let mError="";
    const errors =result.array()
    errors.forEach(err => {
        mError += "     " + err.param.toUpperCase() + " : " + err.msg + "        ";
    });
    req.flash(
        "error",
        mError
    );
    res.redirect("/getCreateClass");

}



//display error for add faculty
exports.checkValidationFaculty = (req, res, next)=> {
    const result = validationResult(req);
    if (result.isEmpty()) {
        return next();
    }
    let mError="";
    const errors =result.array()
    errors.forEach(err => {
        mError += "     " + err.param.toUpperCase() + " : " + err.msg + "        ";
    });
    req.flash(
        "error",
        mError
    );
    res.redirect("/getAddFaculty");

}

//display error for update faculty
exports.checkValidationUpdateFaculty = (req, res, next)=> {
    const result = validationResult(req);
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
    if (result.isEmpty()) {
        return next();
    }
    let errs = "";
    const errors =result.array()
    errors.forEach(err => {
        errs += "     " + err.param.toUpperCase() + " : " + err.msg + "        ";
    });
    req.flash("error", errs);
    res.redirect("/getShowFaculty/" + req.params.id);
}

//display error for update faculty
exports.checkValidationUpdateStudent = (req, res, next)=> {
    const result = validationResult(req);
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
    if (result.isEmpty()) {
        return next();
    }
    let errs = "";
    const errors =result.array()
    errors.forEach(err => {
        errs += "     " + err.param.toUpperCase() + " : " + err.msg + "        ";
    });
    req.flash("error", errs);
    res.redirect("/getShowStudent/" + req.params.pid +"/"+ req.params.sid);
}

//display error for add student
exports.checkValidationStudent = (req, res, next)=> {
    const result = validationResult(req);
    if (result.isEmpty()) {
        return next();
    }
    let mError="";
    const errors =result.array()
    errors.forEach(err => {
        mError += "     " + err.param.toUpperCase() + " : " + err.msg + "        ";
    });
    req.flash(
        "error",
        mError
    );
    res.redirect('/getAddStudent/' + req.params.pid)

}


//display error for add course
exports.checkValidationCourse = (req, res, next)=> {
    const result = validationResult(req);
    if (result.isEmpty()) {
        return next();
    }
    let mError="";
    const errors =result.array()
    errors.forEach(err => {
        mError += "     " + err.param.toUpperCase() + " : " + err.msg + "        ";
    });
    res.render('AddCourse', {
        errorMessage: mError,
        okMessage: null
    })

}

//display error for update course
exports.checkValidationUpdateCourse = (req, res, next)=> {
    const result = validationResult(req);
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
    if (result.isEmpty()) {
        return next();
    }
    let errs = "";
    const errors =result.array()
    errors.forEach(err => {
        errs += "     " + err.param.toUpperCase() + " : " + err.msg + "        ";
    });
    req.flash("error", errs);
    res.redirect("/getShowCourse/" + req.params.id)
}



//display error for add program
exports.checkValidationProgram = (req, res, next)=> {
    const result = validationResult(req);
    if (result.isEmpty()) {
        return next();
    }
    let mError="";
    const errors =result.array()
    errors.forEach(err => {
        mError += "     " + err.param.toUpperCase() + " : " + err.msg + "        ";
    });
    res.render('AddProgram', {
        errorMessage: mError,
        okMessage: null
    })
}
//display error for update program
exports.checkValidationUpdateProgram = (req, res, next)=> {
    const result = validationResult(req);
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
    if (result.isEmpty()) {
        return next();
    }
    let errs="";
    const errors =result.array()
    errors.forEach(err => {
        errs += "     " + err.param.toUpperCase() + " : " + err.msg + "        ";
    });
    req.flash("error", errs);
    res.redirect("/getShowProgram/" + req.params.id)
}


//display error for login
exports.checkValidationLogin = (req, res, next)=> {
    const result = validationResult(req);
    if (result.isEmpty()) {
        return next();
    }
    let mError="";
    const errors =result.array()
    errors.forEach(err => {
        mError +=  err.param.toUpperCase() + " : " + err.msg ;
    });
    req.flash("error", mError);
    res.render("login",{
        pageTitle: "Login",
        errorMessage: mError,
        okMessage:""
      });
}