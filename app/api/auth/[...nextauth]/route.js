import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials"; 
import User from "@/app/schema/mongo/User";
import bcrypt from "bcrypt"; 

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        const { email, password } = credentials;
        try {
          const user = await User.findOne({ email });
          if (!user) {
            console.log('No user found with that email');
            return null;
          }
          const isMatch = await bcrypt.compare(password, user.password);
          if (!isMatch) {
            console.log('Password does not match');
            return null;
          }
          return { id: user._id, name: user.name, email: user.email };
        } catch (error) {
          console.log('Error verifying login:', error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async session({ session, token }) {
      session.userId = token.sub; // Adding userId to the session
      session.user = { id: token.sub, email: token.email, name: token.name }; // Add user details
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    }
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60 // 1 day
  },
  pages: {
    signIn: '/auth/signin',  // Custom sign-in page
  }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };



