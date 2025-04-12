import {Chatroom} from "@/components/chatRoomComponents/ChatRoomComponent";
import { Sidebar } from "@/components/sideBarComponents/SideBarComponent";
import prisma from "@/dbPrismaConnection";
import { NEXT_AUTH_CONFIG } from "@/utils/NextAuthConfig";
import { getServerSession } from "next-auth";


export default async function() {
    const session = await getServerSession(NEXT_AUTH_CONFIG)
    const users = await prisma.user.findMany({
        select: {
            id: true,
            username: true,
            email: true,
            avatar: true
        }
    });
    const usersExceptTheCurrentSessionUser = users.filter((allIndvUser) => {
            return allIndvUser.id != session?.user.id
          });
    

    return (<>
            <Sidebar />
            <Chatroom users={usersExceptTheCurrentSessionUser} />
    </> );
}