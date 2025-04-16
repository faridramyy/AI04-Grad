import ExtractedEmotion from "../models/extracted_emotions.js";
import TherapySession from "../models/therapy_session.js";
import jwt from "jsonwebtoken";

// @desc Get all extracted emotions
// @route GET /extracted-emotions
export const getAllExtractedEmotions = async(req, res) => {
    try {
        const emotions = await ExtractedEmotion.find();
        res.status(200).json(emotions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};



// @desc Get single extracted emotion by ID
// @route GET /extracted-emotions/:id
export const getExtractedEmotionById = async(req, res) => {
    try {
        const emotion = await ExtractedEmotion.findById(req.params.id);
        if (!emotion) return res.status(404).json({ error: "Not found" });
        res.status(200).json(emotion);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};



// @desc Update extracted emotion
// @route PUT /extracted-emotions/:id
export const updateExtractedEmotion = async(req, res) => {
    try {
        const updated = await ExtractedEmotion.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updated) return res.status(404).json({ error: "Not found" });
        res.status(200).json(updated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const predictEmotion = async(uploaded_data_type, file_path) => {
    // Simulate ML prediction (you’ll replace this later with real model logic)
    const emotions = ["happy", "sad", "fear", "angry", "surprised", "neutral"];
    const random = Math.floor(Math.random() * emotions.length);
    return emotions[random];
};



// @desc Create a new extracted emotion
// @route POST /extracted-emotions
// @body {  uploaded_data_type, file_paths }
export const createExtractedEmotion = async(req, res) => {
    try {
        const { uploaded_data_type, file_paths } = req.body;
        const token = req.cookies.token;

        if (!token) return res.status(401).json({ error: "Unauthorized" });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const sessionId = req.cookies.activeSessionId;

        if (!sessionId) return res.status(400).json({ error: "No active session selected" });

        if (!uploaded_data_type || !file_paths) {
            return res.status(400).json({ error: "uploaded_data_type and file_paths are required." });
        }

        const emotion = await predictEmotion(uploaded_data_type, file_paths);

        const newEmotion = await ExtractedEmotion.create({
            session_id: sessionId,
            extracted_emotion: emotion,
            uploaded_data_type,
            file_paths,
        });

        // Update TherapySession to include this emotion
        await TherapySession.findByIdAndUpdate(sessionId, {
            $push: { emotion_records: newEmotion._id },
        });

        res.status(201).json(newEmotion);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// @desc Delete extracted emotion
// @route DELETE /extracted-emotions/:id
export const deleteExtractedEmotion = async(req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) return res.status(401).json({ error: "Unauthorized" });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const sessionId = req.cookies.activeSessionId;
        const emotionId = req.params.id;

        const emotion = await ExtractedEmotion.findById(emotionId);
        if (!emotion) return res.status(404).json({ error: "Emotion not found" });

        if (emotion.session_id.toString() !== sessionId) {
            return res.status(403).json({ error: "Emotion does not belong to active session" });
        }

        // Remove from therapy session's emotion_records array
        await TherapySession.findByIdAndUpdate(sessionId, {
            $pull: { emotion_records: emotionId },
        });

        // Delete the emotion
        await ExtractedEmotion.findByIdAndDelete(emotionId);

        res.status(200).json({ message: "Emotion deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};