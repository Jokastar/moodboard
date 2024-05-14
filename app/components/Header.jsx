"use client"; 

import React from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

function Header() {
    const { data: session, status } = useSession();

    return (
        <div className='flex items-center justify-between text-white'>
            <Link href="/" className='text-[1rem] hover:cursor-pointer'>
                LOGO
            </Link>
            {status === "loading" ? (
                <div>Loading...</div>
            ) : session ? (
                <div
                    onClick={() => signOut()}
                    className= 'text-white text-[1rem] hover:cursor-pointer'
                >
                    LOGOUT
                </div>
            ) : (
                <Link href="/login" className='text-white text-[1rem] hover:cursor-pointer'>
                    LOGIN
                </Link>
            )}
        </div>
    );
}

export default Header;
