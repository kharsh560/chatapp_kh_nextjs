import { configureStore } from "@reduxjs/toolkit";
import toastDataReducer from "../storeFeatures/toastSlice"
// import webSocketReducer from "../storeFeatures/WebSocketSlice"
import socketReducer from "../storeFeatures/WebSocketSlice"
import allUsersArrayReducer from "../storeFeatures/allUsersSlice"
import activeChatReducer from "../storeFeatures/activeChatSlice"

export const store = configureStore({
    reducer: {
        toastData: toastDataReducer, // This key defines how we access it in `useSelector` and not the key "name" inside the userSlice!
        socket: socketReducer,
        allUsersArray: allUsersArrayReducer,
        activeChat: activeChatReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,  // Disable check because we store a non-serializable WebSocket instance.
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;