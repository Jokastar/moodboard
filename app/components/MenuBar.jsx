"use client";
import Link from 'next/link';
import React, { useState, useEffect, useRef } from 'react';

function MenuBar({onGenerateMoodboard}) {
  return (
    <div className='flex justify-center items-center w-full absolute'>
      <div className='flex justify-evenly items-center rounded-[24px] bg-black text-white w-[600px] text-[14px] px-2 py-3 fixed bottom-[70px]'>
        <Link href="/collections" className='uppercase text-[12px]'>View your collections</Link>
        <Link href="/newimage" className='uppercase text-[12px]'>Add new image</Link>
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
        className="uppercase text-[12px]"
        onClick={handleDropdownClick}
      >
        generate moodboard
      </div>
      {page !== 0 && (
        <ul className="absolute bottom-full mb-2 dropdown-content z-[1] menu shadow bg-[var(--background-color-dark)] rounded-box w-52 text-white text-[12px] uppercase">
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
