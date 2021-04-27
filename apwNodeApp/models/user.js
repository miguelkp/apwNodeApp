const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");


const UserSchema = mongoose.Schema({
    username:
    {
        type:String, 
        required:true
    },
    email:
    {
        type:String, 
        required:true, 
        unique:true
    },
    password:
    {
        type:String, 
        required:false
    },
});

// Prior to saving the User information into the database, we save the currentUser.
UserSchema.pre("save", function(done)
{
    var currentUser = this;

    if(!currentUser.isModified("password"))
    { // Parameter check to see if the password is modified
        return done(); // Exits the function if the password isn't modified
    }

    bcrypt.genSalt(10, function(err, salt) // Asynchronously generates a salt hash with a default of 10 rounds 
    { 
        if(err){
            return done(err);
        } 
        
        // If there are no errors, we hash the user's password 
        bcrypt.hash(currentUser.password, salt, function(err, hashedPassword)
        {
            if(err) {
                return done(err);
            }
            currentUser.password = hashedPassword; // Sets the user password to the hashed password generated above
            done();
        });
    });

});

// Function to check password supplied to the hashed passwords saved in the database 
UserSchema.methods.checkPassword = function(guess, done)
{
      if(this.password != null)
      {
          // Compares the text form of the password user has inputted with the hashed passwords stored
          // in the database
          bcrypt.compare(guess,this.password, function(err, isMatch)
          {
             done(err, isMatch);
          });
      }
}

var User = mongoose.model("User", UserSchema);

module.exports = User;