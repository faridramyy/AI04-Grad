import mongoose from "mongoose";

const stressScenarioSchema = new mongoose.Schema({
    question: { type: String, required: true },
    choices: { type: [String], required: true }, // Array of possible answers
    answer_index: { type: Number, required: true }, // Index of correct answer
    difficulty: {
        type: String,
        enum: ["easy", "medium", "hard"],
        required: true,
    }, // Question difficulty level
    is_correct: { type: Boolean, default: false }, // Whether the user answered correctly
});

// Create and export the model
const StressScenario = mongoose.model("StressScenario", stressScenarioSchema);
export default StressScenario;