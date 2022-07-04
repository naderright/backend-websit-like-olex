const joi = require('joi');

const params = {
    params:joi.object().required().keys({
        id:joi.string().required().max(24).min(24)
    })
};


const updateEmail = {
    body:joi.object().required().keys({
        Email:joi.string().required().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    })
};
const updatePass = {
    body:joi.object().required().keys({
        oldPassword:joi.string().required().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
        newPassword:joi.string().required().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
        cPassword: joi.string().valid(joi.ref('newPassword')).required(),
       
    })
};


module.exports = {params,updateEmail,updatePass}