"use client"; 
import React, { useEffect, useRef } from 'react';

import Link from 'next/link';
import './MasonryGrid.css'; // Make sure to include the CSS styles

const MasonryGrid = ({ images, onGenerateMoodboard }) => {
  const masonryRef = useRef(null);

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

  const layoutTimeout = useRef(null);

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
        <div key={image._id} className="masonry-item">
          <Link href={`/${image._id}`}>
          <img
            src={image.imageCardUrl}
            alt={image.name}
            style={{ visibility: 'hidden' }}
          />
          </Link>
        </div>
      ))}
    </div>
  );
};

export default MasonryGrid;
