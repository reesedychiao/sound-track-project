import mongoose from "mongoose";

mongoose.connect(process.env.DNS);

const songSchema = new mongoose.Schema({
  title: { type: String, required: true },
  albumCover: { type: String, required: true },
  artist: { type: String, required: true },
  artistId: { type: String, required: true },
  link: { type: String, required: true },
  uri: { type: String, required: true },
  description: { type: String, required: true },
});

const Song = mongoose.models.Song || mongoose.model("Song", songSchema);

export default Song;
