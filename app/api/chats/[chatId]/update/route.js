import Chat from "@/models/Chat";
import { connectToDB } from "@/mongoDb";
import { NextResponse } from "next/server";

export const POST = async (req, { params }) => {
  try {
    await connectToDB();

    const body = await req.json();

    const { chatId } = params;

    const { name, groupPhoto } = body;

    const updatedGroupChat = await Chat.findByIdAndUpdate(
      chatId,
      { name, groupPhoto },
      { new: true }
    );

    return new NextResponse(JSON.stringify(updatedGroupChat), { status: 201 });
  } catch (error) {
    return new NextResponse("Failed to update group chat photo", {
      status: 500,
    });
  }
};
