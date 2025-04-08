import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
  user: {
    type: String, // user UUID
    required: true,
  },
  conversations: [
    {
      isGroup: {
        type: Boolean,
        required: true,
      },
      otherParty: {
        type: String, // either another user's UUID or a group's _id as string
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
