exports.getNotFound = (req,res,next) =>{
    res.status(404).render('404', {
        pageTitle:'Page not found',
        path:'/not-found',
        isAuthenticated: req.session.isLoggedIn
    });
}

exports.get500 = (req,res,next) =>{
    res.status(500).render('500', {
        pageTitle:'Error',
        path:'/500-algo',
        isAuthenticated: req.session.isLoggedIn
    });
}