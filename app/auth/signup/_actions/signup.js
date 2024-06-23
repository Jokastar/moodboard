"use server"; 

import User from "@/app/schema/mongo/User";
import bcrypt from "bcrypt"; 
import { redirect } from "next/navigation";

export async function signUp(prevState, formData) {
    console.log(formData); 

    const name = formData.get("name"); 
    const email = formData.get("email")
    const password = formData.get("password")
    let userCreated = false; 
     
    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            console.log("User already exists with that email");
            return null; // User already exists
        }

        // Hash password before storing it in the database
        const salt = await bcrypt.genSalt(2);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new user record in the database
        const newUser = new User({
            name,
            email,
            password: hashedPassword
        });

        // Save the new user
        await newUser.save();

        console.log("User registered successfully");
        userCreated = true
    } catch (error) {
        console.log("Error during sign-up:", error)
    } 
    if(userCreated) redirect("/login")
}




