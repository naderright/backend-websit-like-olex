const product = require('express').Router();
const {auth} = require('../../Middelwear/auth.js');
const validation = require('../../Middelwear/validation.js');
const roleAccess = require('../roleAccess.js');
const apiPro = require('./controller/apiPro.js');
const apiComm = require('./controller/apiCom.js');
const validPro = require('./validPro.js');

//product
product.post('/add',auth(roleAccess.all),validation(validPro.addPro),apiPro.addPro);
product.patch('/update/:id',auth(roleAccess.all),validation(validPro.update),apiPro.updatePro);
product.delete('/delete/:id',auth(roleAccess.all),validation(validPro.deletePro),apiPro.deletePro);
product.patch('/softDelete/:id',auth(roleAccess.all),validation(validPro.softDeletePro),apiPro.softDelete);
product.patch('/hide/:id',auth(roleAccess.all),validation(validPro.hidePro),apiPro.hidePro);
product.patch('/:id/like',auth(roleAccess.all),validation(validPro.likeAndUnlike),apiPro.likePro);
product.patch('/:id/unlike',auth(roleAccess.all),validation(validPro.likeAndUnlike),apiPro.unLikePro);
product.patch('/add/Wishlist/:id',auth(roleAccess.all),validation(validPro.addWeshlist),apiPro.addWishlist);

//extra
product.get('/',apiPro.getAllProduct);
product.get('/:idPro',auth(roleAccess.all),apiPro.getSingleProduct)
//comment

product.post('/:id/addComment',auth(roleAccess.all),validation(validPro.Comment),apiComm.addComment);
product.patch('/:id/:commId/update',auth(roleAccess.all),validation(validPro.updateComment),apiComm.updateComment);
product.delete('/:id/:commId/delete',auth(roleAccess.all),validation(validPro.deleteComment),apiComm.deleteComment);
product.patch('/:id/:commId/like',auth(roleAccess.all),validation(validPro.likeAndUnlikeComm),apiComm.likeComment);
product.patch('/:id/:commId/unlike',auth(roleAccess.all),validation(validPro.likeAndUnlikeComm),apiComm.unlikeComment);
product.patch('/:id/:commId/Replies',auth(roleAccess.all),validation(validPro.Replies),apiComm.Replies )
module.exports = product;