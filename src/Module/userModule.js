const { Schema, model } = require("mongoose");

const userSchema = new Schema({
    id:{
        type:Number,
        required:true,
        unique:true
    },
    email:{
        required:true,
        unique:true,
        type:String,
    },
    name:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true
    },
    profile_image:{
        type:String
    }
})

const userModel = model('users',userSchema);

module.exports = {userModel}