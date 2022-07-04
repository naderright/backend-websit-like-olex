const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
 comment_body:{type:String,required:true},
 comment_By : {type:mongoose.Schema.Types.ObjectId,ref:'User'},
 Product_id : {type:mongoose.Schema.Types.ObjectId,ref:'User'},
 likes:[{type:mongoose.Schema.Types.ObjectId,ref:'User'}],
 Replies : [{type:mongoose.Schema.Types.ObjectId,ref:'Comment'}],
},{timestamps:true});

const commentModel = mongoose.model('Comment',commentSchema);
module.exports = commentModel; 