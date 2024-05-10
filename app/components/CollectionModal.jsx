"use client";
import React, { useEffect, useState } from 'react';
import { getCollections, createCollection, addImageToCollection } from '../_actions/collection';
import { useSession } from 'next-auth/react';
import PreviousMap from 'postcss/lib/previous-map';

function CollectionModal() {
    const [collections, setCollections] = useState([]);
    const [newCollectionName, setNewCollectionName] = useState('');
    const { data: session, status } = useSession();

    useEffect(() => {
        const getUserCollections = async () => {
            if (status === "authenticated" && session) {
                try {
                    const result = await getCollections(session.user.id);

                    if (result.success) {
                        setCollections(result.collections);
                    }
                } catch (error) {
                    console.error("Failed to fetch collections", error);
                }
            }
        };

        getUserCollections();
    }, [session]);

    const handleAddImage = async (collectionId) => {
        const imageId = window.location.pathname.split('/').pop(); // Extract imageId from URL

        try {
            const result = await addImageToCollection(collectionId, imageId);

            if (result.success) {
                console.log('Image added to collection successfully!');
            } else {
                console.log('Failed to add image to collection: ' + result.message);
            }
            return;
        } catch (error) {
            console.log('Error adding image to collection:', error);
            return;
        }
    };

    const handleCreateCollection = async () => {
        try {
            const result = await createCollection(session.user.id, newCollectionName);

            if (result.success) {
                setCollections([...collections, result.collection]);
                setNewCollectionName('');
                document.getElementById('create_collection_modal').close();
                alert('Collection created successfully!');
            } else {
                alert('Failed to create collection: ' + result.message);
            }
        } catch (error) {
            console.error('Error creating collection:', error);
            alert('Error creating collection');
        }
    };

    return (
        <>
            <button className="btn" onClick={() => document.getElementById('my_modal_3').showModal()}>Add to collection</button>
            <dialog id="my_modal_3" className="modal">
                <div className="modal-box">
                    <form method="dialog">
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>
                    <h3 className="font-bold text-lg">Collections</h3>
                    {collections.length === 0 ? (
                        <div>
                            <p className="py-4">No collections found. Create one below:</p>
                            <button className="btn" onClick={() => document.getElementById('create_collection_modal').showModal()}>Create Collection</button>
                        </div>
                    ) : (
                        <div className="collections-list">
                            {collections.map((collection) => (
                                <div key={collection._id} className="collection-item" onClick={() => handleAddImage(collection._id, session.user.id)}>
                                    <img src={""} alt={collection.name} className="collection-image w-4 h-4 cover" />
                                    <p className="collection-name">{collection.name}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </dialog>

            <dialog id="create_collection_modal" className="modal">
                <div className="modal-box">
                    <form method="dialog">
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>
                    <h3 className="font-bold text-lg">Create New Collection</h3>
                    <div className="py-4">
                        <input
                            type="text"
                            value={newCollectionName}
                            onChange={(e) => setNewCollectionName(e.target.value)}
                            placeholder="Collection Name"
                            className="input input-bordered w-full"
                        />
                    </div>
                    <button className="btn btn-primary" onClick={handleCreateCollection}>Create</button>
                </div>
            </dialog>
        </>
    );
}

export default CollectionModal;




