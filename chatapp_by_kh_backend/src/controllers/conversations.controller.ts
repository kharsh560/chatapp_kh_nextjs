import { Request, Response } from "express";
import { Conversation } from "../models/conversation.model";
import { Queue } from "./saveMessage.controller";
import { chatMessagePayload } from "../socketLogics/sockets";

const conversationQueue = new Queue<chatMessagePayload>();

let isConvSaveFunctionRunning = 0;

const enableConvSaveFunction = () => {
    if (!isConvSaveFunctionRunning) { // Means if the function is not enabled.
        saveConvFxn();
    }
}

const saveConvFxn = async () => {
    console.log("saveConvFxn: ", saveConvFxn);
    isConvSaveFunctionRunning = 1;

    while (!conversationQueue.isEmpty()) {
        const latestMessagetoBeSavedInConv = conversationQueue.peek();
        // And now, isko ek baar against a sender save karo and then against a reciever.

        await Conversation.updateOne(
            // {First arg = filter condition} Only WS of the user mei se update karo. Bcoz this will run for both, the sender as well as reciever.
            { userUUID: latestMessagetoBeSavedInConv?.sender.userId,
                "conversations.uniqueChatUUID": {
                    $ne: latestMessagetoBeSavedInConv?.activeChatUniqueUUID,
                }, 

            }, 
            {
            $addToSet: {
                // Using "$addToSet" (prevents duplicates based on entire object match):
                conversations: {
                    uniqueChatUUID: latestMessagetoBeSavedInConv?.activeChatUniqueUUID,
                    isGroup: latestMessagetoBeSavedInConv?.isGroup,
                    otherParty: latestMessagetoBeSavedInConv?.reciever?.otherPartyId,
                    otherPartyDP: latestMessagetoBeSavedInConv?.reciever?.otherPartyAvatar,
                    otherPartyName: latestMessagetoBeSavedInConv?.reciever?.otherPartyName,
                    lastRead: {
                        timestamp: null,
                        messageId: null,
                    },
                },
            },
            }
        );

        await Conversation.updateOne(
            // {First arg = filter condition} Only WS of the user mei se update karo. Bcoz this will run for both, the sender as well as reciever.
            { userUUID: latestMessagetoBeSavedInConv?.reciever?.otherPartyId, 
                "conversations.uniqueChatUUID": {
                    $ne: latestMessagetoBeSavedInConv?.activeChatUniqueUUID,
                }, 
            }, 
            {
            $addToSet: {
                // Using "$addToSet" (prevents duplicates based on entire object match):
                conversations: {
                    uniqueChatUUID: latestMessagetoBeSavedInConv?.activeChatUniqueUUID,
                    isGroup: latestMessagetoBeSavedInConv?.isGroup,
                    otherParty: latestMessagetoBeSavedInConv?.sender.userId,
                    otherPartyDP: latestMessagetoBeSavedInConv?.sender.userAvatar,
                    otherPartyName: latestMessagetoBeSavedInConv?.sender.userName,
                    lastRead: {
                        timestamp: null,
                        messageId: null,
                    },
                },
            },
            }
        );

        conversationQueue.dequeue();
    }
    console.log("Updated the conversations of both the users and emptied the conversation queue.");
    isConvSaveFunctionRunning = 0;
}

const createConversationForNewSignedUpUser = async (req : Request, res : Response) => {
    // It will be a protected route. So, there will be user in req. -> NO, NO, NO!
    // It won't be a protected route. Of course, that's a shitty thought! Because, user's conversation needs to bemade just after the sign up is done, and not just after the sign in is done!
    const newlyCreatedUser = req.body.newlyCreatedUser;
    const userId = newlyCreatedUser?.id;
    const userName = newlyCreatedUser?.username;
    // console.log("userId:", userId);

    if (!userId) {
        res.status(401).json({message: "User was not found attached in the request. Unauthenticated!"});
        return;
    }

    try {
        const response = await Conversation.create({
            userUUID: userId,
            userName,
            conversations: [], // Just for being more explicit!
        });
        if (response) {
            console.log("Conversation for this user is created successfully. response:- ", response)
            res.status(200).json({message: "Conversation for this user is created successfully.", newlyCreatedConversation: response});
            return;
        }
    } catch (error) {
        res.status(500).json({message: "Problem encountered in creating a conversation for this user.", error});
        return;
    }
}

const getConversationsOfIndividualUser = async (req : Request, res : Response) => {
    const user = req.user;
    // console.log("user in getConversationsOfIndividualUser :", user);
    if (!user) {
        res.status(401).json({message: "User was not found attached in the request. Unauthenticated!"});
        return;
    }
    try {
        const response = await Conversation.findOne({userUUID: user.id});
        // console.log("response in getConversationsOfIndividualUser: ", response);
        if (response) {
            res.status(200).json({message: "Successfully retrieved conversations for this user.", conversations: response});
            return;
        } else {
            res.status(200).json({ message: "No conversations found for this user." });
            return;
        }
    } catch (error) {
        res.status(500).json({message: "Problem encountered in fetching the conversations for this user.", error});
        return;
    }
}

export {createConversationForNewSignedUpUser, getConversationsOfIndividualUser, conversationQueue, enableConvSaveFunction};