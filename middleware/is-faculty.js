module.exports = (req, res, next) => {
    if (req.session.user.role !== 'faculty') {
        console.log('Invalid Access! Login First');
        req.flash('error', 'Invalid Access! Login First')
        return res.redirect('/');
    }
    next();
}