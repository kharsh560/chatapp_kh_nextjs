import Credentials from "next-auth/providers/credentials";
import client from "@/dbPrismaConnection"

export const NEXT_AUTH_CONFIG = {
    providers: [
        Credentials({
            name: "Email", // Comes on the button
            credentials: {
                email: {label: "Email", type: "email", placeholder: "Enter your email here."},
                password: {label: "Password", type: "password", placeholder: "Enter your password here."},
            },
            async authorize(credentials?: { email: string; password: string }) : Promise<any> {
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
                    avatar: user?.avatar,
                };
            }
        }),
    ],

    secret: process.env.NEXTAUTH_SECRET,

    pages: {
        signIn: "/signin",
    },

//     cookies: { // We can change the cookie's attributes as we want like this!
//     sessionToken: {
//       name: `next-auth.session-token`,
//     // name: `nextAuthSessionToken`,
//       options: {
//         httpOnly: true,
//         sameSite: "lax",      // 👈 this allows sending cookies across localhost:3000 → 5000
//         path: "/",
//         secure: false,        // 👈 this MUST be false in development (http), true in production (https)
//       },
//     },
//   },

    callbacks: {
    // This runs when the JWT is created or updated

    // NOTE; 
    // To include the avatar field in the NextAuth session, you need to make sure it's set on the JWT token in the jwt() callback and then passed to the session inside the session() callback.

    async jwt({ token, user } : { token : any, user : any}) {
    if (user) {
      token.id = user.id;
      token.name = user.name;
      token.email = user.email;
      token.avatar = user.avatar; // 👈 Add this
    }
    return token;
  },

    // // This runs when the session is created
    async session({ session, token } : any) {
      if (session.user && token) {
        // session.user.id = token.id as string; 
        session.user.id = token.sub as string; // Yeah, we can do this directly, bcoz "sub" is having "id" only in it!
        session.user.avatar = token.avatar as string;
      }
      return session;
    },
  },

}