import Gallery from "./components/Gallery";
import SearchBar from "./components/SearchBar/SearchBar";
import { getAllImages } from "./_actions/images";

async function Home() {
  const {data} = await getAllImages()

  return (
    <>
      <SearchBar/>
      <Gallery images={data}/>
    </>
    
  );
}

export default Home; 
