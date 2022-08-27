const Validator = require('validator');
const isEmpty = require('./is-empty');
module.exports = function validateEducationInput(data){
    let errors = {}; 
    data.school = !isEmpty(data.school) ? data.school : '';
    data.degree = !isEmpty(data.degree) ? data.degree : '';
    data.fieldofstudy = !isEmpty(data.fieldofstudy) ? data.fieldofstudy : '';
    data.from = !isEmpty(data.from) ? data.from : '';

    // school validation
    if(Validator.isEmpty(data.school)){
        errors.school = "School field is required."
    }
    // degree validation
    if(Validator.isEmpty(data.degree)){
        errors.degree = "Degree field is required."
    }
    // fieldofstudy validation
    if(Validator.isEmpty(data.fieldofstudy)){
        errors.fieldofstudy = "Field of study is required."
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