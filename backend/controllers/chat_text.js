import dotenv from "dotenv";
import { ElevenLabsClient } from "elevenlabs";
import { promises as fss } from "fs";
import ffmpeg from "fluent-ffmpeg";
import { fileURLToPath } from "url";
import { dirname } from "path";
import fs from "fs";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const elevenLabsApiKey = process.env.ELEVEN_LABS_API_KEY;
const modelsApiLink = process.env.MODELS_API_LINK;
const voiceId = "Xb7hH8MSUJpSbSDYk0k2";


const lipSyncProcess = async (message) => {
  try {
    const inputFile = path.join(__dirname, `audios/message_${message}.mp3`);
    const outputWaveFile = path.join(
      __dirname,
      `audios/message_${message}.wav`
    );
    const outputJsonFile = path.join(
      __dirname,
      `audios/message_${message}.json`
    );

    ffmpeg(inputFile)
      .toFormat("wav")
      .on("error", (err) => {
        console.error("Error during conversion:", err.message);
      })
      .save(outputWaveFile);

      // generate json lips movements from the wav file


  } catch (error) {
    console.error(
      `Error during lip sync process for message: ${message}`,
      error
    );
    throw error;
  }
};

export const handleText = async (req, res) => {
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

  const data = await fetch(`${modelsApiLink}/predict/text`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ sentence: userMessage }),
  })
    .then((response) => response.json())
    .catch((error) => console.error("Error:", error));

  console.log(data);

  const emotionDetected = data.final_prediction;

  // call the generative ai 

  let messages = [
    {
      text: emotionDetected,
      facialExpression: "smile",
      animation: "Talking_1",
    },
  ];

  let responseMessages = [];

  for (let i = 0; i < messages.length; i++) {
    const message = messages[i];
    try {
      const outputFileName = `audios/message_${i}.mp3`;
      const text = message.text;

      try {
        await textToSpeech(text, outputFileName);
      } catch (error) {
        console.error("Error generating text-to-speech audio:", error);
        throw error;
      }

      await lipSyncProcess(i);

      message.audio = await audioFileToBase64(outputFileName);
      message.lipsync = await readJsonTranscript(`audios/intro_0.json`);
      // message.lipsync = await readJsonTranscript(`audios/message_${i}.json`);
    } catch (error) {
      console.error(`Error processing message ${i}:`, error.message);
      message.error = `Failed to process audio for message ${i}`;
    }
    responseMessages.push(message);
  }

  console.log(responseMessages);

  res.send({ messages: responseMessages });
};

const textToSpeech = async (text, outputFileName) => {
  try {
    const client = new ElevenLabsClient({ apiKey: elevenLabsApiKey });
    const audioStream = await client.textToSpeech.convert(voiceId, {
      text,
      model_id: "eleven_multilingual_v2",
      output_format: "mp3_44100_128",
    });

    const audioFilePath = path.join(__dirname, outputFileName);
    const writeStream = fs.createWriteStream(audioFilePath);

    await new Promise((resolve, reject) => {
      audioStream.pipe(writeStream);

      writeStream.on("finish", () => {
        console.log(`Audio saved to ${audioFilePath}`);
        resolve();
      });

      writeStream.on("error", (error) => {
        console.error("Error saving audio:", error);
        reject(error);
      });
    });
  } catch (error) {
    console.error(
      "Error generating speech:",
      error.response?.data || error.message
    );
  }
};

const readJsonTranscript = async (file) => {
  const data = await fss.readFile(file, "utf8");
  return JSON.parse(data);
};

const audioFileToBase64 = async (file) => {
  const data = await fss.readFile(file);
  return data.toString("base64");
};
