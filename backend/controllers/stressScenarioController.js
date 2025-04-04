import StressScenario from "../models/stress_scenario.js";

/**
 * @desc Get all stress scenarios
 */
export const getAllScenarios = async(req, res) => {
    try {
        const scenarios = await StressScenario.find();
        res.status(200).json(scenarios);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/**
 * @desc Get single scenario by ID
 */
export const getScenarioById = async(req, res) => {
    try {
        const scenario = await StressScenario.findById(req.params.id);
        if (!scenario) return res.status(404).json({ error: "Scenario not found" });
        res.status(200).json(scenario);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/**
 * @desc Create a new scenario
 * @body example:
 * {
 *   "choices": ["Take a break", "Keep working", "Cry", "Go outside"],
 *   "answer_index": 0,
 *   "difficulty": "medium",
 *   "is_correct": false
 * }
 */
export const createScenario = async(req, res) => {
    try {
        const newScenario = await StressScenario.create(req.body);
        res.status(201).json(newScenario);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

/**
 * @desc Update a scenario
 * @body example:
 * {
 *   "is_correct": true
 * }
 */
export const updateScenario = async(req, res) => {
    try {
        const updated = await StressScenario.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        if (!updated) return res.status(404).json({ error: "Scenario not found" });
        res.status(200).json(updated);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

/**
 * @desc Delete a scenario
 */
export const deleteScenario = async(req, res) => {
    try {
        const deleted = await StressScenario.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ error: "Scenario not found" });
        res.status(200).json({ message: "Scenario deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};