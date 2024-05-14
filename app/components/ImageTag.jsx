import React from 'react'

function ImageTag({tag, onClick, key}) {
  return (
    <div className="badge badge-primary flex justify-between items-center gap-2" key={key}>
        <span className='text-[12px]'>{tag}</span>
        <div onClick={()=>onClick(tag)} className='h-4 w-4 rounded-[50%] bg-black flex items-center justify-center cursor-pointer'><span className=' text-[12px]'>x</span></div>
    </div>
  )
}

export default ImageTag; 