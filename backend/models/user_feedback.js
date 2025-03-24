import mongoose from "mongoose";

const userFeedbackSchema = new mongoose.Schema({
  session_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "TherapySession",
    required: true,
  },
  rating: { type: Number, required: true, min: 1, max: 5 }, // Rating from 1 to 5
  feedback: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
});

// Create and export the model
const UserFeedback = mongoose.model("UserFeedback", userFeedbackSchema);
export default UserFeedback;
