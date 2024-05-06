"use client"; 
import React, { useState, useEffect } from 'react';
import { getSuggestions } from './_actions/searchBar';

function SearchBar() {
    const [input, setInput] = useState("");
    const [suggestions, setSuggestions] = useState([]);

    useEffect(() => {
        const timeOutId = setTimeout(async () => {
            const retrieveSuggestions = await getSuggestions(input);
            setSuggestions(retrieveSuggestions);
        }, 300);
        return () => clearTimeout(timeOutId);
    }, [input]);  // Dependency on input

    const handleInputChange = (e) => {
        setInput(e.target.value);
    };

    return (
        <div>
            <input
                className='w-full h-6 border border-black rounded-md py-2 px-1'
                value={input}
                onChange={handleInputChange}
                placeholder="Search..."
            />
            {suggestions.length > 0 && (
                <div>
                    <ul>
                        {suggestions.map((suggestion, index) => (
                            <li key={index}>{suggestion}</li>  // Key should be unique; index as key is generally discouraged
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default SearchBar;
