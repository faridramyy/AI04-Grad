import UserSettings from "../models/user_settings.js";
import User from "../models/user.js";
// @desc Get all user settings
export const getAllUserSettings = async(req, res) => {
    try {
        const settings = await UserSettings.find().populate("user_id");
        res.status(200).json(settings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// @desc Get user settings by ID
export const getUserSettingsById = async(req, res) => {
    try {
        const setting = await UserSettings.findById(req.params.id).populate("user_id");
        if (!setting) return res.status(404).json({ error: "Settings not found" });
        res.status(200).json(setting);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// @desc Create new user settings
// 📥 Example JSON body:
// {
//   "user_id": "USER_OBJECT_ID",
//   "avatar_voice": true,
//   "avatar_gender": "male",
//   "background_music": true
// }
export const createUserSettings = async(req, res) => {
    try {
        const newSettings = await UserSettings.create(req.body);
        res.status(201).json(newSettings);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// @desc Update user settings by ID
// 📥 Use same JSON body as above
export const updateUserSettings = async(req, res) => {
    try {
        const updated = await UserSettings.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        if (!updated) return res.status(404).json({ error: "Settings not found" });
        res.status(200).json(updated);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// @desc Delete user settings
export const deleteUserSettings = async(req, res) => {
    try {
        const deleted = await UserSettings.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ error: "Settings not found" });
        res.status(200).json({ message: "Settings deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};