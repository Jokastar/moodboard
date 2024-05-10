"use server"; 

import Collection from "../schema/mongo/Collection";
import User from "../schema/mongo/User";  
import Image from "../schema/mongo/Image"
import { convertObjectIdsToStrings } from "../lib/convertObjectIdsToStrings";

export async function createCollection(userId, name) {
  
  try {
      const newCollection = new Collection({ name, userId });
      await newCollection.save();

      const user = await User.findById(userId);
      if (!user) {
          console.error('User not found');
          return { success: false, message: 'User not found' };
      }

      user.collections.push(newCollection);  // Store the whole collection document
      await user.save();

      console.log('Collection created successfully and added to user:', newCollection);
      return { success: true, collection: newCollection };
  } catch (error) {
      console.error('Error creating collection:', error);
      return { success: false, error: error.message };
  }
}
export async function addImageToCollection(collectionId, imageId) {
    try {
      const collection = await Collection.findOne({_id:collectionId});
      if (!collection) {
        console.error('Collection not found');
        return { success: false, message: 'Collection not found' };
      }
  
      const image = await Image.findOne({_id: imageId});
      if (!image) {
        console.error('Image not found');
        return { success: false, message: 'Image not found' };
      }
  
      collection.images.push(image);
      await collection.save();
      console.log('Image added to collection successfully:', collection);
      return { success: true};
    } catch (error) {
      console.error('Error adding image to collection:', error);
      return { success: false, error: error.message };
    }
  }


export async function deleteImageFromCollection(collectionId, imageId) {
  try {
    const collection = await Collection.findById(collectionId);
    if (!collection) {
      console.error('Collection not found');
      return { success: false, message: 'Collection not found' };
    }

    collection.images = collection.images.filter(imgId => imgId.toString() !== imageId);
    await collection.save();
    console.log('Image removed from collection successfully:', collection);
    return { success: true, collection };
  } catch (error) {
    console.error('Error removing image from collection:', error);
    return { success: false, error: error.message };
  }
}

export async function deleteCollection(collectionId) {
  try {
    const deletedCollection = await Collection.findByIdAndDelete(collectionId);
    if (!deletedCollection) {
      console.error('Collection not found');
      return { success: false, message: 'Collection not found' };
    }
    console.log('Collection deleted successfully:', deletedCollection);
    return { success: true, collection: deletedCollection };
  } catch (error) {
    console.error('Error deleting collection:', error);
    return { success: false, error: error.message };
  }
}

export async function getCollections(userId) {
    try {
      const collections = await Collection.findOne({userId:userId});
      if (!collections) {
        console.error('collection not found');
        return { success: false, message: 'Collection not found' };
      }
      
      console.log('Collections retrieved successfully:', collections);
      
    const updateCollection = convertObjectIdsToStrings(collections); 
      return { success: true, collections:[updateCollection]};
    } catch (error) {
      console.log('Error retrieving collections:', error);
      return { success: false, message: 'Error retrieving collections', error: error.message };
    }
  }


  