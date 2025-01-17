import dbConnect from "../../lib/db";
import User from "../../models/User";
import Song from "../../models/Song";

export async function POST(req) {
  await dbConnect();
  const { date, userId } = await req.json();
  try {
    const user = await User.findById(userId).populate("songs.song");
    if (!user) {
      return new Response(JSON.stringify({ message: "Could not find user" }), {
        status: 404,
      });
    }
    const songRecords = user.songs.filter((song) => {
      const songDate = new Date(song.date).toISOString().split("T")[0];
      const inputDate = date;
      return songDate === inputDate;
    });
    if (songRecords.length === 0) {
      return new Response(
        JSON.stringify({ message: "No song saved for that date" }),
        {
          status: 200,
        }
      );
    }
    const songs = songRecords.map((record) => record.song);
    return new Response(JSON.stringify({ tracks: songs }), {
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
    });
  }
}
