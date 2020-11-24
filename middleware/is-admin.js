
//Checks the Check if the 'admin' is making the request.

module.exports = (req, res, next) => {
    if (req.session.user.role !== 'admin') {
        console.log('Invalid Access! Login First');
        req.flash('error', 'Invalid Access! Login First')
        return res.redirect('/');
    }
    next();
}