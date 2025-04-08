import { configureStore } from "@reduxjs/toolkit";
import toastDataReducer from "../storeFeatures/toastSlice"
import webSocketReducer from "../storeFeatures/WebSocketSlice"

export const store = configureStore({
    reducer: {
        toastData: toastDataReducer, // This key defines how we access it in `useSelector` and not the key "name" inside the userSlice!
        webSocketData: webSocketReducer,
    }
});
