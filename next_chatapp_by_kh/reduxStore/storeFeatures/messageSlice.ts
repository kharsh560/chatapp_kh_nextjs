import { createSlice } from "@reduxjs/toolkit";

export type messagesArrayType = {
    groupId: string | null;
    message: string;
    reciever: string | null;
    sender: string;
    createdAt: Date | null;
    updatedAt: Date | null;
    __v: number | null;
    _id: string;
}

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