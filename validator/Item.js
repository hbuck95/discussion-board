const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateItem(item) {
    let errors = {};

    item.username = !isEmpty(item.username) ? item.username : "";

    if(Validator.isEmpty(item.username)){
        errors.username = "A username is required.";
    }

    if(!Validator.isAlphanumeric(item.username, "en-GB")){
        errors.username = "Usernames can only contain letters or numbers.";
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };

};