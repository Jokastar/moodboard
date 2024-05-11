"use client"; 

import React, {useEffect, useState} from 'react';
import { usePathname} from 'next/navigation';
import ImageForm from '@/app/components/ImageForm'
import { getImageById } from '@/app/_actions/images';
function EditImage() {
const [image, setImage] = useState("");
const [error, setError] = useState(""); 
const pathname = usePathname();
let id = pathname.split('/')[1];
useEffect(() => {
    async function fetchImage(id) {
        console.log(id); 
        try {
            const image = await getImageById(id);

            if (!image) {
                setError("Image not found");
            } else {
                setImage(image);
            }
        } catch (err) {
            setError("An error occurred while fetching the image");
            console.log(err);
        }
    }
    fetchImage(id); // Call the async function inside the useEffect
}, []); // Dependency array: React re-runs the effect if `id` changes

  if(error){
    return (
        <div>{error}</div>
    )
  }
  return (
    <ImageForm image={image}/>
  )
}

export default EditImage; 