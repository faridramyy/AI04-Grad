import { ElevenLabsClient } from "elevenlabs";
import { promises as fs } from "fs"; // ✅ ONLY THIS
import { GoogleGenerativeAI } from "@google/generative-ai";
import { exec, spawn } from "child_process"; // ✅ you forgot spawn before
import path from "path";
import secrets from "../config/secrets.js";

const genAI = new GoogleGenerativeAI(secrets.GOOGLE_API_KEY);
const elevenLabsApiKey = secrets.ELEVEN_LABS_API_KEY;

const elevenlabs = new ElevenLabsClient({
  apiKey: elevenLabsApiKey,
});

const execCommand = (command) => {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) reject(error);
      resolve(stdout);
    });
  });
};

const lipSyncMessage = async (message) => {
  const time = new Date().getTime();
  console.log(`Starting conversion for message ${message}`);
  await execCommand(
    `ffmpeg -y -i audios/message_${message}.mp3 audios/message_${message}.wav`
  );
  console.log(`Conversion done in ${new Date().getTime() - time}ms`);
  await execCommand(
    `./bin/rhubarb -f json -o audios/message_${message}.json audios/message_${message}.wav -r phonetic`
  );
  console.log(`Lip sync done in ${new Date().getTime() - time}ms`);
};

const readJsonTranscript = async (file) => {
  const data = await fs.readFile(file, "utf8");
  return JSON.parse(data);
};

const audioFileToBase64 = async (file) => {
  const data = await fs.readFile(file);
  return data.toString("base64");
};

const generateTherapyReply = async (userMessage) => {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const therapyPrompt = `
    You are a compassionate and supportive therapist.
    You listen carefully, show empathy, and help users explore their feelings.
    Avoid giving direct advice. Instead, ask gentle, open-ended questions that encourage reflection.
    Always maintain a warm, patient, and non-judgmental tone.
    `;

  const result = await model.generateContent({
    contents: [
      {
        parts: [{ text: therapyPrompt }, { text: userMessage }],
      },
    ],
  });

  return result.response.text();
};

const generateAudioAndLipSync = async (text, index) => {
  const fileName = `audios/message_${index}.mp3`;

  const audio = await elevenlabs.generate({
    voice: "Sarah",
    text,
    model_id: "eleven_multilingual_v2",
  });

  await fs.writeFile(fileName, audio, "binary");
  await lipSyncMessage(index);

  return {
    text,
    audio: await audioFileToBase64(fileName),
    lipsync: await readJsonTranscript(`audios/message_${index}.json`),
    facialExpression: "neutral",
    animation: "Idle",
  };
};

const sendDefaultIntro = async (res) => {
  res.send({
    messages: [
      {
        text: "Hey dear... How was your day?",
        audio: await audioFileToBase64("audios/intro_0.wav"),
        lipsync: await readJsonTranscript("audios/intro_0.json"),
        facialExpression: "smile",
        animation: "Talking_1",
      },
    ],
  });
};

const sendMissingKeysMessage = async (res) => {
  res.send({
    messages: [
      {
        text: "Please my dear, don't forget to add your API keys!",
        audio: await audioFileToBase64("audios/api_0.wav"),
        lipsync: await readJsonTranscript("audios/api_0.json"),
        facialExpression: "angry",
        animation: "Angry",
      },
    ],
  });
};

export const textReply = async (req, res) => {
  const userMessage = req.body.message;
  console.log(userMessage);
  if (!userMessage) {
    await sendDefaultIntro(res);
    return;
  }

  if (!elevenLabsApiKey || !process.env.GOOGLE_API_KEY) {
    await sendMissingKeysMessage(res);
    return;
  }

  try {
    const answer = await generateTherapyReply(userMessage);

    console.log(answer);

    const sentences = answer
      .split(/(?<=[.!?])\s+/)
      .map((sentence) => sentence.trim())
      .filter((sentence) => sentence.length > 0);

    const messages = [];

    for (let i = 0; i < sentences.length; i++) {
      const message = await generateAudioAndLipSync(sentences[i], i);
      messages.push(message);
    }

    res.send({ messages });
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .send({ messages: [], error: "Failed to get response from Gemini" });
  }
};

export const audioReply = async (req, res) => {
  try {
    const file = req.file;
    const duration = req.body.duration;

    if (!file || file.size < 500) {
      return res
        .status(400)
        .json({ error: "Uploaded file is empty or too small." });
    }

    console.log(`Audio file saved at: ${file.path}`);
    console.log(`Audio duration: ${duration} seconds`);

    const inputPath = file.path;
    const outputPath = inputPath.replace(path.extname(inputPath), ".wav");

    // Convert audio from webm to WAV
    await new Promise((resolve, reject) => {
      exec(
        `ffmpeg -y -i "${inputPath}" "${outputPath}"`,
        (error, stdout, stderr) => {
          if (error) {
            console.error("Error converting to WAV:", stderr || error.message);
            return reject(error);
          }
          console.log("Conversion to WAV successful");
          resolve();
        }
      );
    });

    // Delete the original uploaded file after conversion
    try {
      await fs.unlink(inputPath);
      console.log("Original uploaded file deleted:", inputPath);
    } catch (unlinkError) {
      console.warn("Failed to delete original file:", unlinkError.message);
    }

    const pythonScriptPath = path.join(
      process.cwd(),
      "utilities",
      "audioOrVideoToText.py"
    );
    const pythonExecutable =
      process.platform === "win32" ? "python" : "python3";

    const python = spawn(pythonExecutable, [pythonScriptPath, outputPath]);

    let transcription = "";
    let errorOutput = "";

    python.stdout.on("data", (data) => {
      transcription += data.toString();
    });

    python.stderr.on("data", (data) => {
      errorOutput += data.toString();
    });

    python.on("close", async (code) => {
      try {
        await fs.unlink(outputPath);
        console.log("WAV file deleted:", outputPath);
      } catch (unlinkError) {
        console.warn("Failed to delete WAV file:", unlinkError.message);
      }

      if (code !== 0) {
        console.error("Transcription failed:", errorOutput);
        return res
          .status(500)
          .json({ error: "Transcription failed", details: errorOutput });
      }

      try {
        const transcribedText = transcription.trim();
        console.log("Transcribed Text:", transcribedText);

        const answer = await generateTherapyReply(transcribedText);
        console.log("Therapy Answer:", answer);

        const sentences = answer
          .split(/(?<=[.!?])\s+/)
          .map((sentence) => sentence.trim())
          .filter((sentence) => sentence.length > 0);

        const messages = [];

        for (let i = 0; i < sentences.length; i++) {
          const message = await generateAudioAndLipSync(sentences[i], i);
          messages.push(message);
        }

        res.send({ messages });
      } catch (error) {
        console.error("Error after transcription:", error);
        res.status(500).send({
          messages: [],
          error: "Failed to process transcription response",
        });
      }
    });

    python.on("error", (error) => {
      console.error("Failed to start Python process:", error.message);
      res.status(500).json({
        error: "Failed to start Python script",
        details: error.message,
      });
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    res
      .status(500)
      .json({ error: "Failed to process audio", details: error.message });
  }
};

export const videoReply = async (req, res) => {
  try {
    const file = req.file;
    const duration = req.body.duration;

    // Validate file
    if (!file || file.size < 500) {
      return res
        .status(400)
        .json({ error: "Uploaded file is empty or too small." });
    }
    if (!["video/webm", "video/mp4"].includes(file.mimetype)) {
      return res.status(400).json({ error: "Unsupported file type." });
    }

    console.log(
      `Uploaded file: ${file.originalname}, size: ${file.size} bytes`
    );
    const inputPath = file.path;
    const outputPath = inputPath.replace(path.extname(inputPath), ".mp4");

    // Convert video to MP4
    await new Promise((resolve, reject) => {
      const command = `ffmpeg -y -i "${inputPath}" "${outputPath}"`;
      exec(command, { timeout: 60000 }, (error, stdout, stderr) => {
        if (error) {
          console.error("FFmpeg conversion error:", stderr || error.message);
          return reject(new Error("Failed to convert video."));
        }
        console.log("Video converted to MP4 successfully.");
        resolve();
      });
    });

    // Delete original uploaded file
    try {
      await fs.unlink(inputPath);
      console.log("Original uploaded file deleted:", inputPath);
    } catch (err) {
      console.warn("Failed to delete original uploaded file:", err.message);
    }

    // Prepare to run Python script
    const pythonScriptPath = path.join(
      process.cwd(),
      "utilities",
      "audioOrVideoToText.py"
    );
    const pythonExecutable =
      process.platform === "win32" ? "python" : "python3";

    const pythonProcess = spawn(pythonExecutable, [
      pythonScriptPath,
      outputPath,
    ]);

    let transcription = "";
    let errorOutput = "";

    pythonProcess.stdout.on("data", (data) => {
      transcription += data.toString();
    });

    pythonProcess.stderr.on("data", (data) => {
      errorOutput += data.toString();
    });

    pythonProcess.on("close", async (code) => {
      try {
        await fs.unlink(outputPath);
        console.log("Converted MP4 file deleted:", outputPath);
      } catch (err) {
        console.warn("Failed to delete converted MP4 file:", err.message);
      }

      if (code !== 0) {
        console.error("Python transcription script error:", errorOutput);
        return res
          .status(500)
          .json({ error: "Transcription failed.", details: errorOutput });
      }

      try {
        const transcribedText = transcription.trim();
        console.log("Transcribed Text:", transcribedText);

        if (!transcribedText) {
          return res.status(400).json({ error: "Empty transcription result." });
        }

        const therapyReply = await generateTherapyReply(transcribedText);
        console.log("Therapy Reply Generated.");

        const sentences = therapyReply
          .split(/(?<=[.!?])\s+/)
          .map((sentence) => sentence.trim())
          .filter((sentence) => sentence.length > 0);

        // Create lip sync/audio generation promises
        const messagePromises = sentences.map((sentence, index) =>
          generateAudioAndLipSync(sentence, index)
        );

        const messages = await Promise.all(messagePromises);

        return res.json({ messages });
      } catch (err) {
        console.error("Error processing transcription:", err);
        return res
          .status(500)
          .json({ error: "Failed to process transcription output." });
      }
    });

    pythonProcess.on("error", (err) => {
      console.error("Failed to start Python process:", err.message);
      return res
        .status(500)
        .json({
          error: "Failed to start transcription process.",
          details: err.message,
        });
    });
  } catch (error) {
    console.error("Unexpected server error:", error);
    return res
      .status(500)
      .json({ error: "Internal server error.", details: error.message });
  }
};
