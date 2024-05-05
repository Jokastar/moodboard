import mongoose from "mongoose";

const tagSchema = new mongoose.Schema({
    tag:{
        type:string,
        required
    }
})

const Tag = mongoose.model?.Tag ||  mongoose.model('Tag', tagSchema);

export default Tag; 