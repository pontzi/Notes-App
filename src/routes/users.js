const express = require("express");
const router = express.Router();
const User = require("../models/User");
const passport = require("passport");

router.get("/users/signin", (req, res) => {
  res.render("users/signin");
});
router.post(
  "/users/signin",
  passport.authenticate("local", {
    successRedirect: "/notes",
    failureRedirect: "/users/signin",
    failureFlash: true,
  })
); //Aqui le pasamos la autenticacion que se hará automaticamente gracias a la configuracion que hicimos en passport.js, le ponemos el nombre de local, porque nuestra autenticacion es local y no de google u otra autenticacion, ya que así la declaramos

router.get("/users/signup", (req, res) => {
  res.render("users/signup");
});

router.post("/users/signup", async (req, res) => {
  const { userName, email, password, confirmPassword } = req.body;
  const errors = [];
  if (userName <= 0) {
    errors.push({ errorMessage: "Please insert your username" });
  }
  if (email <= 0) {
    errors.push({ errorMessage: "Please insert your email" });
  }
  if (password <= 0) {
    errors.push({ errorMessage: "Please insert your password" });
  }
  if (password != confirmPassword) {
    errors.push({ errorMessage: "Password must be the same" });
  }
  if (password.length < 6) {
    errors.push({
      errorMessage: "Password must contain at least 6 characters ",
    });
  }

  const userValidation = await User.findOne({ userName });
  if (userValidation) {
    errors.push({ errorMessage: "The user is already in use" });
  }
  if (errors.length > 0) {
    res.render("users/signup", {
      errors,
      userName,
      email,
      password,
      confirmPassword,
    });
  } else {
    const emailUser = await User.findOne({ email });
    if (emailUser) {
      req.flash("errorMessage", "The email is already in use");
      res.redirect("/users/signup");
      return;
    }

    const newUser = new User({ userName, email, password });
    newUser.password = await newUser.encryptPassword(password);
    await newUser.save();
    req.flash("successMessage", "Congrats! You are registered");
    res.redirect("/users/signin");
  }
});

router.get("/users/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});
module.exports = router;
