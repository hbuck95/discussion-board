const bcrypt = require("bcryptjs");

module.exports = async function encrypt(data){
    console.log(data);

    const hashedData = await new Promise((res,rej) => {
        bcrypt.hash(data, 12, function(err,hash){
            if(err) rej(err);
            console.log(hash);
            res(hash);  
        });
    })
    return hashedData;
}


//     bcrypt.genSalt(13, (err, salt) => {
//         bcrypt.hash(data, salt, (err, hash) => {
//             if(err) 
//                 throw err;
//             console.log("Data: "+data+" Salt: "+salt+" Hash: "+hash);
//             return hash;
//         });
//     });
// };