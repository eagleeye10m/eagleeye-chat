import Chat from "@/models/Chat";
import Message from "@/models/Message";
import { User } from "@/models/User";
import { connectToDB } from "@/mongoDb";
import { NextResponse } from "next/server";

export const GET = async (req, { params }) => {
  try {
    await connectToDB();

    const { userId } = params;

    const allChats = await Chat.find({ members: userId })
      .sort({ lastMessageAt: -1 }) //-1 means desending order
      .populate({ path: "members", model: User })
      .populate({
        path: "messages",
        model: Message,
        populate: { path: "sender seenBy", model: User },
      })
      .exec();

    return new NextResponse(JSON.stringify(allChats), { status: 201 });
  } catch (error) {
    console.log(error);

    return new NextResponse("Failed to get all chats of current user", {
      status: 500,
    });
  }
};
