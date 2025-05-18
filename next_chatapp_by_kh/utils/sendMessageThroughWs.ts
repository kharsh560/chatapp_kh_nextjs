

import { RootState } from "@/reduxStore/store/store";
import { activeChatSliceStatesType } from "@/reduxStore/storeFeatures/activeChatSlice";
import { useSession } from "next-auth/react";
import { useDispatch, useSelector } from "react-redux"

export enum messageTypes {
    ingress = "ingress",
    egress = "egress",
    message = "message",
    alert = "alert",
    connected = "connected",
    closingConnection = "closingConnection"
}

export type chatMessagePayload = {
  typeOfMessage: string;
  activeChatUniqueUUID: string;
  isGroup: boolean;
  sender: {
    userId: string;
    userName: string;
    userAvatar: string;
  };
  reciever: {
    otherPartyId?: string;
    otherPartyObjectIdIfIts_a_GroupMessage?: string;
    otherPartyName: string;
    otherPartyAvatar: string;
  };
  message: string;
  extraPayload?: any;
  newConversationInitialization?: boolean;
};


export const useSendMessageThroughWs =  () => {
    // const dispatch = useDispatch();
    const session = useSession();
    const userName = session.data?.user?.name;
    const userId = session.data?.user?.id;
    const userAvatar = session.data?.user?.avatar;
    const socket = useSelector((state: RootState) => state.socket.socket);
    const activeChat = useSelector((state : RootState) => state.activeChat);


    return (typeOfMessage : messageTypes, message : string, newActiveChat? : activeChatSliceStatesType, newConversationInitialization? : boolean) => {
        if (newActiveChat) {
            console.log("newActiveChat: ", newActiveChat);
        }
        if (socket) {
            socket?.send(JSON.stringify(
                { typeOfMessage, 
                    activeChatUniqueUUID: newActiveChat?.uniqueChatUUID || activeChat.uniqueChatUUID, 
                    isGroup: newActiveChat ?  newActiveChat.isGroup : activeChat.isGroup,
                    // Changed this because, in the case where "isGroup" is false, the second one ran and it gave "null"
                    sender: {userId, userName, userAvatar}, 
                    reciever: {
                      otherPartyId: newActiveChat?.otherPartyId || activeChat.otherPartyId, 
                      otherPartyName: newActiveChat?.otherPartyName || activeChat.otherPartyName, 
                      otherPartyAvatar: newActiveChat?.otherPartyDP || activeChat.otherPartyDP
                    }, 
                    message,
                    newConversationInitialization: newConversationInitialization ? newConversationInitialization : false,
                }));
        }
}
}