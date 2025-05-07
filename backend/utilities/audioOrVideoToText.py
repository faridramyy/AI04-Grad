import sys
import whisper

file_path = sys.argv[1]  # Get file path from Node.js

model = whisper.load_model("base")  # Or "small", etc.
result = model.transcribe(file_path)

print(result["text"])