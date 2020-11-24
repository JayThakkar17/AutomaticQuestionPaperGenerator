//**Each Request must be authenticated, before accesing any ROUTES or DATA */

//Checks the Session.. if the Session is 'isloggedIn==True', all Okay. or else.. redirect to 'login First'

module.exports = (req, res, next) => {
    if (!req.session.isLoggedIn) {
        console.log('Invalid Access! Login First');
        req.flash('error', 'Invalid Access! Login First')
        return res.redirect('/');
    }
    next();
}


