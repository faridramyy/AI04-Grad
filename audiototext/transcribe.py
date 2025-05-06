import sys
import whisper

audio_path = sys.argv[1]  # Get file path from Node.js

model = whisper.load_model("base")  # Or "small", etc.
result = model.transcribe(audio_path)

print(result["text"])