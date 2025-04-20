import { Server as HTTPServer } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { v4 as uuidv4 } from "uuid";
import { parse } from "url";
import jwt from "jsonwebtoken"
import { enableSaveFunction, messageQueue } from "../controllers/saveMessage.controller";
import { Conversation } from "../models/conversation.model";
import { conversationQueue, enableConvSaveFunction } from "../controllers/conversations.controller";

export type chatMessagePayload = {
  typeOfMessage: string;
  activeChatUniqueUUID: string;
  isGroup: boolean;
  sender: {
    userId: string;
    userName: string;
    userAvatar: string;
  };
  reciever: {
    otherPartyId: string;
    otherPartyName: string;
    otherPartyAvatar: string;
  };
  message: string;
  extraPayload?: any;
  newConversationInitialization?: boolean;
};

type decodedTokenPayload = {
    user: {
        name: string;
        email: string;
        sub: string;
        iat: number;
        exp: number;
        jti: string;
    },
    iat: number;
    exp: number;
}

export enum messageTypes {
    ingress = "ingress",
    egress = "egress",
    message = "message",
    alert = "alert",
    connected = "connected",
    closingConnection = "closingConnection"
}

const clients = new Map<string, WebSocket>();
// This is the map of clients connected through websockets.
// clients will map indv -> WS

// const conversationRooms = new Map<string, string[]>();
// Map of strings to a Set of strings
const conversationRooms = new Map<string, Set<string>>();
// This will have the UUID of the conversation, which is a unique identifier of a room...
// ...which can have either duplets or many. Means a 1-1 chat or a grp chat.
// conversationRooms will map room -> indv(in form of their UUID of whose WS can be accessed through "conversationRooms")

export function setupWebSocketServer(server: HTTPServer) {
//   const wss = new WebSocketServer({ server, path: "/realTimeChat/ws" });
  const wss = new WebSocketServer({ noServer: true, path: "/realTimeChat/ws" });
    // let decoded : decodedTokenPayload;
    server.on("upgrade", (req, socket, head) => {
        const { query } = parse(req.url!, true); // Extract query params
        const token = query.token as string; // Get clientId from URL
        let decoded : decodedTokenPayload;

        try {
            const decodedToken = jwt.verify(token, process.env.WEB_SOCKET_VALIDATION_SECRET as string);
            if (typeof decodedToken === "object" && decodedToken !== null) {
                decoded = decodedToken as decodedTokenPayload;
            } else {
                throw new Error("Invalid token payload");
            }
            // console.log("decoded token: ", decoded);
        } catch (error) {
            socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
            socket.destroy();
            return;
        }

        if (clients.has(decoded.user.sub)) {
            console.log("This client already exists!");
            socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
            socket.destroy();
            return;
        }
        

        // If authentication passes, upgrade the connection.
        // Upgrade the connection and pass the decoded token along via the request object or directly attach it to the ws instance.
        wss.handleUpgrade(req, socket, head, (ws) => {
          // Attach the decoded data to the WebSocket instance, making it unique per connection:
          (ws as any).decoded = decoded;
          wss.emit("connection", ws, req);
        });
  });

  wss.on("connection", (ws: WebSocket) => {
    // Now, use the decoded token from this connection instance.
    const decoded : decodedTokenPayload = (ws as any).decoded;
    // const clientId = uuidv4();
    const clientId = decoded.user.sub;
    clients.set(clientId, ws);

    console.log(`Client '${decoded.user.name}' connected with ID: ${clientId}. Total clients = ${clients.size}`);

    ws.send(JSON.stringify({ system: "Welcome!", clientId, name: decoded.user.name }));

    ws.on("message", async (data, isBinary) => {
      // const incomingMessage : {type: string, sender: {userId: string, userName: string}, reciever: {userId: string, userName: string}, message: string} = data.json();
      // console.log(`Message from ${clientId}:`, incomingMessage);

        const parsed : any = isBinary ? data : data.toString(); // safe fallback

        const incomingMessage: chatMessagePayload = JSON.parse(parsed);
        console.log(`Message from ${clientId}:`, incomingMessage);
        
        // Now, as uniqueUUID is present, we need to see whether the message is a group message or 1:1 chat?

        // if the incomingMessage, does not have a "uniqueUUID" then, we need to generate it first. Next we need to check if there is this generated ID already present inside the sender/reciever's conversationSchema(agar ek mei hoga to dusre mei surely hoga). If its already present, then no issues, just go ahead and save the message and update the lastRead with the time and the messageID. And be rest-assured that, it will be present for the group chat! 
        // Now, if its not present already: then;
        // As the incomingMessage is a 1:1 chat(guaranteed bcoz its UUID was just generated), then append the newly created UUID in the "cnversations" array of the convSchema of both the sender and the reciever.
        // NOTE: What if users will be coming from multiple sessions?
        // Also, see, if the uniqueUUID is present, then send this message to the queue. Else, first be assured that the the conv is present in the sender and the reciever.

        // Means, if, message ke ya toh sender mei ya to reciever mei, agar ham nahi haim, toh return kar jao!
        if (!(incomingMessage.sender.userId == decoded.user.sub || incomingMessage.reciever.otherPartyId == decoded.user.sub)) return;

        // Now the flow is like, "here's the "uniqueIdentifier". Now, if this was not present in the incoming message's activeChatUniqueUUID, then simply make a new conversation.

        // let uniqueIdentifier = generateConversationId(incomingMessage.sender.userId, incomingMessage.reciever.otherPartyId);
        // incomingMessage.activeChatUniqueUUID = uniqueIdentifier;

        const uniqueIdentifier = incomingMessage.activeChatUniqueUUID; // From frontend I made sure that it does come.

        // Ab bas backend mei ek check kar lo, agar ye present hai backend ke coversation mei toh theek warna daal do. I also included a marker. "newConversationInitialization"
        if (incomingMessage.newConversationInitialization && incomingMessage.newConversationInitialization == true) {
          // Tell the backend to update the conversation
          conversationQueue.enqueue(incomingMessage);
          enableConvSaveFunction();
        }

        // if (incomingMessage.activeChatUniqueUUID == "") {
        //   // That means its a new chat! Create this conversation's UUID and store this in the conversation models of both the users (sender and reciever).
        //   uniqueIdentifier = generateConversationId(incomingMessage.sender.userId, incomingMessage.reciever.otherPartyId);
        //   if (!incomingMessage.isGroup) {
        //     // const senderInConvOfDB = await Conversation.findOne({user: incomingMessage.sender.userId});
        //     // const recieverInConvOfDB = await Conversation.findOne({user: incomingMessage.reciever.otherPartyId});

        //     // const senderConvUpdateResponse = await Conversation.updateOne(
        //     //   { userUUID: decoded.user.sub }, // {First arg = filter condition} Only WS of the user mei se update karo. Bcoz this will run for both, the sender as well as reciever.
        //     //   {
        //     //     $addToSet: {
        //     //       // Using "$addToSet" (prevents duplicates based on entire object match):
        //     //       conversations: {
        //     //         uniqueChatUUID: uniqueIdentifier,
        //     //         isGroup: incomingMessage.isGroup,
        //     //         otherParty: decoded.user.sub == incomingMessage.sender.userId ? incomingMessage.sender.userId : incomingMessage.reciever.otherPartyId,
        //     //         otherPartyDP: decoded.user.sub == incomingMessage.sender.userId ? incomingMessage.sender.userAvatar : incomingMessage.reciever.otherPartyAvatar ,
        //     //         lastRead: {
        //     //           timestamp: null,
        //     //           messageId: null,
        //     //         },
        //     //       },
        //     //     },
        //     //   }
        //     // );

        //     incomingMessage.activeChatUniqueUUID = uniqueIdentifier;

        //     const updatedConvDoc = await Conversation.findOneAndUpdate( // Used this bcoz "updateOne" does not return anything!
        //       { userUUID: decoded.user.sub },
        //       {
        //         $addToSet: {
        //           conversations: {
        //             uniqueChatUUID: uniqueIdentifier,
        //             isGroup: incomingMessage.isGroup,
        //             otherParty: decoded.user.sub == incomingMessage.sender.userId
        //               ? incomingMessage.sender.userId
        //               : incomingMessage.reciever.otherPartyId,
        //             otherPartyDP: decoded.user.sub == incomingMessage.sender.userId
        //               ? incomingMessage.sender.userAvatar
        //               : incomingMessage.reciever.otherPartyAvatar,
        //             lastRead: {
        //               timestamp: null,
        //               messageId: null,
        //             },
        //           },
        //         },
        //       },
        //       {
        //         new: true, // I used it to make sure that it returns the updated document
        //         upsert: true, // I used it to make sure that it creates this doc, if not found
        //       }
        //     );
        //     // I needed the new doc, bcoz anyways, I need to update the "conversations slice" in the frontend. So why do an extra api call for that!

            
        //     const messageForSuccessfulConvCreation = incomingMessage;
        //     messageForSuccessfulConvCreation.typeOfMessage = messageTypes.alert;
        //     messageForSuccessfulConvCreation.message = "New conversation ID created for this chat.";
        //     messageForSuccessfulConvCreation.extraPayload = updatedConvDoc;

        //     [incomingMessage.sender.userId, incomingMessage.reciever.otherPartyId].forEach((memberInTheRoom) => {
        //           if (clients.get(memberInTheRoom)?.readyState === WebSocket.OPEN) {
        //             clients.get(memberInTheRoom)?.send(JSON.stringify(messageForSuccessfulConvCreation), { binary: isBinary });
        //           }
        //         })

        //   }
        // } else {
        //   uniqueIdentifier = incomingMessage.activeChatUniqueUUID;
        // }

        // Now let me first make setup of 1:1 chat.
        if (incomingMessage.typeOfMessage == messageTypes.ingress) {
          if (!incomingMessage.isGroup) {
            console.log("Inside ingress logic! Here is the decoded name: ", decoded.user.name);
            // Then first get the unique identifier for sender + reciever.
            // const uniqueIdentifier = generateConversationId(incomingMessage.sender.userId, incomingMessage.reciever.otherPartyId);
            // NOTE: Means ham jis room mei aaye, us room ka address kya hai is actually "uniqueIdentifier"!
            if (conversationRooms.has(uniqueIdentifier)) { // Means if the room is already created.
              conversationRooms.get(uniqueIdentifier)?.add(decoded.user.sub);
              // NOTE: Recall, the current WS is owned by "decoded.user.sub".
              const newIncomingMessage = incomingMessage;
              newIncomingMessage.message = `${decoded.user.name} has joined the room!`;
              // Wait, ye "connected" ka message toh sirf, other party ko jaana chaiye na!!
              // if (clients.get(decoded.user.sub)?.readyState === WebSocket.OPEN) {
              //   clients.get(decoded.user.sub)?.send(JSON.stringify(newIncomingMessage), {binary: isBinary});
              // }
              // NOTE: How to get the other sender, means I, can be anyone, sender or reciever!
              // const otherPartyId = 
              console.log("Inside, room already created of ingress logic!");
              // [incomingMessage.sender.userId, incomingMessage.reciever.otherPartyId].map((indvId) => {
              //   if (indvId != decoded.user.sub) {
              //     if (clients.get(indvId)?.readyState === WebSocket.OPEN) {
              //       console.log(`${indvId} is connected!`);
              //       clients.get(indvId)?.send(JSON.stringify(newIncomingMessage), {binary: isBinary});
              //     }
              //   }
              // })
              if (clients.get(incomingMessage.reciever.otherPartyId)?.readyState === WebSocket.OPEN) {
                  console.log(`${incomingMessage.reciever.otherPartyName} is connected!`);
                  clients.get(incomingMessage.reciever.otherPartyId)?.send(JSON.stringify(newIncomingMessage), {binary: isBinary});
                }
            } else { // Means, nahi exist karta hai wo room!
              console.log(`Creating new room: ${uniqueIdentifier}`);
              conversationRooms.set(uniqueIdentifier, new Set([decoded.user.sub]));
            }

          }
        }

        if (incomingMessage.typeOfMessage == messageTypes.egress || incomingMessage.typeOfMessage == messageTypes.closingConnection) { // Means room se nikalna chah rha h
          if (!incomingMessage.isGroup) {
            console.log("Inside egress + closingConnection logic! Current conv rooms: ", conversationRooms.size);
            // Then first get the unique identifier for sender + reciever.
            // const uniqueIdentifier = generateConversationId(incomingMessage.sender.userId, incomingMessage.reciever.otherPartyId);
            // let userRole : string | null = null;
            // [incomingMessage.sender.userId, incomingMessage.reciever.otherPartyId].map((role, index) => {
            //   if (role == decoded.user.sub) {
            //     if (index == 0) userRole="sender";
            //     else userRole="reciever";
            //   }
            // })
            // NOTE: Means ham jis room mei aaye, us room ka address kya hai is actually "uniqueIdentifier"!
            if (conversationRooms.has(uniqueIdentifier)) { // Yes, the room should already be present. But better to check.
              if (conversationRooms.get(uniqueIdentifier)?.has(decoded.user.sub)) {
                console.log(`Removing ${decoded.user.name} from the conversationRoom.`);
                  conversationRooms.get(uniqueIdentifier)?.delete(decoded.user.sub);
              }
              if (conversationRooms.get(uniqueIdentifier)?.size == 0) {
                console.log("Deleting the conversationRoom.")
                conversationRooms.delete(uniqueIdentifier);
              }
              else {
                // NOTE: Recall, the current WS is owned by "decoded.user.sub".
                const newIncomingMessage = incomingMessage;
                newIncomingMessage.message = `${decoded.user.name} has left the room!`;
                // Wait, ye "connected" ka message toh sirf, other party ko jaana chaiye na!!
                // if (clients.get(decoded.user.sub)?.readyState === WebSocket.OPEN) {
                //   clients.get(decoded.user.sub)?.send(JSON.stringify(newIncomingMessage), {binary: isBinary});
                // }
                // NOTE: How to get the other sender, means I, can be anyone, sender or reciever!
                // const otherPartyId = 
                console.log("Inside, room already created of egress + closingConnection!");
                 if (clients.get(incomingMessage.reciever.otherPartyId)?.readyState === WebSocket.OPEN) {
                  console.log(`${incomingMessage.reciever.otherPartyName} is connected! So, notifying them of egression of the other party: ${incomingMessage.sender.userName}!`);
                  clients.get(incomingMessage.reciever.otherPartyId)?.send(JSON.stringify(newIncomingMessage), {binary: isBinary});
                }
                // [incomingMessage.sender.userId, incomingMessage.reciever.otherPartyId].map((indvId) => {
                //   if (indvId != decoded.user.sub) {
                //     if (clients.get(indvId)?.readyState === WebSocket.OPEN) {
                //       console.log(`${indvId} is connected!`);
                //       clients.get(indvId)?.send(JSON.stringify(newIncomingMessage), {binary: isBinary});
                //     }
  
                //   }
                // })
              }
            } else {
              console.log("No room existed for this user! User: ", decoded.user.name);
            }

          }
        }

         if (incomingMessage.typeOfMessage == messageTypes.message) { 
            if (!incomingMessage.isGroup) {
              // console.log("Inside messagelogic! Current conv rooms: ", conversationRooms.size);
              // Then first get the unique identifier for sender + reciever.
              // const uniqueIdentifier = generateConversationId(incomingMessage.sender.userId, incomingMessage.reciever.otherPartyId);
              messageQueue.enqueue(incomingMessage);
              enableSaveFunction();
              if (conversationRooms.has(uniqueIdentifier)) {
                // conversationRooms.get(uniqueIdentifier)? -> need to send message to both sides of the party. It may happen that the reciever is not present in the chat. So, message should reach him also.
                [incomingMessage.sender.userId, incomingMessage.reciever.otherPartyId].forEach((memberInTheRoom) => {
                  if (clients.get(memberInTheRoom)?.readyState === WebSocket.OPEN) {
                    clients.get(memberInTheRoom)?.send(data, { binary: isBinary });
                  }
                })
              } else {
                console.log("No room could be found for this user: ", decoded.user.name);
              }
            }
         }



      // Broadcast to all connected clients
      // wss.clients.forEach((client) => {
      //   console.log(clients.size);
      //   if (client.readyState === WebSocket.OPEN) {
      //     client.send(data, { binary: isBinary });
      //   }
      // });
    });

    ws.on("close", () => {
      clients.delete(clientId);
      // console.log(clients.size);
      console.log(`Socket connection closed for ${clientId}. Clients remaining: ${clients.size}`);
      messageQueue.getItems().forEach((eachMessage) => console.log(eachMessage.message));
    });
  });
}
