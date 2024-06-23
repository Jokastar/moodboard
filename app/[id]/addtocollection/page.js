"use client";
import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { getImageById } from '@/app/_actions/images';
import { addImageToCollection, createCollection } from "../../_actions/collection";
import { useFormState } from "react-dom";
import useCollections from '@/app/hooks/useCollections';

function AddToCollection({ params }) {
    const { data: session } = useSession();
    const imageId = params.id;
    const { collections, isLoading, error } = useCollections(session?.user?.id);

    const [image, setImage] = useState(null);
    const [loadingImage, setLoadingImage] = useState(false);
    const [collectionFormPage, setCollectionFormPage] = useState(0);

    useEffect(() => {
        const fetchImage = async () => {
            setLoadingImage(true);
            const imageData = await getImageById(imageId);
            setImage(imageData);
            setLoadingImage(false);
        };

        fetchImage();
    }, [imageId]);

    if (error) return <p>An error occurred: {error}</p>;
    if (isLoading || loadingImage) return <p>Loading...</p>;

    return (
        <div className='flex flex-col gap-4'>
            <div className='grid grid-cols-2 h-[80vh]'>
                <div className='image-container w-full h-full rounded-sm flex items-center justify-center bg-black'>
                    <img src={image?.imageUrl} alt={image?.name} className="object-cover" />
                </div>
                <div className='form-container w-full h-full rounded-sm p-5 bg-[var(--light-gray)] relative font-favorit-light-c'>
                    <h2 className='uppercase text-[1.25rem] font-favorit-c'>{collectionFormPage === 0 ? "Add to collection" : "Create collection"}</h2>
                    {collectionFormPage === 0 ? (
                        collections.length > 0 ? (
                            <>
                                {collections.map(collection => (
                                    <CollectionRow collection={collection} imageId={imageId} key={collection._id} />
                                ))}
                                <button
                                    className='uppercase px-4 py-2 bg-black text-white w-[92%] rounded-lg absolute bottom-[20px]'
                                    onClick={() => setCollectionFormPage(1)}
                                >
                                    Create collection
                                </button>
                            </>
                        ) : (
                            <div className='flex flex-col items-center justify-center h-full'>
                                <p className='text-center'>No collections created</p>
                                <button
                                    className='uppercase px-6 py-4 bg-black text-white mt-4 rounded-sm text-xs'
                                    onClick={() => setCollectionFormPage(1)}
                                >
                                    Create collection
                                </button>
                            </div>
                        )
                    ) : (
                        <CreateCollectionForm handleCollectionFormPage={setCollectionFormPage} userId={session.user.id} imageId={imageId} />
                    )}
                </div>
            </div>
        </div>
    );
}

function CollectionRow({ collection, imageId }) {
    const [error, setError] = useState(false);
    const [saved, setSaved] = useState(false);

    const handleClick = async () => {
        setError(false);
        try {
            const { success } = await addImageToCollection(collection._id, imageId);
            if (success) {
                setSaved(true);
            } else {
                setError(true);
            }
        } catch (e) {
            setError(true);
        }
    };

    return (
        <div className='flex justify-between items-center p-4 border-b border-black'>
            <div className='collectionInfos flex items-center gap-4'>
                <div className='noOfPhotos rounded-[50%] bg-black text-white w-[20px] h-[20px] flex items-center justify-center text-[10px]'>
                    <span>{collection.images.length}</span>
                </div>
                <p>{collection.name}</p>
            </div>
            <button
                className={`px-4 py-2 rounded-lg text-white ${saved ? 'bg-green-500' : 'bg-black'}`}
                onClick={handleClick}
                disabled={saved}
            >
                {saved ? 'Saved' : 'Save'}
            </button>
            {error && <p className='text-red-500 text-[0.85rem]'>An error occurred, please retry.</p>}
        </div>
    );
}

function CreateCollectionForm({ handleCollectionFormPage, userId, imageId }) {
    const [state, formAction] = useFormState(createCollection, {});

    useEffect(() => {
        if (state.success) {
            handleCollectionFormPage(0);
        }
    }, [state.success, handleCollectionFormPage]);

    return (
        <form action={formAction} className="flex flex-col justify-evenly">
    <div className="mb-4">
        <label className="block text-black mb-2 bg-transparent" htmlFor="name">
            Name
        </label>
        <input
            id="name"
            name="name"
            type="text"
            className="border-b border-b-[var(--black)] bg-transparent w-full py-2 text-black leading-tight focus:outline-none focus:shadow-outline"
            required
        />
    </div>
    <div className="mb-4">
        <label className="block text-black mb-2 bg-transparent" htmlFor="description">
            Description
        </label>
        <textarea
            id="description"
            name='description'
            className="border-b border-b-[var(--black)] w-full py-2 bg-transparent text-black leading-tight focus:outline-none focus:shadow-outline"
            required
        />
    </div>
    <input name="userId" value={userId} id="userId" type="hidden" />
    <input name="imageId" value={imageId} id="imageId" type="hidden" />
    <div className="flex items-center justify-between">
        <button
            type="button"
            onClick={() => handleCollectionFormPage(0)}
            className="bg-gray-500 hover:bg-gray-700 text-white py-2 px-4 rounded-sm focus:outline-none focus:shadow-outline"
        >
            Back
        </button>
        <button
            type="submit"
            className="bg-black text-white py-2 px-4 rounded-sm w-[120px] focus:outline-none focus:shadow-outline"
        >
            Create
        </button>
    </div>
</form>

    );
}

export default AddToCollection;


