import { User } from "@/models/User";
import { connectToDB } from "@/mongoDb/index";
import { hash } from "bcryptjs";

export const POST = async (req) => {
  try {
    await connectToDB();

    const body = await req.json();

    const { username, email, password } = body;

    const existingUser = await User.findOne({ email }); //cause in User schema, the email is unique

    if (existingUser) {
      return new Response("User already exists", {
        status: 400,
        statusText: "User already exists",
      });
    }

    const hashedPassword = await hash(password, 10);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    return new Response(JSON.stringify(newUser), {
      status: 201,
    });
  } catch (error) {
    console.log(error);
    return new Response(`Failed to create new user: ${error}`, {
      status: 500,
    });
  }
};
