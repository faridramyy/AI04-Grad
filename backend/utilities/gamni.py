import json
import random
import numpy as np
import sys
from google.api_core import retry
import google.generativeai as genai

# ================== CONFIGURATION ==================
GOOGLE_API_KEY = "AIzaSyAkKtXkNqZJGyrKtish9SkjVn-0Dl3czec"
genai.configure(api_key=GOOGLE_API_KEY)

# ================== STRESS UTILITIES ==================
def calculate_difficulty(stress_score):
    if stress_score < 0.25:
        return "easy"
    elif stress_score < 0.65:
        return "medium"
    else:
        return "hard"

# ================== SCENARIO MANAGEMENT ==================
class ScenarioBank:
    def __init__(self):
        self.scenarios = {
            "stressed": [
                {
                    "scenario": "Your computer crashes right before an important deadline.",
                    "responses": [
                        {"option": "Panic and give up", "reward": -2},
                        {"option": "Blame others angrily", "reward": -1},
                        {"option": "Take deep breaths and troubleshoot", "reward": 2},
                        {"option": "Ask a colleague for help", "reward": 1}
                    ],
                    "best_choice_index": 2
                }
            ],
            "angry": [
                {
                    "scenario": "A coworker takes credit for your idea in a meeting.",
                    "responses": [
                        {"option": "Yell at them in front of everyone", "reward": -2},
                        {"option": "Stay silent but plot revenge", "reward": -1},
                        {"option": "Calmly correct the record", "reward": 2},
                        {"option": "Discuss it privately later", "reward": 1}
                    ],
                    "best_choice_index": 2
                }
            ]
        }

    def get_fallback_scenario(self, emotion, difficulty):
        emotion = emotion.lower()
        if emotion not in self.scenarios:
            emotion = random.choice(list(self.scenarios.keys()))

        scenario = random.choice(self.scenarios[emotion])
        scenario["difficulty"] = difficulty
        scenario["emotion"] = emotion
        return scenario

class GeminiScenarioGenerator:
    def __init__(self):
        try:
            self.model = genai.GenerativeModel('gemini-1.5-flash')
            self.generation_config = {
                "temperature": 0.8,
                "top_p": 0.95,
                "top_k": 50,
                "max_output_tokens": 1024
            }
            self.available = True
        except Exception as e:
            print(f"⚠️ Gemini init failed: {str(e)}")
            self.available = False

    @retry.Retry()
    def generate_scenario(self, prompt):
        if not self.available:
            return None
        try:
            response = self.model.generate_content(prompt, generation_config=self.generation_config)
            return response.text
        except Exception as e:
            print(f"⚠️ Gemini generation failed: {str(e)}")
            return None

def generate_scenario_with_stress(prev_scenario, chosen_option, stress_score, generator, bank):
    difficulty = calculate_difficulty(stress_score)
    emotion = prev_scenario.get("emotion", "neutral")

    prompt = f"""**Therapeutic Scenario Generation**

**User Profile:**
- Current stress level: {stress_score*10:.1f}/10
- Target difficulty: {difficulty}
- Emotional state: {emotion}

**Previous Interaction:**
- Scenario: \"{prev_scenario['scenario']}\"
- User's choice: \"{chosen_option}\"

**Instructions:**
Generate a new therapeutic scenario in JSON format with these exact fields:
1. "scenario": A realistic 1-2 sentence situation
2. "emotion": Primary emotion [happy, sad, angry, anxious, confused, neutral]
3. "difficulty": "{difficulty}"
4. "responses": 4 options, each with:
   - "option": Response text
   - "reward": Therapeutic value (-3 to +3)
5. "best_choice_index": Index (0-3) of healthiest response

**Example:**
{{
  "scenario": "Your friend cancels plans last minute for the third time.",
  "emotion": "angry",
  "difficulty": "medium",
  "responses": [
    {{"option": "Yell at them and end the friendship", "reward": -2}},
    {{"option": "Passively accept it but feel resentful", "reward": -1}},
    {{"option": "Express your feelings calmly", "reward": 2}},
    {{"option": "Ask if everything is okay with them", "reward": 1}}
  ],
  "best_choice_index": 2
}}

**New Scenario:**"""

    try:
        text = generator.generate_scenario(prompt)
        if text:
            clean = text.strip().replace("```json", "").replace("```", "")
            parsed = json.loads(clean)
            if all(k in parsed for k in ["scenario", "emotion", "difficulty", "responses", "best_choice_index"]):
                if len(parsed["responses"]) == 4:
                    return parsed
    except Exception as e:
        print("⚠️ Parse or validation error:", str(e))

    return bank.get_fallback_scenario(emotion, difficulty)

# ================== ENTRYPOINT ==================
if __name__ == "__main__":
    try:
        data = json.loads(sys.argv[1])
        prev_scenario = data["prev_scenario"]
        chosen_option = data["chosen_option"]
        stress_score = data["stress_score"]

        generator = GeminiScenarioGenerator()
        bank = ScenarioBank()

        scenario = generate_scenario_with_stress(prev_scenario, chosen_option, stress_score, generator, bank)
        print(json.dumps(scenario))
    except Exception as e:
        print(json.dumps({"error": str(e)}))
