import GameSession from "../models/game_session.js";
import StressScenario from "../models/stress_scenario.js"
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