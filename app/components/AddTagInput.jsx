import React, { useState } from 'react';
import ImageTag from './ImageTag';

function AddTagInput({ tags, setTags }) {
    const [currentTagValue, setCurrentTagValue] = useState("");

    const handleDeleteTag = (tag) => {
        setTags(prevTags => prevTags.filter(t => t !== tag));
    }

    const handleAddTag = (e) => {
        if (e.key === "Enter" && currentTagValue.trim()) {
            if (tags?.length < 6) {
                setTags(prevTags => [...prevTags, currentTagValue]);
                setCurrentTagValue("");
            }
        }
    }

    const handleTagInputChange = (e) => {
        setCurrentTagValue(e.target.value);
    }

    return (
        <div className="tags-input">
            <label id="tags">Tags</label>
            <div className='addTags flex items-center gap-2 p-2 rounded-md bg-transparent w-full'>
                <div className='flex gap-2'>
                    {tags?.length > 0 && tags.map(tag => (
                        <ImageTag onClick={handleDeleteTag} tag={tag} key={tag + Date.now()} />
                    ))}
                </div>
                <input
                    type="text"
                    placeholder="Add a tag and press Enter"
                    value={currentTagValue}
                    onChange={handleTagInputChange}
                    onKeyPress={handleAddTag}
                    className='w-full rounded-md bg-transparent text-white border-none focus:outline-none focus:border-none placeholder:text-white'
                />
                <input
                    name="tags"
                    type="hidden"
                    value={JSON.stringify(tags)}
                />
            </div>
        </div>
    );
}

export default AddTagInput;
