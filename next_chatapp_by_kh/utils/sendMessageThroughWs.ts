

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
  };
  reciever: {
    otherPartyId: string;
    otherPartyName: string;
  };
  message: string;
};


export const useSendMessageThroughWs =  () => {
    // const dispatch = useDispatch();
    const session = useSession();
    const userName = session.data?.user?.name;
    const userId = session.data?.user?.id;
    const socket = useSelector((state: RootState) => state.socket.socket);
    const activeChat = useSelector((state : RootState) => state.activeChat);


    return (typeOfMessage : messageTypes, message : string, newActiveChat? : activeChatSliceStatesType) => {
        if (newActiveChat) {
            console.log("newActiveChat: ", newActiveChat);
        }
        if (socket) {
            socket?.send(JSON.stringify(
                { typeOfMessage, 
                    activeChatUniqueUUID: newActiveChat?.uniqueChatUUID || activeChat.uniqueChatUUID, 
                    isGroup: newActiveChat?.isGroup || activeChat.isGroup,
                    sender: {userId, userName}, 
                    reciever: {otherPartyId: newActiveChat?.otherPartyId || activeChat.otherPartyId, 
                    otherPartyName: newActiveChat?.otherPartyName || activeChat.otherPartyName}, message }));
        }
}
}