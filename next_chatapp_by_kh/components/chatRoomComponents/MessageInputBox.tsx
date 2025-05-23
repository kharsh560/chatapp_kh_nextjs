"use client";

import { RootState } from '@/reduxStore/store/store';
import { activeChatSliceStatesType, setActiveChat } from '@/reduxStore/storeFeatures/activeChatSlice';
import { populateConversations } from '@/reduxStore/storeFeatures/conversationSlice';
import { setSocket } from '@/reduxStore/storeFeatures/WebSocketSlice';
import { chatMessagePayload, messageTypes, useSendMessageThroughWs } from '@/utils/sendMessageThroughWs';
import { useConnectWebSocket } from '@/utils/webSocketConnectionLogic';
import { useSession } from 'next-auth/react';
import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';

type Props = {
    setMessagesInStateArray: any;
}

const MessageInputBox = memo(({setMessagesInStateArray}: Props) => {
    // console.log("Running");
    // console.log(ws);
    const [message, setMessage] = useState("");
    const session = useSession();
    const dispatch = useDispatch();
    // const server = useMemo(() => {
    //     console.log("______________ New socket connected from frontend! ______________ ");
    //     wsArr.push(1);
    //     return new WebSocket(socketUrl);
    // }, []) 
    // console.log("on connection: \n",server);
    // let serverRef = useRef<WebSocket | null | undefined>(null);

    let socket = useSelector((state: RootState) => state.socket.socket);
    // const createdAt = useSelector((state: RootState) => state.socket.createdAt);

    // const socket = useSelector((state: RootState) => {
    //     console.log("Selecting socket:", state.socket.socket);
    //     return state.socket.socket;
    // });
    // console.log("Socket: ",socket);
    // const id = useSelector((state: RootState) => state.socket.id);

    // const socketAndId = useSelector((state: RootState) => state.socket);



    // const handleReconnect = useCallback(() => {
    //     // Use your connect function if needed.
    //     connectWebSocket();
    // }, [connectWebSocket]);

    // const didConnect = useRef(false);
    // if (!didConnect.current) {
    //     didConnect.current = true;
    // }

    // const currentActiveChat : activeChatSliceStatesType = useSelector((state : any) => state.activeChat);
    const getNewConversationsFromBackend = async () => {
        try {
            const createConversationRes = await fetch("http://localhost:6900/app/v1/conversations/getConversations", {
                method: "GET",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                });

                if (!createConversationRes.ok) {
                throw new Error("Failed to get user"); // Ensures errors always go to `catch`
            }
            const createConversationResJson = await createConversationRes.json();
            console.log("createConversationResJson -> ",createConversationResJson);
            dispatch(populateConversations(createConversationResJson.conversations));
        } catch (error) {
            console.log("Error occured: ", error);
        }
    }
    
    useEffect(() => {
        console.log("Inside the socket. And here is the socket: ", socket);
        // if (socket) {
        //     if (socket.readyState == 1) {
        //         console.log("Inside the socket send and onmessage");
        //         // socket.send(JSON.stringify({userName, message: `Client: ${userName} is connected!` }));
        //         socket.onmessage = (event) => {
        //             console.log("Received:", event.data);
        //             setMessagesInStateArray((prev : any) => [...prev, JSON.parse(event.data)]);
        //         };
        //     }
        // }
        // NOTE: Fix; Attached onopen instead of relying on .readyState === 1 inside useEffect
        if (socket) {
            if (socket.readyState != 1) {
                console.log("Came inside this condition: [socket.readyState != 1], but didn't let it go ahead!");
                // DEBUG! It should not happen that this component should run even after the cleanup!
                return;
            }
            // socket.send(JSON.stringify({ type: "alert" ,sender: userName, reciever: "Will get it from active chat!", message: `Client: ${userName} is connected!` }));
            // socket.onopen = () => {
            //     console.log("Socket is open now!");
            // };

            socket.onmessage = (event) => {
                console.log("Received:", event.data);
                const messageBody : chatMessagePayload = JSON.parse(event.data);

                // After the messages are set, check additionally if the message has 
                if (messageBody.newConversationInitialization && messageBody.newConversationInitialization == true) {
                    setMessagesInStateArray(messageBody, true);
                    console.log("In here: Calling the new conversations!");
                    // then call for the get conversations.
                    setTimeout(() => {
                        console.log("Calling getNewConversationsFromBackend: ");
                        getNewConversationsFromBackend();
                    }, 3000);
                } else {
                    setMessagesInStateArray(messageBody, false);
                }

                // if (messageBody.typeOfMessage === messageTypes.message) {
                //     setMessagesInStateArray((prev: any) => [...prev, messageBody]);
                // } 
                // if (messageBody.typeOfMessage === messageTypes.alert) {
                //     if (messageBody.message === "New conversation ID created for this chat.") {
                //         dispatch(setActiveChat({...currentActiveChat, uniqueChatUUID: messageBody.newConvUUIDcreated})); -> Now no need, because, I'm creating the new UUID upon clicking the new user in the frontend itself!
                //         dispatch(populateConversations(messageBody.extraPayload));
                //     }
                //     // Also do an api call to update the conversation lists. -> No need as because, I did this using the payload of updatedConvDoc I sent using websocket!
                // } else {
                //     setMessagesInStateArray((prev: any) => [...prev, messageBody]);
                // }
            };
        }

        return () => {
            if (socket) {
                console.log("Cleaning up WebSocket events...");
                socket.onopen = null;
                socket.onmessage = null;
            }
        };

    }, [socket])

    useEffect(() => {
        return () => {
            console.log("🧹 Component is unmounting!");
            // You can clean up subscriptions, timeouts, listeners etc. here
        };
    }, []);

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
            //         setMessagesInStateArray((prev : any) => [...prev, JSON.parse(event.data)]);
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

    const sendWsMessage = useSendMessageThroughWs();

    const sendMessageHandler = () => {
        // server.send("message");
        // console.log(id, socket);
        // socket?.send(JSON.stringify({userName, message}));

        if(socket) {
            sendWsMessage(messageTypes.message, message)
        }

        // socket?.send(JSON.stringify({ type: "message", sender: {userId, userName}, reciever: {userId: otherPartyId, userName: otherPartyName}, message }));
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