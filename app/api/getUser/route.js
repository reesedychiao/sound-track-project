import dbConnect from "../../lib/db";
import { validateSession } from "../../auth/session";

export async function GET(req) {
  await dbConnect();
  const { cookies } = req;
  const sessionToken = cookies.get("sessionToken")?.value;
  if (!sessionToken) {
    return new Response(JSON.stringify({ message: "No session token found" }), {
      status: 401,
    });
  }

  try {
    const { session, user } = await validateSession(sessionToken);
    if (!session || !user) {
      return new Response(JSON.stringify({ message: "Invalid session" }), {
        status: 401,
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
