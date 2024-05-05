import Gallery from "./components/Gallery";
import { getAllImages } from "./_actions/images";

async function Home() {
  const {data} = await getAllImages()

  return (
    <Gallery images={data}/>
  );
}

export default Home; 
