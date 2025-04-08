import avatars from '@/public/AvatarExporter';
import { Home, MessageCircle, Users } from 'lucide-react';
import Image from 'next/image';
import { UserInfo } from './UserInfoSidebarBottomCompinent';
import Link from 'next/link';
import { getServerSession } from 'next-auth';

const getUserData = async () => {
    console.log("Artificial delay starts.");
    // await new Promise((r) => setTimeout(r, 2000));
    console.log("Artificial delay ends.")
        try {
            const response = await fetch("http://localhost:3000/api/getUser");
            // https://api.github.com/users/kharsh560
            if (!response.ok) {
                console.log(`Response status: ${response.status}`);
                return null;
            }
            const userDataJson = await response.json();
            return userDataJson;
        } catch (error) {
            console.log("Something went wrong!", error);
        } 
    }

export async function Sidebar() {
    const session = await getServerSession();
  console.log(session);
    // getUserData().then((data) => console.log(data));
    const userDetails = await getUserData();
  return (
    <div className="h-screen w-64 bg-gray-900 text-white flex flex-col">
      {/* Logo or App Name */}
      <div className="p-4  h-16 text-xl font-bold border-b border-gray-700">Chat App</div>
      
      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          <Link href={"/"} >
            <li className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-800 cursor-pointer">
              <Home size={20} />
              <span>Home</span>
            </li>
          </Link>
          <li className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-800 cursor-pointer">
            <MessageCircle size={20} />
            <span>Messages</span>
          </li>
          <li className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-800 cursor-pointer">
            <Users size={20} />
            <span>Groups</span>
          </li>
        </ul>
      </nav>
      
      {/* User Info */}
      <UserInfo userDetails={userDetails} />
    </div>
  );
}
