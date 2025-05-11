import mongoose from "mongoose";

// Define the Extracted Emotions Schema
const ExtractedEmotionSchema = new mongoose.Schema({
  session_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "TherapySession",
    required: true,
  }, // Linking to TherapySession
  created_at: { type: Date, default: Date.now },
  extracted_emotion: {
    type: String,
    required: true,
  },
  uploaded_data_type: {
    type: String,
    enum: ["brain", "text", "audio", "video"],
    required: true,
  },
  file_paths: { type: String, required: true }, // Path to uploaded data
});

// Create and export the model
const ExtractedEmotion = mongoose.model(
  "ExtractedEmotion",
  ExtractedEmotionSchema
);
export default ExtractedEmotion;
