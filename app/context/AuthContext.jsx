"use client";
import React from 'react';
import { SessionProvider } from 'next-auth/react';

function AuthContext({children}) {
  return (
    <SessionProvider>
        {children}
    </SessionProvider>
  )
}

export default AuthContext