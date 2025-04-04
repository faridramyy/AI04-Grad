import TherapySession from "../models/therapy_session.js";
import ExtractedEmotion from "../models/extracted_emotions.js";
import GameSession from "../models/game_session.js";
import User from "../models/user.js";
import AI_Message from "../models/ai_messages.js";

/**
 * @route GET /api/therapy-sessions
 * @desc Get all therapy sessions
 **/
export const getAllTherapySessions = async(req, res) => {
    try {
        const sessions = await TherapySession.find()
            .populate("emotion_records")
            .populate("chat_sessions")
            .populate("game_sessions")
        res.status(200).json(sessions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};




/**
 * @route GET /api/therapy-sessions/:id
 * @desc Get single therapy session by ID
 */
export const getTherapySessionById = async(req, res) => {
    try {
        const session = await TherapySession.findById(req.params.id)
            .populate("emotion_records")
            .populate("chat_sessions")
            .populate("game_sessions")
        if (!session) return res.status(404).json({ error: "Session not found" });
        res.status(200).json(session);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};




/**
 * @route POST /api/therapy-sessions
 * @desc Create a new therapy session
 * 🔧 Example Body:
 * {
 *  "patient_id": "ObjectId",
 *  "patient_emotion": "happy",
 *  "start_time": "2024-04-01T10:00:00Z",
 *  "end_time": "2024-04-01T11:00:00Z"
 * }
 */
export const createTherapySession = async(req, res) => {
    try {
        const newSession = new TherapySession(req.body);
        const saved = await newSession.save();
        res.status(201).json(saved);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};








/**
 * @route PUT /api/therapy-sessions/:id
 * @desc Update a therapy session
 */
export const updateTherapySession = async(req, res) => {
    try {
        const updated = await TherapySession.findByIdAndUpdate(
            req.params.id,
            req.body, { new: true }
        );
        if (!updated) return res.status(404).json({ error: "Not found" });
        res.status(200).json(updated);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};





/**
 * @route DELETE /api/therapy-sessions/:id
 * @desc Delete therapy session
 */
export const deleteTherapySession = async(req, res) => {
    try {
        const deleted = await TherapySession.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ error: "Not found" });
        res.status(200).json({ message: "Deleted" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};