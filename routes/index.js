// Author of this Page: Miguel Patel

const express = require("express");

const router = express.Router();

// 
router.use(function(req, res, next){
    res.locals.currentUser = req.user; // Sets the user
    res.locals.error = req.flash("error"); // Defines req.flash to the error variable via locals 
    res.locals.info = req.flash("info"); // Defines req.flash to the info variable via locals 
    // (i.e Warnings: Must be logged in to view page )
    next(); // Continues the routing process
});

// Routes to the home.js file where the meat of the content resides
// home.js is where we store all of our routes
router.use("/", require("./home"));


module.exports = router;
