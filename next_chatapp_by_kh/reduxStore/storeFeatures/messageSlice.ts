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

// export type allMessagesSliceType = {
//     currentChatroomUUID: string;
//     messages: messagesArrayType[];
// }

export type allMessagesMapType = Map<string, messagesArrayType[]>;

// const initialState : allMessagesSliceType[] = [
//     {
//         currentChatroomUUID: "",
//         messages: [],
//     }
// ] 

const initialState: { allMessagesMap: allMessagesMapType } = {
  allMessagesMap: new Map(),
}; // -> To get rid of: the Immer + Map drama, I am using map inside the object!
// Redux Toolkit uses Immer under the hood to let you write "mutating-looking" code that’s actually immutable.
// BUT:
// Immer doesn’t support Map and Set by default, unless you explicitly enable it.



export const allMessagesSliceState = createSlice({
    name: "allMessagesSliceState",
    initialState,
    reducers: {
        populateMessages: (state, action) => {
            const newMap = new Map<string, messagesArrayType[]>(state.allMessagesMap);
            // Iterate over the incoming payload
            // for (const eachMessage of incomingMessages) {
            //     newMap.set(eachMessage.currentChatroomUUID, eachMessage.message);
            // }
            for (const { currentChatroomUUID, messages } of action.payload) {
                console.log("messages from the slice: ", messages);
                newMap.set(currentChatroomUUID, messages);
            }
            return {allMessagesMap: newMap};
        }
    }
})

export const { populateMessages } = allMessagesSliceState.actions;

export default allMessagesSliceState.reducer;