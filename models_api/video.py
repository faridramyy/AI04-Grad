import os
import numpy as np
import cv2
import torch
import torch.nn.functional as F
from flask import Flask, request, jsonify
from flask_cors import CORS
from torchvision import models, transforms

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"])

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# Define your emotion classes manually (must match training order)
EMOTION_CLASSES = ['angry', 'disgust', 'fear', 'happy', 'neutral', 'sad', 'surprise']


def get_model_architecture(name, num_classes):
    if name == "resnet_model":
        model = models.resnet50(pretrained=False)  # ← CHANGED from resnet18
        model.fc = torch.nn.Linear(model.fc.in_features, num_classes)
    elif name == "mobilenet_model":
        model = models.mobilenet_v2(pretrained=False)
        model.classifier[1] = torch.nn.Linear(model.classifier[1].in_features, num_classes)
    elif name == "efficientnet_model":
        model = models.efficientnet_b0(pretrained=False)
        model.classifier[1] = torch.nn.Linear(model.classifier[1].in_features, num_classes)
    else:
        raise ValueError(f"Unsupported model: {name}")
    return model

def load_all_models(data_type):
    MODELS_DIR = f"../models/{data_type}/exported_files/"
    models_dict = {}

    print("Loading models from:", MODELS_DIR)
    print("Files found:", os.listdir(MODELS_DIR))

    for file in os.listdir(MODELS_DIR):
        if file.endswith(".pth"):
            model_name = file.replace(".pth", "")
            model_path = os.path.join(MODELS_DIR, file)

            try:
                print(f"\n--- Loading {model_name} ---")
                num_classes = len(EMOTION_CLASSES)
                model = get_model_architecture(model_name, num_classes)
                state_dict = torch.load(model_path, map_location=device)
                model.load_state_dict(state_dict)
                model.to(device).eval()

                models_dict[model_name] = {"model": model}
                print(f"{model_name} loaded successfully ✅")
            except Exception as e:
                print(f"❌ Failed to load {model_name}: {e}")

    return models_dict


def preprocess_video(file_stream):
    try:
        temp_path = "temp_video.mp4"
        with open(temp_path, 'wb') as f:
            f.write(file_stream.read())

        cap = cv2.VideoCapture(temp_path)
        frames = []
        max_frames = 30

        transform = transforms.Compose([
            transforms.ToPILImage(),
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize([0.485, 0.456, 0.406],
                                 [0.229, 0.224, 0.225])
        ])

        frame_count = 0
        while cap.isOpened() and frame_count < max_frames:
            ret, frame = cap.read()
            if not ret:
                break

            frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            tensor_frame = transform(frame_rgb)
            frames.append(tensor_frame)
            frame_count += 1

        cap.release()
        os.remove(temp_path)

        if not frames:
            print("⚠️ No frames extracted from video")
            return None

        video_tensor = torch.stack(frames)  # (T, C, H, W)
        averaged_tensor = video_tensor.mean(dim=0, keepdim=True)  # (1, C, H, W)

        print(f"Preprocessed video shape: {averaged_tensor.shape}")
        return averaged_tensor.to(device)

    except Exception as e:
        print(f"❌ Video preprocessing failed: {e}")
        return None


@app.route("/predict/video", methods=["POST"])
def predict_video():
    try:
        models_dict = load_all_models("video")

        model_weights = {
            "efficientnet_model": 0.4,
            "resnet_model": 0.3,
            "mobilenet_model": 0.5
        }

        if 'video' not in request.files:
            return jsonify({"error": "No video file provided"}), 400

        video_file = request.files['video']
        predictions = {}
        weighted_votes = {}

        for model_name, components in models_dict.items():
            model = components["model"]

            video_file.seek(0)  # Reset file pointer
            input_tensor = preprocess_video(video_file)
            if input_tensor is None:
                predictions[model_name] = "Preprocessing failed"
                continue

            try:
                with torch.no_grad():
                    output = model(input_tensor)
                    probs = F.softmax(output, dim=1)
                    class_index = torch.argmax(probs, dim=1).item()
                    label = EMOTION_CLASSES[class_index]

                    predictions[model_name] = label
                    weight = model_weights.get(model_name, 1)
                    weighted_votes[label] = weighted_votes.get(label, 0) + weight

                    print(f"{model_name} predicted: {label} ✅")

            except Exception as e:
                print(f"❌ Prediction error for {model_name}: {e}")
                predictions[model_name] = f"Prediction error: {str(e)}"

        final_prediction = (
            max(weighted_votes, key=weighted_votes.get)
            if weighted_votes else "Unable to determine"
        )

        print(f"\n🧠 Final prediction: {final_prediction}")
        return jsonify({
            "predictions": predictions,
            "final_prediction": final_prediction
        })

    except Exception as e:
        print(f"❌ Server error: {e}")
        return jsonify({"error": str(e)}), 500


@app.route("/", methods=["GET"])
def home():
    return "🎥 Video Emotion Server is running (no label encoders needed)"


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5003, debug=True)
