
/** All the Request from the Student... */

//for each Request it will check for the authentication....
const isAuth = require("../middleware/is-auth");
const isStudent = require('../middleware/is-student')

const express = require("express");
const studentController = require('../controllers/student-controller');
const questionBankController = require("../controllers/question-bank-controller");
const questionPaperController = require("../controllers/question-paper-controller");
const validator = require("../controllers/validator");

const router = express.Router();


router.get("/sGetPublicQuestions", isAuth, isStudent, studentController.getPublicQuestions);


router.post("/findPublicQuestions", isAuth, isStudent,validator.createValidationFor("/findPublicQuestions"),validator.checkValidationPublicQuestion , questionBankController.getPublicQuestionForStudents);

router.get("/sQuestionDetails/:qId", isAuth, isStudent, questionBankController.getQuestionDetailsForStudents);

router.get("/getPublicQuestionPapers", isAuth, isStudent, studentController.getQuestionPaperForStudent);

router.post('/findQuestionPaper', isAuth, isStudent,validator.createValidationFor("/findQuestionPaper"),validator.checkValidationPublicQuestionPaper , questionPaperController.getQuestionStudents)

//***********************************************************************************/

module.exports = router;
