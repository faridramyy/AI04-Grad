import User from "../models/user.js";
import TherapySession from "../models/therapy_session.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

export const signinUser = async(req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res
                .status(400)
                .json({ error: "Username and password are required." });
        }

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

        // 4. Find their most recent therapy session
        const recentSession = await TherapySession.findOne({ patient_id: user._id })
            .sort({ createdAt: -1 }) // assumes you have timestamps enabled
            .select("_id stress_score_before"); // we only need the ID

        // 5. Set cookies: token + (if exists) activeSessionId
        const cookieOpts = {
            httpOnly: false,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Lax",
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        };

        res.cookie("token", token, cookieOpts);

        if (recentSession) {
            console.log(" i am in sign in  and this is the session it self:");
            console.log("session:", recentSession);
            console.log("initial stress score is :", recentSession.stress_score_before);
            res.cookie("activeSessionId", recentSession._id.toString(), cookieOpts);
            res.cookie("initial_stress_score", recentSession.stress_score_before, cookieOpts);
        }

        // 6. Send response
        return res.status(200).json({
            message: "Signed in successfully",
            token,
            user: {
                id: user._id,
                role: user.role,
                username: user.username,
            },
            activeSessionId: recentSession ? recentSession._id : null,
            initial_stress_score: recentSession.stress_score_before ? recentSession.stress_score_before : null
        });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

// in your auth route file

export const verifyToken = async(req, res) => {
    const token = req.cookies.token;

    if (!token) return res.status(401).json({ isAuthenticated: false });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return res.status(200).json({ isAuthenticated: true, user: decoded });
    } catch (err) {
        return res.status(401).json({ isAuthenticated: false });
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

export const createUser = async (req, res) => {
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

    // ✅ Validate required fields
    if (!username || !firstname || !lastname || !phonenumber || !email || !password) {
      return res.status(400).json({ error: "All required fields must be provided." });
    }

    // ✅ Email and phone validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return res.status(400).json({ error: "Invalid email format." });

    const phoneRegex = /^\+\d{1,3}\d{7,15}$/;
    if (!phoneRegex.test(phonenumber)) {
      return res.status(400).json({ error: "Invalid phone number format." });
    }

    // ✅ Check for existing records
    const [emailExists, usernameExists, phoneExists] = await Promise.all([
      User.findOne({ email }),
      User.findOne({ username }),
      User.findOne({ phonenumber }),
    ]);
    if (emailExists) return res.status(400).json({ error: "Email already in use." });
    if (usernameExists) return res.status(400).json({ error: "Username already taken." });
    if (phoneExists) return res.status(400).json({ error: "Phone number already in use." });

    // ✅ Create user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      firstname,
      lastname,
      phonenumber,
      email,
      password: hashedPassword,
      role: role || "patient",
      ai_sessions_id: [],
      is_severe_case: false,
    });
    const savedUser = await newUser.save();

    // ✅ Create JWT
    const token = jwt.sign({ userId: savedUser._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    // ✅ Create therapy session
    const now = new Date();
    const end = new Date(now.getTime() + 30 * 60 * 1000); // 30 mins session by default

    const newSession = new TherapySession({
      patient_id: savedUser._id,
      patient_emotion: "neutral",
      start_time: now,
      end_time: end,
      stress_score_before: 0,
      stress_score_after: 0,
      emotion_records: [],
      chat_sessions: [],
      game_sessions: [],
      challenges_sessions: [],
    });

    const savedSession = await newSession.save();

    // ✅ Link session to user
    savedUser.ai_sessions_id.push(savedSession._id);
    await savedUser.save();

    // ✅ Set cookies
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "Lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.cookie("activeSessionId", savedSession._id.toString(), {
      httpOnly: true,
      sameSite: "Lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000,
    });

    // ✅ Final response
    return res.status(201).json({
      message: "User created and session initialized.",
      user: savedUser,
      session: savedSession,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const logoutUser = (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Lax",
    });

    res.clearCookie("activeSessionId", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Lax",
    });

    return res.status(200).json({ message: "Logged out successfully" });
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
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
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