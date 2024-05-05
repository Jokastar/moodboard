import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        default:"" 
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase: true
    }
});

const User = mongoose.models?.User || mongoose.model('User', userSchema); 

export default User; 