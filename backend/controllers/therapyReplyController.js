import { ElevenLabsClient } from "elevenlabs";
import { promises as fs } from "fs";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { exec } from "child_process";
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

export const textReply = async (req, res) => {
  const userMessage = req.body.message;
  
  if (!userMessage) {
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
    return;
  }

  if (!elevenLabsApiKey || !process.env.GOOGLE_API_KEY) {
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
    return;
  }

  try {
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

    const answer = await result.response.text();

    console.log(answer);

    const sentences = answer
      .split(/(?<=[.!?])\s+/) // split after . ! or ? followed by a space
      .map((sentence) => sentence.trim()) // remove extra spaces
      .filter((sentence) => sentence.length > 0); // remove any empty sentences

    const messages = [];

    for (let i = 0; i < sentences.length; i++) {
      const text = sentences[i]; // the text of the sentence
      const fileName = `audios/message_${i}.mp3`;
      // Generate audio

      const audio = await elevenlabs.generate({
        voice: "Sarah",
        text,
        model_id: "eleven_multilingual_v2",
      });

      // Save audio buffer to file
      await fs.writeFile(fileName, audio, "binary");

      // Generate lipsync
      await lipSyncMessage(i);

      // Build the message object
      const message = {
        text: text,
        audio: await audioFileToBase64(fileName),
        lipsync: await readJsonTranscript(`audios/message_${i}.json`),
        facialExpression: "neutral", // or you can pick based on mood later
        animation: "Idle", // default animation
      };

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
