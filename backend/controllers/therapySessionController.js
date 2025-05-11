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
        console.log("i am here in selected session ");
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
        const stress_score_before = session.stress_score_before;
        await session.save();
        // ─────────────────────────────────────────────────────────────────

        // Store in cookie
        res.cookie("activeSessionId", sessionId, {
            httpOnly: false,
            sameSite: "Lax",
            maxAge: 24 * 60 * 60 * 1000,
        });
        res.cookie("initial_stress_score", stress_score_before, {
            httpOnly: false,
            sameSite: "Lax",
            maxAge: 24 * 60 * 60 * 1000,
        });
        console.log(" i am in select session and the stress score before is :", stress_score_before);

        // Return the updated session
        res.status(200).json({
            message: "Session selected and end_time updated.",
            initialstressscore: stress_score_before,
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

export const dashboardStressAnalysis = async(req, res) => {
    try {
        // 1) Auth
        const token = req.cookies.token;
        if (!token) return res.status(401).json({ error: "Unauthorized." });
        const { userId } = jwt.verify(token, process.env.JWT_SECRET);

        // 2) Load session + its game_sessions (only stress fields)
        const session = await TherapySession.findById(req.params.sessionId)
            .populate({
                path: "game_sessions",
                select: "stress_score_before stress_score_after",
            });
        if (!session) return res.status(404).json({ error: "Session not found." });
        if (session.patient_id.toString() !== userId) {
            return res.status(403).json({ error: "Forbidden." });
        }

        // 3) Build the flat array
        const values = [
            session.stress_score_before,
            ...session.game_sessions.flatMap(g => [
                g.stress_score_before,
                g.stress_score_after,
            ]),
        ];

        return res.json({ values });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};



export const allSessionsStressAnalysis = async(req, res) => {
    try {
        // 1) Auth
        const token = req.cookies.token;
        if (!token) return res.status(401).json({ error: "Unauthorized." });
        const { userId } = jwt.verify(token, process.env.JWT_SECRET);

        // 2) Load all sessions for this user, sorted by start_time
        const sessions = await TherapySession.find({ patient_id: userId })
            .sort({ start_time: 1 })
            .populate({
                path: "game_sessions",
                select: "stress_score_before stress_score_after",
            });

        // 3) Build flat rows: one object per measurement
        const rows = sessions.flatMap((sess, idx) => {
            const sessionName = `Session ${idx + 1}`;
            const endDate = sess.end_time;

            // start with the session’s initial stress
            const measurements = [
                { sessionName, endDate, value: sess.stress_score_before },
                // then each game’s before/after
                ...sess.game_sessions.flatMap(g => [
                    { sessionName, endDate, value: g.stress_score_before },
                    { sessionName, endDate, value: g.stress_score_after },
                ]),
            ];

            return measurements;
        });

        return res.json({ rows });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};


export const dashboardFinalScoreAnalysis = async(req, res) => {
    try {
        // 1) Auth
        const token = req.cookies.token;
        if (!token) return res.status(401).json({ error: "Unauthorized." });
        const { userId } = jwt.verify(token, process.env.JWT_SECRET);

        // 2) Load session + only final_score from its game_sessions
        const session = await TherapySession.findById(req.params.sessionId)
            .populate({
                path: "game_sessions",
                select: "final_score",
            });
        if (!session) {
            return res.status(404).json({ error: "Session not found." });
        }
        if (session.patient_id.toString() !== userId) {
            return res.status(403).json({ error: "Forbidden." });
        }

        // 3) Extract all final_scores
        const values = session.game_sessions.map(g => g.final_score);

        return res.json({ values });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};




export const allSessionsFinalScoreAnalysis = async(req, res) => {
    try {
        // 1) Auth
        const token = req.cookies.token;
        if (!token) return res.status(401).json({ error: "Unauthorized." });
        const { userId } = jwt.verify(token, process.env.JWT_SECRET);

        // 2) Load all sessions, with only final_score & difficulty_level from game_sessions
        const sessions = await TherapySession.find({ patient_id: userId })
            .sort({ start_time: 1 })
            .populate({
                path: "game_sessions",
                select: "final_score difficulty_level",
            });

        // 3) Build flat rows
        const rows = sessions.flatMap((sess, idx) => {
            const sessionName = `Session ${idx + 1}`;
            return sess.game_sessions.map(g => ({
                sessionName,
                difficulty: g.difficulty_level,
                score: g.final_score,
            }));
        });

        return res.json({ rows });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};



export const getSessionEmotionDistribution = async(req, res) => {
    try {
        // 1) Auth
        const token = req.cookies.token;
        if (!token) return res.status(401).json({ error: "Unauthorized." });
        const { userId } = jwt.verify(token, process.env.JWT_SECRET);

        // 2) Load session + only 'emotion' from each record
        const session = await TherapySession.findById(req.params.sessionId)
            .populate({
                path: "emotion_records",
                select: "extracted_emotion",
            });
        if (!session) return res.status(404).json({ error: "Session not found." });
        if (session.patient_id.toString() !== userId) {
            return res.status(403).json({ error: "Forbidden." });
        }
        console.log(session);

        // 3) Count each unique emotion
        const counts = {};
        for (const rec of session.emotion_records) {
            const em = rec.extracted_emotion;
            counts[em] = (counts[em] || 0) + 1;
        }

        return res.json({ counts });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};




export const getAllSessionsEmotionDistribution = async(req, res) => {
    try {
        // 1) Auth
        const token = req.cookies.token;
        if (!token) return res.status(401).json({ error: "Unauthorized." });
        const { userId } = jwt.verify(token, process.env.JWT_SECRET);

        // 2) Load all sessions + their emotion_records.emotion
        const sessions = await TherapySession.find({ patient_id: userId })
            .populate({
                path: "emotion_records",
                select: "extracted_emotion",
            });
        console.log(sessions);

        // 3) Flatten & count
        const counts = {};
        for (const sess of sessions) {
            for (const rec of sess.emotion_records) {
                const em = rec.extracted_emotion;
                counts[em] = (counts[em] || 0) + 1;
            }
        }

        return res.json({ counts });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};