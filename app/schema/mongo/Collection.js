import mongoose from "mongoose";

const collectionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Image name is required'],
    trim: true
  },
  images: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Image' // Reference the Image model
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  },
  userId:{
    type:mongoose.Schema.Types.ObjectId
  }
});

const Collection = mongoose.models?.Collection || mongoose.model('Collection', collectionSchema);

export default Collection;