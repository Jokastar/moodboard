import React from 'react'
import Link from 'next/link'

function Header() {
  return (
    <div className='flex items-center justify-between'>
        <Link href="/">Home</Link>
        <Link href="/login">Login</Link>
    </div>
  )
}

export default Header; 