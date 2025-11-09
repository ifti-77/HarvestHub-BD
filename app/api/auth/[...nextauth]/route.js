import CredentialsProvider from "next-auth/providers/credentials";
import NextAuth from "next-auth";
import ConnectToDB from "@/lib/mongoDB";
import Admin from "@/app/models/Admin";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        userid: { label: "User ID", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await ConnectToDB(); // ensure DB connection

        // console.log("Received credentials:", credentials);
        const databaseUser = await Admin.findOne({
          userid: credentials.userid,
          password: credentials.password
        });
        // console.log("DB user found:", databaseUser);

        if (databaseUser) {
          return { id: databaseUser._id, userid: databaseUser.userid };
        } else {
          throw new Error("Invalid credentials");
        }
      },
    }),
  ],
  pages: {
    //signIn: "/signin", // adjust if needed
  },
  callbacks:{
    async jwt({token,user}){
      if(user)
      {
        token.id = user.userid
      }
      return token
    },
    async session({session,token}){
      
      if(token)session.user.id = token.id
      return session
    }
  },

  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST }
