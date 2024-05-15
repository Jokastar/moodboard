"use client";

import { useEffect, useState } from "react";  
import Gallery from "./components/Gallery";
import SearchBar from "./components/SearchBar/SearchBar";
import { getAllImages, getImagesByQuery, getImagesByTags } from "./_actions/images";

function Home() {
  const [images, setImages] = useState([]); 
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true); 

  const handleSearchBarSubmit = async (input) => {
    const requestedImages = await getImagesByQuery(input); 
    setImages(requestedImages); 
  }

  const handleGenerateMoodboard = async (tags = []) => {
    const requestedImages = await getImagesByTags(tags);
    setImages(requestedImages);
  }

  useEffect(() => {
    const getImages = async () => {
      let { requestedImages, totalPages } = await getAllImages(page); 
      const newList = [...images, ...requestedImages]; 
      setImages(newList); 
      setHasMore(page < totalPages); 
    }
    getImages(); 
  }, [page])

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight || !hasMore) return;
      setPage(prev => prev + 1);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMore]);

  return (
    <>
      <SearchBar handleSubmit={handleSearchBarSubmit} />
      <Gallery images={images} onGenerateMoodboard={handleGenerateMoodboard} />
    </>
  );
}

export default Home;

