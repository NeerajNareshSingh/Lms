const Validator = require('validator');
const isEmpty = require('./is-empty');
module.exports = function validateExperienceInput(data){
    let errors = {}; 
    data.title = !isEmpty(data.title) ? data.title : '';
    data.company = !isEmpty(data.company) ? data.company : '';
    data.from = !isEmpty(data.from) ? data.from : '';

    // title validation
    if(Validator.isEmpty(data.title)){
        errors.title = "Title field is required."
    }
    // company validation
    if(Validator.isEmpty(data.company)){
        errors.company = "Company is required."
    }
    // from validation
    if(Validator.isEmpty(data.from)){
        errors.from = "From Date is required."
    }
    return{
        errors,
        isValid:isEmpty(errors)
    };
};