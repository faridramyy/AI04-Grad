import UserFeedback from "../models/user_feedback.js";
import TherapySession from "../models/therapy_session.js";
// @desc Get all feedback entries
export const getAllFeedback = async(req, res) => {
    try {
        const feedbacks = await UserFeedback.find().populate("session_id");
        res.status(200).json(feedbacks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// @desc Get feedback by ID
export const getFeedbackById = async(req, res) => {
    try {
        const feedback = await UserFeedback.findById(req.params.id).populate("session_id");
        if (!feedback) return res.status(404).json({ error: "Feedback not found" });
        res.status(200).json(feedback);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};



// @desc Create new feedback
// Example body:
// {
//   "session_id": "SESSION_OBJECT_ID",
//   "rating": 5,
//   "feedback": "This session was amazing!"
// }
export const createFeedback = async(req, res) => {
    try {
        const newFeedback = await UserFeedback.create(req.body);
        res.status(201).json(newFeedback);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};



// @desc Update feedback by ID
// Same body format as above
export const updateFeedback = async(req, res) => {
    try {
        const updated = await UserFeedback.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        if (!updated) return res.status(404).json({ error: "Feedback not found" });
        res.status(200).json(updated);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};



// @desc Delete feedback
export const deleteFeedback = async(req, res) => {
    try {
        const deleted = await UserFeedback.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ error: "Feedback not found" });
        res.status(200).json({ message: "Feedback deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};