import Link from 'next/link';
import React from 'react'

function MenuBar() {
  return (
        <div className='flex justify-evenly items-center rounded-md bg-black text-white w-[600px] text-[12px]'>
            <Link href="/mycollections">View your collections</Link>
            <Link href="/newimage">Add new image</Link>
            <div className="dropdown dropdown-top">
                <div tabIndex={0} role="button" className="btn">generate moodboard</div>
                <ul tabIndex={0} className="dropdown-content z-[1] menu shadow bg-base-100 rounded-box w-52 text-black text-[12px]">
                    <li>generate random moodboard</li>
                    <li>add tags</li>
                </ul>
            </div>
        </div>
  )
}

export default MenuBar; 