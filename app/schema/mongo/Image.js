import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
    name: {
      type: String,
      required: [true, 'Image name is required'],
      trim: true
    },
    imageUrl: {
      type: String,
      required: [true, 'Image URL is required']
    },
    imageCardUrl:{
      type:String,
      required:true
    }, 
    imageCloudinaryId:{
        type:String,
        required: true
    },
    imageCardCloudinaryId:{
      type:String,
      required:true
    },
    tags: [{
      type: String,
      trim: true
    }],
    createdAt: {
      type: Date,
      default: Date.now() 
    }
  });
  
  const Image = mongoose.models?.Image || mongoose.model('Image', imageSchema);

export default Image;

/* 
,
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',  // Assuming you have a User model
      required: [true, 'User ID is required']
    }
*/