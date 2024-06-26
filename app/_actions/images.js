//TO DO: delete previous image from cloudinary

"use server";
import OpenAI from "openai";
import connectDB from "@/app/lib/connectDb";
import cloudinary from "@/app/lib/connectCloudinary";
import ImageSchema from "@/app/schema/zod/imageSchema";
import Image from "@/app/schema/mongo/Image";
import Tag from "../schema/mongo/Tag";
import WordEmbedding from "../schema/mongo/WordEmbeddings";
import sharp from "sharp";

import { Buffer } from 'buffer';
import { redirect } from "next/navigation";


const openai = new OpenAI({apiKey:process.env.OPENAI_KEY});

(async () => {
  await connectDB();
})();


export async function getImageTagsfromChatGPT(base64ImageUrl) {
    const system_prompt = "You are an agent specialized in tagging images related to fashion, architecture, landscape, design, video games, paintings and photography. Each image will showcase distinctive features that may pertain to style trends, architectural forms, natural scenery, artistic design elements, or digital environments from video games. You will be provided with an image along with a brief description or title of the scene, item, or theme depicted in the image. Your goal is to extract relevant keywords that could be used to categorize and search for these images in a creative database or digital gallery. Keywords should be precise, in lower case, and capture the essence of the image in terms of: Subject Matter (e.g., 'evening gown', 'skyscraper', 'waterfall', 'graphic poster', 'fantasy RPG') Design Style (e.g., 'minimalist', 'art deco', 'surrealist', 'baroque', 'pixel art') Dominant Colors (e.g., 'mint green', 'charcoal gray', 'pastel pink', 'neon blue') Material or Fabric (for fashion and design items, e.g., 'silk', 'leather', 'canvas') Texture and Patterns (for video game imagery, e.g., 'gritty texture', 'smooth shading', '8-bit') Emotional or Thematic Tone (e.g., 'serene', 'dynamic', 'melancholic', 'epic', 'mysterious') Only select material, style, or color keywords if they are prominently featured and contribute significantly to the character or appeal of the image. Return the keywords in the format of an array of strings, like this:['fantasy RPG', 'epic', 'neon blue', 'pixel art']  Ensure your tags not only describe the image accurately but also resonate with artistic and aesthetic nuances that could appeal to designers, artists, gamers, and creatives seeking inspiration or specific imagery for their projects. return 4 tags maximum";

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "user",
                    content: [
                        { type: "text", text: system_prompt },
                        {
                            type: "image_url",
                            image_url: {
                                "url": base64ImageUrl
                            },
                        },
                    ],
                },
            ],
        });
        
        // Remove leading and trailing whitespace
        let tagsStringArray = response.choices[0].message.content.trim();

    // Remove surrounding square brackets if present
    if (tagsStringArray.startsWith('[') && tagsStringArray.endsWith(']')) {
        tagsStringArray = tagsStringArray.substring(1, tagsStringArray.length - 1);
    }

    // Split the string by commas, taking into account potential spaces
    let tagsArray = tagsStringArray.split(/\s*,\s*/);

    // Trim each item to remove any remaining whitespace and quotes
    tagsArray = tagsArray.map(tag => tag.replace(/'/g, '').trim());
    
    return tagsArray;


    } catch (e) {
        console.log(e);
    }
}



export async function addNewImage(prevState, formData) {
    const imageName = formData.get('name');
    const imageFile = formData.get('image');
    const tagsString = formData.get('tags');
    console.log("image:" + imageFile.type);
    let success = false;

    if (!imageName || !imageFile) {
        console.error('Missing required fields');
        return { success: false, message: 'Missing required fields' };
    }

    const result = ImageSchema.safeParse({
        imageName: imageName,
        imageFile: imageFile
    });

    if (!result.success) {
        console.error('Validation errors:', result.error.flatten().fieldErrors);
        return { success: false, message: 'Validation errors', errors: result.error.flatten().fieldErrors };
    }

    try {
        const tags = JSON.parse(tagsString || "[]");
        const imageFileToBuffer = Buffer.from(await imageFile.arrayBuffer());
        const { imageBuffer, imageCardBuffer, error } = await changeImageFormat(imageFileToBuffer);

        if (error) {
            console.log("failed changing image format " + error);
            return;
        }

        const uploadImageResult = await uploadImageToCloudinary(imageBuffer, imageName);
        const uploadImageCardResult = await uploadImageToCloudinary(imageCardBuffer, imageName);

        console.log('Upload successful:', uploadImageResult);
        console.log('Upload successful:', uploadImageCardResult);

        const newImage = new Image({
            name: imageName,
            imageUrl: uploadImageResult.url,
            imageCardUrl: uploadImageCardResult.url,
            imageCloudinaryId: uploadImageResult.public_id,
            imageCardCloudinaryId: uploadImageCardResult.public_id,
            tags: tags
        });

        await newImage.save();

       
        const imageNameEmbedding = await getEmbedding(imageName.toLowerCase());

        await WordEmbedding.updateOne(
            { embedding: imageNameEmbedding },
            { $set: { embedding: imageNameEmbedding, word:imageName.toLowerCase()}},
            { upsert: true }
        );

        for (const tag of tags) {
            const tagEmbedding = await getEmbedding(tag.toLowerCase());
            await Tag.updateOne(
                { tag: tag.toLowerCase()},
                { $set: { tag: tag}},
                { upsert: true }
            );
            await WordEmbedding.updateOne(
                { embedding: tagEmbedding },
                { $set: { embedding: tagEmbedding, word: tag.toLowerCase()} },
                { upsert: true }
            );
            
        }

        success = true;
    } catch (error) {
        console.log('Failed to upload or save image:', error);
        return { success: false, message: 'Failed to upload or save image', error: error.message };
    }

    if (success) redirect("/");
}


export async function updateImage(prevState, formData) {
    try {
        const imageId = formData.get('imageId');
        const name = formData.get('name');
        const tagsString = formData.get('tags');
        const imageFile = formData.get('image');

        const tags = tagsString ? JSON.parse(tagsString) : [];

        if (imageFile && imageFile.size > 0) {
            const imageFileToBuffer = Buffer.from(await imageFile.arrayBuffer());
            const { imageBuffer, imageCardBuffer, error } = await changeImageFormat(imageFileToBuffer);

            if (error) {
                console.log("Failed changing image format " + error);
                return { success: false, message: "Failed changing image format" };
            }

            let imageToUpdate = await Image.findById(imageId);
            if (!imageToUpdate) {
                console.log('Image not found');
                return { success: false, message: 'Image not found' };
            }

            const uploadImageResult = await uploadImageToCloudinary(imageBuffer);
            const uploadImageCardResult = await uploadImageToCloudinary(imageCardBuffer);

            const updatedImage = await Image.findByIdAndUpdate(imageId, {
                $set: {
                    name: name,
                    imageUrl: uploadImageResult.url,
                    imageCardUrl: uploadImageCardResult.url,
                    imageCloudinaryId: uploadImageResult.public_id,
                    imageCardCloudinaryId: uploadImageCardResult.public_id,
                    tags: tags
                }
            }, { new: true, omitUndefined: true });

            if (imageToUpdate.imageCloudinaryId && imageToUpdate.imageCloudinaryId !== uploadImageResult.public_id) {
                await deleteImageFromCloudinary(imageToUpdate.imageCloudinaryId);
                await deleteImageFromCloudinary(imageToUpdate.imageCardCloudinaryId);
            }

            if (tags.length > 0) {
                for (let tag of tags) {
                    const tagEmbedding = await getEmbedding(tag);
                    await Tag.updateOne(
                        { tag: tag },
                        { upsert: true }
                    );

                    await WordEmbedding.updateOne(
                        { embedding: tagEmbedding },
                        { $setOnInsert: { embedding: tagEmbedding } },
                        { upsert: true }
                    );
                }
            }

            const imageNameEmbedding = await getEmbedding(name);
            await WordEmbedding.updateOne(
                { embedding: imageNameEmbedding },
                { $setOnInsert: { embedding: imageNameEmbedding } },
                { upsert: true }
            );

            if (updatedImage) {
                console.log('Image updated successfully');
                return { success: true, message: 'Image updated successfully', data: updatedImage };
            } else {
                console.log('Image not found');
                return { success: false, message: 'Image not found' };
            }
        } else {
            const updatedImage = await Image.findByIdAndUpdate(imageId, {
                $set: {
                    name: name,
                    tags: tags
                }
            }, { new: true, omitUndefined: true });

            if (tags.length > 0) {
                for (let tag of tags) {
                    const tagEmbedding = await getEmbedding(tag);
                    await Tag.updateOne(
                        { tag: tag },
                        { $setOnInsert: { tag: tag, tagEmbedding: tagEmbedding } },
                        { upsert: true }
                    );

                    await WordEmbedding.updateOne(
                        { embedding: tagEmbedding },
                        { $setOnInsert: { embedding: tagEmbedding } },
                        { upsert: true }
                    );
                }
            }

            const imageNameEmbedding = await getEmbedding(name);
            await WordEmbedding.updateOne(
                { embedding: imageNameEmbedding },
                { $setOnInsert: { embedding: imageNameEmbedding } },
                { upsert: true }
            );

            if (updatedImage) {
                console.log('Image updated successfully');
                redirect("/");
                return { success: true, message: 'Image updated successfully', data: updatedImage };
            } else {
                console.log('Image not found');
                return { success: false, message: 'Image not found' };
            }
        }
    } catch (error) {
        console.error('Error updating image:', error);
        return { success: false, message: 'Error updating image', error: error.toString() };
    }
}

export async function deleteImage(imageId) {
    try {
        const imageToDelete = await Image.findById(imageId);
        if (!imageToDelete) {
            console.log('Image not found');
            return { success: false, message: 'Image not found' };
        }

        const cloudinaryResponse = await deleteImageFromCloudinary(imageToDelete.imageCloudinaryId);
        console.log('Cloudinary delete response:', cloudinaryResponse);

        if (imageToDelete.imageCardCloudinaryId) {
            const cloudinaryCardResponse = await deleteImageFromCloudinary(imageToDelete.imageCardCloudinaryId);
            console.log('Cloudinary card delete response:', cloudinaryCardResponse);
        }

        const deletedImage = await Image.findByIdAndDelete(imageId);

        
        await WordEmbedding.deleteOne({ word: imageToDelete.name });

    
        console.log('Image and related embeddings deleted successfully from MongoDB and Cloudinary');
        return { success: true, message:'Image deleted successfully', data: deletedImage };
    } catch (error) {
        console.error('Error deleting image:', error);
        return { success: false, message: 'Error deleting image', error: error.toString() };
    }
}

 export async function getAllImages(page) {
    let limit = 10; 

    try {
      const images = await Image.find()
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

      // Count the total number of documents
      const count = await Image.countDocuments();
      console.log('Images retrieved successfully:');
      return {requestedImages:images, totalPages: Math.ceil(count / limit)}
    } catch (error) {
      console.log('Error retrieving images:', error);
      return []; 
    }
  }

  export async function getImageById(id) {
    try {  
      const image = await Image.findOne({_id:id}).lean();

      if (!image) {
        console.log('No image found with ID:', id);
        return null;  // or you could throw an error based on your error handling strategy
      }
      return image;
    } catch (error) {
      console.error('Error fetching image:', error);
      return {}; 
    }
  }

  export async function getImagesByIds(imageIds) {
    try {

        // Use Mongoose find with $in operator
        const images = await Image.find({ _id: { $in: imageIds } });
        console.log("image retrieved successfully: " + images); 
        return images
    } catch (error) {
        console.log('Error fetching images:', error);
        return {}; 
    }
}

  export async function getImagesByQuery(query){
    try {  
      const images = await Image.find({
        $or: [
          { name: { $regex: query, $options: 'i' } },  // Case insensitive search on name
          { tags: { $regex: query, $options: 'i' } }   // Case insensitive search in tags array
        ]
      });

      if (!images) {
        console.log('No image found with ID:', id);
        return [];  // or you could throw an error based on your error handling strategy
      }
      return images;
    } catch (error) {
      console.log('Error fetching image:', error);
      return []; 
    }
  }
 
  export async function getImagesByTags(userTags = []) {
    try {
        let tagValues = userTags;

        // If no user tags are provided, fetch random tags
        if (!tagValues.length) {
            const randomTags = await Tag.aggregate([
                { $sample: { size: 5 } }
            ]);

            // If no tag found return empty list
            if (randomTags.length < 1) return []; 

            // Extract tag values from the fetched tags
            tagValues = randomTags.map(tag => tag.tag);
        }

        // Query images that contain any of the provided or randomly selected tags
        const images = await Image.find({
            tags: { $in: tagValues }
        });
        return images;

    } catch (error) {
        console.log("Error fetching images by tags:", error);
    }
}

export async function uploadImageToCloudinary(imageBuffer) {
  return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream({ resource_type: 'image' },
          (error, result) => {
              if (error) {
                  reject(error);  // Properly reject the promise if there's an error
              } else {
                  resolve(result);  // Resolve with the result if upload is successful
              }
          });

      // The buffer is sent to Cloudinary
      uploadStream.end(imageBuffer);
  });
}

export async function deleteImageFromCloudinary(publicId) {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(publicId, function(error, result) {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  }

async function changeImageFormat(imageBuffer) {
    try {
      // Resize while preserving aspect ratio for the main image
      const newImageBuffer = await sharp(imageBuffer)
        .resize({ width: 1024 }) // Specify width, height will be calculated to maintain aspect ratio
        .toFormat('webp') // Convert to webp
        .toBuffer();
  
      // Resize while preserving aspect ratio for the image card
      const imageCardBuffer = await sharp(imageBuffer)
        .resize({ width: 600 }) // Specify width, height will be calculated to maintain aspect ratio
        .toFormat('webp')
        .toBuffer();
  
      return { imageBuffer: newImageBuffer, imageCardBuffer: imageCardBuffer, error: false };
    } catch (e) {
      return { error: e };
    }
  }


 export async function getEmbedding(text){
  try{
    const embedding = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: text,
      encoding_format: "float",
    });

    return embedding.data[0].embedding; 

  }catch(e){
    console.log("embedding error", e); 
  } 
}




