import TherapySession from "../models/therapy_session.js";
import ExtractedEmotion from "../models/extracted_emotions.js";
import GameSession from "../models/game_session.js";
import User from "../models/user.js";
import AI_Message from "../models/ai_messages.js";
import jwt from "jsonwebtoken";

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
        // ─── Auth ────────────────────────────────────────────────
        const token = req.cookies.token;
        if (!token) return res.status(401).json({ error: "Unauthorized. No token." });
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;

        // ─── Pull & validate body ─────────────────────────────────
        const {
            patient_id = userId,
                patient_emotion,
                start_time,
                end_time,
                emotion_records = [],
                chat_sessions = [],
                game_sessions = [],
                challenges_sessions = [],
        } = req.body;

        if (!patient_emotion || !start_time || !end_time) {
            return res.status(400).json({
                error: "Missing required fields: patient_emotion, start_time, end_time.",
            });
        }

        // ─── Check patient exists ──────────────────────────────────
        const user = await User.findById(patient_id);
        if (!user) {
            return res.status(404).json({ error: "User (patient) not found." });
        }

        // ─── Validate emotion ─────────────────────────────────────
        const allowed = ["neutral", "happy", "sad", "fear", "disgust", "angry", "depressed"];
        if (!allowed.includes(patient_emotion)) {
            return res.status(400).json({ error: "Invalid patient_emotion value." });
        }

        // ─── Create & save session ─────────────────────────────────
        const newSession = new TherapySession({
            patient_id,
            patient_emotion,
            start_time,
            end_time,
            stress_score_before: 0,
            stress_score_after: 0,
            emotion_records,
            chat_sessions,
            game_sessions,
            challenges_sessions,
        });
        const savedSession = await newSession.save();

        // ─── Push into user's list ────────────────────────────────
        user.ai_sessions_id.push(savedSession._id);
        await user.save();

        // ─── Set as active session cookie ──────────────────────────
        res.cookie("activeSessionId", savedSession._id.toString(), {
            httpOnly: true,
            sameSite: "Lax",
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        });

        // ─── Response ──────────────────────────────────────────────
        return res.status(201).json({
            message: "Therapy session created and set as active.",
            session: savedSession,
        });
    } catch (err) {
        console.error("Error creating therapy session:", err);
        return res.status(500).json({ error: err.message });
    }
};

function parseCookies(cookieHeader) {
    const cookies = {};
    if (!cookieHeader) return cookies;

    cookieHeader.split(";").forEach((cookie) => {
        const [name, ...rest] = cookie.trim().split("=");
        cookies[name] = decodeURIComponent(rest.join("="));
    });

    return cookies;
}






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
        // 🔐 Extract token from cookies
        const cookies = parseCookies(req.headers.cookie);
        const token = cookies.token;

        if (!token) {
            return res.status(401).json({ error: "No token provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;
        console.log(decoded);

        const sessionId = req.params.id;

        // ✅ Check if session exists
        const session = await TherapySession.findById(sessionId);
        console.log(session);
        if (!session) {
            return res.status(404).json({ error: "Therapy session not found." });
        }

        // 🔧 Pull from user's array using ObjectId match
        const updateResult = await User.updateOne({ _id: userId }, { $pull: { ai_sessions_id: req.params.id } });

        // Optional: verify update happened
        if (updateResult.modifiedCount === 0) {
            console.warn("⚠️ Session ID was not found in user's array (already removed?).");
        }
        // ✅ Delete the therapy session
        await TherapySession.findByIdAndDelete(req.params.id);



        res.status(200).json({ message: "Therapy session deleted successfully." });
    } catch (error) {
        console.error("Error deleting therapy session:", error);
        res.status(500).json({ error: error.message });
    }
};


export const selectSession = async(req, res) => {
    try {
        const sessionId = req.params.id;
        const token = req.cookies.token;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;

        // Fetch & populate
        const session = await TherapySession.findById(sessionId)
            .populate("emotion_records")
            .populate("chat_sessions")
            .populate("game_sessions");

        if (!session) {
            return res.status(404).json({ error: "Therapy session not found." });
        }
        if (session.patient_id.toString() !== userId) {
            return res.status(403).json({ error: "Forbidden: This is not your session" });
        }

        // ─── UPDATE end_time ─────────────────────────────────────────────
        session.end_time = new Date();
        await session.save();
        // ─────────────────────────────────────────────────────────────────

        // Store in cookie
        res.cookie("activeSessionId", sessionId, {
            httpOnly: true,
            sameSite: "Lax",
            maxAge: 24 * 60 * 60 * 1000,
        });

        // Return the updated session
        res.status(200).json({
            message: "Session selected and end_time updated.",
            session,
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



export const getAllSessionsOfUser = async(req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ error: "Unauthorized. No token." });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;

        const sessions = await TherapySession
            .find({ patient_id: userId })
            .sort({ end_time: -1 }) // ← sort by end_time descending
            .populate("emotion_records")
            .populate("chat_sessions")
            .populate("game_sessions");

        return res.status(200).json(sessions);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};