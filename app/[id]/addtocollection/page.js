"use client"; 
import React, {useState} from 'react';
import { useSession } from 'next-auth/react';
import { getImageById} from '@/app/_actions/images';
import {addImageToCollection, createCollection} from "../../_actions/collection" 
import {useFormState, useFormStatus} from "react-dom"; 
import useCollections from '@/app/hooks/useCollections';

function AddToCollection({ params }) {
    const { data: session } = useSession();
    const imageId = params.id;
    const { collections, isLoading, error } = useCollections(session?.user?.id);

    const [image, setImage] = useState(null);
    const [loadingImage, setLoadingImage] = useState(false);
    const [collectionForm, setCollectionForm] = useState(0); 

    const handleCreateCollection = () =>{

    }

    React.useEffect(() => {
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
        <div className='grid grid-cols-2 gap-4 h-[80vh]'>
            <div className='image-container w-full h-full rounded-lg flex items-center justify-center border border-white'>
                <img src={image?.imageUrl} alt={image?.name} className="cover"/>
            </div>
            <div className='form-container w-full h-full rounded-lg p-5 border border-white bg-slate-300 relative'>
                <h2 className='uppercase text-[1.25rem]'>{collectionForm == 0 ? "Add to collection" : "create collection"}</h2>
                {collectionForm == 0 ? collections.map(collection => (
                    <>
                    <CollectionRow collection={collection} imageId={imageId} key={collection._id} />
                    
                    <button className='uppercase px-4 py-2 bg-black text-white w-[92%] rounded-lg absolute bottom-[20px]' onClick={()=>setCollectionForm(1)}>create collection</button>
                    </>
                )) : <CreateCollectionForm handleCollectionForm={setCollectionForm} userId={session.user.id} imageId={imageId}/>
            }
            </div>
        </div>
        </div>
    );
}


function CollectionRow({ collection, imageId }) {
    const [error, setError] = useState(false);
    const [saved, setSaved] = useState(false);

    const handleClick = async () => {
        setError(false); // Reset error state before attempting the action
        try {
            const { success } = await addImageToCollection(collection._id, imageId);
            if (success) {
                setSaved(true); // Update the saved state if the operation was successful
            } else {
                setError(true); // Set error state if the operation was not successful
            }
        } catch (e) {
            setError(true); // Set error state if there was an exception
        }
    };

    return (
        <div className='flex justify-between items-center p-4 border-b border-black'>
            <div className='collectionInfos flex items-center gap-4'>
                <div className='noOfPhotos rounded-[50%] bg-black text-white w-[24px] h-[24px]'>
                    {""}
                </div>
                <p>{collection.name}</p>
            </div>
            <button
                className={`px-4 py-2 rounded-lg text-white ${saved ? 'bg-green-500' : 'bg-black'}`}
                onClick={handleClick}
                disabled={saved} // Disable the button if the image is already saved
            >
                {saved ? 'Saved' : 'Save'}
            </button>
            {error && <p className='text-red-500 text-[0.85rem]'>An error occurred, please retry.</p>}
        </div>
    );
}

function CreateCollectionForm({handleCollectionForm, userId, imageId}){
    const [state, formAction] = useFormState(createCollection, {}); 

    if(state.success){
        handleCollectionForm(0); 
    }
    return(
        <form action={formAction}>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2" htmlFor="name">
                        Name
                    </label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2" htmlFor="description">
                        Description
                    </label>
                    <textarea
                        id="description"
                        name='description'
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                </div>
                <input name="userId" value={userId} id="userId" type="hidden"/>
                <input name="imageId" value={imageId} id="imageId" type="hidden"/>
                <div className="flex items-center justify-between">
                    
                    <button
                        type="button"
                        onClick={()=> handleCollectionForm(0)}
                        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Back
                    </button>
                    <button
                        type="submit"
                        className="bg-black text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Create
                    </button>
                </div>
            </form>
    )
}


export default AddToCollection;

