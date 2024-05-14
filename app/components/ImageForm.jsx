"use client"; 

import React, { useState, useRef, useEffect } from 'react';
import {useFormState} from "react-dom"; 
import { usePathname } from 'next/navigation';

import ImageTag from './ImageTag';
import {addNewImage, updateImage} from '../_actions/images';

function ImageForm({image}) {
    const [imageUrl, setImgUrl] = useState(null);
    const [tags, setTags] = useState([]);
    const [currentTagValue, setCurrentTagValue] = useState(null);
    const [file, setFile] = useState(null); 
    const [isLoading, setIsLoading] = useState(false); 
    const [error, setError] = useState(""); 
    const [state, formAction] = useFormState(image ? updateImage : addNewImage, {})     
    const fileInputRef = useRef("");
    const imageName = useRef(""); 
    const path= usePathname(); 

    useEffect(()=>{
        if(image){
            setImgUrl(image.imageUrl)
            setTags(image.tags)
            imageName.current.value = image.name
        }
    }, [image])

    const handleImageChange = async (e) => {
        setError(null); 
        const newFile = e.target.files[0]; // Works for both drag and drop and manual file selection
        if(newFile && newFile.size > 10 * 1024 * 1024){
            setError("Image file exceeds the authorize size"); 
            return; 
        }
        processImage(newFile);
    };

    const processImage = async (file) => {
        setIsLoading(true);
        setFile(file)

        //get image as arrayBuffer; 
        const reader = new FileReader();
        reader.onload = function(e) {
            const imageUrl = e.target.result
            setImgUrl(imageUrl); 
            setIsLoading(false); 
        };
    
        reader.readAsDataURL(file);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const droppedFiles = e.dataTransfer.files;
        if (droppedFiles.length) {
            const file = droppedFiles[0];
            // Manually set the MIME type if not provided
            if (!file.type || file.type === 'application/octet-stream') {
                const fileName = file.name.toLowerCase();
                if (fileName.endsWith('.png')) {
                    file.type = 'image/png';
                } else if (fileName.endsWith('.jpg') || fileName.endsWith('.jpeg')) {
                    file.type = 'image/jpeg';
                } // Add other file type checks as needed
            }
            fileInputRef.current.files = droppedFiles; // Update the file input's files
            handleImageChange({ target: { files: droppedFiles } });
        }
    }
    const handleClick = (e) => {
        e.preventDefault(); 
        e.stopPropagation();
        fileInputRef.current.click(); //simulate a click on the image input when user clicks anywhere in the drop zone
    };
    const handleDeleteTag = (tag) =>{
        setTags(prevTags => prevTags.filter(t => t !== tag))
    }
    
    const handleAddTag = (e) =>{
        if(e.key === "Enter" && currentTagValue.trim()){
            if(tags.length < 6){
                setTags(prevTags => [...prevTags, currentTagValue]); 
                setCurrentTagValue("");
            }  
        }
    } 
    const handleTagInputChange = (e) =>{
        setCurrentTagValue(e.target.value); 
    }
    
 
    return (
        <form action={formAction} className='w-full' onKeyPress={(e)=>{if(e.key === "Enter")e.preventDefault()}}>
        <div className="grid grid-cols-2 gap-4 h-[80vh]">
        <div>
        <div
    className='dropZone w-full p-4 border border-white text-white rounded-md flex items-center justify-center flex-col relative gap-2 h-full'
    onDrop={handleDrop}
    onDragOver={(e) => e.preventDefault()}
>
    <input
        ref={fileInputRef}
        onChange={handleImageChange}
        type="file"
        className="absolute opacity-0 cursor-pointer" // Invisible but functional
        style={{ top: 0, left: 0 }}
        name='image'
    />
    
    {!imageUrl && !isLoading && !error && <p className='text-[0.85rem]'>Drop your image here or click to select</p>}
    {!imageUrl && !isLoading && !error && <button className='text-[0.85rem] bg-slate-500 text-white px-2 py-1 rounded-md' onClick={handleClick}>choose a file</button>}

    {imageUrl && !isLoading && !error && <img className='w-full h-full absolute inset-0 object-cover rounded-md' src={imageUrl} alt="selectedImage"/>}
    {isLoading && !error && <p>Image loading...</p>}
    {error && <p>{error}</p>}
</div>

        {imageUrl && !isLoading && !error && <button className='text-[0.85rem] px-2 py-1 rounded-md' onClick={handleClick}>choose a file</button>}
        </div>
        <div className="form-inputs flex flex-col justify-between p-4 bg-slate-300 rounded-md h-full">
        <div className="form-upper-part flex flex-col gap-4">
            <h2 className='uppercase text-[1.5rem]'>{path.includes("newimage")?"Add new image" : "Edit Image"}</h2>
            <div className='imageName flex flex-col'>
                <label htmlFor="name">Name</label>
                <input
                ref={imageName}
                name="name"
                required
                className="rounded-md w-full p-2 focus:outline-none focus:border-none" type="text" id='name'/>
            </div>
            <div className="tags-input">
            <label id="tags">Tags</label>
            <div className='addTags flex items-center gap-2 p-2 rounded-md bg-white w-full'>
            <div className='flex gap-2'>
                {tags.length > 0 && tags.map(tag =>(
                    <ImageTag onClick={handleDeleteTag} tag={tag} key={tag+Date.now()}/>
                ))}
            </div>
            <input
                type="text"
                placeholder="Add a tag and press Enter"
                value={currentTagValue}
                onChange={handleTagInputChange}
                onKeyPress={handleAddTag}
                className='w-full rounded-md border-none focus:outline-none focus:border-none'
            />
            <input
            name="tags"
            type="hidden"
            value={JSON.stringify(tags)} />

            {image && <input
            type="hidden"
            name="imageId"
            value={image._id}/>}
            </div>
            </div>
        </div>
             
            <button type='submit' className="p-2 bg-black rounded-md text-white">Submit</button>
            </div>
            </div>
        </form>
    );
}

export default ImageForm;
