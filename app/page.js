"use client";

import { useEffect, useState } from "react";  
import MenuBar from "./components/MenuBar";
import { useSession } from "next-auth/react";
import SearchBar from "./components/SearchBar/SearchBar";
import { getAllImages, getImagesByQuery, getImagesByTags } from "./_actions/images";
import MasonryGrid from "./components/MasonryGrid/MasonryGrid";

function Home() {
  const [images, setImages] = useState([]); 
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const {data:session} = useSession(); 
 
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
      
      if(requestedImages){
        const newImagesList = [...images, ...requestedImages]; 
      setImages(newImagesList); 
      setHasMore(page < totalPages); 
      }
      
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
      {images?.length > 0 ? <MasonryGrid images={images} onGenerateMoodboard={handleGenerateMoodboard}/> : <p>No image available</p>}
      {session && <MenuBar onGenerateMoodboard={handleGenerateMoodboard} />}
    </>
  );
}

export default Home;

