// import jwt from "jsonwebtoken"; // For generating tokens
import { verify } from "jsonwebtoken";
import client from "@/dbPrismaConnection"
import { useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSocket } from '@/reduxStore/storeFeatures/WebSocketSlice'; // adjust import path as needed
import { getSession } from "next-auth/react";
import { RootState } from "@/reduxStore/store/store";

export function useConnectWebSocket() {
  const dispatch = useDispatch();
  const socketRef = useRef<WebSocket | null>(null);
  const secret : any = process.env.NEXT_PUBLIC_WEB_SOCKET_VALIDATION_SECRET; 
  // By default, process.env.XYZ is only available on the server. If you want an env variable to be available on the client (browser), you must prefix it with NEXT_PUBLIC_.

  
  const id = useSelector((state: RootState) => state.socket.id);
  const storedSocket = useSelector((state: RootState) => state.socket.socket);

  const connectWebSocket = useCallback(async () => {
    console.log(storedSocket);
      const session : any = await getSession();

      if (id || storedSocket) return;

    // console.log(session.user);
    // Avoid re-connecting
    // if (socket) {
    //     console.log("Already, a socket connection is present for the user!");
    //     return socket;
    // }
    try {
      // Step 1: Authenticate via HTTP
      const authRes = await fetch("http://localhost:6900/api/v1/websockets/initializeWS", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!authRes.ok) {
        throw new Error("Auth failed before WebSocket connection.");
      }

      const authResJson = await authRes.json();
    //   console.log("Before: ", authResJson.token);
    //   console.log("Secret: ", secret);
    console.log("Running on:", typeof window === "undefined" ? "Server" : "Client");
      
    // const decoded = verify(authResJson.token, secret);
    // const decoded = verify(authResJson.token, process.env.NEXT_PUBLIC_WEB_SOCKET_VALIDATION_SECRET as string);

    // NOTE: about line 33, 34: ❗️jsonwebtoken's verify() does not work in the browser! The jsonwebtoken library is Node.js-specific and depends on Node's crypto module, which is not available in browsers.




    // console.log("After...decoded: ", decoded);
    // // console.log("After: ", authResJson.token);


    // const user = await client.user.findUnique({
    //     where: {
    //         id: decoded.sub as string,
    //     },
    // });

    // if (!user) {
    //     throw new Error("Un-authorized access!");
    // }

    // console.log("User", user);

      // Step 2: Create WebSocket connection.
      const socketUrl = `ws://localhost:6900/realTimeChat/ws?token=${authResJson.token}`;
      const socket = new WebSocket(socketUrl);

    //   socket.onopen = () => {
    //     console.log("WebSocket connection established!");
    //   };
      // socket.onmessage = (event) => {
      //   console.log("Received:", event.data);
      // };
      socket.onerror = (err) => {
        console.error("WebSocket error:", err);
      };
      socket.onclose = () => {
        console.log("Closing socket!")
        console.log("WebSocket closed");
        dispatch(setSocket(null));
      };

      socketRef.current = socket;

      // Dispatch the socket to Redux state.
      if (!id) {
          dispatch(setSocket({socket, id: session?.user.id, createdAt: Date.now()}));
      }

      return socket;
    } catch (error) {
      console.error("WebSocket connection failed!", error);
      return null;
    }
  }, []);

  // useEffect(() => {
  //   // Optionally, automatically try connecting when the hook mounts.
  //   connectWebSocket();
  //   // Clean up when unmounting
    // return () => {
    //   if (socketRef.current) {
    //     socketRef.current.close();
    //     dispatch(setSocket(null));
    //   }
    // };
  // }, [connectWebSocket, dispatch]);

  return { socket: socketRef.current, connectWebSocket };
}



// import jwt from "jsonwebtoken"; // For generating tokens
// import client from "@/dbPrismaConnection"
// import { useRef } from "react";

// async function useConnectWebSocket() {
//   try {
//     // Step 1: Authenticate via HTTP
//   const authRes = await fetch("http://localhost:8000/initializeWSserver", {
//         method: "GET",
//         headers: {
//             "Content-Type": "application/json",
//         },
//         credentials: 'include',
//     });

//   if (!authRes.ok) {
//     throw new Error("Auth failed before WebSocket connection.");
//   }

//   const authResJson = await authRes.json();

//   console.log(authResJson.token);

//   const decoded = jwt.verify(authResJson.token, process.env.WEB_SOCKET_VALIDATION_SECRET as string);


//     const user = await client.user.findUnique({
//         where: {
//             id: decoded.sub as string,
//         },
//     });

//     if (!user) {
//         throw new Error("Un-authorized access!");
//     }

//   // Step 2: Connect to WebSocket (browser will send cookies)
//   const socketUrl = `ws://localhost:6900/realTimeChat/ws`;
//     const serverRef = useRef<WebSocket | null>(null);
//   // Create the WebSocket connection if it doesn't exist yet
//     if (!serverRef.current) {
//     serverRef.current = new WebSocket(socketUrl);
//     }


// //   const socket = new WebSocket("ws://localhost:8000/realTimeChat/ws");

// //   socket.onopen = () => {
// //     console.log("WebSocket connection established!");
// //   };

// //   socket.onmessage = (event) => {
// //     console.log("Received:", event.data);
// //   };

// //   socket.onerror = (err) => {
// //     console.error("WebSocket error", err);
// //   };

// //   socket.onclose = () => {
// //     console.log("Socket closed");
// //   };

//   return serverRef;
//   } catch (error) {
//     console.log("Websocket connection failed! ", error)
//   }
// }

// export {useConnectWebSocket};