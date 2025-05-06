import { ElevenLabsClient } from "elevenlabs";
import { promises as fs } from "fs";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { exec } from "child_process";
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

    // New Part: Convert to WAV using ffmpeg
    const inputPath = file.path;
    const outputPath = inputPath.replace(path.extname(inputPath), ".wav");

    await new Promise((resolve, reject) => {
      exec(
        `ffmpeg -y -i "${inputPath}" "${outputPath}"`,
        (error, stdout, stderr) => {
          if (error) {
            console.error("Error converting to WAV:", error);
            return reject(error);
          }
          console.log("Conversion to WAV successful");
          resolve();
          fs.unlink(inputPath);
          console.log("Original WEBM file deleted");
        }
      );
    });

    await sendDefaultIntro(res);
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .send({ messages: [], error: "Failed to get response from Gemini" });
  }
};

export const videoReply = async (req, res) => {
  res.send({ messages: [{ text: "Video feature not implemented yet." }] });
};
