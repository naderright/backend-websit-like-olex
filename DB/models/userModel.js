const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    userName:{type:String , required:true},
    firstName :String,
    lastName:String,
    Email:{type:String , required:true , unique:true},
    Password:{type:String , required:true},
    Profile_picture:String, 
    Cover_pictures:Array,
    code:String, 
    Confirmed:{type:Boolean,default:false},
    Blocked:{type:Boolean,default:false}, 
    WishList:[{type:mongoose.Schema.Types.ObjectId,ref:'Product'}],
    products_user:[{type:mongoose.Schema.Types.ObjectId,ref:'Product'}],
    IsDeleted:{type:Boolean,default:false},
    role:{type:String,default:'user'},
    socketID:String
},{timestamps:true});

userSchema.pre('save',async function(next){
    this.Password = await bcrypt.hash(this.Password ,parseInt(process.env.saltRound) );
    next();
});

userSchema.pre('findByIdAndUpdate', async function (next) {
    
    const hookData = await this.model.findOne(this.getQuery()).select("__v");
    this.set({ __v: hookData.__v + 1 });
    next();
});


const userModel =  mongoose.model('User',userSchema);
module.exports = userModel;