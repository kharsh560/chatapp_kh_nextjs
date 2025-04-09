import { NEXT_AUTH_CONFIG } from "@/utils/NextAuthConfig";
import NextAuth, { User } from "next-auth";

const handler = NextAuth(NEXT_AUTH_CONFIG);

export const GET = handler;
export const POST = handler;