import mongoose from "mongoose";

const userSettingsSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  avatar_voice: { type: Boolean, default: true }, // Whether the avatar speaks out loud
  avatar_gender: { type: String, enum: ["male", "female"], required: true }, // Gender of the AI avatar
  background_music: { type: Boolean, default: true }, // Whether background music is enabled
});

const UserSettings = mongoose.model("UserSettings", userSettingsSchema);
export default UserSettings;
