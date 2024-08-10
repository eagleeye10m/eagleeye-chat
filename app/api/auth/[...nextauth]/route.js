import { User } from "@/models/User";
import { connectToDB } from "@/mongoDb";
import { compare } from "bcryptjs";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// const handler = NextAuth({
//   providers: [
//     CredentialsProvider({
//       name: "Credentials",
//       async authorize(credentials) {
//         // the credentials will be all the info from the login form
//         if (!credentials.email || !credentials.password) {
//           console.log(credentials);
//           throw new Error("Invalid email or password");
//         }

//         await connectToDB();

//         const user = await User.findOne({ email: credentials.email });

//         if (!user || !user?.password) {
//           throw new Error("Invalid email or password");
//         }

//         const isMatch = await compare(credentials.password, user.password); //credentials.password is the password that user types in login page

//         if (!isMatch) throw new Error("Invalid password");
//         return user;
//       },
//     }),
//   ],

//   secret: process.env.NEXTAUTH_SECRET,

//   callbacks: {
//     async session({ session }) {
//       const mongoDbUser = await User.findOne({ email: session.user.email });
//       session.user.id = mongoDbUser._id.toString();
//       session.user = { ...session.user, ...mongoDbUser._doc };

//       return session;
//     },
//   },
// });

// export { handler as GET, handler as POST };

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      async authorize(credentials) {
        // the credentials will be all the info from the login form
        if (!credentials.email || !credentials.password) {
          throw new Error("Invalid email or password");
        }

        await connectToDB();

        const user = await User.findOne({ email: credentials.email });

        if (!user || !user?.password) {
          throw new Error("Invalid email or password");
        }

        const isMatch = await compare(credentials.password, user.password); //credentials.password is the password that user types in login page

        if (!isMatch) throw new Error("Invalid password");
        return user;
      },
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async session({ session }) {
      const mongoDbUser = await User.findOne({ email: session.user.email });
      session.user.id = mongoDbUser._id.toString();
      session.user = { ...session.user, ...mongoDbUser._doc };

      return session;
    },
  },
};
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
