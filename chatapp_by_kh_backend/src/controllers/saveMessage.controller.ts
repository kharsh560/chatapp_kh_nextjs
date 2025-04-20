import { Mongoose } from "mongoose";
import { chatMessagePayload } from "../socketLogics/sockets";
import { Message } from "../models/message.model";

export class Queue<T> {
  private items: T[] = [];

  enqueue(item: T): void {
    this.items.push(item);
  }

  dequeue(): T | undefined {
    return this.items.shift();
  }

  peek(): T | undefined {
    return this.items[0];
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  size(): number {
    return this.items.length;
  }

  clear(): void {
    this.items = [];
  }

    getItems(): T[] {
        return [...this.items];
    }
}

const messageQueue = new Queue<chatMessagePayload>();

let isSaveFunctionRunning = 0;

const enableSaveFunction = () => {
    if (!isSaveFunctionRunning) { // Means if the function is not enabled.
        saveMessageFxn();
    }
}

const saveMessageFxn = async () => {
    isSaveFunctionRunning = 1;

    while (!messageQueue.isEmpty()) {
        const lastMessage = messageQueue.peek();

        const saveMessageInDB = async () => {
            let response;

            const options = lastMessage?.isGroup
                ? {
                    typeOfMessage: lastMessage.typeOfMessage,
                    activeChatUniqueUUID: lastMessage?.activeChatUniqueUUID,
                    isGroup: lastMessage?.isGroup,
                    sender: {
                        userId: lastMessage?.sender?.userId,
                        userName: lastMessage?.sender?.userName,
                        userAvatar: lastMessage?.sender?.userAvatar,
                    },
                    reciever: {
                        otherPartyId: null,
                        otherPartyObjectIdIfIts_a_GroupMessage: lastMessage?.reciever?.otherPartyObjectIdIfIts_a_GroupMessage,
                        otherPartyName: lastMessage?.reciever?.otherPartyName,
                        otherPartyAvatar: lastMessage?.reciever?.otherPartyAvatar,
                    },
                    message: lastMessage?.message,
                    extraPayload: null, //lastMessage?.extraPayload,
                    newConversationInitialization: lastMessage?.newConversationInitialization,
                }
                : {
                    typeOfMessage: lastMessage?.typeOfMessage,
                    activeChatUniqueUUID: lastMessage?.activeChatUniqueUUID,
                    isGroup: lastMessage?.isGroup,
                    sender: {
                        userId: lastMessage?.sender?.userId,
                        userName: lastMessage?.sender?.userName,
                        userAvatar: lastMessage?.sender?.userAvatar,
                    },
                    reciever: {
                        otherPartyId: lastMessage?.reciever?.otherPartyId,
                        otherPartyObjectIdIfIts_a_GroupMessage: null,
                        otherPartyName: lastMessage?.reciever?.otherPartyName,
                        otherPartyAvatar: lastMessage?.reciever?.otherPartyAvatar,
                    },
                    message: lastMessage?.message,
                    extraPayload: null, //lastMessage?.extraPayload,
                    newConversationInitialization: lastMessage?.newConversationInitialization,
                };

                try {
                    response = await Message.create(options);
                    console.log(`${lastMessage?.message} -> saved!`);
                    messageQueue.dequeue();
                } catch (error) {
                    console.error("Failed to save user:", console.log(error));
                }
        }   
        await saveMessageInDB(); 
    }

    console.log("messageQueue is now empty.");
    isSaveFunctionRunning = 0;
}

export {messageQueue, enableSaveFunction}
