import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

export async function middleware(req) {
    // Retrieve the token from the request using next-auth's getToken function
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    console.log(token); 
    // Check if the token exists and is valid
    if (!token) {
        // If no token, redirect to the login page
        const loginUrl = new URL('/login', req.url);
        return NextResponse.redirect(loginUrl);
    }

    // If the token is valid, continue to the next middleware or route handler
    return NextResponse.next();
}

// Define the routes to match for this middleware
export const config = {
    matcher: ["/collections",'/collections/:id*', '/newimage', '/:id*/edit'],
};
