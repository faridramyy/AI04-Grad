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
        // 1️⃣ Auth
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ error: "Unauthorized: no token." });
        }
        const { userId } = jwt.verify(token, process.env.JWT_SECRET);

        // 2️⃣ Active session
        const sessionId = req.cookies.activeSessionId;
        if (!sessionId) {
            return res.status(400).json({ error: "No active session cookie set." });
        }

        // 3️⃣ Ensure session exists & belongs to user
        const session = await TherapySession.findById(sessionId);
        if (!session) {
            return res.status(404).json({ error: "Therapy session not found." });
        }
        if (session.patient_id.toString() !== userId) {
            return res.status(403).json({ error: "Forbidden: not your session." });
        }

        // 4️⃣ Validate body
        const { rating, feedback } = req.body;
        if (
            typeof rating !== "number" ||
            !Number.isInteger(rating) ||
            rating < 1 ||
            rating > 5
        ) {
            return res
                .status(400)
                .json({ error: "Rating must be an integer between 1 and 5." });
        }
        if (
            typeof feedback !== "string" ||
            feedback.trim().length === 0
        ) {
            return res
                .status(400)
                .json({ error: "Feedback must be a non-empty string." });
        }

        // 5️⃣ Create & save
        const newFeedback = await UserFeedback.create({
            session_id: sessionId,
            rating,
            feedback: feedback.trim(),
            // created_at will auto-set
        });

        return res.status(201).json(newFeedback);
    } catch (err) {
        return res.status(500).json({ error: err.message });
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