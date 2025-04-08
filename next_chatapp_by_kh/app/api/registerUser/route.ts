// import { PrismaClient } from "@prisma/client";
import { NextRequest } from "next/server";
// const client = new PrismaClient();
import client from "@/dbPrismaConnection"
// import { v4 as uuidv4 } from "uuid"; // No need, prisma will generate uuid automatically! No need to install "uuid" as well!

export async function POST(req: NextRequest) {
    // Extract data from req.
    const body = await req.json();
    
    try {
        // Store the data in DB and WAIT for it to complete
        // const userUUID = uuidv4(); // No need, prisma will generate uuid automatically!
        const res = await client.user.create({
            data: {
                // id: userUUID, // No need, prisma will generate uuid automatically!
                username: body.username,
                email: body.email,
                password: body.password,
            }
        });

        console.log("response: ", res);

        return Response.json({
            message: "User registered successfully!"
        });
    } catch (error) {
        console.error("Error creating user:", error);
        return Response.json({ error: error }, { status: 500 });
    }
}





