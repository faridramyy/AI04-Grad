import sys
import whisper

video_path = sys.argv[1]

model = whisper.load_model("base")  # or "small", "medium", "large"
result = model.transcribe(video_path)

print(result["text"])
