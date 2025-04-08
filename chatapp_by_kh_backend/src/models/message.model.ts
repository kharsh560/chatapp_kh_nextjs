import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  sender: {
    type: String, // user UUID from Postgres
    required: true,
  },
  receiver: {
    type: String, // user UUID from Postgres
    required: true,
  },
  groupId: {
    type: mongoose.Schema.Types.ObjectId, // references a groupSchema _id
    ref: "Group", // optional if you want to populate group data
    default: null,
  },
}, {
  // If you want Mongoose to maintain createdAt/updatedAt
  timestamps: true,
});

export const Message = mongoose.model("Message", messageSchema);
