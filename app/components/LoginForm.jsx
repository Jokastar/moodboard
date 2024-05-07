"use client"; 
import React, { useState } from 'react';
import Link from 'next/link';
import { signIn } from "next-auth/react"; 
import { useRouter } from 'next/navigation'

function LoginForm() {
    const router = useRouter(); 
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null); 
    

    const handleSubmit = async (event) => {
        event.preventDefault();

        try{

            const result = await signIn('credentials', {
                redirect: false, // Prevent NextAuth from redirecting automatically
                email,
                password
            });

            if (result?.error) {
                console.log(result.error)
                setError("Password or email incorrect")
            } else {
                console.log('Logged in successfully!');
                // Redirect to another page or update the UI
                console.log(result); 
                router.push("/")
            }

        }catch(e){
            console.log(e)
            setError(" unexpected error occured"); 
            return 
        }
    
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="p-8 bg-white shadow-lg rounded-lg">
                <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            id="email"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            id="password"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    {error && <p className='bg-red-600 text-white text-[8px] p-1 rounded-md'>{error}</p>}
                    <button
                        type="submit"
                        className="py-2 px-4 bg-blue-500 text-white font-bold rounded hover:bg-blue-700"
                    >
                        Log In
                    </button>
                    <p className="text-center text-sm text-gray-600">
                        Do not have an account?{' '}
                        <Link href="/signup" className="text-blue-500 hover:text-blue-600">Sign up</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default LoginForm;
