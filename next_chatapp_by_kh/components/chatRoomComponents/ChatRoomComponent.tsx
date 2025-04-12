"use client"; // Ensure Framer Motion works on the client side

import { memo, useEffect, useState } from "react";
import { motion } from "framer-motion";
import avatars from "@/public/AvatarExporter";
import MessageInputBox from "./MessageInputBox";
import { useSession } from "next-auth/react";
import { useDispatch, useSelector } from "react-redux";
import { populateUsers } from "@/reduxStore/storeFeatures/allUsersSlice";
import { NewUsersDropDownComponent } from "./NewUsersDropDownComponent";
import { RootState } from "@/reduxStore/store/store";
import { useConnectWebSocket } from "@/utils/webSocketConnectionLogic";
import { setSocket } from "@/reduxStore/storeFeatures/WebSocketSlice";
import { chatMessagePayload, messageTypes, useSendMessageThroughWs } from "@/utils/sendMessageThroughWs";
import { resetActiveChat } from "@/reduxStore/storeFeatures/activeChatSlice";


export type userSliceStatesType = {
    id: string;
    username: string;
    email: string;
    avatar: string;
}

export const Chatroom = memo(({users} : {users: userSliceStatesType[]}) => {
  const session = useSession();
  // console.log(session);
  const userId = session.data?.user?.id;
  const userName = session.data?.user?.name;
  const [messages, setMessages] = useState<chatMessagePayload[]>([]);
  const prevConversations = null;
  const dispatch = useDispatch();
  const activeChat = useSelector((state : any) => {
    // console.log("state.activeChat", state.activeChat);
    return state.activeChat;
  });

    const { connectWebSocket } = useConnectWebSocket();

    const sendWsMessage = useSendMessageThroughWs();

    const socket = useSelector((state: RootState) => state.socket.socket);

     useEffect(() => {
          console.log("Inside the socket above connectWebSocket()");
          connectWebSocket();
      }, []);

      useEffect(() => {
        return () => {
            if (socket) {
                // socket.send(JSON.stringify({ userId, message: `Client: ${userId} is closing the socket connection!` }));
                // const newActiveChat = activeChat;
                // sendWsMessage(messageTypes.closingConnection, `Client: ${userName} has closed the socket connection!`, newActiveChat)
                console.log("Closing the socket connection!");
                (socket as WebSocket).close();
                dispatch(setSocket(null));
                // dispatch(resetActiveChat());
            }
        };
      }, [socket])

//   useEffect(() => {
//   console.log("activeChat changed:", activeChat);
// }, [activeChat]);

  // console.log("activeChat", activeChat);


  // console.log("users: ", users);

  useEffect(() => {
    dispatch(populateUsers(users));
  }, [users])

  // console.log(messages);
 

  // const [firstUser, setFirstUser] = useState<string>("");

  // useEffect(() => {
  //   const getFirstUser = async () => {
  //       try {
  //           const res = await fetch("http://localhost:3000/api/getFirstUser");
  //           if (!res.ok) {
  //               throw new Error("Failed to fetch user!");
  //           }
  //           const user = await res.json();
  //           setFirstUser(user.userId);
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
        < NewUsersDropDownComponent setMessages={setMessages} newUsers={users} />
        <div className="flex-1 overflow-y-auto">
          {prevConversations == null ? <p className=" p-2 text-gray-400">Start a fresh conversation!</p> : ""}
          
        </div>
      </motion.aside>

      {/* MAIN CHAT SECTION */}
      {!activeChat.activeChatPresent ? "" : 
      <div className={`flex-1 flex flex-col `}>
        {/* ${activeChat.otherPartyId == "" ? "hidden" : "block"} */}
        {/* HEADER */}
        <motion.header
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 80 }}
          className=" h-16 flex items-center p-4 border-b border-gray-700"
        >
          <img
            src={activeChat?.otherPartyDP}
            alt={activeChat?.otherPartyName}
            className="w-10 h-10 rounded-full mr-3"
          />
          <div>
            <div className="font-semibold">{activeChat?.otherPartyName}</div>
            {/* <div className="text-sm text-gray-400">{activeChat.status}</div> */}
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
            msg.typeOfMessage == (messageTypes.message.toString()) ? (<div
              key={index}
              className={`flex ${
                msg.sender.userId === userId ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs rounded-lg ${
                  msg.sender.userId === userId
                    ? "bg-gray-800 text-white"
                    : "bg-gray-700 text-gray-200"
                } ${msg.message ? "p-3" : ""}`}
              >
                <div className="text-sm mb-1">{msg.sender.userName}</div>
                <div className="text-base">{msg.message}</div>
              </div>
            </div>) : (
              <div key={index} className={`flex w-full justify-center `}>
                <p className=" rounded-lg text-sm p-1 text-purple-600 bg-purple-600/30">
                  {msg.message}
                </p>
              </div>
            )
          ))}
        </motion.div>

        {/* MESSAGE INPUT */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="h-16 border-t border-gray-700 flex items-center px-4"
        >
          <MessageInputBox setMessagesInStateArray={setMessages} />
        </motion.div>
      </div>}
    </div>
  );
})


