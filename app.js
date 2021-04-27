// Required Variables
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const flash = require('connect-flash');
const path = require("path");
const cookieParser = require("cookie-parser");
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user');

// Connection to database
const url = 'mongodb://127.0.0.1:27017/projectDB'
mongoose.connect(url, { useUnifiedTopology: true, useNewUrlParser: true });
mongoose.createConnection(url, { useNewUrlParser: true });

// Checks connection to DB
const db = mongoose.connection
db.once('open', function() {
    console.log('Successfully connected to MongoDB');
});

// Initializes the application
const app = express();
app.set('views', './views');
app.set('view engine', 'ejs');

// Images
app.use(express.static(path.join(__dirname, 'public')))

// Code for cookie-parser Middleware used to parse the cookies attached to client requests. 
// Provided by and credited to https://www.npmjs.com/package/cookie-parser
app.use(cookieParser());

// EDIT 4/21/21: Body-Parser has been deprecated so we will use the express module parser provided to us. 
// Used to parse incoming bodies of text in a middleware before storing within the database.
app.use(express.urlencoded({extended:false}));

// Code for Express Session Middleware provided by https://github.com/expressjs/session
// Used to handle the session's application session's middleware.
app.use(session({
    secret: 'ejrewaea',
    resave: false,
    saveUninitialized: false,
}));

// Code for Express Messages Middleware provided by https://github.com/visionmedia/express-messages
// Used to handle the sessions global variable of 'messages' to the express-messages module.
app.use(flash());

// Code for Passport JS authentication middleware - Passport is provided by and credited to http://www.passportjs.org/docs/username-password/
app.use(passport.initialize()); 
app.use(passport.session()); // Stores the variables to be persisted across the entire user session
// Works hand in hand with user.use session() above 

// Setting up Passport Authentication 
    // Seralizes the user into the session
    passport.serializeUser(function (user, done) {
        //serializing the user
        done(null, user._id);
    });
    // Deserializes the user by ID
    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });

    passport.use("login", new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    }, function (email, password, done) {
        // Checks the database to match the username entered to the usernamed saved in the database
        User.findOne({ email: email }, function (err, user) {
            if (err) { return done(err); }
            if (!user) {
                return done(null, false, { message: "No user has that Email!" });
            }
            // Checking the database using local var. "user" to match the password entered to the password saved in the databse
            user.checkPassword(password, function (err, isMatch) {
                if (err) { return done(err); }
                if (isMatch) {
                    return done(null, user);
                } else {
                    return done(null, false, { message: "Invalid password" });
                }
            });
        });
    }));

// Home Route
app.use("/", require("./routes"));

// Starts Server
app.listen(3000, function() {
    console.log('The server is running on port 3000!');
});