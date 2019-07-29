const bcrypt = require("bcryptjs");

module.exports = async function compare(value, hash){
    bcrypt.compare(value, hash).then(isMatch => {
        return isMatch;
    });
}
