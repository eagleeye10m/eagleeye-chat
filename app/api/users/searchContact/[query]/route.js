import { User } from "@/models/User";
import { connectToDB } from "@/mongoDb";

export const GET = async (req, { params }) => {
  try {
    await connectToDB();

    const { query } = params;

    const searchContext = await User.find({
      //use either username or either email
      $or: [
        { username: { $regex: query, $options: "i" } }, //i stands for insensitive for capital letters.
        { email: { $regex: query, $options: "i" } },
      ],
    });

    return new Response(JSON.stringify(searchContext), { status: 200 });
  } catch (error) {
    return new Response("Failed to search contact", { status: 500 });
  }
};
