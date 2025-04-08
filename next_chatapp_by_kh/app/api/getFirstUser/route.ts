import client from "@/dbPrismaConnection"
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const user = await client.user.findFirst();
        if (user) {
            // console.log(user.username);
            return NextResponse.json(user)
        }
    } catch (error) {
        console.log("Error: ", error);
    }
}