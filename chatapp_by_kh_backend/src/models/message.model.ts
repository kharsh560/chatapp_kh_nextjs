import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    typeOfMessage: {
      type: String,
      required: true,
    },
    activeChatUniqueUUID: {
      type: String,
      required: true,
    },
    isGroup: {
      type: Boolean,
      required: true,
    },
    sender: {
      userId: {
        type: String,
        required: true,
      },
      userName: {
        type: String,
        required: true,
      },
      userAvatar: {
        type: String,
        required: true,
      },
    },
    reciever: {
      otherPartyId: {
        type: String,
        required: true,
        default: null,
      },
      otherPartyObjectIdIfIts_a_GroupMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Group",
        default: null,
      },
      otherPartyName: {
        type: String,
        required: true,
      },
      otherPartyAvatar: {
        type: String,
        required: true,
      },
    },
    message: {
      type: String,
      required: true,
    },
    extraPayload: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    newConversationInitialization: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// const messageSchema = new mongoose.Schema({
//   sender: {
//     type: String, // user UUID from Postgres
//     required: true,
//   },
//   receiver: {
//     type: String, // user UUID from Postgres
//     default: null,
//   },
//   groupId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Group",
//     default: null,
//   },
//   message: {
//     type: String,
//     required: true,
//   }
//   // NOTE: I have made the schema such that, from the source, if its a group, only then groupId will be present. And same for the reciever, which is a simple one.
// }, {
//   // If you want Mongoose to maintain createdAt/updatedAt
//   timestamps: true,
// });

export const Message = mongoose.model("Message", messageSchema);


// import mongoose from "mongoose";

// const messageSchema = new mongoose.Schema({
//   typeOfMessage: {
//     type: String,
//     required: true,
//   },
//   activeChatUniqueUUID: {
//     type: String,
//     required: true,
//   },
//   isGroup: {
//     type: Boolean,
//     default: false,
//   },
//   sender: {
//     userId: {
//       type: String, // UUID from Postgres
//       required: true,
//     },
//     userName: {
//       type: String,
//       required: true,
//     }
//   },
//   receiver: {
//     otherPartyId: {
//       type: String, // UUID from Postgres
//       required: true,
//     },
//     otherPartyName: {
//       type: String,
//       required: true,
//     }
//   },
//   message: {
//     type: String,
//     required: true,
//   },
//   groupId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Group",
//     default: null,
//   },
// }, {
//   timestamps: true,
// });

// export const Message = mongoose.model("Message", messageSchema);

