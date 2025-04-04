import User from "../models/user.js";
import TherapySession from '../models/therapy_session.js';


// /**
//  * @route   POST /api/users
//  * @desc    Create a new user
//  * @body    {
//  *            "username": "john_doe",
//  *            "firstname": "John",
//  *            "lastname": "Doe",
//  *            "phonenumber": "+201234567890",
//  *            "email": "john@example.com",
//  *            "password": "hashedpassword",
//  *            "role": "patient", // optional, default is patient
//  *            "ai_sessions_id": [], // optional
//  *            "is_severe_case": false // optional
//  *          }
//  */


export const createUser = async(req, res) => {
    try {
        const user = new User(req.body);
        const savedUser = await user.save();
        res.status(201).json(savedUser);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// /**
//  * @route   GET /api/users
//  * @desc    Fetch all users (populates ai_sessions)
//  */

export const getAllUsers = async(req, res) => {
    try {
        const users = await User.find().populate("ai_sessions_id");
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};



// /**
//  * @route   GET /api/users/:id
//  * @desc    Fetch a single user by ID
//  */
export const getUserById = async(req, res) => {
    try {
        const user = await User.findById(req.params.id).populate("ai_sessions_id");
        if (!user) return res.status(404).json({ error: "User not found" });
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};





// /**
//  * @route   PUT /api/users/:id
//  * @desc    Update user info
//  * @body    {
//  *            "firstname": "UpdatedName",
//  *            "lastname": "UpdatedLast",
//  *            "phonenumber": "+201122334455"
//  *          }
//  */
export const updateUser = async(req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            req.body, { new: true }
        );
        if (!updatedUser) return res.status(404).json({ error: "User not found" });
        res.status(200).json(updatedUser);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};




// /**
//  * @route   DELETE /api/users/:id
//  * @desc    Delete a user by ID
//  */
export const deleteUser = async(req, res) => {
    try {
        const deleted = await User.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ error: "User not found" });
        res.status(200).json({ message: "User deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};