import React from 'react'
import Link from 'next/link'

function Header() {
  return (
    <div>
        <div>Logo</div>
        <Link href="/login">Login</Link>
    </div>
  )
}

export default Header