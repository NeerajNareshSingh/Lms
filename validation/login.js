const Validator = require('validator');
const isEmpty = require('./is-empty');
module.exports = function validateLoginUserInput(data){
    let errors = {}; 
    data.email = !isEmpty(data.email) ? data.email : '';
    data.password = !isEmpty(data.password) ? data.password : '';

    // email validation
    if(Validator.isEmpty(data.email)){
        errors.email = "Email field is required."
    }
    // password validation
    if(Validator.isEmpty(data.password)){
        errors.password = "Password is required."
    }
    return{
        errors,
        isValid:isEmpty(errors)
    };
};