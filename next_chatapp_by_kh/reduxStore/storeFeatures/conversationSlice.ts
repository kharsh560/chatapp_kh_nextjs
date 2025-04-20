import { createSlice } from "@reduxjs/toolkit";

export type conversationArrayState = {
    uniqueChatUUID: string;
    isGroup: boolean;
    otherParty: string;
    otherPartyName: string;
    otherPartyDP: string;
    lastRead: {
        timestamp: Date;
        messageId: string;
    }
}

export type conversationSliceStatesType = {
    userUUID: string;
    userName: string;
    conversations: conversationArrayState[];
    createdAt: Date | null;
    updatedAt: Date | null;
    __v: number | null;
    _id: string;
}

const initialState : conversationSliceStatesType = {
    userUUID: "",
    userName: "",
    conversations: [],
    createdAt: null,
    updatedAt: null,
    __v: null,
    _id: "",

}


export const conversationSlice = createSlice({
    name: "conversationSlice",  // This name is just for Redux DevTools
    initialState,
    reducers: {
        populateConversations: (state, action) => {
            return action.payload; // Returned as it is bcoz of potential "Redux State Mutation Issue"
        }

    }
});

export const {populateConversations} = conversationSlice.actions;

export default conversationSlice.reducer;