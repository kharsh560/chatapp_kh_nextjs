"use client";

import { useSession } from 'next-auth/react';
import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useSelector } from 'react-redux';

type Props = {
    setMessages: any;
}

const MessageInputBox = memo(({setMessages}: Props) => {
    // console.log("Running");
    const ws = useSelector((state: { webSocketData: WebSocket }) => state.webSocketData);
    // console.log(ws);
    const [message, setMessage] = useState("");
    const session = useSession();
    const userName = session.data?.user?.name;
    // const socketUrl = `ws://localhost:8080?username=${userName}`;
    const socketUrl = `ws://localhost:6900/realTimeChat/ws`;
    const wsArr : number[] = [];
    // const server = useMemo(() => {
    //     console.log("______________ New socket connected from frontend! ______________ ");
    //     wsArr.push(1);
    //     return new WebSocket(socketUrl);
    // }, []) 
    // console.log("on connection: \n",server);
    const serverRef = useRef<WebSocket | null>(null);


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

    useEffect(() => {
        if (userName) {
            // Create the WebSocket connection if it doesn't exist yet
            if (!serverRef.current) {
            serverRef.current = new WebSocket(socketUrl);
            }
            
            serverRef.current.onopen = () => {
                serverRef.current?.send(JSON.stringify({userName, message: `Client: ${userName} is connected!` }));
                serverRef.current!.onmessage = (event) => {
                    // console.log("Received:", event.data);
                    setMessages((prev : any) => [...prev, JSON.parse(event.data)]);
                };
            };

            return () => {
                // if (ws.OPEN) {
                //     console.log(`${userName} is going to be disconnected. (Server)!`);
                //     serverRef.current?.send(JSON.stringify({userName, message: `Client: ${userName} is going to disconnect!` }));
                // }
                serverRef.current?.close();
                serverRef.current = null;
            };
        }
    }, [userName]);

    const sendMessageHandler = () => {
        // server.send("message");
        serverRef.current?.send(JSON.stringify({userName, message}));
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