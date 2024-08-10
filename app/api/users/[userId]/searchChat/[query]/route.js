import Chat from "@/models/Chat";
import Message from "@/models/Message";
import { User } from "@/models/User";
import { connectToDB } from "@/mongoDb";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const GET = async (req, { params }) => {
  try {
    await connectToDB();

    const { userId, query } = params;

    const searchedChats = await Chat.find({
      members: userId,
      name: { $regex: query, $options: "i" },
    })
      .populate({
        path: "members",
        model: User,
      })
      .populate({
        path: "messages",
        model: Message,
        populate: {
          path: "sender seenBy",
          model: User,
        },
      })
      .exec();

    return new NextResponse(JSON.stringify(searchedChats), { status: 201 });
  } catch (error) {
    console.log(error);
    return new NextResponse("Failed to search ", { status: 500 });
  }
};
