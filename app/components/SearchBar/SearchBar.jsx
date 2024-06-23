import React, { useState, useEffect } from 'react';
import { getSuggestions } from './_actions/searchBar';

function SearchBar({ handleSubmit }) {
    const [input, setInput] = useState("");
    const [suggestions, setSuggestions] = useState([]);

    useEffect(() => {
        if (input.trim() === "") {
            setSuggestions([]);
            return;
        }
        const timeOutId = setTimeout(async () => {
            const retrieveSuggestions = await getSuggestions(input);
            setSuggestions(retrieveSuggestions);
        }, 300);
        return () => clearTimeout(timeOutId);
    }, [input]);

    const handleInputChange = (e) => {
        setInput(e.target.value);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();  // Prevent default action of the Enter key
            handleSubmit(input);  // Perform the search
            setSuggestions([]);  // Optionally clear suggestions
        }
    };

    const handleSuggestionClick = (suggestion) => {
        setInput(suggestion);  // Set input to the clicked suggestion
        handleSubmit(suggestion);  // Perform the search
        setSuggestions([]);  // Clear suggestions after selection
    };

    return (
        <div>
            <input
                className='w-full h-6 text-lg text-black border-b-2 bg-transparent font-favorit-light-c italic placeholder:text-black border-black  focus:outline-none ring-0'
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Search"
            />
            {suggestions.length > 0 && (
                <ul className="absolute z-10 list-disc bg-white border rounded-sm mt-1 max-w-[400px]">
                    {suggestions.map((suggestion, index) => (
                        <li key={index} className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => handleSuggestionClick(suggestion)}>
                            {suggestion}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default SearchBar;

