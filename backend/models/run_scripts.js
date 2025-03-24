import AI_Message from "../models/ai_messages.js";
import User from "../models/user.js";
import TherapySession from "../models/therapy_session.js";
import UserFeedback from "../models/user_feedback.js";
import StressScenario from "../models/stress_scenario.js";
import GameSession from "../models/game_session.js";
import ExtractedEmotion from "../models/extracted_emotions.js";
import SevereCase from "../models/severe_case.js";
import UserSettings from "./user_settings.js";
//mongodb+srv://Rina:25102002b@rina.gp6gt.mongodb.net/rina_dataset/
mongoose
  .connect(
    "mongodb+srv://Rina:25102002b@rina.gp6gt.mongodb.net/rina_dataset/",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// async function insertDummyAiMessages() {
//     try {
//         const userSettings = new UserSettings({
//             user_id: "67d1e678f5426c5b1aded5dd", // Existing user ID
//             avatar_voice: true,
//             avatar_gender: "male",
//             background_music: false
//         });

//         const savedSettings = await userSettings.save();
//         console.log("✅ User settings inserted:", savedSettings);
//     } catch (error) {
//         console.error("❌ Error inserting user settings:", error);
//     } finally {
//         mongoose.disconnect();
//     }
// }
// insertDummyAiMessages();
