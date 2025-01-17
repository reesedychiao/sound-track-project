import User from "../../models/User";
import bcrypt from "bcryptjs";
import dbConnect from "../../lib/db";
import { createSession, generateRandomSessionToken } from "../../auth/session";

export async function POST(req) {
  await dbConnect();
  const { username, password, privacy } = await req.json();

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return new Response(JSON.stringify({ message: "User already exists" }), {
        status: 400,
      });
    }
    const salt = bcrypt.genSaltSync(10);
    const hashedPW = bcrypt.hashSync(password, salt);
    const newUser = new User({
      username: username,
      password: hashedPW,
      privacy,
    });
    await newUser.save();
    const sessionToken = generateRandomSessionToken();
    const session = await createSession(sessionToken, newUser._id);
    const response = new Response(
      JSON.stringify({ message: "User registered successfully" }),
      {
        status: 200,
      }
    );
    response.headers.set(
      "Set-Cookie",
      `sessionToken=${sessionToken}; Path=/; Expires=${session.expireDate.toUTCString()}; HttpOnly; SameSite=Lax`
    );
    return response;
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
    });
  }
}
