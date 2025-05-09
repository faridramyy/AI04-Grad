import os
import sys
import pickle
import numpy as np
import librosa
import soundfile as sf
from tensorflow.keras.models import load_model

def load_all_models(data_type):
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
    if model_name == "cnn_CREMA_D":
        mel = librosa.feature.melspectrogram(y=y, sr=sr, n_mels=128)
        log_mel = librosa.power_to_db(mel, ref=np.max)
        log_mel = librosa.util.fix_length(log_mel, size=128, axis=1)
        log_mel = (log_mel - np.min(log_mel)) / (np.max(log_mel) - np.min(log_mel))
        return np.expand_dims(log_mel, axis=(0, -1))
    
    elif model_name == "cnn":
        mel = librosa.feature.melspectrogram(y=y, sr=sr, n_mels=24)
        log_mel = librosa.power_to_db(mel, ref=np.max)
        log_mel = librosa.util.fix_length(log_mel, size=32, axis=1)
        log_mel = (log_mel - np.min(log_mel)) / (np.max(log_mel) - np.min(log_mel))
        return np.expand_dims(log_mel.flatten(), axis=0)

    elif model_name == "lstm_CREMA_D":
        mfcc = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=13)
        return np.expand_dims(mfcc.T, axis=0)

    elif model_name == "lstm":
        mfcc = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=1)
        return np.expand_dims(mfcc.T, axis=0)

    return None

def main():
    if len(sys.argv) < 2:
        print("❌ Please provide an audio file path.")
        return

    file_path = sys.argv[1]

    try:
        y, sr = sf.read(file_path)
        if y.ndim > 1:
            y = y.mean(axis=1)

        models_dict = load_all_models("audio")
        model_weights = {
            "cnn_CREMA_D": 0.25,
            "cnn": 0.25,
            "lstm_CREMA_D": 0.25,
            "lstm": 0.25
        }

        predictions = {}
        weighted_votes = {}

        for model_name, components in models_dict.items():
            model = components["model"]
            encoder = components["label_encoder"]
            features = preprocess_audio(y, sr, model_name)

            if features is None:
                predictions[model_name] = "Preprocessing failed"
                continue

            prediction = model.predict(features)
            class_index = int(np.argmax(prediction, axis=1)[0])
            label = encoder.inverse_transform([class_index])[0]

            predictions[model_name] = label
            weight = model_weights.get(model_name, 1)
            weighted_votes[label] = weighted_votes.get(label, 0) + weight

        final_prediction = (
            max(weighted_votes, key=weighted_votes.get)
            if weighted_votes else "Unable to determine"
        )

        print(f"Predictions: {predictions}")
        print(f"Final Prediction: {final_prediction}")

    except Exception as e:
        print(f"❌ Error: {str(e)}")

if __name__ == "__main__":
    main()
