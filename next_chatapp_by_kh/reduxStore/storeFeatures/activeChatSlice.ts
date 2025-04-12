import { createSlice } from "@reduxjs/toolkit";

export type activeChatSliceStatesType = {
    activeChatPresent: boolean;
    uniqueChatUUID: string;
    otherPartyId: string;
    otherPartyName: string;
    otherPartyDP: string;
    isGroup: boolean | null;
    lastRead: {
        timestamp: Date | null;
        messageId: string;
    };
}

const initialState : activeChatSliceStatesType = {
    activeChatPresent: false,
    uniqueChatUUID: "",
    otherPartyId: "",
    otherPartyName: "",
    otherPartyDP: "",
    isGroup: null,
    lastRead: {
        timestamp: null,
        messageId: "",
    },
}

export const activeChatSlice = createSlice({
    name: "activeChatSlice",  // This name is just for Redux DevTools
    initialState,
    reducers: {
        setActiveChat: (state, action) => {
            // state = action.payload; // Needs array of userObjects!
            // console.log("action.payload ", action.payload); // Its working properly!
            // NOTE:
            // Redux state must be immutable. If you mutate the existing state instead of returning a...
            // ...new copy, React/Redux won’t detect any change and won’t notify components subscribed via useSelector.
            return {
                // ...state,
                ...action.payload , // ✅ forces a new object
            };
            // console.log("activeChatSlice's State: ", state); // Its also working properly!
        },
        resetActiveChat: (state) => {
            // state = initialState;
            // console.log("State after the redux reset.",state);
            return {
                ...initialState,
            }
        }
    }
});

export const {setActiveChat, resetActiveChat} = activeChatSlice.actions;

export default activeChatSlice.reducer;