import sys
import whisper

file_path = sys.argv[1]  # Get file path from Node.js

model = whisper.load_model("base")  # You can also use "small", "medium", "large"

# Force the model to assume English input
result = model.transcribe(file_path, language="en")

print(result["text"])
