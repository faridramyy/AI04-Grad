import mongoose from "mongoose";

const gameSessionSchema = new mongoose.Schema({
    session_id: { type: mongoose.Schema.Types.ObjectId, ref: "TherapySession", required: true }, // Linked to therapy session
    stress_score_before: { type: Number, default: 0 }, // Default stress score before the session
    stress_score_after: { type: Number, required: true }, // Stress score after session
    questions: { type: [mongoose.Schema.Types.ObjectId], ref: "StressScenario", required: true }, // Array of question IDs
    user_answers: { type: [Number], required: true }, // Array of user answers
    is_correct: { type: [Boolean], required: true }, // Boolean array to track correctness
    final_score: { type: Number, required: true }, // Final calculated score
    difficulty_level: { type: String, enum: ["easy", "medium", "hard"], required: true } // Session difficulty level
});

// Create and export the model
const GameSession = mongoose.model("GameSession", gameSessionSchema);
export default GameSession;