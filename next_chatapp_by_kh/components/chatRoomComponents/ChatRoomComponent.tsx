"use client"; // Ensure Framer Motion works on the client side

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import avatars from "@/public/AvatarExporter";
import MessageInputBox from "./MessageInputBox";
import { useSession } from "next-auth/react";



// Dummy data for sidebar
const dummyChats = [
  {
    id: 1,
    name: "Alice Johnson",
    status: "Online",
    avatar: avatars.avatar2.src,
  },
  {
    id: 2,
    name: "Developers Group",
    status: "3 members online",
    avatar: avatars.avatar3.src,
  },
  {
    id: 3,
    name: "John Doe",
    status: "Offline",
    avatar: avatars.avatar4.src,
  },
  {
    id: 4,
    name: "Family Group",
    status: "10 members online",
    avatar: avatars.avatar5.src,
  },
   {
    id: 5,
    name: "Gambling Group",
    status: "23 members online",
    avatar: avatars.avatar6.src,
  },
];

type firstUser = {
    username: string
}

// Dummy messages
const dummyMessages = [
  { id: 1, sender: "Alice Johnson", text: "Hey there! How's it going?" },
  { id: 2, sender: "You", text: "All good! Working on a new project." },
  { id: 3, sender: "Alice Johnson", text: "Nice! Let’s chat more about it." },
];

export function Chatroom() {
  const session = useSession();
  const userName = session.data?.user?.name;
  const [activeChat, setActiveChat] = useState(dummyChats[0]);
  const [messages, setMessages] = useState<{userName: string, message: string}[]>([]);
  // console.log(messages);
  interface User {
    name: string;
    // Add other properties as needed
  }

  // const [firstUser, setFirstUser] = useState<string>("");

  // useEffect(() => {
  //   const getFirstUser = async () => {
  //       try {
  //           const res = await fetch("http://localhost:3000/api/getFirstUser");
  //           if (!res.ok) {
  //               throw new Error("Failed to fetch user!");
  //           }
  //           const user = await res.json();
  //           setFirstUser(user.username);
  //           // return user;
  //       } catch (error) {
  //           console.log("Error: ", error);
  //       }
  //   }
  //   // getFirstUser();
  // }, [])

  // console.log(firstUser);

  return (
    <div className="h-screen w-full flex flex-row bg-black text-white font-sans">
      {/* SIDEBAR */}
      <motion.aside
        initial={{ x: -200, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="w-64 border-r border-gray-700 hidden md:flex flex-col"
      >
        <div className=" h-16 p-4 border-b border-gray-700 text-xl font-semibold">
          Chats & Groups
        </div>
        <div className="flex-1 overflow-y-auto">
          {dummyChats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => setActiveChat(chat)}
              className={`flex items-center p-3 cursor-pointer hover:bg-gray-800 transition ${
                chat.id === activeChat.id ? "bg-gray-800" : ""
              }`}
            >
              <img
                src={chat.avatar}
                alt={chat.name}
                className="w-10 h-10 rounded-full mr-3"
              />
              <div>
                <div className="font-medium">{chat.name}</div>
                <div className="text-sm text-gray-400">{chat.status}</div>
              </div>
            </div>
          ))}
        </div>
        {/* <div
            //   onClick={() => setActiveChat(chat)}
              className={`flex items-center p-3 cursor-pointer hover:bg-gray-800 transition `}
            >
              <img
                src={avatars.avatar8.src}
                // alt={chat.name}
                className="w-10 h-10 rounded-full mr-3"
              />
              <div>
                <div className="font-medium text-white">{firstUser}</div>
                <div className="text-sm text-gray-400">Online</div>
              </div>
            </div> */}
      </motion.aside>

      {/* MAIN CHAT SECTION */}
      <div className="flex-1 flex flex-col">
        {/* HEADER */}
        <motion.header
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 80 }}
          className=" h-16 flex items-center p-4 border-b border-gray-700"
        >
          <img
            src={activeChat.avatar}
            alt={activeChat.name}
            className="w-10 h-10 rounded-full mr-3"
          />
          <div>
            <div className="font-semibold">{activeChat.name}</div>
            <div className="text-sm text-gray-400">{activeChat.status}</div>
          </div>
        </motion.header>

        {/* MESSAGES */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="flex-1 overflow-y-auto p-4 space-y-3"
        >
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.userName === userName ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs rounded-lg ${
                  msg.userName === userName
                    ? "bg-gray-800 text-white"
                    : "bg-gray-700 text-gray-200"
                } ${msg.message ? "p-3" : ""}`}
              >
                <div className="text-sm font-medium mb-1">{msg.userName}</div>
                <div className="text-base">{msg.message}</div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* MESSAGE INPUT */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="h-16 border-t border-gray-700 flex items-center px-4"
        >
          <MessageInputBox setMessages={setMessages} />
        </motion.div>
      </div>
    </div>
  );
}
