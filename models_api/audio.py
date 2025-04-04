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
    MODELS_DIR = "../models/" + data_type + "/exported_files/"
    models = {}

    for file in os.listdir(MODELS_DIR):
        if file.endswith(".h5"):
            model_name = file.replace(".h5", "")
            model_path = os.path.join(MODELS_DIR, file)
            label_encoder_path = os.path.join(MODELS_DIR, f"{model_name}_label_encoder.pkl")

            model = load_model(model_path)

            with open(label_encoder_path, "rb") as label_encoder_file:
                label_encoder = pickle.load(label_encoder_file)

            models[model_name] = {
                "model": model,
                "label_encoder": label_encoder
            }

    return models


@app.route("/predict/audio", methods=["POST"])
def predict_audio():
    try:
        models_dict = load_all_models("audio")

        # define weights based on accuracy 
        model_weights = {
            "cnn_CREMA_D": 0.25, 
            "cnn": 0.25,
            "lstm_CREMA_D": 0.25,
            "lstm": 0.25
        }

        if 'audio' not in request.files:
            return jsonify({"error": "No audio file provided"}), 400

        audio_file = request.files['audio']
        # Load audio data
        y, sr = sf.read(audio_file)
        if y.ndim > 1:
            y = y.mean(axis=1)  # Convert stereo to mono

        # Extract log-mel spectrogram with shape (128, ?) (time may vary)
        mel_spec = librosa.feature.melspectrogram(y=y, sr=sr, n_mels=128, fmax=8000)
        log_mel_spec = librosa.power_to_db(mel_spec, ref=np.max)

        # Resize or pad to (128, 128)
        if log_mel_spec.shape[1] < 128:
            pad_width = 128 - log_mel_spec.shape[1]
            log_mel_spec = np.pad(log_mel_spec, ((0, 0), (0, pad_width)), mode='constant')
        else:
            log_mel_spec = log_mel_spec[:, :128]

        # Normalize
        log_mel_spec = (log_mel_spec - np.min(log_mel_spec)) / (np.max(log_mel_spec) - np.min(log_mel_spec))

        # Final shape: (1, 128, 128, 1) -> suitable for Conv2D
        input_features = np.expand_dims(log_mel_spec, axis=(0, -1))
            

        predictions = {}
        weighted_votes = {}

        for model_name, data in models_dict.items():
            model = data["model"]
            label_encoder = data["label_encoder"]

            # Detect model input shape
            expected_shape = model.input_shape  # e.g., (None, 128, 128, 1) or (None, 128, 1)

            if expected_shape == (None, 128, 128, 1):
                # Prepare log-mel spectrogram for Conv2D
                mel_spec = librosa.feature.melspectrogram(y=y, sr=sr, n_mels=128, fmax=8000)
                log_mel_spec = librosa.power_to_db(mel_spec, ref=np.max)

                if log_mel_spec.shape[1] < 128:
                    pad_width = 128 - log_mel_spec.shape[1]
                    log_mel_spec = np.pad(log_mel_spec, ((0, 0), (0, pad_width)), mode='constant')
                else:
                    log_mel_spec = log_mel_spec[:, :128]

                log_mel_spec = (log_mel_spec - np.min(log_mel_spec)) / (np.max(log_mel_spec) - np.min(log_mel_spec))
                input_features = np.expand_dims(log_mel_spec, axis=(0, -1))  # (1, 128, 128, 1)

            elif expected_shape == (None, 128, 1):
                # Prepare MFCC for Conv1D/LSTM
                mfcc = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=1)

                if mfcc.shape[1] < 128:
                    pad_width = 128 - mfcc.shape[1]
                    mfcc = np.pad(mfcc, ((0, 0), (0, pad_width)), mode='constant')
                else:
                    mfcc = mfcc[:, :128]

                mfcc = mfcc.T  # shape: (128, 1)
                input_features = np.expand_dims(mfcc, axis=0)  # shape: (1, 128, 1)

            else:
                predictions[model_name] = "Unsupported input shape"
                continue

            prediction = model.predict(input_features)
            predicted_class = np.argmax(prediction, axis=1)
            predicted_label = label_encoder.inverse_transform(predicted_class)[0]

            predictions[model_name] = predicted_label

            weight = model_weights.get(model_name, 1)
            weighted_votes[predicted_label] = weighted_votes.get(predicted_label, 0) + weight


            final_prediction = max(weighted_votes, key=weighted_votes.get)

            return jsonify({
                'predictions': predictions,
                'final_prediction': final_prediction
            })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 400


@app.route("/", methods=["GET"])
def home():
    return "Server is running"


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5001, debug=True)
