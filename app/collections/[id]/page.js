"use client";
import React, { useEffect, useState } from 'react';
import { useRouter} from 'next/navigation';
import { getCollectionById, deleteCollection, removeImageFromCollection } from '@/app/_actions/collection';
import { getImagesByIds } from '@/app/_actions/images';

const CollectionImages = ({params}) => {
    const [images, setImages] = useState([]);
    const [collectionName, setCollectionName] = useState('');
    const collectionId = params.id
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
                // Optionally update the state or UI to reflect the removal
            } else {
                console.error('Failed to remove image from collection:', result.message);
                // Optionally handle the error in the UI
            }
        } catch (error) {
            console.error('An error occurred while removing the image from the collection:', error);
            // Optionally handle the error in the UI
        }
    };
    

    return (
        <div>
            <div className='flex items-center justify-between my-4'>
                <h2 className="text-2xl text-white">{collectionName}</h2>
                <button className="text-red-600 hover:text-red-500 cursor-pointer" onClick={handleDeleteCollection}>Delete Collection</button>
            </div>
            <button className=" mb-4 text-white hover:text-gray-200 my-4" onClick={() => router.back()}>Back to Collections</button>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {images.length === 0 ? (
                    <p className="text-center text-gray-500">No images available.</p>
                ) : (
                    images.map((image) => (
                        <ImageCollectionCard
                        key={image._id}
                        image={image}
                        handleImageClick={handleImageClick}
                        handleRemoveImage={handleRemoveImage}
                        collectionId={collectionId}
                    />
                    ))
                )}
            </div>
        </div>
    );
};


const ImageCollectionCard = ({ image, handleImageClick, handleRemoveImage, collectionId }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    return (
        <div key={image._id} className="bg-gray-200 p-4 rounded-lg relative">
            <img
                src={image.imageCardUrl}
                alt={image.title}
                className="w-full h-auto rounded-lg cursor-pointer"
                onClick={() => handleImageClick(image._id)}
            />
            <p className="text-center mt-2">{image.title}</p>
            
            <div className="absolute top-2 right-2">
                <button onClick={toggleDropdown} className="text-white bg-black rounded-[50%] w-4 h-4 focus:outline-none">
                    .
                </button>
                {dropdownOpen && (
                    <div className="absolute right-4 top-2 bg-white border rounded-lg shadow-lg">
                        <button
                            onClick={() => handleRemoveImage(collectionId, image._id)}
                            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                        >
                            Remove
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};


export default CollectionImages
