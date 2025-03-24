import mongoose from "mongoose";

// Define the schema
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    phonenumber: { type: String, required: true, match: /^\+\d{1,3}\d{7,15}$/ }, // Phone format validation
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Hashed password
    role: { type: String, enum: ["patient", "admin"], default: "patient" },
    created_at: { type: Date, default: Date.now },
    ai_sessions_id: { type: [mongoose.Schema.Types.ObjectId], ref: "TherapySession", default: [] }, // References therapy sessions
    is_severe_case: { type: Boolean, default: false }
});

// Create and export model
const User = mongoose.model("User", userSchema);
export default User;