import dbConnect from "../../lib/db";
import { validateSession } from "../../auth/session";

export async function GET(req) {
  await dbConnect();

  const { cookies } = req;
  const sessionToken = cookies.get("sessionToken");

  if (!sessionToken) {
    return new Response(
      JSON.stringify({ loggedIn: false, message: "No session token" }),
      { status: 200 }
    );
  }

  const { session, user } = await validateSession(sessionToken);

  if (!session || !user) {
    return new Response(
      JSON.stringify({ loggedIn: false, message: "Invalid session" }),
      { status: 200 }
    );
  }

  return new Response(JSON.stringify({ loggedIn: true, user }), {
    status: 200,
  });
}
