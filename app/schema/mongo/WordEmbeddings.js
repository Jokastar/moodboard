import mongoose from "mongoose"; 


const wordEmbeddingsSchema = new mongoose.Schema({
    word:{
        type:String,
        required:true
    },
    embedding:{
        type:[Number],
        required:true, 
    }
})

const WordEmbedding = mongoose.models?.WordEmbedding ||  mongoose.model('WordEmbedding', wordEmbeddingsSchema);

export default WordEmbedding; 