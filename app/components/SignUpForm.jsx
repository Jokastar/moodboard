"use client";
import React, { useState } from 'react';
import { useFormState } from "react-dom";
import { signUp } from '../auth/signup/_actions/signup';
import Link from 'next/link';

function SignUpForm() {
    const [state, formAction] = useFormState(signUp, {});
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await formAction({ name, email, password });
        } catch (e) {
            setError("Unexpected error occurred");
        }
    };

    return (
        <div className='grid grid-cols-2 h-[80vh]'>
            <div className='white-space w-full'></div>
            <form className="w-full h-full" onSubmit={handleSubmit}>
                <div className=" white-space h-[10vh]"></div>
                <div className='form-ctn w-full flex flex-col gap-14 text-white'>
                    <p className="uppercase">sign up</p>
                    <div>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            className="w-full text-[1rem] focus:outline-none border-b-2 border-b-white bg-transparent placeholder:uppercase placeholder:text-white"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            placeholder="Name"
                        />
                    </div>
                    <div>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className="w-full text-[1rem] focus:outline-none border-b-2 border-b-white bg-transparent placeholder:uppercase placeholder:text-white"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="Email"
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            className="w-full text-[1rem] focus:outline-none border-b-2 border-b-white bg-transparent placeholder:uppercase placeholder:text-white"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="Password"
                        />
                        
                    </div>
                    {error && <p className='bg-red-600 text-white text-xs p-2 rounded-sm'>{error}</p>}
                    <div className='submit-ctn'>
                        <button
                            type="submit"
                            className="w-full py-2 px-4 text-black bg-white rounded-sm uppercase"
                        >
                            Sign Up
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default SignUpForm;
