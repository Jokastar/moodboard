"use client"; 

import React from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';

function Header() {
    const { data: session, status } = useSession();
    return (
        <div className='flex items-center justify-between text-white'>
            <Link href="/" className='text-[1rem] hover:cursor-pointer uppercase'>
                HOME
            </Link>
            <AuthButton session={session} />
        </div>
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
                    className='text-white text-[1rem] hover:cursor-pointer'
                >
                    LOGOUT
                </div>
            ) : (
                <Link href="/auth/login" className='text-white text-[1rem] hover:cursor-pointer'>
                    LOGIN
                </Link>
            )}
        </>
    );
};


export default Header;
