import os
import sys
import cv2
import torch
import torch.nn.functional as F
import numpy as np
from torchvision import models, transforms

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

EMOTION_CLASSES = ['angry', 'disgust', 'fear', 'happy', 'neutral', 'sad', 'surprise']

def get_model_architecture(name, num_classes):
    if name == "resnet_model":
        model = models.resnet50(pretrained=False)
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
    MODELS_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "models", data_type, "exported_files"))
    models_dict = {}

    for file in os.listdir(MODELS_DIR):
        if file.endswith(".pth"):
            model_name = file.replace(".pth", "")
            model_path = os.path.join(MODELS_DIR, file)

            try:
                num_classes = len(EMOTION_CLASSES)
                model = get_model_architecture(model_name, num_classes)
                state_dict = torch.load(model_path, map_location=device)
                model.load_state_dict(state_dict)
                model.to(device).eval()

                models_dict[model_name] = {"model": model}
            except Exception as e:
                print(f"❌ Failed to load {model_name}: {e}")

    return models_dict

def preprocess_video(video_path):
    try:
        cap = cv2.VideoCapture(video_path)
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

        if not frames:
            print("⚠️ No frames extracted from video")
            return None

        video_tensor = torch.stack(frames)  # (T, C, H, W)
        averaged_tensor = video_tensor.mean(dim=0, keepdim=True)  # (1, C, H, W)
        return averaged_tensor.to(device)

    except Exception as e:
        print(f"❌ Video preprocessing failed: {e}")
        return None

def main():
    if len(sys.argv) < 2:
        print("❌ Please provide a video file path.")
        return

    video_path = sys.argv[1]
    if not os.path.exists(video_path):
        print("❌ Provided video file path does not exist.")
        return

    try:
        models_dict = load_all_models("video")

        model_weights = {
            "efficientnet_model": 0.4,
            "resnet_model": 0.3,
            "mobilenet_model": 0.5
        }

        predictions = {}
        weighted_votes = {}

        input_tensor = preprocess_video(video_path)
        if input_tensor is None:
            print("❌ Failed to preprocess video.")
            return

        for model_name, components in models_dict.items():
            model = components["model"]
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
                predictions[model_name] = "Prediction error"

        final_prediction = (
            max(weighted_votes, key=weighted_votes.get)
            if weighted_votes else "Unable to determine"
        )

        print(f"\nPredictions: {predictions}")
        print(f"Final Prediction: {final_prediction}")

    except Exception as e:
        print(f"❌ Unexpected error: {e}")

if __name__ == "__main__":
    main()
