"use client"

import {useEffect, useState} from "react";  
import Header from "./components/Header";
import Gallery from "./components/Gallery";
import SearchBar from "./components/SearchBar/SearchBar";
import MenuBar from "./components/MenuBar";
import { getAllImages, getImagesByQuery } from "./_actions/images";
import { useSession } from "next-auth/react";

  function Home() {
  const [images, setImages] = useState([]); 
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true); 
  const session = useSession(); 
  console.log(session); 
  
  const handleSearchBarSubmit = async (input) =>{
    const requestedImages = await getImagesByQuery(input); 
    setImages(requestedImages); 
  }
  useEffect(()=>{
    const getImages = async () =>{

      let {requestedImages, totalPages} = await getAllImages(page); 
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
      <SearchBar handleSubmit={handleSearchBarSubmit}/>
      <Gallery images={images}/>
      <MenuBar/>
    </>
    
  );
}

export default Home; 
