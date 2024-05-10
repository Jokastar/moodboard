"use client"; 

import React from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

function Header() {
    const { data: session, status } = useSession();

    return (
        <div className='flex items-center justify-between p-4 bg-gray-800 text-white'>
            <Link href="/" className='text-lg font-bold'>
                Home
            </Link>
            {status === "loading" ? (
                <div>Loading...</div>
            ) : session ? (
                <button
                    onClick={() => signOut()}
                    className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded'
                >
                    Logout
                </button>
            ) : (
                <Link href="/login" className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>
                    Login
                </Link>
            )}
        </div>
    );
}

export default Header;
