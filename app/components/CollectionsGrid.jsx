"use client";
import React, { useEffect, useState } from 'react';
import { getCollections } from '../_actions/collection';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { getImageById } from '../_actions/images';

const CollectionsGrid = () => {
    const [collections, setCollections] = useState([]);
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        const fetchCollections = async () => {
            if (status === "authenticated" && session) {
                try {
                    const result = await getCollections(session.user.id);
                    if (result.success) {
                        //add the imageUrl of the first image of each collection as a fields
                        const modifiedCollections = await Promise.all(result.collections.map(async (collection) => {
                            console.log(JSON.stringify(collection)); 
                            const image = collection.images[0] ? await getImageById(collection.images[0]) : "";

                            let imageUrl = image.imageCardUrl
                            return {...collection, imageUrl}; 
                        }));
                        console.log('Collections fetched with images:', JSON.stringify(modifiedCollections, null, 2));
                        setCollections(modifiedCollections);
                    }
                } catch (error) {
                    console.error("Failed to fetch collections", error);
                }
            }
        };

        if (status === "authenticated") {
            fetchCollections();
        }
    }, [status]);

    const handleCollectionClick = (collectionId) => {
        router.push(`/collections/${collectionId}`);
    };

    return (
        <>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full">
            {collections.length === 0 ? (
                <p className="text-cent">No collections available.</p>
            ) : (
                collections.map((collection) => (
                    <div
                        key={collection._id}
                        className="relative bg-cover bg-center h-[300px] rounded-sm cursor-pointer transform transition-transform duration-300 hover:scale-[1.02]"
                        style={{ backgroundImage: `url(${collection.imageUrl})` }}
                        onClick={() => handleCollectionClick(collection._id)}
                    >
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-sm">
                            <p className="text-md  text-white text-center px-2">{collection.name}</p>
                        </div>
                    </div>
                ))
            )}
        </div>
        </>
    );
};

export default CollectionsGrid;


