const helpers = {};

helpers.isAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    //passport nos da este metodo
    return next();
  }
  req.flash("errorMessage", "You are not authorized to view this content");
  res.redirect("/users/signin");
};

module.exports = helpers;
