var bcrypt = require("bcryptjs");
var mongoose = require("mongoose");

const SALT_FACTOR = 10;

var UserSchema = mongoose.Schema({
    username:{type:String, required:true},
    email:{type:String, required:true, unique:true},
    password:{type:String, required:false},
});

UserSchema.pre("save", function(done){
    var user = this;

    if(!user.isModified("password")){
        return done();
    }

    bcrypt.genSalt(SALT_FACTOR, function(err,salt){
        if(err){return done(err);}
        bcrypt.hash(user.password, salt, function(err, hashedPassword){
            if(err) {return done(err);}
            user.password = hashedPassword;
            done();
        });
    });

});

UserSchema.methods.checkPassword = function(guess, done){
      if(this.password != null){
          bcrypt.compare(guess,this.password, function(err, isMatch){
             done(err, isMatch);
          });
      }
}

var User = mongoose.model("User", UserSchema);

module.exports = User;