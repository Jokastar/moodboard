import ImageCard from './ImageCard';
import MenuBar from './MenuBar';

function Gallery({ images }) {
  if(!images || images.lenght < 1 ) {
    return(
      <div>No Images Found</div>
    )
  }
    return (
      <div className=" grid grid-cols-3 gap-4 relative">
        {images.map((image) => (
          <ImageCard image={image} key={image._id}/>
        ))}
        <MenuBar/>
      </div>
    );
  }
  
export default Gallery;
  

