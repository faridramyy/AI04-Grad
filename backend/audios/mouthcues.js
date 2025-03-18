import fs from 'fs';
import { execSync } from 'child_process';
import ffmpeg from 'fluent-ffmpeg';

// Path to eSpeak executable
const ESPEAK_PATH = "C:/espeak/command_line/espeak.exe";

// **1️⃣ Function to Extract Audio Duration**
function getAudioDuration(audioPath) {
    return new Promise((resolve, reject) => {
        ffmpeg.ffprobe(audioPath, (err, metadata) => {
            if (err) {
                console.error("❌ Error getting audio duration:", err);
                reject(err);
            } else {
                const duration = metadata.format.duration;
                console.log(`🎵 Audio Duration: ${duration.toFixed(2)} seconds`);
                resolve(duration);
            }
        });
    });
}

// **2️⃣ Function to Get Cleaned Phonemes**
function getPhonemes(sentence) {
    try {
        const command = `${ESPEAK_PATH} -q --ipa=3 "${sentence}"`;
        let output = execSync(command, { encoding: 'utf-8' }).trim();

        console.log(`🔵 Raw Phoneme Output:`, output);

        // **🔄 Step 1: Cleanup output (remove weird symbols)**
        let phonemeArray = output
            .replace(/[_ˈˌ]/g, " ") // Remove underscores & stress markers
            .replace(/\s+/g, " ") // Remove extra spaces
            .trim()
            .split(" "); // Properly split phonemes

        console.log("📌 Cleaned Phoneme Array:", phonemeArray);
        return phonemeArray;
    } catch (error) {
        console.error("❌ Error generating phonemes:", error);
        return [];
    }
}

// **3️⃣ Generalized Phoneme-to-Viseme Mapping**
const phonemeToViseme = {
    "p": "B",
    "b": "B",
    "m": "B", // Closed lips
    "f": "E",
    "v": "E", // Top teeth on bottom lip
    "θ": "C",
    "ð": "C", // Tongue between teeth
    "t": "D",
    "d": "D",
    "s": "D",
    "z": "D",
    "n": "D",
    "l": "D",
    "r": "D", // Tongue touches roof
    "ʃ": "F",
    "ʒ": "F",
    "tʃ": "F",
    "dʒ": "F", // "sh", "ch" sounds
    "k": "G",
    "g": "G",
    "ŋ": "G", // Back of tongue lifts
    "h": "X", // Neutral / silent
    "eɪ": "A",
    "aɪ": "A",
    "ɔɪ": "A",
    "oʊ": "A",
    "ju": "A", // "ey", "ai", "oy"
    "æ": "B",
    "ɛ": "B",
    "e": "B", // Mid-open mouth
    "i": "C",
    "ɪ": "C", // Smile (like "ee")
    "ʊ": "B",
    "u": "B",
    "uː": "B", // Rounded lips (fixing issue)
    "ʌ": "D",
    "ɑ": "D",
    "ɒ": "D",
    "ɐ": "D", // Open mouth vowels (fixing issue)
    "ɔ": "F",
    "aʊ": "F", // "aw" sounds
    "j": "C",
    "w": "C", // Semi-vowels
    "ə": "B", // Schwa neutral vowel (fixing issue)
    "ŋ": "X" // Nasal closure
};


// **4️⃣ Function to Map Phonemes to Visemes**
function mapPhonemesToVisemes(phonemes) {
    return phonemes.map(phoneme => {
        let mappedValue = phonemeToViseme[phoneme] || "X"; // Default to "X"
        console.log(`🔄 Mapping: "${phoneme}" → "${mappedValue}"`);
        return { value: mappedValue };
    });
}

// **5️⃣ Function to Generate LipSync JSON**
async function generateLipSyncJSON(sentence, audioPath, savePath) {
    try {
        const duration = await getAudioDuration(audioPath);
        const rawPhonemes = getPhonemes(sentence);
        const mappedMouthCues = mapPhonemesToVisemes(rawPhonemes);

        if (mappedMouthCues.length === 0) {
            console.error("❌ No mouth cues generated. Exiting.");
            return;
        }

        const interval = duration / mappedMouthCues.length;

        // **Generate Timestamped Mouth Cues**
        const mouthCues = mappedMouthCues.map((cue, index) => ({
            start: parseFloat((index * interval).toFixed(2)),
            end: parseFloat(((index + 1) * interval).toFixed(2)),
            value: cue.value
        }));

        const data = {
            metadata: { duration: parseFloat(duration.toFixed(2)) },
            mouthCues
        };

        fs.writeFileSync(savePath, JSON.stringify(data, null, 4));
        console.log(`✅ LipSync JSON saved to ${savePath}`);
    } catch (error) {
        console.error("❌ Error in LipSync Generation:", error);
    }
}

// **🚀 Run Example**
const sentence = "hey dear, how was your day";
const audioPath = "backend\audios\intro_0.json"; // adjust path before running
const savePath = "backend\audios\lipsync_intro_1.json"; // adjust path before running

generateLipSyncJSON(sentence, audioPath, savePath);