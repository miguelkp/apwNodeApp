const express = require("express");

const router = express.Router();

router.use(function(req,res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.info = req.flash("info");

    next();
});

// Routes to the home.js file where the meat of the content resides
router.use("/", require("./home"));


module.exports = router;
