import User from "../../models/User";
import Comment from "../../models/Comment";
import dbConnect from "../../lib/db";

export async function POST(req) {
  await dbConnect();
  const { date, userId, songId, comment, myUsername } = await req.json();
  const newComment = new Comment({
    username: myUsername,
    comment: comment,
  });
  const savedComment = await newComment.save();
  if (!savedComment) {
    return new Response(
      JSON.stringify({ message: "Could not save song to database" }),
      { status: 404 }
    );
  }
  const user = await User.findById(userId);
  if (!user) {
    return new Response(JSON.stringify({ message: "Could not find user" }), {
      status: 404,
    });
  }
  const entryIndex = user.songs.findIndex((entry) => {
    const entryDate = entry.date.toISOString().split("T")[0];
    return entryDate == date && entry.song.toString() === songId;
  });
  if (entryIndex < 0) {
    return new Response(
      JSON.stringify({ message: "Could not find song entry" }),
      {
        status: 404,
      }
    );
  }
  user.songs[entryIndex].comments.push(savedComment._id);
  await user.save();
  return new Response(
    JSON.stringify({ message: "Successfully added comment!" }),
    {
      status: 200,
    }
  );
}
