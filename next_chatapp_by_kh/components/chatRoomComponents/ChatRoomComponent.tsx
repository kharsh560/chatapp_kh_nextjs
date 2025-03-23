"use client"; // Ensure Framer Motion works on the client side

import { useState } from "react";
import { motion } from "framer-motion";
import avatars from "@/public/AvatarExporter";

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
];

// Dummy messages
const dummyMessages = [
  { id: 1, sender: "Alice Johnson", text: "Hey there! How's it going?" },
  { id: 2, sender: "You", text: "All good! Working on a new project." },
  { id: 3, sender: "Alice Johnson", text: "Nice! Let’s chat more about it." },
];

export function Chatroom() {
  const [activeChat, setActiveChat] = useState(dummyChats[0]);

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
          {dummyMessages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.sender === "You" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs rounded-lg p-3 ${
                  msg.sender === "You"
                    ? "bg-gray-800 text-white"
                    : "bg-gray-700 text-gray-200"
                }`}
              >
                <div className="text-sm font-medium mb-1">{msg.sender}</div>
                <div className="text-base">{msg.text}</div>
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
          <input
            type="text"
            placeholder="Type a message..."
            className="w-full bg-transparent border border-gray-700 rounded-full px-4 py-2 text-white focus:outline-none focus:border-gray-500"
          />
        </motion.div>
      </div>
    </div>
  );
}
