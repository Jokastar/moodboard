"use client"; 

import React from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';

function Header() {
    const { data: session, status } = useSession();
    return (
        <>
        <div className='flex items-center justify-between font-favorit-c'>
            <Link href="/" className= 'home-btn hover:cursor-pointer font-reckless-neue-book text-[28px] uppercase'>
                MOODBOARD
            </Link>
            <AuthButton session={session} />
        </div>
         </>
    );
}

const AuthButton = ({ session }) => {
    const path = usePathname(); 

    if (path.includes("auth")) {
        return null; // Do not render anything if the path includes "auth"
    }

    return (
        <>
            {session ? (
                <div
                    onClick={() => signOut()}
                    className='text-xs hover:cursor-pointer'
                >
                    LOGOUT
                </div>
            ) : (
                <Link href="/auth/login" className='text-xs hover:cursor-pointer'>
                    LOGIN
                </Link>
            )}
        </>
    );
};


export default Header;
