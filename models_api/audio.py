import os
import pickle
import numpy as np
import librosa
import soundfile as sf
from flask import Flask, request, jsonify
from tensorflow.keras.models import load_model
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"])


def load_all_models(data_type):
    """
    Load all models and their corresponding label encoders from the specified directory.
    """
    MODELS_DIR = f"../models/{data_type}/exported_files/"
    models = {}

    for file in os.listdir(MODELS_DIR):
        if file.endswith(".h5"):
            model_name = file.replace(".h5", "")
            model_path = os.path.join(MODELS_DIR, file)
            label_path = os.path.join(MODELS_DIR, f"{model_name}_label_encoder.pkl")

            try:
                model = load_model(model_path)
                with open(label_path, "rb") as f:
                    label_encoder = pickle.load(f)

                models[model_name] = {
                    "model": model,
                    "label_encoder": label_encoder
                }

            except Exception as e:
                print(f"Failed to load {model_name}: {e}")

    return models


def preprocess_audio(y, sr, model_name):
    """
    Preprocess audio according to the model's input requirements.
    """
    if model_name == "cnn_CREMA_D":
        mel = librosa.feature.melspectrogram(y=y, sr=sr, n_mels=128)
        log_mel = librosa.power_to_db(mel, ref=np.max)
        log_mel = librosa.util.fix_length(log_mel, size=128, axis=1)
        log_mel = (log_mel - np.min(log_mel)) / (np.max(log_mel) - np.min(log_mel))
        return np.expand_dims(log_mel, axis=(0, -1))  # Shape: (1, 128, 128, 1)
    
    elif model_name == "cnn":
        mel = librosa.feature.melspectrogram(y=y, sr=sr, n_mels=24)  # 24 x 32 = 768
        log_mel = librosa.power_to_db(mel, ref=np.max)
        log_mel = librosa.util.fix_length(log_mel, size=32, axis=1)  # shape: (24, 32)
        log_mel = (log_mel - np.min(log_mel)) / (np.max(log_mel) - np.min(log_mel))
        return np.expand_dims(log_mel.flatten(), axis=0)  # (1, 768)


    elif model_name == "lstm_CREMA_D":
        mfcc = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=13)
        return np.expand_dims(mfcc.T, axis=0)  # Shape: (1, T, 13)

    elif model_name == "lstm":
        mfcc = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=1)  # Reduce to 1 feature
        return np.expand_dims(mfcc.T, axis=0)  # Shape: (1, T, 1)

    return None

@app.route("/predict/audio", methods=["POST"])
def predict_audio():
    """
    Predict emotion from uploaded audio using multiple models.
    """
    try:
        # Load all models and encoders
        models_dict = load_all_models("audio")

        # Define weights for each model (can be tuned)
        model_weights = {
            "cnn_CREMA_D": 0.25,
            "cnn": 0.25,
            "lstm_CREMA_D": 0.25,
            "lstm": 0.25
        }

        # Check if audio file is provided
        if 'audio' not in request.files:
            return jsonify({"error": "No audio file provided"}), 400

        audio_file = request.files['audio']
        y, sr = sf.read(audio_file)

        if y.ndim > 1:
            y = y.mean(axis=1)  # Convert stereo to mono

        predictions = {}
        weighted_votes = {}

        # Loop through each model
        for model_name, components in models_dict.items():
            model = components["model"]
            encoder = components["label_encoder"]

            features = preprocess_audio(y, sr, model_name)
            if features is None:
                predictions[model_name] = "Preprocessing failed or unsupported format"
                continue

            try:
                prediction = model.predict(features)
                class_index = int(np.argmax(prediction, axis=1)[0])
                label = encoder.inverse_transform(np.array([class_index]))[0]

                predictions[model_name] = label
                weight = model_weights.get(model_name, 1)
                weighted_votes[label] = weighted_votes.get(label, 0) + weight

            except Exception as e:
                predictions[model_name] = f"Prediction error: {str(e)}"

        # Decide final prediction based on weighted voting
        final_prediction = (
            max(weighted_votes, key=weighted_votes.get)
            if weighted_votes else "Unable to determine"
        )

        return jsonify({
            "predictions": predictions,
            "final_prediction": final_prediction
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/", methods=["GET"])
def home():
    return "Server is running"


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5001, debug=True)
