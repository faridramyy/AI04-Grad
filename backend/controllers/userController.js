import User from "../models/user.js";
import TherapySession from '../models/therapy_session.js';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

export const signinUser = async(req, res) => {
    try {
        const { username, password } = req.body;

        // 1. Check if username exists
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ error: "Username not found" });
        }

        // 2. Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Incorrect password" });
        }

        // 3. Generate JWT token
        const token = jwt.sign({ userId: user._id, role: user.role },
            process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
        );

        // ✅ Set token as a cookie
        res
            .cookie("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production", // true in production (HTTPS)
                sameSite: "Lax", // "None" if using different domains and secure is true
                maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
            })
            .status(200)
            .json({
                message: "Signed in successfully",
                token,
                user: {
                    id: user._id,
                    role: user.role,
                    username: user.username,
                },
            });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

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
        const {
            username,
            firstname,
            lastname,
            phonenumber,
            email,
            password,
            role,
        } = req.body;

        // ✅ Check required fields
        if (!username ||
            !firstname ||
            !lastname ||
            !phonenumber ||
            !email ||
            !password
        ) {
            return res
                .status(400)
                .json({ error: "All required fields must be provided." });
        }

        // ✅ Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: "Invalid email format." });
        }

        // ✅ Validate phone number format
        const phoneRegex = /^\+\d{1,3}\d{7,15}$/;
        if (!phoneRegex.test(phonenumber)) {
            return res.status(400).json({ error: "Invalid phone number format." });
        }

        // ✅ Check for existing email
        const emailExists = await User.findOne({ email });
        if (emailExists) {
            return res.status(400).json({ error: "Email already in use." });
        }

        // ✅ Check for existing username
        const usernameExists = await User.findOne({ username });
        if (usernameExists) {
            return res.status(400).json({ error: "Username already taken." });
        }

        // ✅ Check for existing phone number
        const phoneExists = await User.findOne({ phonenumber });
        if (phoneExists) {
            return res.status(400).json({ error: "Phone number already in use." });
        }

        // ✅ Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // ✅ Create and initialize user with full schema
        const newUser = new User({
            username,
            firstname,
            lastname,
            phonenumber,
            email,
            password: hashedPassword,
            role: role || "patient", // Optional, default is 'patient'
            ai_sessions_id: [], // Default
            is_severe_case: false // Default
                // created_at: Date.now() is automatic from schema
        });

        const savedUser = await newUser.save();

        return res.status(201).json(savedUser);
    } catch (err) {
        return res.status(500).json({ error: err.message });
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