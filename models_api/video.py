import os
import pickle
import numpy as np
import cv2
from flask import Flask, request, jsonify
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
from flask_cors import CORS
from werkzeug.utils import secure_filename
import tensorflow as tf
from PIL import Image

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"])

# Configuration
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'mp4', 'avi', 'mov', 'flv'}
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Preprocessing function
def preprocess_frame(frame, target_size=(224, 224)):
    frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    frame = cv2.resize(frame, target_size)
    img = Image.fromarray(frame)
    img_array = image.img_to_array(img)
    img_array = tf.keras.applications.efficientnet.preprocess_input(img_array)
    return img_array

def load_video_models():
    MODELS_DIR = "../models/video/exported_files/"
    models = {}
    
    model_files = {
        "EfficientNet-B0": {
            "h5": "EfficientNet-B0.h5",
            "pkl": "EfficientNet-B0.pkl"
        },
        "MobileNet": {
            "h5": "emotion_recognition_mobilenet_weights.h5",
            "pkl": "mobilenet_label_encoder.pkl"
        },
        "ResNet": {
            "h5": "emotion_recognition_resnet_weights.h5",
            "pkl": "emotion_recognition_resnet_label_encoder.pkl"
        }
    }
    
    for model_name, files in model_files.items():
        h5_path = os.path.join(MODELS_DIR, files["h5"])
        pkl_path = os.path.join(MODELS_DIR, files["pkl"])
        
        if os.path.exists(h5_path) and os.path.exists(pkl_path):
            try:
                model = load_model(h5_path)
                with open(pkl_path, "rb") as f:
                    label_encoder = pickle.load(f)
                models[model_name] = {
                    "model": model,
                    "label_encoder": label_encoder
                }
                print(f"✅ Successfully loaded {model_name}")
            except Exception as e:
                print(f"❌ Error loading {model_name}: {str(e)}")
        else:
            print(f"⚠️ Files not found for {model_name}")
    
    return models

video_models = load_video_models()

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def extract_key_frames(video_path, num_frames=16):
    cap = cv2.VideoCapture(video_path)
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    frame_indices = np.linspace(0, total_frames - 1, num=min(num_frames, total_frames), dtype=int)
    
    frames = []
    for idx in frame_indices:
        cap.set(cv2.CAP_PROP_POS_FRAMES, idx)
        ret, frame = cap.read()
        if ret:
            frames.append(frame)
    cap.release()
    return frames

@app.route('/predict/video', methods=['POST'])
def predict_video():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'Empty filename'}), 400
    
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        try:
            # Model weights based on test accuracies:
            # EfficientNet: 98.31%, ResNet: 97.08%, MobileNet: 84.66%
            model_weights = {
                "EfficientNet-B0": 0.40,  # Highest weight (best accuracy)
                "ResNet": 0.35,           # Second-best
                "MobileNet": 0.25         # Lower weight but still contributes
            }
            
            frames = extract_key_frames(filepath)
            if not frames:
                return jsonify({'error': 'No frames extracted'}), 400
            
            processed_frames = [preprocess_frame(frame) for frame in frames]
            frames_array = np.array(processed_frames)
            
            predictions = {}
            weighted_votes = {}
            
            for model_name, data in video_models.items():
                model = data['model']
                label_encoder = data['label_encoder']
                
                frame_predictions = []
                for frame in frames_array:
                    frame = np.expand_dims(frame, axis=0)
                    pred = model.predict(frame)
                    pred_class = np.argmax(pred, axis=1)
                    pred_label = label_encoder.inverse_transform(pred_class)[0]
                    frame_predictions.append(pred_label)
                
                unique, counts = np.unique(frame_predictions, return_counts=True)
                model_prediction = unique[np.argmax(counts)]
                confidence = max(counts) / len(frame_predictions)
                
                predictions[model_name] = {
                    'prediction': model_prediction,
                    'confidence': f"{confidence:.2%}",
                    'frame_predictions': frame_predictions
                }
                
                weight = model_weights.get(model_name, 0)
                weighted_votes[model_prediction] = weighted_votes.get(model_prediction, 0) + weight
            
            if weighted_votes:
                final_prediction = max(weighted_votes.items(), key=lambda x: x[1])[0]
                final_confidence = max(weighted_votes.values()) / sum(weighted_votes.values())
            else:
                final_prediction = "unknown"
                final_confidence = 0.0
            
            os.remove(filepath)
            
            return jsonify({
                'status': 'success',
                'final_prediction': final_prediction,
                'final_confidence': f"{final_confidence:.2%}",
                'model_predictions': predictions,
                'weights_used': model_weights
            })
            
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
    return jsonify({'error': 'Invalid file type'}), 400

@app.route("/", methods=["GET"])
def home():
    return "🎥 Video Emotion Recognition API"

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5002, debug=True)