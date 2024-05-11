"use client";
import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getCollectionById, deleteCollection } from '@/app/_actions/collection';
import { getImagesByIds } from '@/app/_actions/images';

const CollectionImages = () => {
    const [images, setImages] = useState([]);
    const [collectionName, setCollectionName] = useState('');
    const collectionId = usePathname().split("/")[2];  
    const router = useRouter();

    useEffect(() => {
        const fetchCollectionDetails = async () => {
            try {
                const result = await getCollectionById(collectionId);
                if (result.success) {
                    const collection = result.collection;
                    setCollectionName(collection.name);

                    if (collection.images.length > 0) {
                        const imagesResult = await getImagesByIds(collection.images);
                        setImages(imagesResult);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch collection details", error);
            }
        };

        if (collectionId) {
            fetchCollectionDetails();
        }
    }, [collectionId]);

    const handleDeleteCollection = async () => {
        try {
            const result = await deleteCollection(collectionId);
            if (result.success) {
                alert('Collection deleted successfully!');
                router.push('/'); // Redirect to home or collections list
            } else {
                alert('Failed to delete collection: ' + result.message);
            }
        } catch (error) {
            console.error('Error deleting collection:', error);
            alert('Error deleting collection');
        }
    };

    const handleImageClick = (imageId) => {
        router.push(`/${imageId}`);
    };

    return (
        <div className="p-4">
            <button className="btn btn-primary mb-4" onClick={() => router.back()}>Back to Collections</button>
            <h2 className="text-2xl font-bold mb-4">{collectionName}</h2>
            <button className="btn btn-danger mb-4" onClick={handleDeleteCollection}>Delete Collection</button>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {images.length === 0 ? (
                    <p className="text-center text-gray-500">No images available.</p>
                ) : (
                    images.map((image) => (
                        <div key={image._id} className="bg-gray-200 p-4 rounded-lg">
                            <img
                                src={image.imageCardUrl}
                                alt={image.title}
                                className="w-full h-auto rounded-lg cursor-pointer"
                                onClick={() => handleImageClick(image._id)}
                            />
                            <p className="text-center mt-2">{image.title}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default CollectionImages
