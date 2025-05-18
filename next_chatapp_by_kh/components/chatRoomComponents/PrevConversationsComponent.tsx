"use client";

import { RootState } from '@/reduxStore/store/store';
import { activeChatSliceStatesType, setActiveChat } from '@/reduxStore/storeFeatures/activeChatSlice';
import { conversationArrayState } from '@/reduxStore/storeFeatures/conversationSlice';
import { generateConversationId } from '@/utils/generateConversationId';
import { messageTypes, useSendMessageThroughWs } from '@/utils/sendMessageThroughWs';
import { useSession } from 'next-auth/react';
import React, { memo } from 'react'
import { useDispatch, useSelector } from 'react-redux';

type Props = {
    prevConversations: conversationArrayState[];
    setMessages: any;
}

const PrevConversationsComponent = memo(({prevConversations, setMessages}: Props) => {
  const dispatch = useDispatch();
  const socket = useSelector((state: RootState) => state.socket.socket);
  const activeChat = useSelector((state : RootState) => state.activeChat);
  const sendWsMessage = useSendMessageThroughWs();
  const session = useSession();
  const userName = session.data?.user?.name;

  const sendIngressEgressMessageToServer = (newActiveChat : activeChatSliceStatesType) => {
      if (socket) {
          if (activeChat.activeChatPresent) {
              sendWsMessage(messageTypes.egress, `Client: ${userName} is disconnected!`);
          }
          // Yes, "ingress" toh hoga hee!
          sendWsMessage(messageTypes.ingress, `Client: ${userName} is connecting!`, newActiveChat, true);
          // sendWsMessage(messageTypes.connected, `Client: ${userName} is connected!`);
      }
  }

  const handlePrevConvUserClick = (uniqueChatUUID : string, otherPartyId: string, otherPartyName : string, otherPartyDP : string, isGroup : boolean, lastRead : any) => {
      const newActiveChat = {
      activeChatPresent: true,
      uniqueChatUUID,
      otherPartyId,
      otherPartyName,
      otherPartyDP,
      isGroup,
      lastRead
    };

    console.log("newActiveChat -> ", newActiveChat);

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
    <div>
        {
            prevConversations.map((indvConversation) => (
              <div 
              onClick={() => handlePrevConvUserClick(indvConversation.uniqueChatUUID, indvConversation.otherParty, indvConversation.otherPartyName, indvConversation.otherPartyDP, indvConversation.isGroup, indvConversation.lastRead)} 
              key={indvConversation?.otherParty} 
              className=" flex items-center p-3 cursor-pointer hover:bg-gray-800 transition  ">
                <img
                  src={indvConversation?.otherPartyDP}
                  alt={indvConversation?.otherPartyName}
                  className="w-10 h-10 rounded-full mr-3"
                />
              <div>
                <div className="font-semibold">{indvConversation?.otherPartyName}</div>
                {/* <div className="text-sm text-gray-400">{activeChat.status}</div> */}
              </div>
              </div>
            ))
        }
    </div>
  )
})

export {PrevConversationsComponent}