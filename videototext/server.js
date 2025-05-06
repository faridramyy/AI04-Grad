const express = require('express');
const multer = require('multer');
const cors = require('cors');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

app.use(cors());

// Create 'uploads' folder if it doesn't exist
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Multer for handling video uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, 'input_video' + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// POST /transcribe-video
app.post('/transcribe-video', upload.single('video'), (req, res) => {
  const filePath = req.file.path;

  const pythonPath = 'C:/Users/dell/anaconda3/envs/whisper_env/python.exe';  // Adjust if needed
  const python = spawn(pythonPath, ['transcribe.py', filePath]);

  let transcription = '';
  let errorOutput = '';

  python.stdout.on('data', (data) => {
    transcription += data.toString();
  });

  python.stderr.on('data', (data) => {
    errorOutput += data.toString();
  });

  python.on('close', (code) => {
    if (code === 0) {
      res.json({ text: transcription.trim() });
    } else {
      res.status(500).json({ error: 'Transcription failed', details: errorOutput });
    }
  });
});

app.listen(port, () => {
  console.log(`Whisper video-to-text server running at http://localhost:${port}`);
});
