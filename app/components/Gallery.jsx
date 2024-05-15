"use client"; 
import React from 'react';
import ImageCard from './ImageCard';
import MenuBar from './MenuBar';
import { useSession } from 'next-auth/react';

function Gallery({ images, onGenerateMoodboard }) {
  const { data: session, status } = useSession();
    if (!images || images.length < 1) {
    return (
      <div>No Images Found</div>
    );
  }
  return (
    <div className="grid grid-cols-3 gap-4 relative">
      {images.map((image) => (
        <ImageCard image={image} key={image._id} />
      ))}
      {session && <MenuBar onGenerateMoodboard={onGenerateMoodboard} />}
    </div>
  );
}

export default Gallery;

  

