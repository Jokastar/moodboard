"use client"; 

import React, { useState, useRef, useEffect } from 'react';
import {useFormState} from "react-dom"; 

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

        if (e.dataTransfer.files.length) {
            fileInputRef.file = e.dataTransfer.files[0]; 
            processImage(e.dataTransfer.files[0]);
        }
    };

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
        <div className="w-full flex items-start">
        <form action={formAction} className='w-[40%]' onKeyPress={(e)=>{if(e.key === "Enter")e.preventDefault()}}>
        <div 
                className='dropZone w-full h-[250px] p-4 my-4 border border-white text-white rounded-md flex items-center justify-center flex-col relative gap-2' 
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
            >   
                <input
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    type="file"
                    className="absolute opacity-0 cursor-pointer" // Invisible but functional
                    style={{ top: 0, left: 0}}
                    name='image'
                />
                
                {!imageUrl && !isLoading && !error && <p className='text-[0.85rem]'>Drop your image here or click to select</p>}
                {imageUrl && !isLoading && !error && <img className='w-full h-full object-cover rounded-md' src={imageUrl} alt="image"/>}
                {isLoading && !error && <p>Image loading...</p>}
                {error && <p>{error}</p>}
        </div>
        <div className="form-input text-white  flex flex-col gap-4">
        {!isLoading && !error && <button onClick={handleClick} className='p-1 bg-slate-700 text-[0.85rem] rounded-md text-white w-[100px]'>choose file</button>}
            <div className='imageName flex flex-col'>
                <label htmlFor="name">Name</label>
                <input
                ref={imageName}
                name="name"
                required
                className="bg-[var(--background-color-dark)] border border-white rounded-md w-full p-2" type="text" id='name'/>
            </div>
            <div className="tags-input">
            <label id="tags">Tags</label>
            <div className='addTags flex items-center gap-2 p-2 bg-[var(--background-color-dark)] border border-white rounded-md w-full'>
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
                className='w-full rounded-md bg-[var(--background-color-dark)] border-none focus:outline-none focus:border-none'
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
            <button type='submit' className="p-2 bg-[var(--background-color-dark)]  border border-white rounded-md">Submit</button>
            </div>
        </form>
        </div>
    );
}

export default ImageForm;
