import json
import random
import numpy as np
from transformers import AutoModelForSeq2SeqLM, AutoTokenizer
import torch

# ================== STRESS UTILITIES ==================
def get_initial_stress_level():
    while True:
        try:
            stress = float(input("Enter your current stress level (0-10): "))
            if 0 <= stress <= 10:
                return stress / 10  # Normalize
            print("Please enter a value between 0 and 10.")
        except ValueError:
            print("Invalid input. Please enter a number.")

def calculate_difficulty(stress_score):
    if stress_score < 0.25:
        return "easy"
    elif stress_score < 0.65:
        return "medium"
    else:
        return "hard"

def adjust_stress(current_stress, reward):
    adjustment = -reward * 0.07 + np.random.uniform(-0.01, 0.01)
    adjustment = np.sign(adjustment) * min(abs(adjustment), 0.15)
    new_stress = current_stress + adjustment
    return np.clip(new_stress, 0.0, 1.0)

# ================== DATA LOADING ==================
def load_seed_dataset(path="../../models/game/datasets/game.json"):
    try:
        with open(path, "r") as file:
            data = json.load(file)
            scenarios = data.get("intents", [])
            validated = []
            for scenario in scenarios:
                if not all(k in scenario for k in ["scenario", "emotion", "responses"]):
                    continue
                if "difficulty" not in scenario:
                    scenario["difficulty"] = "medium"
                valid_responses = []
                for r in scenario.get("responses", []):
                    if "option" in r and "reward" in r:
                        valid_responses.append({
                            "option": r["option"],
                            "reward": float(r["reward"])
                        })
                if len(valid_responses) >= 2:
                    scenario["responses"] = valid_responses
                    validated.append(scenario)
            return validated
    except Exception as e:
        print(f"❌ Dataset load error: {e}")
        return []

# ================== GENERATION ==================
def generate_scenario_with_stress(prev_scenario, chosen_option, stress_score, model, tokenizer):
    difficulty = calculate_difficulty(stress_score)
    emotion = prev_scenario.get("emotion", "neutral")

    prompt = f"""You are a therapeutic AI creating emotional decision-making scenarios.

Current Context:
- User stress level: {stress_score*10:.1f}/10
- Target difficulty: {difficulty}
- Previous emotion: {emotion}
- Last scenario: "{prev_scenario['scenario']}"
- User's choice: "{chosen_option}"

Generate a new scenario as JSON with these exact fields:
1. "scenario": A 1-2 sentence situation (realistic)
2. "emotion": One of [happy, sad, stressed, angry, anxious, confused, neutral]
3. "difficulty": "{difficulty}"
4. "responses": List of 4 options, each with:
   - "option": Text response
   - "reward": Number from -3 to +3
5. "best_choice_index": Index (0-3)

Example:
{{
  "scenario": "Your coworker takes credit for your idea.",
  "emotion": "angry",
  "difficulty": "medium",
  "responses": [
    {{"option": "Confront them angrily", "reward": -2}},
    {{"option": "Stay quiet but resentful", "reward": -1}},
    {{"option": "Discuss it calmly", "reward": 2}},
    {{"option": "Bring it up with your manager", "reward": 1}}
  ],
  "best_choice_index": 2
}}

New Scenario:"""

    inputs = tokenizer(prompt, return_tensors="pt", max_length=1024, truncation=True)
    with torch.no_grad():
        outputs = model.generate(
            **inputs,
            max_new_tokens=512,
            do_sample=True,
            top_k=50,
            top_p=0.95,
            temperature=0.7,
            num_return_sequences=1
        )
    decoded = tokenizer.decode(outputs[0], skip_special_tokens=True)

    try:
        scenario = json.loads(decoded.strip())
        required_keys = ["scenario", "emotion", "difficulty", "responses", "best_choice_index"]
        if all(k in scenario for k in required_keys):
            if len(scenario["responses"]) == 4 and 0 <= scenario["best_choice_index"] <= 3:
                return scenario
        print("⚠️ Generated scenario failed validation.")
    except json.JSONDecodeError:
        print("❌ Could not parse generated scenario.")

    return get_fallback_scenario(difficulty, emotion)

def get_fallback_scenario(difficulty, emotion):
    return {
        "scenario": "You're waiting in line and someone cuts in front of you.",
        "emotion": emotion,
        "difficulty": difficulty,
        "responses": [
            {"option": "Say nothing and stay annoyed", "reward": -1},
            {"option": "Politely ask them to go back", "reward": 1},
            {"option": "Complain loudly", "reward": -2},
            {"option": "Let it go and use your phone", "reward": 0}
        ],
        "best_choice_index": 1
    }

# ================== TERMINAL GAME LOOP ==================
def terminal_gameplay(initial_scenario, model, tokenizer, initial_stress, rounds=5):
    current_scenario = initial_scenario
    current_stress = initial_stress

    for round_index in range(rounds):
        print("\n==============================")
        print(f"🌀 Round {round_index + 1}")
        print(f"📊 Stress: {current_stress*10:.1f}/10")
        print(f"🎭 Emotion: {current_scenario.get('emotion', 'neutral')}")
        print(f"📜 Scenario: {current_scenario['scenario']}")
        print(f"⚡ Difficulty: {current_scenario.get('difficulty', 'medium')}")
        print("\nYour Options:")
        for idx, resp in enumerate(current_scenario["responses"]):
            print(f"{idx + 1}. {resp['option']} (Reward: {resp['reward']:+})")

        while True:
            try:
                choice = int(input("Enter your choice (1-4): ")) - 1
                if 0 <= choice < 4:
                    break
                print("Invalid input. Please choose a number between 1 and 4.")
            except ValueError:
                print("Invalid input. Please enter a number.")

        user_choice = current_scenario["responses"][choice]["option"]
        reward = current_scenario["responses"][choice]["reward"]
        current_stress = adjust_stress(current_stress, reward)

        print("\n✅ You chose:", user_choice)
        print(f"🏆 Reward: {reward:+}")
        print(f"📉 New Stress Level: {current_stress*10:.1f}/10")

        if round_index + 1 < rounds:
            current_scenario = generate_scenario_with_stress(
                current_scenario,
                user_choice,
                current_stress,
                model,
                tokenizer
            )
        else:
            print("\n🎉 Game Over!")
            print(f"Final Stress Level: {current_stress*10:.1f}/10")

# ================== MAIN ==================
def main():
    print("🧠 Enhanced Terminal Stress Game\n")
    initial_stress = get_initial_stress_level()
    seed_data = load_seed_dataset()
    if not seed_data:
        print("❌ No valid scenarios found.")
        return

    model_name = "google/flan-t5-base"
    try:
        tokenizer = AutoTokenizer.from_pretrained(model_name)
        model = AutoModelForSeq2SeqLM.from_pretrained(model_name)
    except Exception as e:
        print(f"❌ Model loading error: {e}")
        return

    difficulty = calculate_difficulty(initial_stress)
    filtered_scenarios = [s for s in seed_data if s.get("difficulty", "medium") == difficulty]
    first_scenario = random.choice(filtered_scenarios if filtered_scenarios else seed_data)

    terminal_gameplay(first_scenario, model, tokenizer, initial_stress, rounds=5)

if __name__ == "__main__":
    main()
