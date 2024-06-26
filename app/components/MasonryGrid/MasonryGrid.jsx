import React, { useEffect,useState, useRef } from 'react';
import Link from 'next/link';
import './MasonryGrid.css';

const MasonryGrid = ({ images, collectionMode, handleRemoveImage, collectionId }) => {
  const masonryRef = useRef(null);
  const layoutTimeout = useRef(null);

  const setCols = () => {
    const w = masonryRef.current.offsetWidth;
    const cols = w > 800 ? 4 : w > 500 ? 3 : w > 300 ? 2 : 1;
    masonryRef.current.style.setProperty('--cols', String(cols));
  };

  const layout = () => {
    setCols();

    const blocks = Array.from(masonryRef.current.children);
    const cols = Number(masonryRef.current.style.getPropertyValue('--cols'));
    const colHeights = Array(cols).fill(0);

    blocks.forEach((block) => {
      const min = Math.min(...colHeights);
      const colIdx = colHeights.indexOf(min);

      block.style.setProperty('--col-i', String(colIdx));
      block.style.setProperty(
        'top',
        `calc(${min}px + var(--gap, var(--default-gap)))`
      );

      const blockHeight = block.offsetHeight;
      colHeights[colIdx] += blockHeight + parseInt(getComputedStyle(block).marginBottom, 10);
    });

    const maxColHeight = Math.max(...colHeights);
    masonryRef.current.style.setProperty('height', `${maxColHeight}px`);
  };

  const handleResize = () => {
    if (!layoutTimeout.current) {
      layoutTimeout.current = setTimeout(() => {
        layout();
        layoutTimeout.current = null;
      }, 20);
    }
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const imgs = Array.from(masonryRef.current.querySelectorAll('img'));

    const loadImages = async () => {
      await Promise.all(
        imgs.map((img) => {
          return new Promise((resolve, reject) => {
            if (img.complete) {
              resolve();
            } else {
              img.onload = resolve;
              img.onerror = reject;
            }
          });
        })
      );

      imgs.forEach((img) => (img.style.visibility = 'visible'));
      layout();
    };

    loadImages();
  }, [images]);

  return (
    <div className="masonry-grid" ref={masonryRef}>
      {images.map((image) => (
        <ImageCollectionCard
          key={image._id}
          image={image}
          handleRemoveImage={handleRemoveImage}
          collectionMode={collectionMode}
          collectionId={collectionId}
        />
      ))}
    </div>
  );
};

const ImageCollectionCard = ({ image, handleRemoveImage, collectionMode, collectionId }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <div className="masonry-item bg-black rounded-sm relative">
      <Link href={`/${image._id}`}>
        <img
          src={image.imageCardUrl}
          alt={image.name}
          className="w-full h-auto cursor-pointer"
          style={{ visibility: 'hidden' }}
        />
      </Link>
      {collectionMode && (
        <div className="absolute top-2 right-2">
          <button onClick={toggleDropdown} className="text-black bg-white rounded-[50%] w-4 h-4 focus:outline-none">
            ...
          </button>
          {dropdownOpen && (
            <div className="absolute right-4 top-2 bg-white border rounded-lg shadow-lg">
              <button
                onClick={() => handleRemoveImage(collectionId, image._id)}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
              >
                Remove
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MasonryGrid;
