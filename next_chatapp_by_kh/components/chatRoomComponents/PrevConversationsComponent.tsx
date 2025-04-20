"use client";

import { conversationArrayState } from '@/reduxStore/storeFeatures/conversationSlice';
import React, { memo } from 'react'

type Props = {
    prevConversations: conversationArrayState[];
}

const PrevConversationsComponent = memo(({prevConversations}: Props) => {
  return (
    <div>
        {
            prevConversations.map((indvConversation) => (
              <div key={indvConversation?.otherParty} className=" flex items-center p-3 cursor-pointer hover:bg-gray-800 transition  ">
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