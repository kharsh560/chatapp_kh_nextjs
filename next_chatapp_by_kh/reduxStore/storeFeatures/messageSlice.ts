import { createSlice } from "@reduxjs/toolkit";

export type messagesArrayType = {
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
    createdAt: Date | null;
    updatedAt: Date | null;
    __v: number | null;
    _id: string;
};

export type allMessagesSliceType = {
    currentChatroomUUID: string;
    messages: messagesArrayType[];
}

const initialState : allMessagesSliceType[] = [
    {
        currentChatroomUUID: "",
        messages: [],
    }
] 

export const allMessagesSliceState = createSlice({
    name: "allMessagesSliceState",
    initialState,
    reducers: {
        populateMessages: (state, action) => {
            return action.payload;
        }
    }
})

export const { populateMessages } = allMessagesSliceState.actions;

export default allMessagesSliceState.reducer;