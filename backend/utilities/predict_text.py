import os
import sys
import pickle
import numpy as np
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.sequence import pad_sequences

def load_all_models(data_type):
    MODELS_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "models", data_type, "exported_files"))
    models = {}

    for file in os.listdir(MODELS_DIR):
        if file.endswith(".h5"):
            model_name = file.replace(".h5", "")
            model_path = os.path.join(MODELS_DIR, file)
            tokenizer_path = os.path.join(MODELS_DIR, f"{model_name}_tokenizer.pkl")
            label_encoder_path = os.path.join(MODELS_DIR, f"{model_name}_label_encoder.pkl")

            try:
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
            except Exception as e:
                print(f"❌ Failed to load model {model_name}: {e}")

    return models

def main():
    if len(sys.argv) < 2:
        print("❌ Please provide a sentence as a command-line argument.")
        return

    sentence = " ".join(sys.argv[1:])  # Supports multi-word input without quotes

    try:
        models_dict = load_all_models("text")

        if not models_dict:
            print("❌ No models were loaded. Check the model directory.")
            return

        model_weights = {
            "cnn": 0.35,
            "cnn_with_resnet": 0.35,
            "crnn": 0.1,
            "rnn": 0.2
        }

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
            weight = model_weights.get(model_name, 1)
            weighted_votes[predicted_label] = weighted_votes.get(predicted_label, 0) + weight

        final_prediction = max(weighted_votes, key=weighted_votes.get)

        print("✅ Individual Model Predictions:")
        for name, pred in predictions.items():
            print(f" - {name}: {pred}")
        print(f"\n🎯 Final Ensemble Prediction: {final_prediction}")

    except Exception as e:
        print(f"❌ Error: {str(e)}")

if __name__ == "__main__":
    main()
