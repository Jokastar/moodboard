"use client";
import React, { useEffect, useState } from 'react';
import { getCollectionsForModal, createCollection, addImageToCollection } from '../_actions/collection';
import { useSession } from 'next-auth/react';
import { useRef } from 'react';

function CollectionModal() {
    const [collections, setCollections] = useState([]);
    const [newCollectionName, setNewCollectionName] = useState('');
    const { data: session, status } = useSession();
    const createCollectionModalRef = useRef(null);
    const addToCollectionModalRef = useRef(null);

    useEffect(() => {
        const getUserCollections = async () => {
            if (status === "authenticated" && session) {
                try {
                    const result = await getCollectionsForModal(session.user.id);

                    if (result.success) {
                        setCollections(result.collections);
                    }
                } catch (error) {
                    console.error("Failed to fetch collections", error);
                }
            }
        };

        getUserCollections();
    }, [session, status]);

    const handleAddImage = async (collectionId) => {
        const imageId = window.location.pathname.split('/').pop(); // Extract imageId from URL

        try {
            const result = await addImageToCollection(collectionId, imageId);

            if (result.success) {
                console.log('Image added to collection successfully!');
                alert('Image added to collection successfully!');
            } else {
                console.log('Failed to add image to collection: ' + result.message);
                alert('Failed to add image to collection: ' + result.message);
            }
        } catch (error) {
            console.log('Error adding image to collection:', error);
            alert('Error adding image to collection');
        }
        addToCollectionModalRef.current.close();
    };

    const handleCreateCollection = async () => {
        try {
            const result = await createCollection(session.user.id, newCollectionName);

            if (result.success) {
                setCollections([...collections, result.collection]);
                setNewCollectionName('');
                createCollectionModalRef.current.close();
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
            <button onClick={() => addToCollectionModalRef.current.showModal()} className="bg-[#4f4f4f] hover:bg-[#383838] text-white rounded-lg">Add to collection</button>
            <dialog id="my_modal_3" className="modal" ref={addToCollectionModalRef}>
                <div className="modal-box bg-[var(--dark-gray)] text-white rounded-sm p-6">
                    <form method="dialog">
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>
                    <h3 className="font-bold text-lg">Collections</h3>
                    {collections.length === 0 ? (
                        <div>
                            <p className="py-4">No collections found. Create one below:</p>
                            <button className="btn" onClick={() => createCollectionModalRef.current.showModal()}>Create Collection</button>
                        </div>
                    ) : (
                        <div className="collections-list flex flex-col gap-4 py-4">
                            {collections.map((collection) => (
                                <div key={collection._id} className="collection-item cursor-pointer bg-[var(--black)] p-2 rounded-sm hover:bg-[var(--gray)]" onClick={() => handleAddImage(collection._id)}>
                                    <p className="collection-name">{collection.name}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </dialog>

            <dialog id="create_collection_modal" className="modal" ref={createCollectionModalRef}>
                <div className="modal-box bg-[var(--dark-gray)] text-white rounded-sm p-6">
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
                            className="input input-bordered w-full bg-transparent text-white border-[var(--black)]"
                        />
                    </div>
                    <button className="btn btn-primary bg-black border-none rounded-md" onClick={handleCreateCollection}>Create</button>
                </div>
            </dialog>
        </>
    );
}

export default CollectionModal;




