import Link from 'next/link';

function Gallery({ images }) {
  if(!images || images.lenght < 1 ) {
    return(
      <div>No Images Found</div>
    )
  }
    return (
      <div className="flex flex-wrap gap-4">
        {images.map((image) => (
          <Link key={image._id} href={`/${image._id}`}>
            <div className="w-48 cursor-pointer">
              <img src={image.imageCardUrl} alt={image.name} className="w-full aspect-square rounded-lg shadow-lg object-cover"/>
              <p className="mt-2 text-center text-sm font-semibold">{image.name}</p>
            </div>
          </Link>
        ))}
      </div>
    );
  }
  
export default Gallery;
  

