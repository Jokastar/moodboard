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
                className='w-full h-6 border border-black rounded-md py-2 px-1'
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Search..."
            />
            {suggestions.length > 0 && (
                <ul className="absolute z-10 list-disc bg-white border border-gray-300 rounded shadow-lg mt-1">
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

