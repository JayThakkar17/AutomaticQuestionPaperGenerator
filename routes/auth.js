/**Routes that handler Authentication....  */

const express = require("express");

const authController = require("../controllers/auth-controller");

const router = express.Router();
const validator = require("../controllers/validator");

//get the login page.
router.get("/", authController.getLogin);

//login
router.post("/",validator.createValidationFor('/'),validator.checkValidationLogin, authController.postLogin);

//logout
router.get("/logout", authController.postLogout);



router.get('/getForgotPassword', authController.getForgotPassword)

router.post("/resetPassword", authController.resetPassword)

router.get("/getNewPassword/:token", authController.getNewPassword)

router.post('/updatePassword', authController.updatePassword)

module.exports = router;
