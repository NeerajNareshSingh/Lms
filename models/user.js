const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');
const config = require('config');
const userSchema = new mongoose.Schema({
    userName:{
        type:String,
        required:true,
        minlength:3,
        maxlength:30,
        unique:true
    },
    firstName:{
        type:String,
        required:true,
        minlength:3,
        maxlength:30
    },
    lastName:{
        type:String,
        required:true,
        minlength:3,
        maxlength:30
    },
    email:{
        type:String,
        required:true,
        minlength:5,
        maxlength:30,
        unique:true
    },
    password:{
        type:String,
        required:true,
        minlength:6,
        maxlength:1024,

    },
    role:{
        type: String,
        required:true,
        enum :['superAdmin', 'admin', 'teacher', 'student', 'parent'],
        default: 'admin'
    },
    createdAt:{
        type: Date,
        required: true,
        default: Date.now()
    },
    updatedAt:{
        type: Date
    }
});
userSchema.methods.generateAuthToken = function(){
    const jwtToken = jwt.sign({_id: this._id, firstName: this.firstName, lastName: this.lastName, email: this.email}, config.get('jwtPrivateKey'), { expiresIn: '10h'});
    return jwtToken;
}
const User = mongoose.model('user', userSchema);
exports.User = User;
