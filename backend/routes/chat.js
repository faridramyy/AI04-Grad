import express from "express";
import { handleText } from "../controllers/chat_text.js";

const router = express.Router();

router.post("/text", handleText);
// router.post("/audio", handleAudio);
// router.post("/video", handleVideo);

export default router;
