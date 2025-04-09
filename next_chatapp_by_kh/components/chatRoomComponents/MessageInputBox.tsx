"use client";

import { RootState } from '@/reduxStore/store/store';
import { setSocket } from '@/reduxStore/storeFeatures/WebSocketSlice';
import { useConnectWebSocket } from '@/utils/webSocketConnectionLogic';
import { useSession } from 'next-auth/react';
import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';

type Props = {
    setMessages: any;
}

const MessageInputBox = memo(({setMessages}: Props) => {
    // console.log("Running");
    // console.log(ws);
    const [message, setMessage] = useState("");
    const session = useSession();
    const userName = session.data?.user?.name;
    const dispatch = useDispatch();
    // const server = useMemo(() => {
    //     console.log("______________ New socket connected from frontend! ______________ ");
    //     wsArr.push(1);
    //     return new WebSocket(socketUrl);
    // }, []) 
    // console.log("on connection: \n",server);
    // let serverRef = useRef<WebSocket | null | undefined>(null);

    let socket = useSelector((state: RootState) => state.socket.socket);
    const createdAt = useSelector((state: RootState) => state.socket.createdAt);

    // const socket = useSelector((state: RootState) => {
    //     console.log("Selecting socket:", state.socket.socket);
    //     return state.socket.socket;
    // });
    // console.log("Socket: ",socket);
    // const id = useSelector((state: RootState) => state.socket.id);

    // const socketAndId = useSelector((state: RootState) => state.socket);

    // Alternatively, you can get the connection method from your custom hook.
    const { connectWebSocket } = useConnectWebSocket();

    // const handleReconnect = useCallback(() => {
    //     // Use your connect function if needed.
    //     connectWebSocket();
    // }, [connectWebSocket]);

    // const didConnect = useRef(false);
    // if (!didConnect.current) {
    //     didConnect.current = true;
    // }

    useEffect(() => {
        console.log("Inside the socket above connectWebSocket()");
        connectWebSocket();

        // return () => {
        //     if (socket) {
        //         console.log("Closing the socket connection!");
        //         (socket as WebSocket).close();
        //         dispatch(setSocket(null));
        //     }
        // };
        
    }, []);
    
    useEffect(() => {
        console.log("Inside the socket.");
        // if (socket) {
        //     if (socket.readyState == 1) {
        //         console.log("Inside the socket send and onmessage");
        //         // socket.send(JSON.stringify({userName, message: `Client: ${userName} is connected!` }));
        //         socket.onmessage = (event) => {
        //             console.log("Received:", event.data);
        //             setMessages((prev : any) => [...prev, JSON.parse(event.data)]);
        //         };
        //     }
        // }
        // NOTE: Fix; Attached onopen instead of relying on .readyState === 1 inside useEffect
        if (socket) {
            socket.onopen = () => {
                console.log("Socket is open now!");
                socket.send(JSON.stringify({ userName, message: `Client: ${userName} is connected!` }));
            };

            socket.onmessage = (event) => {
                console.log("Received:", event.data);
                setMessages((prev: any) => [...prev, JSON.parse(event.data)]);
            };
        }

         return () => {
            if (socket) {
                socket.send(JSON.stringify({ userName, message: `Client: ${userName} is closing the socket connection!` }));
                console.log("Closing the socket connection!");
                (socket as WebSocket).close();
                dispatch(setSocket(null));
            }
        };

    }, [socket, createdAt])


    // useEffect(() => {
    //     server.onopen = () => {
    //         server.send(`Client: ${userName} is connected!`);
    //         server.onmessage = (event) => {
    //             console.log("Received:", event.data);
    //         };
    //         console.log("on open: \n",server);

    //     }
    //     return () => {
    //         wsArr.pop();
    //         server.close();
    //     }
    // }, [])

    // useEffect(() => {
    //     if (userName) {
    //         // Create the WebSocket connection if it doesn't exist yet
    //         // if (!serverRef.current) {
    //         // serverRef.current = new WebSocket(socketUrl);
    //         // }

            
    //         serverRef.current.onopen = () => {
            //     serverRef.current?.send(JSON.stringify({userName, message: `Client: ${userName} is connected!` }));
            //     serverRef.current!.onmessage = (event) => {
            //         // console.log("Received:", event.data);
            //         setMessages((prev : any) => [...prev, JSON.parse(event.data)]);
            //     };
            // };

    //         return () => {
    //             // if (ws.OPEN) {
    //             //     console.log(`${userName} is going to be disconnected. (Server)!`);
    //             //     serverRef.current?.send(JSON.stringify({userName, message: `Client: ${userName} is going to disconnect!` }));
    //             // }
    //             serverRef.current?.close();
    //             serverRef.current = null;
    //         };
    //     }
    // }, [userName]);

    const sendMessageHandler = () => {
        // server.send("message");
        // console.log(id, socket);
        socket?.send(JSON.stringify({userName, message}));
        // console.log("Lingering WS connections:- ", wsArr.length);
        // console.log(message);
        setMessage("");
        // serverRef.current?.send("Hple, KH here!");
    }
    
  return (
    <div className=' flex w-full gap-2'>
        <input
            type="text"
            placeholder="Type a message..."
            onChange={(e) => setMessage(e.target.value)}
            value={message}
            className="w-full bg-transparent border border-gray-700 rounded-full px-4 py-2 text-white focus:outline-none focus:border-gray-500"
          />
          <button className="p-1 bg-gray-800 text-white text-sm rounded-lg hover:bg-gray-700 transition duration-200 cursor-pointer w-24" onClick={() => sendMessageHandler()} >Send</button>
    </div>
  )
})

export default MessageInputBox