const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    profileUrl:{
        type:String
    },
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        unique:true,
        required:true
    },
    phoneNumber:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        required:true
    },
    penName:{
        type:String, 
        default:null
    }

}, {timestamps:true});

UserSchema.index(
  { penName: 1 },
  { unique: true, partialFilterExpression: { penName: { $exists: true, $ne: null } } }
);

module.exports = mongoose.model('User', UserSchema);