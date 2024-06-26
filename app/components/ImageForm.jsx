"use client";

import React, { useState, useRef, useEffect } from 'react';
import ImageTag from './ImageTag';
import { getImageTagsfromChatGPT } from '../_actions/images';
import { useFormState } from "react-dom";
import { usePathname } from 'next/navigation';
import { addNewImage, updateImage } from '../_actions/images';
import { v4 as uuidv4 } from 'uuid';

function ImageForm({ image }) {
    const [imageUrl, setImgUrl] = useState(null);
    const [tags, setTags] = useState([]);
    const [currentTagValue, setCurrentTagValue] = useState('');
    const [file, setFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [state, formAction] = useFormState(image ? updateImage : addNewImage, {})
    const fileInputRef = useRef(null);
    const imageName = useRef(null);
    const path = usePathname();

    useEffect(() => {
        if (image) {
            setImgUrl(image.imageUrl);
            setTags(image.tags.map(tag => ({ id: uuidv4(), tag })));
            imageName.current.value = image.name;
        }
    }, [image]);

    const handleImageChange = async (e) => {
        setError(null);
        const newFile = e.target.files[0];
        console.log(newFile); 
    
        if (!newFile) {
            setError("No file selected");
            return;
        }
        
        if (newFile.size > 1 * 1024 * 1024) {
            setError("Image file exceeds the authorized size (1MB)");
            return;
        }
    
        // Check file type
        const allowedTypes = ['image/png', 'image/jpeg', 'image/gif', 'image/webp'];
        if (!allowedTypes.includes(newFile.type)) {
            setError("Unsupported file format. Please select PNG, JPEG, GIF, or WebP.");
            return;
        }
    
        await processImage(newFile);
    };
    

    const processImage = async (file) => {
        setIsLoading(true);
        setFile(file);

        const reader = new FileReader();
        reader.onload = async function (e) {
            const imageUrl = e.target.result;
            setImgUrl(imageUrl);
            const imageTags = await getImageTagsfromChatGPT(imageUrl);
            if (!imageTags) {
                setIsLoading(false);
                return;
            }
            const newTags = imageTags.map(tag => ({ id: uuidv4(), tag }));
            setTags(newTags);
            setIsLoading(false);
        };

        reader.readAsDataURL(file);
    };

    const handleDrop = async (e) => {
        e.preventDefault();

    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length) {
        const file = droppedFiles[0];

        fileInputRef.current.files = droppedFiles;
        await handleImageChange({ target: { files: droppedFiles } });
    }
    }

    const handleClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        fileInputRef.current.click();
    };

    const handleDeleteTag = (id) => {
        setTags(prevTags => prevTags.filter(t => t.id !== id));
    }

    const handleAddTag = (e) => {
        if (e.key === "Enter" && currentTagValue.trim()) {
            let id = uuidv4();
            setTags(prevTags => [...prevTags, { tag: currentTagValue.trim(), id: id }]);
            setCurrentTagValue('');
        }
    }

    const handleTagInputChange = (e) => {
        setCurrentTagValue(e.target.value);
    }

    return (
        <form action={formAction} className='w-full' onKeyPress={(e) => { if (e.key === "Enter") e.preventDefault() }}>
            <div className="grid grid-cols-2 h-[80vh] font-favorit-light-c">
                <div>
                    <div
                        className='dropZone w-full p-4 bg-[var(--black)] text-white rounded-sm flex items-center justify-center flex-col relative gap-2 h-full'
                        onDrop={handleDrop}
                        onDragOver={(e) => e.preventDefault()}
                    >
                        <input
                            ref={fileInputRef}
                            onChange={handleImageChange}
                            type="file"
                            className="absolute opacity-0 cursor-pointer"
                            style={{ top: 0, left: 0 }}
                            name='image'
                        />
                        {!imageUrl && !isLoading && !error && <p className='text-[0.85rem]'>Drop your image here or click to select</p>}
                        {error && <p className='text-[0.85rem] text-red'>{error}</p>}
                        {!imageUrl && !isLoading && <button className='text-[0.85rem] bg-[var(--black)] text-white p-2 rounded-sm border border-white' onClick={handleClick}>choose a file</button>}
                        {imageUrl && !isLoading && !error && <img className='object-contain max-w-full max-h-[70vh] rounded-sm' src={imageUrl} alt="selectedImage" />}
                        {isLoading && !error && <p>Image loading...</p>}
                        
                    </div>
                </div>
                <div className="form-inputs flex flex-col justify-between p-6 bg-[var(--dark-gray)] rounded-sm h-full">
                    <div className="form-upper-part flex flex-col gap-6">
                        <h2 className='uppercase text-[1.2rem] font-favorit-c'>{path.includes("newimage") ? "Add new image" : "Edit Image"}</h2>
                        <div className='imageName flex flex-col border-b border-b-[var(--black)]'>
                            <label htmlFor="name">Name</label>
                            <input
                                ref={imageName}
                                name="name"
                                required
                                className="w-full bg-transparent py-2 focus:outline-none focus:border-none" type="text" id='name' />
                        </div>
                        <div className="tags-input">
                            <label id="tags">Tags</label>
                            <div className='addTags flex flex-col gap-2 py-2 bg-transparent border-b border-b-[var(--black)] w-full'>
                                <input
                                    type="text"
                                    placeholder="Add a tag and press Enter"
                                    value={currentTagValue}
                                    onChange={handleTagInputChange}
                                    onKeyPress={handleAddTag}
                                    className='w-full bg-transparent border-none focus:outline-none focus:border-none'
                                />
                                <div className='flex gap-2 flex-wrap'>
                                    {tags.length > 0 && tags.map(tag => (
                                        <ImageTag onClick={handleDeleteTag} tag={tag.tag} key={tag.id} id={tag.id} />
                                    ))}
                                </div>
                                <input
                                    name="tags"
                                    type="hidden"
                                    value={JSON.stringify(tags.map(t => t.tag))} />
                                {image && <input
                                    type="hidden"
                                    name="imageId"
                                    value={image?._id} />}
                            </div>
                        </div>
                        {imageUrl && !isLoading && !error && <button className='text-[0.85rem] p-2  rounded-sm  text-black my-4 w-[120px] border border-[var(--black)]' onClick={handleClick}>change image</button>}
                    </div>
                    <button type='submit' className="p-2 bg-black rounded-md text-white">Submit</button>
                </div>
            </div>
        </form>
    );
}

export default ImageForm;

