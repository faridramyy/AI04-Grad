import { execSync } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

// Get __dirname in ES Module
const __filename = fileURLToPath(
    import.meta.url);
const __dirname = dirname(__filename);

// Adjusted Paths
const rhubarbBinary = path.join(__dirname, "../rhubarb_bin/rhubarb.exe");
const audioDir = path.join(__dirname, "../audios");

const lipSyncMessage = async(filenameWithoutExt) => {
    const time = new Date().getTime();

    const wavPath = path.join(audioDir, `${filenameWithoutExt}.wav`);
    const outputPath = path.join(audioDir, `${filenameWithoutExt}.json`);

    console.log(`🔊 Starting lipsync for: ${filenameWithoutExt}.wav`);

    try {
        execSync(
            `"${rhubarbBinary}" -f json -o "${outputPath}" "${wavPath}" -r phonetic`, { stdio: "inherit" }
        );
        console.log(`✅ Lip sync JSON generated in ${new Date().getTime() - time}ms`);
    } catch (err) {
        console.error("❌ Rhubarb error:", err.message);
    }
};

// Usage
lipSyncMessage("intro_0"); // Now matches intro.wav