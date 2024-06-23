
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
        <div className='grid grid-cols-2 h-[80vh]'>
            <div className='white-space w-full'></div>
            <form className="w-full h-full" onSubmit={handleSubmit}>
                <div className=" white-space h-[10vh]"></div>
                <div className='form-ctn w-full flex flex-col gap-14 text-white'>
                    <p className="uppercase">login</p>
                    <div>
                        <input
                            type="email"
                            id="email"
                            className="w-full text-[1rem] focus:outline-none  border-b-2 border-b-white bg-transparent placeholder:uppercase placeholder:text-white"
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
                            className="w-full text-[1rem] focus:outline-none  border-b-2 border-b-white placeholder:uppercase bg-transparent placeholder:text-white"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder='password'
                        />
                        <p className="text-sm  my-2">
                        Do not have an account?&nbsp;
                        <Link href="/auth/signup" className="text-indigo-600 hover:text-indigo-700">Sign up</Link>
                    </p>
                    </div>
                    {error && <p className='bg-red-600 text-white text-xs p-2 rounded-sm'>{error}</p>}
                    <div className='submit-ctn'>
                    <button
                        type="submit"
                        className="w-full py-2 px-4 text-black bg-white rounded-sm uppercase"
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
