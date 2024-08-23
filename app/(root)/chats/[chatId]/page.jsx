import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import ChatList from "@/components/ChatList";
import ChatDetails from "@/components/ChatDetails";
import { connectToDB } from "@/mongoDb";
import { NextResponse } from "next/server";
import Message from "@/models/Message";
import { User } from "@/models/User";

const ChatPage = async ({ params }) => {
  const data = await getServerSession(authOptions);
  const session = JSON.parse(JSON.stringify(data));

  const { chatId } = params;
  console.log(session);

  const { _id } = data?.user;
  const currentUserId = _id.toString();

  const seenMessage = async () => {
    "use server";
    try {
      await connectToDB();

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

  try {
    await seenMessage();
  } catch (error) {
    console.log(error);
  }

  return (
    <section className="main-container">
      <div className="w-1/3 max-lg:hidden">
        <ChatList currentChatId={chatId} session={session} />
      </div>
      <div className="w-2/3 max-lg:w-full">
        <ChatDetails chatId={chatId} session={session} />
      </div>
    </section>
  );
};

export default ChatPage;
