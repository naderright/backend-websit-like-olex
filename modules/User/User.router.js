const { auth } = require('../../Middelwear/auth');
const roleAccess = require('../roleAccess');
const admin = require('./controller/admin');
const validUser = require('./validationUser');
const validation = require('../../Middelwear/validation.js');
const profile = require('./controller/profile');
const { my_multer, extentions } = require('../../servises/multer.js');
const allUser = require('./controller/getAllUser');

const user = require('express').Router();

user.get('/',allUser)
//admin
user.delete('/delete/:id',auth(roleAccess.admin),validation(validUser.params),admin.deleteUser);
user.patch('/softDelete/:id',auth(roleAccess.admin),validation(validUser.params),admin.softDelete);
user.patch('/block/:id',auth(roleAccess.admin),validation(validUser.params),admin.BlockUser);

//profile
user.put('/updateEmail',auth(roleAccess.all),validation(validUser.updateEmail),profile.updateEmail);
user.put('/updatePass',auth(roleAccess.all),validation(validUser.updatePass),profile.updatePass);

user.delete('/delete',auth(roleAccess.all),profile.deleteProf);

user.patch('/profile/picture',auth(roleAccess.all),
my_multer('/profile/pic',extentions.image).single('image'),profile.profilePic);

user.patch('/profile/coverPic',auth(roleAccess.all),
my_multer('/profile/coverPic',extentions.image).array('image'),profile.coverPic);

//extra
user.get('/wishList',auth(roleAccess.all),profile.getWishlist);
//get single product if wishList includes product 
user.get('/wishList/:idPro',auth(roleAccess.all),profile.getSinglPRoduct);
user.patch('/wishList/:id/remove',auth(roleAccess.all),validation(validUser.params),profile.wishlistRmove)
//extra



module.exports = user;