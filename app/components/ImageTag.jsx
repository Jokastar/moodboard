import React from 'react'

function ImageTag({tag, onClick, key, id}) {
  return (
    <div className="flex justify-between items-center gap-2 p-2 rounded-[20px] text-white text-center font-favorit-light-c text-[10px] bg-black" key={key}>
        <span>{tag}</span>
        <div onClick={()=>onClick(id)} className='h-3 w-3 rounded-[50%] bg-[var(--red)] text-white flex items-center justify-center cursor-pointer'><span className='text-[8px]'>x</span></div>
    </div>
  )
}

export default ImageTag; 