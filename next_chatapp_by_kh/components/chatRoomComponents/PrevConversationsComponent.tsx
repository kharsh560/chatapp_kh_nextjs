"use client";

import { setActiveChat } from '@/reduxStore/storeFeatures/activeChatSlice';
import { conversationArrayState } from '@/reduxStore/storeFeatures/conversationSlice';
import React, { memo } from 'react'
import { useDispatch } from 'react-redux';

type Props = {
    prevConversations: conversationArrayState[];
}

const PrevConversationsComponent = memo(({prevConversations}: Props) => {
  const dispatch = useDispatch();
  const setThisAsActiveChat = (uniqueChatUUID : string, otherPartyId: string, otherPartyName : string, otherPartyDP : string, isGroup : boolean, lastRead : any) => {
    const newActiveChat = {
      activeChatPresent: true,
      uniqueChatUUID,
      otherPartyId,
      otherPartyName,
      otherPartyDP,
      isGroup,
      lastRead
    };
    dispatch(setActiveChat(newActiveChat));
  }

  return (
    <div>
        {
            prevConversations.map((indvConversation) => (
              <div 
              onClick={() => setThisAsActiveChat(indvConversation.uniqueChatUUID, indvConversation.otherParty, indvConversation.otherPartyName, indvConversation.otherPartyDP, indvConversation.isGroup, indvConversation.lastRead)} 
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