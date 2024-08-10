import Chat from "@/models/Chat";
import Message from "@/models/Message";
import { User } from "@/models/User";
import { connectToDB } from "@/mongoDb";
import { NextResponse } from "next/server";

export const GET = async (req, { params }) => {
  try {
    await connectToDB();

    const chat = await Chat.findById(params.chatId)
      .populate({ path: "members", model: User })
      .populate({
        path: "messages",
        model: Message,
        populate: {
          path: "sender seenBy",
          model: User,
        },
      })
      .exec();

    return new NextResponse(JSON.stringify(chat), { status: 201 });
  } catch (error) {
    console.log(error);
    return new NextResponse("Failed to get chat details", { status: 500 });
  }
};

export const POST = async (req, { params }) => {
  try {
    await connectToDB();
    const { chatId } = params;
    const body = req.json();
    const { currentUserId } = body;

    await Message.updateMany(
      {
        chat: chatId,
      },
      { $addToSet: { seenBy: currentUserId } }, //  $addToSet :	 Adds elements to an array only if they do not already exist in the set.
      { new: true }
    )
      .populate({
        path: "sender seenBy",
        model: User,
      })
      .exec();

    return new NextResponse("Seen all message by current user", {
      status: 201,
    });
  } catch (error) {
    console.log(error);
    return new NextResponse("Failed to update seen users", { status: 500 });
  }
};
