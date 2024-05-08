//TO DO: delete previous image from cloudinary

"use server";
import OpenAI from "openai";
import connectDB from "@/app/lib/connectDb";
import cloudinary from "@/app/lib/connectCloudinary";
import ImageSchema from "@/app/schema/zod/imageSchema";
import Image from "@/app/schema/mongo/Image";
import Tag from "../schema/mongo/Tag";

import { Buffer } from 'buffer';




//const openai = new OpenAI({apiKey:process.env.OPENAI_KEY});

(async () => {
  await connectDB();
})();

export async function getImageTags(imageUrl, title){
 const system_prompt = "You are an agent specialized in tagging images related to fashion, architecture, landscape, design, and video games. Each image will showcase distinctive features that may pertain to style trends, architectural forms, natural scenery, artistic design elements, or digital environments from video games. You will be provided with an image along with a brief description or title of the scene, item, or theme depicted in the image. Your goal is to extract relevant keywords that could be used to categorize and search for these images in a creative database or digital gallery. Keywords should be precise, in lower case, and capture the essence of the image in terms of: Subject Matter (e.g., 'evening gown', 'skyscraper', 'waterfall', 'graphic poster', 'fantasy RPG') Design Style (e.g., 'minimalist', 'art deco', 'surrealist', 'baroque', 'pixel art') Dominant Colors (e.g., 'mint green', 'charcoal gray', 'pastel pink', 'neon blue') Material or Fabric (for fashion and design items, e.g., 'silk', 'leather', 'canvas') Texture and Patterns (for video game imagery, e.g., 'gritty texture', 'smooth shading', '8-bit') Emotional or Thematic Tone (e.g., 'serene', 'dynamic', 'melancholic', 'epic', 'mysterious') Only select material, style, or color keywords if they are prominently featured and contribute significantly to the character or appeal of the image. Return the keywords in the format of an array of strings, like this:['fantasy RPG', 'epic', 'neon blue', 'pixel art']  Ensure your tags not only describe the image accurately but also resonate with artistic and aesthetic nuances that could appeal to designers, artists, gamers, and creatives seeking inspiration or specific imagery for their projects."

 try{
  const response = await openai.chat.completions.create(
    {model:"gpt-4-vision-preview",
    messages:[
        {
            "role": "system",
            "content": system_prompt
        },
        {
            "role": "user",
            "content": [
                {
                    "type": "image_url",
                    "image_url": imageUrl,
                },
            ],
        },
        {
            "role": "user",
            "content": title
        }
    ],
        max_tokens:300,
        top_p:0.1
   } )
    console.log(response.choices[0].message.content); 
    return response.choices[0].message.content

 }catch(error){
  console.log(error); 
  return error; 
 }
 
}

export async function addNewImage(prevState, formData) {
  const imageName = formData.get('name');
  const imageFile = formData.get('image');
  const tagsString = formData.get('tags');

  if (!imageName || !imageFile) {
      console.error('Missing required fields');
      return { success: false, message: 'Missing required fields' };
  }

  // Validate the form data using your Zod schema
  const result = ImageSchema.safeParse({
    imageName: imageName,
    imageFile:imageFile
  });

  if (!result.success) {
    console.error('Validation errors:', result.error.flatten().fieldErrors);
    return { success: false, message: 'Validation errors', errors: result.error.flatten().fieldErrors };
  }

  try {
    // Parse the tags from string to JSON
    let tags = JSON.parse(tagsString || "[]");

    // Get buffer from imageFile
    const imageBuffer = Buffer.from(await imageFile.arrayBuffer());

    // Upload the image file to Cloudinary
    const uploadResult = await uploadImageToCloudinary(imageBuffer, imageName);
    console.log('Upload successful:', uploadResult);

    //upload image to MongoDB
    const newImage = new Image({
      name: imageName,
      imageUrl: uploadResult.url, // Use the URL from Cloudinary upload result
      imageCloudinaryId : uploadResult.public_id,
      tags: tags
    });

    // Save the new image document
    await newImage.save(); 

    if(tags.lenght > 0){
      await Tag.insertMany(tags, { ordered: false });
    }
    

    return {success: true, message: 'Image uploaded and saved successfully'};
  } catch (error) {
    console.error('Failed to upload or save image:', error);
    return { success: false, message: 'Failed to upload or save image', error: error.toString()};
  }
}

export async function deleteImage(imageId) {
    try {
      const result = await Image.findByIdAndDelete(imageId);
      if (result) {
        console.log('Image deleted successfully');
        return { success: true, message: 'Image deleted successfully', data: result };
      } else {
        console.log('Image not found');
        return { success: false, message: 'Image not found' };
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      return { success: false, message: 'Error deleting image', error: error.toString() };
    }
  }

 export async function getAllImages(page) {
    let limit = 5; 

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
      console.error('Error retrieving images:', error);
      return []; 
    }
  }

  export async function getImageById(id) {
    try {  
      const image = await Image.findById(id).lean();
      if (!image) {
        console.log('No image found with ID:', id);
        return null;  // or you could throw an error based on your error handling strategy
      }
      return image;
    } catch (error) {
      console.error('Error fetching image:', error);
      throw error;  // Rethrow or handle as needed
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
      console.error('Error fetching image:', error);
      throw error;  // Rethrow or handle as needed
      return []
    }
  }

 export async function updateImage(prevState, formData) {
  console.log(formData); 

    try {
      const imageId = formData.get('imageId');
      const name = formData.get('name');
      const tagsString = formData.get('tags');
      const imageFile = formData.get('image');
      let updatedImage; 
      

      // Parse tags if provided
      const tags = tagsString ? JSON.parse(tagsString) : [];
  
      // Check if there is a new image file and upload it
      if (imageFile && imageFile.size > 0) {

        const imageBuffer = Buffer.from(await imageFile.arrayBuffer());
        const uploadResult = await uploadImageToCloudinary(imageBuffer);

        //get the image's cloudinaryId
        let {imageCloudinaryId} = await Image.findById(imageId).select("imageCloudinaryId");
        if (!imageCloudinaryId) {
            console.log('Image not found');
            return { success: false, message: 'Image not found' };
        }
  
          let imageUrl = uploadResult.url; // Update the imageUrl with the new URL from Cloudinary
          updatedImage = await Image.findByIdAndUpdate(imageId, {
          $set: {
            name: name,
            imageUrl: imageUrl,
            imageCloudinaryId: uploadResult.public_id,
            tags: tags
          }
        }, { new: true, omitUndefined: true });

        if (imageCloudinaryId && imageCloudinaryId !== uploadResult.public_id) {
          console.log(imageCloudinaryId)
          await deleteImageFromCloudinary(imageCloudinaryId);
      }
      }
  
      // Update the image document in MongoDB
        updatedImage = await Image.findByIdAndUpdate(imageId, {
        $set: {
          name: name,
          tags: tags
        }
      }, { new: true, omitUndefined: true });
  
      if (updatedImage) {
        console.log('Image updated successfully');
        return { success: true, message: 'Image updated successfully', data: updatedImage };
      } else {
        console.log('Image not found');
        return { success: false, message: 'Image not found' };
      }
    } catch (error) {
      console.error('Error updating image:', error);
      return { success: false, message: 'Error updating image', error: error.toString() };
    }
  }
  
  async function getImagesByTags(userTags = []) {
    try {
        let tagValues = userTags;

        // If no user tags are provided, fetch random tags
        if (!tagValues.length) {
            const randomTags = await Tag.aggregate([
                { $sample: { size: 5 } }
            ]);

            if (!randomTags.length) throw new Error("No tags found");

            // Extract tag values from the fetched tags
            tagValues = randomTags.map(tag => tag.tag);
        }

        // Query images that contain any of the provided or randomly selected tags
        const images = await Image.find({
            tags: { $in: tagValues }
        });

        return images;
    } catch (error) {
        console.error("Error fetching images by tags:", error);
        throw error;  // Rethrow or handle as needed
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

