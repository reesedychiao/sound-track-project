import User from "../../models/User";
import dbConnect from "../../lib/db";

export async function POST(req) {
  await dbConnect();
  const { username } = await req.json();
  try {
    const user = await User.findOne({ username: username });
    if (!user) {
      return new Response(JSON.stringify({ message: "User does not exist" }), {
        status: 404,
      });
    }
    return new Response(JSON.stringify({ user }), {
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
    });
  }
}
