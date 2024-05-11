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
                        const collectionsWithImages = await Promise.all(result.collections.map(async (collection) => {
                            const image = collection.images[0] 
                                ? await getImageById(collection.images[0]) : "";

                            let imageUrl = image.imageCardUrl
                            return { ...collection, imageUrl};
                        }));
                        console.log('Collections fetched with images:', JSON.stringify(collectionsWithImages, null, 2));
                        setCollections(collectionsWithImages);
                    }
                } catch (error) {
                    console.error("Failed to fetch collections", error);
                }
            }
        };

        if (status === "authenticated") {
            fetchCollections();
        }
    }, [status, session]);

    const handleCollectionClick = (collectionId) => {
        router.push(`/collections/${collectionId}`);
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
            {collections.length === 0 ? (
                <p className="text-center text-gray-500">No collections available.</p>
            ) : (
                collections.map((collection) => (
                    <div
                        key={collection._id}
                        className="relative bg-cover bg-center h-48 rounded-lg cursor-pointer transform transition-transform duration-200 hover:scale-105"
                        style={{ backgroundImage: `url(${collection.imageUrl})` }}
                        onClick={() => handleCollectionClick(collection._id)}
                    >
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                            <p className="text-white text-lg font-semibold text-center px-2">{collection.name}</p>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default CollectionsGrid;


