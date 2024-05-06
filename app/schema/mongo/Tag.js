import mongoose from "mongoose";

const tagSchema = new mongoose.Schema({
    tag:{
        type:String,
        required:true
    }
})

const Tag = mongoose.models?.Tag ||  mongoose.model('Tag', tagSchema);

export default Tag; 