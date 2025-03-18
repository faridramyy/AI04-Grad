import mongoose from "mongoose";

const aiMessageSchema = new mongoose.Schema({
    sender_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
    date: { type: Date, default: Date.now },
    message_text: { type: String, required: true },
    response: { type: String, required: true }, // NEW FIELD ADDED
    chat_session_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "ChatSession" }
});

const AI_Message = mongoose.model("AI_Message", aiMessageSchema);
export default AI_Message;