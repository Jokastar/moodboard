
"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { signIn } from "next-auth/react"; 
import { useRouter } from 'next/navigation';

function LoginForm() {
    const router = useRouter(); 
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null); 

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const result = await signIn('credentials', {
                redirect: false, // Prevent NextAuth from redirecting automatically
                email,
                password
            });

            if (result?.error) {
                console.log(result.error);
                setError("Password or email incorrect");
            } else {
                console.log('Logged in successfully!');
                // Redirect to another page or update the UI
                router.push("/");
            }
        } catch (e) {
            console.log(e);
            setError("Unexpected error occurred");
        }
    };

    return (
        <div className='grid grid-cols-2 min-h-[80vh]'>
            <div className='white-space w-full'></div>
            <form className="grid grid-rows-[20%_80%] w-full h-full"  onSubmit={handleSubmit}>
                <div className='whitspace'></div>
                <div className='form-ctn w-full h-full flex flex-col justify-between '>
                    <div className='inputs'>
                    <div>
                        <input
                            type="email"
                            id="email"
                            className="mb-[4rem] w-full text-white text-[1.5rem] focus:outline-none bg-[var(--background-color-dark)] border-b-2 border-b-white placeholder:uppercase placeholder:text-white"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder='email'
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            id="password"
                            className="w-full text-white text-[1.5rem] focus:outline-none bg-[var(--background-color-dark)] border-b-2 border-b-white placeholder:uppercase placeholder:text-white"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder='password'
                        />
                        <p className="text-sm text-white">
                        Do not have an account?&nbsp;
                        <Link href="/auth/signup" className="text-indigo-600 hover:text-indigo-700">Sign up</Link>
                    </p>
                    </div>
                    {error && <p className='bg-red-600 text-white text-xs p-2 rounded-md'>{error}</p>}
                    </div>
                    <div className='submit-ctn'>
                    <button
                        type="submit"
                        className="w-full py-2 px-4 text-black bg-white rounded-lg"
                    >
                        Log In
                    </button>
                    
                    </div>
                </div>   
                </form>
            </div>
    );
}

export default LoginForm;
