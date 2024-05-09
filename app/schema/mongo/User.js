import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true
    },
    collections:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Collection' // Reference the Image model
          }
    ]
}, { timestamps: true });

const User = mongoose.models?.User || mongoose.model('User', userSchema); 

export default User; 