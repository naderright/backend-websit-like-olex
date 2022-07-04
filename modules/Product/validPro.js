const joi = require('joi');

const addPro = {
    body:joi.object().required().keys({
        product_title:joi.string().required(),
        Product_desc:joi.string().required(),
        Product_price:joi.number().required(),
    })
};
const update = {
    body:joi.object().required().keys({
        Product_price:joi.number().required(),
    }),

    params:joi.object().required().keys({
        id:joi.string().required().max(24).min(24)
    })
};

const deletePro = {
    

    params:joi.object().required().keys({
        id:joi.string().required().max(24).min(24)
    })
};

const softDeletePro = {
    

    params:joi.object().required().keys({
        id:joi.string().required().max(24).min(24)
    })
};
const hidePro = {
    

    params:joi.object().required().keys({
        id:joi.string().required().max(24).min(24)
    })
};

const likeAndUnlike = {
    

    params:joi.object().required().keys({
        id:joi.string().required().max(24).min(24)
    })
};


const addWeshlist= {
    

    params:joi.object().required().keys({
        id:joi.string().required().max(24).min(24)
    })
};


const Comment ={
    body:joi.object().required().keys({
        comment_body:joi.string().required()
    }),
    params:joi.object().required().keys({
        id:joi.string().required().max(24).min(24)
    })
};

const updateComment ={
    body:joi.object().required().keys({
        comment_body:joi.string().required()
    }),
    params:joi.object().required().keys({
        id:joi.string().required().max(24).min(24),
        commId:joi.string().required().max(24).min(24),
    })
};

const deleteComment ={
    params:joi.object().required().keys({
        id:joi.string().required().max(24).min(24),
        commId:joi.string().required().max(24).min(24),
    })
};

const likeAndUnlikeComm = {
    params:joi.object().required().keys({
        id:joi.string().required().max(24).min(24),
        commId:joi.string().required().max(24).min(24),
    })
};
const Replies = {
    body:joi.object().required().keys({
        comment_body:joi.string().required()
    }),
    params:joi.object().required().keys({
        id:joi.string().required().max(24).min(24),
        commId:joi.string().required().max(24).min(24),
    })
};

module.exports={addPro,update,deletePro,likeAndUnlike,softDeletePro
    ,hidePro,addWeshlist,Comment,updateComment,deleteComment,likeAndUnlikeComm,Replies};