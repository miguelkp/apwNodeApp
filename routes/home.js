const express = require("express");
const passport = require("passport");

// const ensureAuthenticated = require("../app").ensureAuthenticated;

const User = require("../models/user");

const router = express.Router();

// List of Routes Below

// Default Index Route
router.get("/", function (req, res) {
   res.render("index"); // Renders the Index (Main Page)
});

// Home Page
router.get("/home", function (req, res) {
   res.render("home"); // Renders a view of the Home Page
});

// About Us Page
router.get("/about", function (req, res) {
   res.render("about"); // Renders a view of the About Us Page
});

// Login Page
router.get("/login", function (req, res) {
   res.render("login"); // Renders a view of the Login form Page
});

// Logout Function via Passport JS
// Upon clicking the "logout" function
router.get("/logout", function(req, res){ 
   req.logout(); // Logs user out of currently signed in account
   res.redirect("home"); // Redirects user to the Home Page
});

router.post("/login", passport.authenticate("login", {
   successRedirect: "/", // Upon successful login, redirect user to the index page
   failureRedirect: "/login", // Upon failure, re-direct to login page.
   failureFlash: true // Promps flash error messages to pop up.
}));

// Register / Sign Up Page
router.get("/register", function (req, res) {
   res.render("register"); // Renders the Sign Up form page
});

router.post("/register", function (req, res, next) {
   const username = req.body.username;
   const email = req.body.email;
   const password = req.body.password;

   User.findOne({ email: email }, function (err, user) {
      if (err) { return next(err); }
      if (user) {
         req.flash("error", "There's already an account with this email"); // Promps red error message underneath header
         return res.redirect("/register"); // Redirects user to the same register page to prompt them to enter in another set of data
      }

      // If no user is found via login, we register a new user
      // with the following requirements:
      const newUser = new User({
         username: username,
         password: password,
         email: email
      });

      newUser.save(next); // Saves user by adding them to the database.

   });

   // Used for user authentication during login
}, passport.authenticate("login", {
   successRedirect: "/",
   failureRedirect: "/register", 
   failureFlash: true
}));

module.exports = router;
