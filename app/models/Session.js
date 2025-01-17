import mongoose from "mongoose";

mongoose.connect(process.env.DNS);

const sessionSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  expireDate: { type: Date, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const Session =
  mongoose.models.Session || mongoose.model("Session", sessionSchema);

export default Session;
