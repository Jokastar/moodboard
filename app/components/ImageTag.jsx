import React from 'react'

function ImageTag({tag, onClick, key}) {
  return (
    <div className="badge badge-primary" key={key}>
        {tag}
        <span onClick={()=>onClick(tag)}>close</span>
    </div>
  )
}

export default ImageTag; 