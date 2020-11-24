
//render the 404.ejs page
exports.get404 = (req, res, next) => {
    res.status(404).render('404', {
        pageTitle: 'Page Not Found'
    });
};

//render the noData.ejs page.
exports.getNoDataError = (req, res, next) => {
    res.status(404).render('noData', {
        pageTitle: 'NoData',
        message:message
    });
};
