const joi = require('joi');
const signup = {
    body:joi.object().required().keys({
        userName:joi.string().required().max(30).min(3).alphanum(),
        Email:joi.string().required().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
        Password:joi.string().required().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
        cPassword:joi.ref('Password'),
    })
};

const confirmEmail = {
    params: joi.object().required().keys({
        token:joi.string().required(),
    })
}

const signin = {
    body:joi.object().required().keys({
        Email:joi.string().required().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
        Password:joi.string().required().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
    })
};

const forgotPass = {
    body:joi.object().required().keys({
        Email:joi.string().required().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
        newPassword:joi.string().required().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
        cNewPassword: joi.string().valid(joi.ref('newPassword')).required(),
        code:joi.string().max(10000).min(1000)
    })
};



module.exports={signup,signin,confirmEmail,forgotPass}