"use client"

import {useEffect, useState} from "react";  
import Gallery from "./components/Gallery";
import SearchBar from "./components/SearchBar/SearchBar";
import { getAllImages, getImagesByQuery } from "./_actions/images";

  function Home() {
  const [images, setImages] = useState(); 
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true); 
  
  

  const handleSearchBarSubmit = async (input) =>{
    const requestedImages = await getImagesByQuery(input); 
    setImages(requestedImages); 
  }
  useEffect(()=>{
    const getImages = async () =>{

      let {images, totalPages} = await getAllImages(page); 

      setImages(prev => [...prev, images]); 
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
      <SearchBar handleSubmit={handleSearchBarSubmit}/>
      <Gallery images={images}/>
    </>
    
  );
}

export default Home; 
