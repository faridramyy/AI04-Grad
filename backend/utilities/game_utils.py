import json
import random
from transformers import AutoModelForSeq2SeqLM, AutoTokenizer
import torch

def load_seed_dataset(path="../datasets/game.json"):
    """Load seed dataset from JSON file"""
    try:
        with open(path, "r") as file:
            return json.load(file)["intents"]
    except Exception as e:
        print(f"❌ Dataset load error: {e}")
        return []

def generate_scenario_with_stress(prev_scenario, chosen_option, stress_score, model, tokenizer):
    """Generate follow-up scenario considering current stress level"""
    difficulty = calculate_difficulty(stress_score)
    
    prompt = (
        f"You are a therapeutic AI that creates emotional decision-making game scenarios.\n"
        f"Current user stress level: {stress_score*10}/10\n"
        f"Target difficulty: {difficulty}\n"
        f"Previous scenario: {prev_scenario['scenario']}\n"
        f"User chose: {chosen_option}\n"
        f"Generate a new JSON scenario with:\n"
        f"- 'scenario': situation matching the difficulty\n"
        f"- 'emotion': one of ['happy', 'sad', 'stressed', 'angry', 'anxious', 'confused']\n"
        f"- 'difficulty': '{difficulty}'\n"
        f"- 'responses': 4 options with 'option' and 'reward' (-3 to +3)\n"
        f"- 'best_choice_index': index of best response\n"
        f"Return only valid JSON."
    )

    inputs = tokenizer(prompt, return_tensors="pt", max_length=512, truncation=True)
    with torch.no_grad():
        outputs = model.generate(
            **inputs,
            max_new_tokens=512,
            do_sample=True,
            top_k=50,
            top_p=0.95,
            temperature=0.8
        )
    decoded = tokenizer.decode(outputs[0], skip_special_tokens=True)
    
    try:
        return json.loads(decoded)
    except json.JSONDecodeError:
        print("❌ Failed to parse generated scenario")
        return None