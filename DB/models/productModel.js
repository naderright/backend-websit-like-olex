const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
     product_title:{type:String,required:true},
     Product_desc:{type:String,required:true},
     Product_price:{type:Number,required:true},
     Likes:[{type:mongoose.Schema.Types.ObjectId,ref:'User'}],
     CreatedBy:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
     Hidden:{type:Boolean,default:false}, 
     IsDeleted:{type:Boolean,default:false},
     Comments:[{type:mongoose.Schema.Types.ObjectId,ref:'Comment'}] ,
     Wishlists : [{type:mongoose.Schema.Types.ObjectId,ref:'User'}],
     qr_code :String
},{timestamps:true});


const productModel = mongoose.model('Product',productSchema);
module.exports = productModel;