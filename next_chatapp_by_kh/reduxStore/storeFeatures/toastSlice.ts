import { createSlice } from "@reduxjs/toolkit";

enum toastStates {
    none,
    error,
    warning,
    success
}

type toastSliceStatesType = {
    visible: boolean;
    message: string;
    state: toastStates;
}

const initialState : toastSliceStatesType = {
    visible: false,
    message: "",
    state: toastStates.none
}

export const toastSlice = createSlice({
    name: "toastSlice",  // This name is just for Redux DevTools
    initialState,
    reducers: {
        showToast: (state, action) => {
            state.visible = !state.visible;
            state.message = action.payload.message;
            state.state = action.payload.state;
        },
        hideToast:  (state) => {
            state.visible = !state.visible;
            state.message = "";
            state.state = toastStates.none;
        },
    }
});

export const {showToast, hideToast} = toastSlice.actions;

export default toastSlice.reducer;