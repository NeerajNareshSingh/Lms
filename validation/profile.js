const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateProfileInput(data){
    let errors = {}; 
    data.addressLine1 = !isEmpty(data.addressLine1) ? data.addressLine1 : '';
    data.city = !isEmpty(data.city) ? data.city : '';
    data.state = !isEmpty(data.state) ? data.state : '';
    data.country = !isEmpty(data.country) ? data.country : '';
    data.postalCode = !isEmpty(data.postalCode) ? data.postalCode : '';
   
    // Address Line1 validation
    if(!Validator.isEmpty(data.addressLine1)){
            errors.addressLine1 = 'Address Line1 is manadatory field.'
    }

    // City validation
    if(!Validator.isEmpty(data.city)){
        errors.city = 'City is manadatory field.'
    }

    // City validation
    if(!Validator.isEmpty(data.state)){
        errors.state = 'State is manadatory field.'
    }

    // Country validation
    if(!Validator.isEmpty(data.country)){
        errors.country = 'Country is manadatory field.'
    }

    // Country validation
    if(!Validator.isEmpty(data.postalCode)){
        errors.postalCode = 'Postal Code is manadatory field.'
    }
    
    return{
        errors,
        isValid:isEmpty(errors)
    };
};