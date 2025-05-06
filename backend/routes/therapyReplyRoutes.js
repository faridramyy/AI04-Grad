import express from "express";
import { textReply } from "../controllers/therapyReplyController.js";

const router = express.Router();

router.post("/text", textReply);
// router.post("/audio", audioReply);
// router.post("/video", videoReply);

export default router;
