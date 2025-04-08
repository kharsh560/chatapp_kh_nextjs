import mongoose from "mongoose";

const groupSchema = new mongoose.Schema({
  admin: {
    type: String, // user UUID
    required: true,
  },
  participants: {
    type: [String], // array of user UUIDs
    required: true,
  },
  groupName: {
    type: String,
    required: true,
  },
  groupDP: {
    type: String, // cloudinary URL
    default: "",
  },
}, {
  timestamps: true,
});

export const Group = mongoose.model("Group", groupSchema);
