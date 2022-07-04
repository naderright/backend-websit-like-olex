const validation = require('../../Middelwear/validation');
const regist= require('./controller/Register');
const joiValid= require('./validation.auth');

const auth = require('express').Router();

auth.post('/signup',validation(joiValid.signup),regist.signup);
auth.get('/confirmEmail/:token',validation(joiValid.confirmEmail),regist.confirmEmail);
auth.post('/signin',validation(joiValid.signin),regist.signin);
auth.post('/sendCode',regist.sendCode);
auth.patch('/forgotPass',validation(joiValid.forgotPass),regist.forgotPass);




module.exports = auth;