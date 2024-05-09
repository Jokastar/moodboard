import Collection from "../schema/mongo/Collection";
import User from "../schema/mongo/User";  

export async function createCollection(name) {
    try {
      const newCollection = new Collection({ name });
      await newCollection.save();
      console.log('Collection created successfully:', newCollection);
      return { success: true, collection: newCollection };
    } catch (error) {
      console.error('Error creating collection:', error);
      return { success: false, error: error.message };
    }
  }

  
export async function addImageToCollection(collectionId, imageId) {
    try {
      const collection = await Collection.findById(collectionId);
      if (!collection) {
        console.error('Collection not found');
        return { success: false, message: 'Collection not found' };
      }
  
      const image = await Image.findById(imageId);
      if (!image) {
        console.error('Image not found');
        return { success: false, message: 'Image not found' };
      }
  
      collection.images.push(image._id);
      await collection.save();
      console.log('Image added to collection successfully:', collection);
      return { success: true, collection };
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
      const user = await User.findById(userId).populate('collections');
      if (!user) {
        console.error('User not found');
        return { success: false, message: 'User not found' };
      }
      
      console.log('Collections retrieved successfully:', user.collections);
      return { success: true, collections: user.collections };
    } catch (error) {
      console.log('Error retrieving collections:', error);
      return { success: false, message: 'Error retrieving collections', error: error.message };
    }
  }


  