import AI_Message from "../models/ai_messages.js";
import TherapySession from "../models/therapy_session.js";
import jwt from "jsonwebtoken";
// @desc Get all AI messages
export const getAllAIMessages = async(req, res) => {
    try {
        const messages = await AI_Message.find()
        res.status(200).json(messages);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// @desc Get AI message by ID
export const getAIMessageById = async(req, res) => {
    try {
        const message = await AI_Message.findById(req.params.id)

        if (!message) return res.status(404).json({ error: "Message not found" });
        res.status(200).json(message);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// @desc Create new AI message
// 📥 Body example:
// {
//   "sender_id": "USER_ID",
//   "message_text": "How are you today?",
//   "response": "I'm doing great, thank you!",
//   "chat_session_id": "CHAT_SESSION_ID"
// }


export const createAIMessage = async(req, res) => {
    try {
        const sessionId = req.cookies.activeSessionId;
        if (!sessionId) return res.status(400).json({ error: "No active session selected" });

        const { sender_id, message_text, response } = req.body;
        if (!sender_id || !message_text || !response) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const newMsg = await AI_Message.create({
            sender_id,
            message_text,
            response,
            chat_session_id: sessionId,
        });

        await TherapySession.findByIdAndUpdate(sessionId, {
            $push: { chat_sessions: newMsg._id },
        });

        res.status(201).json(newMsg);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// @desc Update AI message by ID
// 📥 Same structure as POST
export const updateAIMessage = async(req, res) => {
    try {
        const updated = await AI_Message.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        if (!updated) return res.status(404).json({ error: "Message not found" });
        res.status(200).json(updated);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// @desc Delete AI message
export const deleteAIMessage = async(req, res) => {
    try {



        const sessionId = req.cookies.activeSessionId;
        if (!sessionId) return res.status(400).json({ error: "No active session selected" });

        const messageId = req.params.id;

        await TherapySession.findByIdAndUpdate(sessionId, {
            $pull: { chat_sessions: messageId },
        });

        const deleted = await AI_Message.findByIdAndDelete(messageId);
        if (!deleted) return res.status(404).json({ error: "Message not found" });

        res.status(200).json({ message: "Message deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};