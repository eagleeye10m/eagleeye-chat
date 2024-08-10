import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    reqiured: true,
    unique: true,
  },
  password: {
    type: String,
    reqiured: true,
    unique: true,
  },
  profileImage: {
    type: String,
    default: "",
  },
  chats: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Chat" }],
    default: [],
  },
});

export const User = mongoose.models.User || mongoose.model("User", UserSchema);
