import { createSlice } from "@reduxjs/toolkit";

// 🔧 By default, enums in TypeScript are number-based:

// export enum toastStates {
//   none,     // 0
//   error,    // 1
//   warning,  // 2
//   success   // 3
// }

// If you want to use strings, you must explicitly assign them:

export enum toastStates {
  none = "none",
  error = "error",
  warning = "warning",
  success = "success"
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