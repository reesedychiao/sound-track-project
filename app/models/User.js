import mongoose from "mongoose";

mongoose.connect(process.env.DNS);

const userSchema = new mongoose.Schema({
  id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  sessions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Session" }],
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  songs: [
    {
      date: { type: Date, required: true },
      song: { type: mongoose.Schema.Types.ObjectId, ref: "Song" },
      comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
    },
  ],
  privacy: { type: String },
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
