import User from "../../models/User";
import dbConnect from "../../lib/db";
import Song from "../../models/Song";

export async function POST(req) {
  await dbConnect();
  const { userId, songId, date } = await req.json();
  const user = await User.findById(userId);
  if (!user) {
    return new Response(JSON.stringify({ message: "Could not find user" }), {
      status: 404,
    });
  }
  user.songs = user.songs.filter((song) => {
    return !(
      new Date(song.date).toISOString().split("T")[0] === date &&
      song.song.toString() === songId
    );
  });
  await user.save();
  const deletedSong = await Song.deleteOne({ _id: songId });
  if (deletedSong.deletedCount === 0) {
    return new Response(
      JSON.stringify({ message: "Could not delete the song" }),
      { status: 404 }
    );
  }
  return new Response(
    JSON.stringify({ message: "Successfully deleted song!" }),
    { status: 200 }
  );
}
