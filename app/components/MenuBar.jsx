"use client";
import Link from 'next/link';
import React, { useState, useEffect, useRef } from 'react';

function MenuBar({onGenerateMoodboard}) {
  return (
    <div className='flex justify-center items-center w-full absolute left-0 text-[var(--light-gray]'>
      <div className='flex gap-4 items-center rounded-sm bg-[var(--light-black)] text-[var(--light-gray)] text-sm p-4 font-favorit-light-c fixed bottom-[70px] border-[#6D6D6D]'>
        <Link href="/collections" className='p-4 border border-[#6D6D6D] rounded-sm'>View your collections</Link>
        <Link href="/newimage" className='p-4 border border-[#6D6D6D] rounded-sm'>Add new image</Link>
        <MoodBoard  onGenerateMoodboard={onGenerateMoodboard}/>
      </div>
    </div>
  );
}

function MoodBoard({ onGenerateMoodboard }) {
  const [page, setPage] = useState(0);
  const [tags, setTags] = useState("");
  const dropdownRef = useRef(null);

  const handleClick = async () => {
    await onGenerateMoodboard(tags ? [tags] : []);
    setPage(0); // Close the dropdown after generating the moodboard
  };

  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setPage(0);
      setTags("");
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleDropdownClick = () => {
    if (page === 0) {
      setPage(1); // Open the dropdown
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        tabIndex={0}
        role="button"
        className="text-sm p-4 border border-[#6D6D6D] rounded-sm"
        onClick={handleDropdownClick}
      >
        Generate moodboard
      </div>
      {page !== 0 && (
        <ul className="absolute bottom-full mb-2 dropdown-content z-[1] menu shadow bg-[var(--light-dark)] rounded-box w-52 text-white text-[12px] uppercase">
          {page === 1 ? (
            <>
              <li
                className="cursor-pointer my-1 p-2 rounded-md bg-gray-900 hover:bg-gray-600"
                onClick={handleClick}
              >
                random moodboard
              </li>
              <li
                className="cursor-pointer my-1 p-2 rounded-md bg-gray-900 hover:bg-gray-600"
                onClick={() => setPage(2)}
              >
                add tags
              </li>
            </>
          ) : (
            <>
              <li className="my-1">
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="Enter tags"
                  className="w-full p-1 rounded-md bg-gray-700 text-white placeholder-white focus:bg-gray-700 focus:text-white"
                />
              </li>
              <li
                className="cursor-pointer my-1 p-2 rounded-md bg-gray-900 hover:bg-gray-600"
                onClick={handleClick}
              >
                generate moodboard
              </li>
            </>
          )}
        </ul>
      )}
    </div>
  );
}


export default MenuBar;
