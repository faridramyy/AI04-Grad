import os
import pickle
import numpy as np
from flask import Flask, request, jsonify
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.sequence import pad_sequences
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
            tokenizer_path = os.path.join(MODELS_DIR, f"{model_name}_tokenizer.pkl")
            label_encoder_path = os.path.join(
                MODELS_DIR, f"{model_name}_label_encoder.pkl"
            )

            model = load_model(model_path)

            with open(tokenizer_path, "rb") as tokenizer_file:
                tokenizer = pickle.load(tokenizer_file)

            with open(label_encoder_path, "rb") as label_encoder_file:
                label_encoder = pickle.load(label_encoder_file)

            models[model_name] = {
                "model": model,
                "tokenizer": tokenizer,
                "label_encoder": label_encoder,
            }

    return models


@app.route("/predict/text", methods=["POST"])
def predict():
    try:
        models_dict = load_all_models("text")

        # define weights based on accuracy 
        model_weights = {
            "cnn": 0.35, 
            "cnn_with_resnet": 0.35,
            "crnn": 0.1,
            "rnn": 0.2
        }

        input_data = request.get_json()
        sentence = input_data["sentence"]

        predictions = {}
        weighted_votes = {}

        for model_name, data in models_dict.items():
            tokenizer = data["tokenizer"]
            label_encoder = data["label_encoder"]
            model = data["model"]

            sequence = tokenizer.texts_to_sequences([sentence])
            padded_sequence = pad_sequences(sequence, maxlen=100)

            prediction = model.predict(padded_sequence)
            predicted_class = np.argmax(prediction, axis=1)
            predicted_label = label_encoder.inverse_transform(predicted_class)[0]

            predictions[model_name] = predicted_label

            weight = model_weights.get(model_name, 1)  # Default weight is 1 if not specified
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
