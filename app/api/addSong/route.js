import Song from "../../models/Song";
import dbConnect from "../../lib/db";
import User from "../../models/User";

export async function POST(req) {
  await dbConnect();
  const {
    title,
    albumCover,
    artist,
    artistId,
    link,
    uri,
    date,
    description,
    userId,
  } = await req.json();
  try {
    const newSong = new Song({
      title: title,
      albumCover: albumCover,
      artist: artist,
      artistId: artistId,
      link: link,
      uri: uri,
      description: description,
    });
    const savedSong = await newSong.save();
    if (!savedSong) {
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
    user.songs.push({ date: date, song: savedSong._id });
    await user.save();
    return new Response(JSON.stringify({ newSong: savedSong, user: user }), {
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
    });
  }
}
