import Link from 'next/link';
import React from 'react'

function MenuBar() {
  return (
    <div className='flex justify-center items-center w-full absolute'>
        <div className='flex justify-evenly items-center rounded-[24px] bg-black text-white w-[600px] text-[14px] px-2 py-3 fixed bottom-[70px]'>
            <Link href="/collections" className='uppercase text-[12px]'>View your collections</Link>
            <Link href="/newimage" className='uppercase text-[12px]'>Add new image</Link>
            <div className="dropdown dropdown-top">
                <div tabIndex={0} role="button" className='uppercase text-[12px]'>generate moodboard</div>
                <ul tabIndex={0} className="dropdown-content z-[1] menu shadow bg-base-100 rounded-box w-52 text-black text-[12px] uppercase">
                    <li>generate random moodboard</li>
                    <li>add tags</li>
                </ul>
            </div>
        </div>
    </div>
  )
}

export default MenuBar; 