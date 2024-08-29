exports.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect("/user/signin");
    }
};
