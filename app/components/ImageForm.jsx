"use client"; 

import React, { useState, useRef, useEffect } from 'react';
import {useFormState} from "react-dom"; 

import ImageTag from './ImageTag';
import {addNewImage, updateImage} from '../_actions/images';

function ImageForm({image}) {
    const [imageUrl, setImgUrl] = useState(null);
    const [tags, setTags] = useState([]);
    const [currentTagValue, setCurrentTagValue] = useState("");
    const [file, setFile] = useState(null); 
    const [isLoading, setIsLoading] = useState(false); 
    const [state, formAction] = useFormState(image ? updateImage : addNewImage, {})     
    const fileInputRef = useRef(null);
    const imageName = useRef(null); 

    useEffect(()=>{
        if(image){
            setImgUrl(image.imageUrl)
            setTags(image.tags)
            imageName.current.value = image.name
        }
    }, [image])

    const handleImageChange = async (e) => {
        const newFile = e.target.files[0]; // Works for both drag and drop and manual file selection
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
            processImage(e.dataTransfer.files[0]);
        }
    };

    const handleClick = (e) => {
        e.stopPropagation();
        fileInputRef.current.click(); //simulate a click on the image input when user clicks anywhere in the drop zone
    };
    const handleDeleteTag = (tag) =>{
        setTags(prevTags => prevTags.filter(t => t !== tag))
    }
    
    const handleAddTag = (e) =>{
        if(e.key === "Enter" && currentTagValue.trim()){
            setTags(prevTags => [...prevTags, currentTagValue]); 
            setCurrentTagValue("");  
        }
    } 
    const handleTagInputChange = (e) =>{
        setCurrentTagValue(e.target.value); 
    }
    
 
    return (
        <form action={formAction} className='w-[700px]' onKeyPress={(e)=>{if(e.key === "Enter")e.preventDefault()}}>
            <div 
                className='dropZone w-full h-[400px] p-4 border border-slate-950 rounded-md flex items-center justify-center cursor-pointer relative' 
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
            >   
                <input
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    type="file"
                    className="absolute opacity-0 w-full h-full cursor-pointer" // Invisible but functional
                    style={{ top: 0, left: 0}}
                    name='image'
                />
                {!imageUrl && !isLoading && <p>Drop your image here or click to select</p>}
                {imageUrl && !isLoading && <img className='w-full h-full object-cover rounded-md' src={imageUrl} alt="image"/>}
                {isLoading && <p>Image loading...</p>}
            </div>
            <div className='imageName flex flex-col py-3'>
                <label htmlFor="name">Name</label>
                <input
                ref={imageName}
                name="name"
                required
                className="border border-slate-950 rounded-md w-full p-2" type="text" id='name'/>
            </div>
            <div className=' addTags border border-slate-950 rounded-md p-2 flex'>
            <div className='flex'>
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
                className='focus:border-none w-full'
            />
            <input
            type="hidden"
            name="tags"
            value={JSON.stringify(tags)} />
            {image && <input
            type="hidden"
            name="imageId"
            value={image._id}/>}
            </div> 
            <button type='submit'>Submit</button>
        </form>
    );
}

export default ImageForm;
