import { createSlice } from "@reduxjs/toolkit";

type allUsersSliceStatesType = {
    id: String;
    username: String;
    email: String;
    avatar: String;
}

const initialState : allUsersSliceStatesType[] = [
    {
        id: "",
        username: "",
        email: "",
        avatar: "",
    }
]

export const allUsersSlice = createSlice({
    name: "allUsersSlice",  // This name is just for Redux DevTools
    initialState,
    reducers: {
        populateUsers: (state, action) => {
            state = action.payload; // Needs array of userObjects!
        }
    }
});

export const {populateUsers} = allUsersSlice.actions;

export default allUsersSlice.reducer;