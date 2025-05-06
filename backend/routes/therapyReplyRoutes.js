import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { textReply, audioReply, videoReply } from "../controllers/therapyReplyController.js";

const router = express.Router();

// Multer setup

const audioDir = path.join(process.cwd(), "uploads/audio");
const videoDir = path.join(process.cwd(), "uploads/video");

// Ensure audio and video upload directories exist
if (!fs.existsSync(audioDir)) {
  fs.mkdirSync(audioDir, { recursive: true });
}
if (!fs.existsSync(videoDir)) {
  fs.mkdirSync(videoDir, { recursive: true });
}

// Storage for audio
const audioStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, audioDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname) || ".webm"; // fallback to .webm if no ext
    cb(null, `audio-${uniqueSuffix}${ext}`);
  }
});

// Storage for video
const videoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, videoDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname) || ".mp4"; // fallback to .mp4 if no ext
    cb(null, `video-${uniqueSuffix}${ext}`);
  }
});

const uploadAudio = multer({ storage: audioStorage });
const uploadVideo = multer({ storage: videoStorage });

// Routes
router.post("/text", textReply);
router.post("/audio", uploadAudio.single("audio"), audioReply);
router.post("/video", uploadVideo.single("video"), videoReply);

export default router;
