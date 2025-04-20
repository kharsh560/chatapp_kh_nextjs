import { Request, Response } from "express";
import { generateChatroomUUID } from "../utilities/getChatroomUUID";
import { Message } from "../models/message.model";

export type conversationArrayState = {
    uniqueChatUUID: string;
    isGroup: boolean;
    otherParty: string;
    otherPartyName: string;
    otherPartyDP: string;
    lastRead: {
        timestamp: Date;
        messageId: string;
    }
}

export type conversationSliceStatesType = {
    userUUID: string;
    userName: string;
    conversations: conversationArrayState[];
    createdAt: Date | null;
    updatedAt: Date | null;
    __v: number | null;
    _id: string;
}

const getAllMessagesForTheGivenConversations = async (req: Request, res: Response) => {
    console.log("Inside getAllMessagesForTheGivenConversations controller!");
    const userRequestingTheseMessages = req.user?.sub;
    const conversationDoc : conversationSliceStatesType = req.body.allConv;
    const id1 = conversationDoc?.userUUID;
    // console.log("conversationDoc: ", conversationDoc);

    if (id1 !== userRequestingTheseMessages) {
        res.status(401).json({message: "User is un-authorized to get the messages for this conversation."});
        return;
    }

    const allConversationsOfThisUser : conversationArrayState[] = conversationDoc?.conversations;
    let id2;
    const allMessagesUnderTheseConversations: { [key: string]: any[] }[] = [];
    // Just a refresher :-
    // The forEach() method calls a function for each element in an array.
    // The JavaScript for in statement loops through the properties of an Object:
    // allConversationsOfThisUser.forEach(async (conversation) => {
    //     id2 = conversation?.otherParty;
    //     const currentChatroomUUID : string = generateChatroomUUID(id1, id2);
    //     const allMessagesInCurrentChatRoom : any = {};
    //     let messages;
    //     try {
    //         messages = await Message.find({
    //             $or: [
    //                 { sender: id1, receiver: id2 },
    //                 { sender: id2, receiver: id1 },
    //             ],
    //         }).sort({ createdAt: 1 });
    //     } catch (error) {
    //         console.log("Error finding messages for the chatroom: ", currentChatroomUUID);
    //     }
    //     // console.log("messages: ", messages);
    //     allMessagesInCurrentChatRoom[currentChatroomUUID] = messages;
    //     // console.log("allMessagesInCurrentChatRoom: ", allMessagesInCurrentChatRoom);
    //     allMessagesUnderTheseConversations.push(allMessagesInCurrentChatRoom);
    // })

    for (const conversation of allConversationsOfThisUser) {
  const id2 = conversation?.otherParty;
  const currentChatroomUUID: string = generateChatroomUUID(id1, id2);
  const allMessagesInCurrentChatRoom: any = {};
  let messages;

  try {
    messages = await Message.find({
      $or: [
        { sender: id1, receiver: id2 },
        { sender: id2, receiver: id1 },
      ],
    }).sort({ createdAt: 1 });
  } catch (error) {
    console.log("Error finding messages for the chatroom: ", currentChatroomUUID);
    continue; // optional: skip this one if error
  }

//   allMessagesInCurrentChatRoom[currentChatroomUUID] = messages;
    allMessagesInCurrentChatRoom["currentChatroomUUID"] = currentChatroomUUID;
    allMessagesInCurrentChatRoom["messages"] = messages;
  allMessagesUnderTheseConversations.push(allMessagesInCurrentChatRoom);
}

    // console.log("allMessagesUnderTheseConversations: ", JSON.stringify(allMessagesUnderTheseConversations));
    res.status(200).json( allMessagesUnderTheseConversations );
}

export {getAllMessagesForTheGivenConversations};