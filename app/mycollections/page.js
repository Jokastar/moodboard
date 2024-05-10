"use client"; 

import React, { useEffect, useState } from 'react'; 
import { useSession } from 'next-auth/react';
import { getCollections } from '../_actions/collection';

function MyCollection() {
    const [collections, setCollections] = useState([]); 
    const { data: session, status } = useSession();

    useEffect(() => {
        const getUserCollections = async () => {
            if (status === "authenticated" && session) {
                try {
                    const userCollection = await getCollections(session.user.id);

                    if (userCollection.success) {
                        setCollections(userCollection.collections);
                    }
                } catch (error) {
                    console.error("Failed to fetch collections", error);
                }
            }
        };
        
        getUserCollections();
    }, [status, session]);

    return (
        <div>
            {collections.length > 0 ? (
                collections.map((collection) => (
                    <div key={collection.id}>{collection.name}</div>
                ))
            ) : (
                <div>No collections found</div>
            )}
        </div>
    );
}

export default MyCollection;
