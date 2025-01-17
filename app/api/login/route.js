import { createSession, generateRandomSessionToken } from "../../auth/session";
import dbConnect from "../../lib/db";
import User from "../../models/User";
import bcrypt from "bcrypt";

export async function POST(req) {
  await dbConnect();
  const { username, password } = await req.json();

  try {
    const userMatch = await User.findOne({ username });
    if (!userMatch) {
      return new Response(JSON.stringify({ message: "User does not exist" }), {
        status: 404,
      });
    }
    const passwordMatch = await bcrypt.compare(password, userMatch.password);
    if (!passwordMatch) {
      return new Response(
        JSON.stringify({ message: "Password is incorrect" }),
        {
          status: 401,
        }
      );
    }
    const sessionToken = generateRandomSessionToken();
    const session = await createSession(sessionToken, userMatch._id);

    const response = new Response(
      JSON.stringify({ message: "Login successful" }),
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
