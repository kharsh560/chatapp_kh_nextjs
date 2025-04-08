import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    ws : null
}

export const webSocketSlice = createSlice({
    name: "webSocketSlice",
    initialState,
    reducers: {
        openConnection: (state, action) => {
            state.ws = action.payload;
        },
        closeConnection: (state) => {
            state.ws = null;
        }
    }
});

export const {openConnection, closeConnection} = webSocketSlice.actions;

export default webSocketSlice.reducer;