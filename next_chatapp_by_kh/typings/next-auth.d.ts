import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string; 
      name?: string | null;
      email?: string | null;
      avatar?: string | null;
    };
  }

  interface User {
    id: string;
    avatar?: string | null;
  }


  interface JWT {
    id: string;
    avatar?: string | null;
  }
}
