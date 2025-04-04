import SevereCase from "../models/severe_case.js";

// @desc Get all severe cases
export const getAllSevereCases = async(req, res) => {
    try {
        const cases = await SevereCase.find().populate("assigned_patient");
        res.status(200).json(cases);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// @desc Get severe case by ID
export const getSevereCaseById = async(req, res) => {
    try {
        const severeCase = await SevereCase.findById(req.params.id).populate("assigned_patient");
        if (!severeCase) return res.status(404).json({ error: "Severe case not found" });
        res.status(200).json(severeCase);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// @desc Create new severe case
// 📥 Body example:
// {
//   "assigned_patient": "USER_ID_HERE",
//   "is_active": true
// }
export const createSevereCase = async(req, res) => {
    try {
        const newCase = await SevereCase.create(req.body);
        res.status(201).json(newCase);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// @desc Update severe case by ID (e.g. to set ended_at or deactivate it)
// 📥 Body example:
// {
//   "is_active": false,
//   "ended_at": "2024-12-30T00:00:00Z"
// }
export const updateSevereCase = async(req, res) => {
    try {
        const updated = await SevereCase.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        if (!updated) return res.status(404).json({ error: "Severe case not found" });
        res.status(200).json(updated);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// @desc Delete severe case
export const deleteSevereCase = async(req, res) => {
    try {
        const deleted = await SevereCase.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ error: "Severe case not found" });
        res.status(200).json({ message: "Severe case deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};