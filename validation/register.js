const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateRegisterUserInput(data){
    let errors = {}; 
    data.userName = !isEmpty(data.userName) ? data.userName : '';
    data.firstName = !isEmpty(data.firstName) ? data.firstName : '';
    data.lastName = !isEmpty(data.lastName) ? data.lastName : '';
    data.email = !isEmpty(data.email) ? data.email : '';
    data.password = !isEmpty(data.password) ? data.password : '';
    data.cPassword = !isEmpty(data.cPassword) ? data.cPassword : '';

     // first name validation
     if(!Validator.isLength(data.userName, {min: 3, max: 30})){
        errors.userName = "User name must be between 3  and 30 characters.";
    }
    if(Validator.isEmpty(data.userName)){
        errors.userName = "User name field is required."
    }
    // first name validation
    if(!Validator.isLength(data.firstName, {min: 3, max: 30})){
        errors.firstName = "First name must be between 3  and 30 characters.";
    }
    if(Validator.isEmpty(data.firstName)){
        errors.firstName = "First name field is required."
    }

   // last name validation
    if(!Validator.isLength(data.lastName, {min: 3, max: 30})){
        errors.lastName = "Last name must be between 3  and 30 characters.";
    }
    if(Validator.isEmpty(data.lastName)){
        errors.lastName = "Last name field is required."
    }

    // email validation
    if(Validator.isEmpty(data.email)){
        errors.email = "Email field is required."
    }
    if(!Validator.isEmail(data.email)){
        errors.email = "Email is invalid."
    }

    // password validation
    if(Validator.isEmpty(data.password)){
        errors.password = "Password is required."
    }
    if(!Validator.isLength(data.password,{min: 6, max: 30})){
        errors.password = "Password must be between 6  and 30 characters."
    }
    if(Validator.isEmpty(data.cPassword)){
        errors.cPassword = "Confirm password is required."
    }
    if(!Validator.equals(data.password, data.cPassword)){
        errors.cPassword = "Password  and confirm password fields do not match."
    }
    return{
        errors,
        isValid:isEmpty(errors)
    };
};