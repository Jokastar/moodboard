"use client";
import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import ImageCard from '../components/ImageCard';
import { getImageById } from '../_actions/images';


function ImageInfo() {
    const [image, setImage] = useState(null);
    const [error, setError] = useState(null);
    const pathname = usePathname();
    const id = pathname.replace(/\//g, ''); // Clean the pathname to get the ID

    useEffect(() => {
        async function fetchImage() {
            try {
                const image = await getImageById(id);
                if (!image) {
                    setError("Image not found");
                } else {
                    setImage(image);
                }
            } catch (err) {
                setError("An error occurred while fetching the image");
                console.error(err);
            }
        }

        fetchImage(); // Call the async function inside the useEffect
    }, [id]); // Dependency array: React re-runs the effect if `id` changes

    if (error) {
        return <div>{error}</div>; // Display error if any
    }

    if (!image) {
        return <div>Loading...</div>; // Loading state if image not yet fetched
    }

    return (
        <div>
            <ImageCard image={image} imageId={id} /> 
        </div>
    );
}

export default ImageInfo;
