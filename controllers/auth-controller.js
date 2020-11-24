const crypto = require('crypto')

const bcrypt = require("bcryptjs"); //for enrypting the password
const User = require("../models/user");
const Faculty = require('../models/faculty')

//render the login.ejs page.
exports.getLogin = (req, res, next) => {

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

   res.render("login",{
    //path: "/login",
    pageTitle: "Login",
    errorMessage: mError,
    okMessage:mOk
  });

};

// Authenticate the user... Create the session...
/**
 */
exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ _id: email })
    .then((user) => {
      if (!user) {
        req.flash("error", "Invalid email or password.");
        return res.redirect("/");
      }
      else if (!user.active) {
        req.flash("error", "Account is Deactiveted by Admin!");
        return res.redirect("/");
      }
      bcrypt
        .compare(password, user.password)
        .then((doMatch) => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save((err) => {
              console.log(err);
              const user_details = {
                role: user.role,
                name: user.name,
                email: user._id
              }
              if (user.role === 'faculty') {
                Faculty.findById(user._id)
                  .then(fac => {
                    if (!fac)
                      res.locals.classes = []
                    else
                      res.locals.classes = fac.classes
                    res.render("dashboard", {
                      user: user_details
                    });
                  })
                  .catch(err => {
                    console.log("this is err :", err);
                  })
              }
              else {
                res.render("dashboard", {
                  user: user_details
                });
              }
            });
          }
          req.flash("error", "Invalid email or password.");
          res.redirect("/");
        })
        .catch((err) => {
          console.log(err);
          res.redirect("/");
        });
    })
    .catch((err) => console.log(err));
};


//logout.... end the session.
exports.postLogout = (req, res, next) => {
  req.flash("info", "Successfully Logged Out");
  req.session.destroy((err) => {
    res.redirect("/");
  });
};




exports.getForgotPassword = (req, res, next) => {
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
  res.render("forgotPassword", {
    //path: "/login",
    pageTitle: "Forgot Password",
    errorMessage: mError,
    okMessage: mOk
  });
}

exports.resetPassword = (req, res, next) => {

  const id = req.body.email

  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      req.flash('error', "Something's wrong Please Try again later!")
      return res.redirect('/getForgotPassword')
    }
    const token = buffer.toString('hex');

    User.findOne({ _id: id })
      .then((user) => {
        if (!user) {
          req.flash(
            "error",
            "No account with that email found!"
          );
          return req.redirect('/getForgotPassword');
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;  //one hour
        return user.save();
      })
      .then((result) => {

        res.redirect('/getNewPassword/' + token)

        //**Mailing Service. */
        // const smtpTransport = nodemailer.createTransport({
        //     service: 'gmail',
        //     auth: {
        //         user: "*****20@gmail.com", //sender's Id and password
        //         pass: "*****@123"
        //     }
        // });
        // const mailOptions = {
        //     from: "mooseparmar20@gmail.com",
        //     to: id,                                        //receiver's id.
        //     subject: "Password Reset!",
        //     text: "Follow the link to  reset your password!",
        //     html: `
        // <p>You requested a password reset</p><br>
        // <p>Click this <a href="http://localhost:5000/getNewPassword/${token}">link</a> to set a new  password</p>
        //`
        // }
        // smtpTransport.sendMail(mailOptions, function (error, response) {
        //     if (error) {
        //         console.log(error);
        // req.flash("error", "Coundn't send the mail!")
        // res.redirect('/getForgotPassword')
        //     } else {
        //         console.log('email sent to : ' + id);
        // req.flash("info", "Mail sent! Please check your inbox!")
        // res.redirect('/getForgotPassword')
        //     }
        // });
      })
      .catch((err) => {
        console.log(err);
        req.flash(
          "error",
          "Something's Wrong Please try again later!"
        );
        res.redirect("/");
      });
  })
}

exports.getNewPassword = (req, res, next) => {

  const token = req.params.token;

  User.findOne({
    resetToken: token,
    resetTokenExpiration: {
      $gt: Date.now()
    }
  })
    .then(user => {
      res.render('newPassword', {
        pageTitle: "Reset Password",
        userId: user._id.toString(),
        passwordToken: token
      })
    })
    .catch(err => {
      console.log(err);
      req.flash('error', "Something's wrong Please Try Again Later!")
      res.redirect('/')
    })
}


exports.updatePassword = (req, res, next) => {
  const id = req.body.email;
  const newPassword = req.body.password
  const token = req.body.passwordToken
  let resetUser;
  User.findOne({
    resetToken: token,
    resetTokenExpiration: {
      $gt: Date.now()
    },
    _id: id
  })
    .then(resultuser => {
      resetUser = resultuser
      return bcrypt.hash(newPassword, 12);
    })
    .then(hashedPassword => {
      resetUser.password = hashedPassword;
      resetUser.resetToken = null;
      resetUser.resetTokenExpiration = null;
      return resetUser.save();
    })
    .then(ress => {
      req.flash('info', 'Password Changed Succesfully!')
      res.redirect('/');
    })
    .catch(err => {
      console.log(err);
      req.flash('error', "Counld'n change the password!")
      res.redirect('/');
    })
}






