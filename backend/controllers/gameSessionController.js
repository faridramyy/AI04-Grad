import GameSession from "../models/game_session.js";
import StressScenario from "../models/stress_scenario.js"
import jwt from "jsonwebtoken";
import TherapySession from "../models/therapy_session.js";
// @desc    Get all game sessions
// @route   GET /gamesessions
export const getAllGameSessions = async(req, res) => {
    try {
        const sessions = await GameSession.find().populate("questions");
        res.status(200).json(sessions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// @desc    Get single game session by ID
// @route   GET /gamesessions/:id
export const getGameSessionById = async(req, res) => {
    try {
        const session = await GameSession.findById(req.params.id).populate("questions");
        if (!session) return res.status(404).json({ error: "Session not found" });
        res.status(200).json(session);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// @desc    Create a game session
// @route   POST /gamesessions
// @body    { session_id, stress_score_after, questions, user_answers, is_correct, final_score, difficulty_level }
export const createGameSession = async(req, res) => {
    try {
        const newSession = new GameSession(req.body);
        await newSession.save();
        res.status(201).json(newSession);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// @desc    Update a game session
// @route   PUT /gamesessions/:id
export const updateGameSession = async(req, res) => {
    try {
        const updated = await GameSession.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        if (!updated) return res.status(404).json({ error: "Not found" });
        res.status(200).json(updated);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// @desc    Delete a game session
// @route   DELETE /gamesessions/:id
export const deleteGameSession = async(req, res) => {
    try {
        const deleted = await GameSession.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ error: "Not found" });
        res.status(200).json({ message: "Deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
// controllers/therapyController.js






export const recordInitialStress = async(req, res) => {
    try {
        // 1. Pull & validate answers
        const answers = req.body.answers;
        if (!Array.isArray(answers) || answers.length !== 10) {
            return res
                .status(400)
                .json({ error: "answers must be an array of 10 numbers (0–4)." });
        }
        for (const v of answers) {
            if (typeof v !== "number" || v < 0 || v > 4 || !Number.isInteger(v)) {
                return res
                    .status(400)
                    .json({ error: "Each answer must be an integer from 0 to 4." });
            }
        }

        // 2. Compute stress score
        const sum = answers.reduce((acc, v) => acc + v, 0);
        const stressScore = sum / 4; // yields 0–10

        // 3. Authenticate user
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ error: "Unauthorized: no token." });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;

        // 4. Load active session
        const sessionId = req.cookies.activeSessionId;
        if (!sessionId) {
            return res.status(400).json({ error: "No active session cookie set." });
        }
        const session = await TherapySession.findById(sessionId);
        if (!session) {
            return res.status(404).json({ error: "Therapy session not found." });
        }
        if (session.patient_id.toString() !== userId) {
            return res.status(403).json({ error: "Forbidden: not your session." });
        }

        // 5. Save initial stress score
        session.stress_score_before = stressScore;
        await session.save();

        // 6. Respond
        return res.json({ stressScore });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};