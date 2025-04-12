"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { activeChatSliceStatesType, setActiveChat } from "@/reduxStore/storeFeatures/activeChatSlice";
import { RootState } from "@/reduxStore/store/store";
import { useSession } from "next-auth/react";
import { messageTypes, useSendMessageThroughWs } from "@/utils/sendMessageThroughWs";
import { userSliceStatesType } from "./ChatRoomComponent";


const NewUsersDropDownComponent = ({newUsers, setMessages} : {newUsers : userSliceStatesType[], setMessages : any}) => {
    // Further, new Users will also be filtered using the current user's conversations!
  const [isOpen, setIsOpen] = useState(false);
    const dispatch = useDispatch();
  const toggleDropdown = () => setIsOpen((prev) => !prev);
  const session = useSession();
  const userName = session.data?.user?.name;
  const userId = session.data?.user?.id;
  const socket = useSelector((state: RootState) => state.socket.socket);
  const activeChat = useSelector((state : RootState) => state.activeChat);

//   console.log("newUsers: ", newUsers);

const sendWsMessage = useSendMessageThroughWs();

// See, in new user dropdown, I will have to ensure that there's no any user, whose conversation is already present in the history.
// And ofcourse it has to be a 1-1 room.
// See, the logic is, any user which is clicked here, is sure to be absent in the history of both the sender and the reciever!
// So, it will be the first time when you will be creating it. (Caviard: What is in real-time, reciever creates the grp before you?)

    const sendIngressEgressMessageToServer = (newActiveChat : activeChatSliceStatesType) => {
        if (socket) {
            if (activeChat.activeChatPresent) {
                sendWsMessage(messageTypes.egress, `Client: ${userName} is disconnected!`)
                setMessages([]);
            }
            // Yes, "ingress" toh hoga hee!
            sendWsMessage(messageTypes.ingress, `Client: ${userName} is connecting!`, newActiveChat);
            // sendWsMessage(messageTypes.connected, `Client: ${userName} is connected!`);
        }
    }


  const handleNewUserClick = (otherPartyId : string, otherPartyDP_avatar : string, otherPartyName : string) => {
    const newActiveChat = {
    activeChatPresent: true,
    uniqueChatUUID: "",
    otherPartyId,
    otherPartyName,
    otherPartyDP: otherPartyDP_avatar,
    isGroup: false,
    lastRead: {
      timestamp: null,
      messageId: "",
    },
  };

  console.log("Running handleNewUserClick!", newActiveChat);
  
  dispatch(setActiveChat(newActiveChat));

    if (!socket) {
        setTimeout(() => {
            console.log("Retrying room creation!");
                sendIngressEgressMessageToServer(newActiveChat);
        }, 1500);
    } else {
        sendIngressEgressMessageToServer(newActiveChat);
    }

    console.log("activeChat: ", activeChat);

  }

  return (
    <div className="w-full text-white">
      <div
        className={`flex items-center justify-between px-4 py-2 cursor-pointer hover:bg-gray-800 ${ isOpen ? "" : "border-b border-gray-700" }`}
        onClick={toggleDropdown}
      >
        <span className="">New users</span>
        {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </div>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={`overflow-hidden bg-black ${ isOpen ? "border-b border-gray-700" : "" }`}
          >

       {/* Moved this logic to the parent. Now the "users" has only the elements except this session's user.

          .filter((allIndvUser) => {
            return allIndvUser.id != userId
          })

           */}

            {newUsers.map((indvUser) => (
            <div
              key={indvUser.id}
              className={`flex items-center p-3 cursor-pointer hover:bg-gray-800 transition `}
              onClick={() => handleNewUserClick(indvUser.id, indvUser.avatar, indvUser.username)}
            >
              <img
                src={indvUser.avatar}
                alt={indvUser.username}
                className="w-10 h-10 rounded-full mr-3"
              />
              <div>
                <div className="">{indvUser.username}</div>
                {/* <div className="text-sm text-gray-400">{indvUser.status}</div> */}
              </div>
            </div>
          ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export {NewUsersDropDownComponent};
