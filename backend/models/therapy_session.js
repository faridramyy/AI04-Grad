import mongoose from "mongoose";

const therapySessionSchema = new mongoose.Schema({
    patient_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    patient_emotion: {
        type: String,
        enum: ["neutral", "happy", "sad", "fear"],
        required: true,
    },
    start_time: { type: Date, required: true },
    end_time: { type: Date, required: true },
    emotion_records: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "ExtractedEmotion",
        default: [],
    }, // Nullable
    stress_score_before: { type: Number, default: null }, // Nullable
    stress_score_after: { type: Number, default: null }, // Nullable
    chat_sessions: [
        { type: mongoose.Schema.Types.ObjectId, ref: "AI_Message", default: [] },
    ], // Nullable
    game_sessions: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "GameSession",
        default: [],
    }, // Nullable
    challenges_sessions: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "ChallengeSession",
        default: [],
    }, // Nullable
});

// Create and export model
const TherapySession = mongoose.model("TherapySession", therapySessionSchema);
export default TherapySession;