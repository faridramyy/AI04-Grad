import ExtractedEmotion from "../models/extracted_emotions.js";

// @desc Create a new extracted emotion
// @route POST /extracted-emotions
// @body { session_id, extracted_emotion, uploaded_data_type, file_paths }
export const createExtractedEmotion = async(req, res) => {
    try {
        const newEmotion = await ExtractedEmotion.create(req.body);
        res.status(201).json(newEmotion);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};



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



// @desc Delete extracted emotion
// @route DELETE /extracted-emotions/:id
export const deleteExtractedEmotion = async(req, res) => {
    try {
        const deleted = await ExtractedEmotion.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ error: "Not found" });
        res.status(200).json({ message: "Deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};