import Image from 'next/image'; 
import Link from 'next/link';
import React from 'react'; 

function ImageCard({image, key}) {
  return (
    <Link key={key} href={`/${image._id}`}>
        <div className='w-full aspect-[1/1.2] border border-white rounded-md object-cover'>
        <img
        src={image.imageCardUrl}
        alt={image.name}
        className='rounded-md object-cover w-full h-full'
        />
        </div>
    </Link>
  )
}



export default ImageCard; 