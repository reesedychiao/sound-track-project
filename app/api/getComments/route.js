import User from "../../models/User";
import Comment from "../../models/Comment";
import dbConnect from "../../lib/db";

export async function POST(req) {
  await dbConnect();
  const { date, userId, songId } = await req.json();
  const user = await User.findById(userId).populate("songs.comments");
  if (!user) {
    return new Response(JSON.stringify({ message: "Could not find user" }), {
      status: 404,
    });
  }
  const entry = user.songs.find((entry) => {
    const entryDate = entry.date.toISOString().split("T")[0];
    return entryDate == date && entry.song.toString() === songId;
  });
  if (!entry) {
    return new Response(
      JSON.stringify({ message: "Could not find song entry" }),
      {
        status: 404,
      }
    );
  }

  return new Response(JSON.stringify({ comments: entry.comments }), {
    status: 200,
  });
}
