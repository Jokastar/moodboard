"use client"; 
import React from 'react'
import Link from 'next/link';

function AuthHeader() {
  return (
    <div className='logo-ctn'>
        <Link href="/" className='text-[1rem] text-white hover:cursor-pointer'>LOGO</Link>
    </div>
  )
}

export default AuthHeader