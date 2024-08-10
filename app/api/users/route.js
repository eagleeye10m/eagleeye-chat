import { User } from "@/models/User";
import { connectToDB } from "@/mongoDb";

export const dynamic = "force-static";
export const GET = async () => {
  try {
    await connectToDB();

    const allUsers = await User.find();
    return new Response(JSON.stringify(allUsers), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("Failed to get all users", { status: 500 });
  }
};
