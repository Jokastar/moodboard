import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials"; 
import User from "@/app/schema/mongo/User";
import bcrypt from "bcrypt"; 

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: 'Credentials',
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        username: { label: "Username", type: "text"},
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {

        const { email, password } = credentials;
        console.log(credentials); 
        return {email:email}
       /* try {
          // Find the user by email
          const user = await User.findOne({ email });
          if (!user) {
              console.log('No user found with that email');
              return null; // No user found with that email
          }
  
          // Compare the entered password with the hashed password stored in the database
          const isMatch = await bcrypt.compare(password, user.password);
          if (!isMatch) {
              console.log('Password does not match');
              return null; // Password does not match
          }
  
          console.log('User authenticated successfully');
          return user; // Return the user object if password matches
      } catch (error) {
          console.log('Error verifying login:', error);
          return null; 
      } */
  }
 })
]
}
const handler = NextAuth(authOptions); 

export { handler as GET, handler as POST }



