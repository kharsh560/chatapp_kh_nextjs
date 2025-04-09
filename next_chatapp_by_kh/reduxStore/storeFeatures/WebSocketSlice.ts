import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SocketState {
    id: string | null;
    socket: WebSocket | null;
    createdAt: Date | null;
}

const initialState: SocketState = {
    id: null,
  socket: null,
  createdAt: null,
};

const socketSlice = createSlice({
  name: 'socket',
  initialState,
  reducers: {
    setSocket(state, action) {
      state.socket = action.payload?.socket;
      state.id = action.payload?.id;
      state.createdAt = action.payload?.createdAt;
      // return {
      //   ...state,
      //   socket: action.payload?.socket,
      //   id: action.payload?.id,
      // };
    },
    // Optionally add a clearSocket action
    clearSocket(state) {
      state.socket = null;
    }
  },
});

export const { setSocket, clearSocket } = socketSlice.actions;
export default socketSlice.reducer;




// import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
//     ws : null
// }

// export const webSocketSlice = createSlice({
//     name: "webSocketSlice",
//     initialState,
//     reducers: {
//         openConnection: (state, action) => {
//             state.ws = action.payload;
//         },
//         closeConnection: (state) => {
//             state.ws = null;
//         }
//     }
// });

// export const {openConnection, closeConnection} = webSocketSlice.actions;

// export default webSocketSlice.reducer;