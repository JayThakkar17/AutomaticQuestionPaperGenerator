/** All the Request from the admin... */

//for each Request it will check for the authentication....
const isAuth = require('../middleware/is-auth');
const isAdmin = require('../middleware/is-admin')
const express = require("express");

const adminController = require("../controllers/admin-controller");
const userController = require("../controllers/user-controller");
const validator = require("../controllers/validator");
const router = express.Router();


//*********************************************************************************** */
                    /**Program Routes */

//*********************************************************************************** */

//render AddProgram.ejs page.
router.get("/getAddProgram", isAuth, isAdmin, adminController.getAddProgram);

//Add program - Database.
router.post("/addProgram", isAuth, isAdmin,validator.createValidationFor("/getAddProgram"),validator.checkValidationProgram , adminController.addProgram);

//list Program
router.get("/listProgram", isAuth, isAdmin,  adminController.listPrograms);

// a Single program Details
router.get("/getShowProgram/:id", isAuth, isAdmin,  adminController.getProgramDetails);

//Delete a Program
router.get('/getShowProgram/deleteProgram/:id', isAuth, isAdmin,  adminController.deleteProgram);

//Update a Program
router.post('/getShowProgram/updateProgram/:id', isAuth, isAdmin,validator.createValidationFor("/getShowProgram/updateProgram/:id"),validator.checkValidationUpdateProgram,  adminController.updateProgram);



//*********************************************************************************** */
                    /**Course Routes */

//*********************************************************************************** */

//render AddCourse.ejs page.
router.get("/getAddCourse", isAuth, isAdmin, adminController.getAddCourse);

// add Course -Database.
router.post("/addCourse", isAuth, isAdmin, validator.createValidationFor("/addCourse"),validator.checkValidationCourse, adminController.addCourse);

// list Courses.
router.get("/listCourses", isAuth, adminController.listCourses);

// a Single Course Details.
router.get("/getShowCourse/:id", isAuth, isAdmin, adminController.getCourseDetails);

// Delete a Course.
router.get('/getShowCourse/deleteCourse/:id', isAuth, isAdmin,  adminController.deleteCourse);

// Update a Course.
router.post('/getShowCourse/updateCourse/:id', isAuth, isAdmin,validator.createValidationFor("/getShowCourse/updateCourse/:id"),validator.checkValidationUpdateCourse, adminController.updateCourse);






//*********************************************************************************** */
                    /**Faculty Routes */

//*********************************************************************************** */

//render AddFaculty page.
router.get("/getAddFaculty", isAuth, isAdmin, adminController.getAddFaculty);

//list Facutly.
router.get("/listFaculty", isAuth, isAdmin, adminController.listFaculty);

//Add Faculty - Database.
router.post("/addFaculty", isAuth, isAdmin,  validator.createValidationFor("/addFaculty"), validator.checkValidationFaculty ,userController.addUser);

// a Single Faculty Details.
router.get("/getShowFaculty/:id", isAuth, isAdmin, userController.getFacultyDetails);

// Detele a Faculty.
router.get('/getShowFaculty/deleteFaculty/:id', isAuth, isAdmin,  userController.deleteFaculty);

// Update a Faculty.
router.post('/getShowFaculty/updateFaculty/:id', isAuth, isAdmin,validator.createValidationFor("/getShowFaculty/updateFaculty/:id"),validator.checkValidationUpdateFaculty, userController.updateFaculty);


// get add Student
router.get("/getAddStudent/:pid", isAuth, isAdmin, adminController.getAddStudent);

//Add Student - Database.
router.post("/addStudent/:pid", isAuth, isAdmin,validator.createValidationFor("/addStudent"), validator.checkValidationStudent, userController.addUser);

router.get('/listStudent/:pid', isAuth, isAdmin, adminController.listStudents)

// a Single Student's Details.
router.get("/getShowStudent/:pid/:sid", isAuth, isAdmin, userController.getStudentsDetails);

// Update a Student.
router.post('/updateStudent/:pid/:sid', isAuth, isAdmin,validator.createValidationFor('/updateStudent/:pid/:sid'),validator.checkValidationUpdateStudent, userController.updateStudent);

// Detele a Student.
router.get('/deleteDelete/:pid/:sid', isAuth, isAdmin, userController.deleteStudent);

//exports the routes
module.exports = router;
