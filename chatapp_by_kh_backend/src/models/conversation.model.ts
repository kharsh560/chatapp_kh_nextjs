import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
  userUUID: {
    type: String, // user UUID
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  conversations: [
    {
      uniqueChatUUID: {
        type: String,
        required: true,
      },
      isGroup: {
        type: Boolean,
        required: true,
      },
      otherParty: {
        type: String, // either another user's UUID or a group's _id as string
        required: true,
      },
      otherPartyDP: {
        type: String,
        required: true,
      },
      otherPartyName: {
        type: String,
        required: true,
      },
      lastRead: {
        timestamp: {
          type: Date,
          default: null,
        },
        messageId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Message", // references messageSchema
          default: null,
        },
      },
    },
  ],
}, {
  timestamps: true,
});

export const Conversation = mongoose.model("Conversation", conversationSchema);
