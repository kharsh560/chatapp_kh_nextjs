import NextAuth, { User } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import client from "@/dbPrismaConnection"

const handler = NextAuth({
    providers: [
        Credentials({
            name: "Email", // Comes on the button
            credentials: {
                email: {label: "Email", type: "email", placeholder: "Enter your email here."},
                password: {label: "Password", type: "password", placeholder: "Enter your password here."},
            },
            async authorize(credentials?: { email: string; password: string }) : Promise< User | null > {

                if (credentials?.email == null || credentials?.email == undefined || credentials?.email == "" ||
                    credentials?.password == null || credentials?.password == undefined || credentials?.password == ""
                 ) {
                    return null;
                }

                const user = await client.user.findUnique({
                    where: {
                        email: credentials?.email as string,
                    },
                });

                if (!user) {
                    console.log("Invalid credentials");
                    return null;
                }

                if (user.password) {
                    if (!(credentials?.password === user.password)) {
                        console.log("Invalid password");
                        return null;
                    }
                }

                return {
                    id: `${user?.id}`,
                    name: user?.username,
                    email: user?.email,
                };
            }
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: "/signin",
    },
    callbacks: {
    // This runs when the JWT is created or updated
    async jwt({ token, user }) {
    console.log("token here: \n",token);
      if (user) {
        token.id = user.id; // 👈 Injecting id into token
      }
      console.log("token now: \n",token);
      return token;
    },

    // This runs when the session is created
    async session({ session, token } : any) {
      if (session.user && token) {
        session.user.id = token.id as string; // 👈 Exposing id in session
      }
      return session;
    },
  },

});

export const GET = handler;
export const POST = handler;