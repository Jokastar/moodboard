"use client";
import React, { useState, useEffect } from 'react';
import {useRouter } from 'next/navigation';
import DisplayImage from '../components/DisplayImage';
import { getImageById } from '../_actions/images';

function ImageInfo({params}) {
    const [image, setImage] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();
    const imageId = params.id
    
   
    useEffect(() => {
        async function fetchImage() {
            try {
                const image = await getImageById(imageId);
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
    }, [imageId]); // Dependency array: React re-runs the effect if `id` changes

    if (error) {
        return <div>{error}</div>; // Display error if any
    }

    if (!image) {
        return <div>Loading...</div>; // Loading state if image not yet fetched
    }

    return (
        <div>
            <button onClick={() => router.back()}>Go Back</button> {/* Go Back button */}
            <DisplayImage image={image} imageId={imageId} />
        </div>
    );
}

export default ImageInfo;
