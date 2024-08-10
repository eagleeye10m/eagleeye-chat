import { pusherServer } from "@/lib/pusher";
import Chat from "@/models/Chat";
import { User } from "@/models/User";
import { connectToDB } from "@/mongoDb";
import { revalidateTag } from "next/cache";

export const POST = async (req, { params }) => {
  try {
    await connectToDB();

    const body = await req.json();
    const { currentUserId, members, isGroup, name, groupPhoto } = body;

    //Define query to find the chat
    const query = isGroup
      ? { isGroup, name, groupPhoto, members: [currentUserId, ...members] }
      : { members: { $all: [currentUserId, ...members], $size: 2 } }; //size 2 is to make sure that this chat only has 2 members cause its not a group chat!

    let chat = await Chat.findOne(query);

    if (!chat) {
      //If chat does not exists, create a new one
      chat = await new Chat(
        isGroup ? query : { members: [currentUserId, ...members] }
      );

      await chat.save();

      const updateAllMembers = chat.members.map(async (memberId) => {
        await User.findByIdAndUpdate(
          memberId,
          {
            $addToSet: { chats: chat._id },
          },
          {
            new: true,
          }
        );
      });
      Promise.all(updateAllMembers); //we can clean the promise.all BTW, it doesnt matter as I've test that out

      /*trigger a pusher event for each member to notify a new chat */
      chat.members.map((member) => {
        pusherServer.trigger(member._id.toString(), "new-chat", chat);
      });
    }
    revalidateTag("contacts");
    revalidateTag("chats");

    return new Response(JSON.stringify(chat), { status: 201 });
  } catch (error) {
    console.log(error);
    return new Response("Failed to create a new chat", { status: 500 });
  }
};
