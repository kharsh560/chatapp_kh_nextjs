import {Chatroom} from "@/components/chatRoomComponents/ChatRoomComponent";
import { Sidebar } from "@/components/sideBarComponents/SideBarComponent";
import prisma from "@/dbPrismaConnection";
import { NEXT_AUTH_CONFIG } from "@/utils/NextAuthConfig";
import { getServerSession } from "next-auth";

async function getUsersAndCurrentUserConv() {
    const users = await prisma.user.findMany({
        select: {
            id: true,
            username: true,
            email: true,
            avatar: true
        }
    });

    // const conversations = await fetch("http://localhost:6900/app/v1/conversations/getConversations", {
    //     method: "GET",
    //     headers: { "Content-Type": "application/json" },
    //     credentials: "include",
    // })

    return {users};
}


export default async function() {
    const session = await getServerSession(NEXT_AUTH_CONFIG)
    const {users} = await  getUsersAndCurrentUserConv();

    // console.log("conversations: ", conversations);
    console.log("users: ", users);

    const usersExceptTheCurrentSessionUser = users.filter((allIndvUser) => {
            return allIndvUser.id != session?.user.id
          });
    

    return (<>
            <Sidebar />
            <Chatroom users={usersExceptTheCurrentSessionUser} />
    </> );
}