"use client";
import React, { useEffect, useState } from 'react';
import MasonryGrid from '@/app/components/MasonryGrid/MasonryGrid';
import { useRouter } from 'next/navigation';
import { getCollectionById, deleteCollection, removeImageFromCollection } from '@/app/_actions/collection';
import { getImagesByIds } from '@/app/_actions/images';

const CollectionImages = ({ params }) => {
    const [images, setImages] = useState([]);
    const [collectionName, setCollectionName] = useState('');
    const [collectionDescription, setCollectionDescription] = useState("");
    const collectionId = params.id;
    const router = useRouter();

    useEffect(() => {
        const fetchCollectionDetails = async () => {
            try {
                const result = await getCollectionById(collectionId);
                if (result.success) {
                    const collection = result.collection;
                    setCollectionName(collection.name);
                    setCollectionDescription(collection.description);

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
                router.push('/collections'); // Redirect to home or collections list
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

    const handleRemoveImage = async (collectionId, imageId) => {
        try {
            const result = await removeImageFromCollection(collectionId, imageId);
            if (result.success) {
                console.log('Image removed from collection successfully');
                setImages(prevImages => prevImages.filter(image => image._id !== imageId));
            } else {
                console.error('Failed to remove image from collection:', result.message);
            }
        } catch (error) {
            console.error('An error occurred while removing the image from the collection:', error);
        }
    };

    return (
        <div>
            <div className='flex items-center justify-between my-4 border-b-2 border-b-black'>
                <h2 className="text-lg uppercase">{collectionName}</h2>
                <button className="text-red-600 hover:text-red-500 cursor-pointer text-sm" onClick={handleDeleteCollection}>Delete Collection</button>
            </div>
            <div className='description'>
                <p>Description</p>
                <p>{collectionDescription}</p>
            </div>
            <button className=" mb-4 hover:text-gray-200 my-4 text-xs" onClick={() => router.back()}>Back to Collections</button>
            <MasonryGrid
                images={images}
                collectionMode={true}
                handleRemoveImage={handleRemoveImage}
                collectionId={collectionId}
            />
        </div>
    );
};

export default CollectionImages;
