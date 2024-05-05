import { z } from 'zod';

const ImageSchema = z.object({
    imageFile: z.instanceof(File, { message: "A file must be uploaded." })
        .refine(file => file.size <= 1024 * 1024 * 20, { message: "File must be no larger than 5MB." }) // Example size limit
        .refine(file => ['image/jpeg', 'image/png'].includes(file.type), { message: "Only JPEG and PNG formats are allowed." }),
    imageName: z.string().min(1, { message: "Name is required." })
});

export default ImageSchema;
