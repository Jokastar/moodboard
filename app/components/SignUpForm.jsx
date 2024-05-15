"use client";
import React from 'react';
import {useFormState, useFormStatus} from "react-dom"; 
import { signUp } from '../signup/_actions/signup';

function SignUpForm() {
    const [state, formAction] = useFormState(signUp, {}); 

    return (
        <div className="grid grid-cols-2 min-h-[80vh]">
        <div className="white-space w-full"></div>
        <form className="grid grid-rows-[20%_80%] w-full h-full" action={formAction}>
            <div className="whitespace"></div>
            <div className="form-ctn w-full h-full flex flex-col justify-between">
                <div className="inputs">
                    <div>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            className="mb-[3rem] w-full text-white text-[1.5rem] focus:outline-none bg-[var(--background-color-dark)] border-b-2 border-b-white placeholder:uppercase placeholder:text-white"
                            required
                            placeholder="Name"
                        />
                    </div>
                    <div>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className="mb-[3rem] w-full text-white text-[1.5rem] focus:outline-none bg-[var(--background-color-dark)] border-b-2 border-b-white placeholder:uppercase placeholder:text-white"
                            required
                            placeholder="Email"
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            className="mb-[3rem] w-full text-white text-[1.5rem] focus:outline-none bg-[var(--background-color-dark)] border-b-2 border-b-white placeholder:uppercase placeholder:text-white"
                            required
                            placeholder="Password"
                        />
                    </div>
                </div>
                <div className="submit-ctn">
                    <button
                        type="submit"
                        className=" w-full py-2 px-4 text-black bg-white rounded-lg"
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
