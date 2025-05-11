import json
import random
import numpy as np
from google.api_core import retry
import google.generativeai as genai
from collections import deque

# ================== CONFIGURATION ==================
GOOGLE_API_KEY = "AIzaSyAkKtXkNqZJGyrKtish9SkjVn-0Dl3czec"  # Replace if needed
genai.configure(api_key=GOOGLE_API_KEY)

# Game Parameters
INITIAL_ROUNDS = 5
MIN_STRESS = 0.0
MAX_STRESS = 1.0

# RL Parameters
LEARNING_RATE = 0.1
DISCOUNT_FACTOR = 0.9
EXPLORATION_RATE = 0.3
MEMORY_SIZE = 100

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
    return np.clip(new_stress, MIN_STRESS, MAX_STRESS)

# ================== REINFORCEMENT LEARNING ==================
class RLAgent:
    def __init__(self):
        self.q_table = {}  # State -> action values
        self.memory = deque(maxlen=MEMORY_SIZE)
        self.exploration_rate = EXPLORATION_RATE
        
    def get_state_key(self, scenario, stress_level):
        return f"{scenario['emotion']}_{scenario['difficulty']}_{int(stress_level*10)}"
    
    def choose_action(self, state_key, responses):
        if random.random() < self.exploration_rate:
            return random.randint(0, len(responses)-1)
        
        if state_key not in self.q_table:
            self.q_table[state_key] = [0] * len(responses)
            return random.randint(0, len(responses)-1)
        
        return np.argmax(self.q_table[state_key])
    
    def update_q_table(self, state, action, reward, next_state):
        if state not in self.q_table:
            self.q_table[state] = [0] * 4
        
        if next_state not in self.q_table:
            self.q_table[next_state] = [0] * 4
        
        best_next_action = np.argmax(self.q_table[next_state])
        td_target = reward + DISCOUNT_FACTOR * self.q_table[next_state][best_next_action]
        td_error = td_target - self.q_table[state][action]
        self.q_table[state][action] += LEARNING_RATE * td_error
        
        # Gradually decrease exploration
        self.exploration_rate = max(0.01, self.exploration_rate * 0.995)

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
                },
                {
                    "scenario": "You're overwhelmed with multiple urgent tasks.",
                    "responses": [
                        {"option": "Ignore them all", "reward": -2},
                        {"option": "Work frantically without focus", "reward": -1},
                        {"option": "Prioritize and tackle one by one", "reward": 2},
                        {"option": "Delegate some tasks", "reward": 1}
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
            ],
            "anxious": [
                {
                    "scenario": "You have to give a presentation to senior leadership.",
                    "responses": [
                        {"option": "Call in sick to avoid it", "reward": -2},
                        {"option": "Do it but constantly apologize", "reward": -1},
                        {"option": "Prepare thoroughly and practice", "reward": 2},
                        {"option": "Ask a friend to review your slides", "reward": 1}
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
            self.model = genai.GenerativeModel('gemini-1.0-pro')
            self.generation_config = {
                "temperature": 0.8,
                "top_p": 0.95,
                "top_k": 50,
                "max_output_tokens": 1024
            }
            self.available = True
            # Test the connection
            genai.list_models()
        except Exception as e:
            print(f"⚠️ Gemini initialization warning: {str(e)}")
            self.available = False
    
    @retry.Retry()
    def generate_scenario(self, prompt):
        if not self.available:
            return None
            
        try:
            response = self.model.generate_content(
                prompt,
                generation_config=self.generation_config
            )
            return response.text
        except Exception as e:
            print(f"⚠️ Gemini generation warning: {str(e)}")
            self.available = False
            return None

def generate_scenario_with_stress(prev_scenario, chosen_option, stress_score, generator, scenario_bank):
    difficulty = calculate_difficulty(stress_score)
    emotion = prev_scenario.get("emotion", "neutral")

    # Try Gemini first if available
    if generator.available:
        prompt = f"""**Therapeutic Scenario Generation**
        
**User Profile:**
- Current stress level: {stress_score*10:.1f}/10
- Target difficulty: {difficulty}
- Emotional state: {emotion}

**Previous Interaction:**
- Scenario: "{prev_scenario['scenario']}"
- User's choice: "{chosen_option}"

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

        generated_text = generator.generate_scenario(prompt)
        
        try:
            if generated_text:
                # Clean the response
                clean_text = generated_text.strip().replace("```json", "").replace("```", "")
                scenario = json.loads(clean_text)
                
                # Validate structure
                required_keys = ["scenario", "emotion", "difficulty", "responses", "best_choice_index"]
                if all(k in scenario for k in required_keys):
                    if len(scenario["responses"]) == 4 and 0 <= scenario["best_choice_index"] <= 3:
                        return scenario
        except Exception as e:
            print(f"⚠️ Scenario parsing error: {e}")
    
    # Fallback to local scenarios
    return scenario_bank.get_fallback_scenario(emotion, difficulty)

# ================== GAME LOOP ==================
def terminal_gameplay(initial_scenario, initial_stress, rounds=INITIAL_ROUNDS):
    generator = GeminiScenarioGenerator()
    scenario_bank = ScenarioBank()
    agent = RLAgent()
    current_scenario = initial_scenario
    current_stress = initial_stress
    
    print("\n" + "="*50)
    print("🌟 THERAPEUTIC DECISION MAKER 🌟")
    print("="*50)
    print("Welcome to your personalized stress management experience!")
    print("Make choices that will help balance your emotional state.\n")

    for round_index in range(rounds):
        print("\n" + "="*50)
        print(f"🌀 ROUND {round_index + 1}/{rounds}")
        print(f"📊 Stress Level: {current_stress*10:.1f}/10")
        print(f"🎭 Emotional Context: {current_scenario['emotion'].upper()}")
        print(f"⚡ Difficulty: {current_scenario['difficulty'].upper()}")
        print("\n📜 SCENARIO:")
        print(f"{current_scenario['scenario']}\n")
        
        print("🛑 YOUR OPTIONS:")
        for idx, resp in enumerate(current_scenario["responses"]):
            print(f"{idx + 1}. {resp['option']} (Potential impact: {resp['reward']:+})")
        
        # RL agent suggests action
        state_key = agent.get_state_key(current_scenario, current_stress)
        suggested_action = agent.choose_action(state_key, current_scenario["responses"])
        print(f"\n💡 AI Suggestion: Option {suggested_action + 1} might be most therapeutic")
        
        while True:
            try:
                choice = input("\nChoose (1-4) or 'q' to quit: ").strip().lower()
                if choice == 'q':
                    print("\n👋 Thank you for playing!")
                    return
                
                choice = int(choice) - 1
                if 0 <= choice < 4:
                    break
                print("Please enter a number between 1-4")
            except ValueError:
                print("Invalid input. Please try again.")

        user_choice = current_scenario["responses"][choice]["option"]
        reward = current_scenario["responses"][choice]["reward"]
        prev_stress = current_stress
        current_stress = adjust_stress(current_stress, reward)
        
        print("\n" + "="*30)
        print("✅ YOUR CHOICE:", user_choice)
        print(f"🏆 Therapeutic Impact: {reward:+}")
        print(f"📈 Stress Change: {prev_stress*10:.1f} → {current_stress*10:.1f}/10")
        
        # Generate next scenario with fallback
        next_scenario = generate_scenario_with_stress(
            current_scenario,
            user_choice,
            current_stress,
            generator,
            scenario_bank
        )
        
        # RL learning
        next_state_key = agent.get_state_key(next_scenario, current_stress)
        agent.update_q_table(state_key, choice, reward, next_state_key)
        
        current_scenario = next_scenario
        
        # Check for game end conditions
        if current_stress <= 0.1:
            print("\n🌈 Congratulations! You've achieved excellent stress management!")
            break
        elif current_stress >= 0.9:
            print("\n⚡ Warning! Your stress levels are very high. Consider taking a break.")
            break
    
    print("\n" + "="*50)
    print("🎮 GAME SUMMARY")
    print(f"Final Stress Level: {current_stress*10:.1f}/10")
    if current_stress < 0.3:
        print("🌟 Excellent! You've demonstrated great stress management skills!")
    elif current_stress < 0.6:
        print("👍 Good job! You're maintaining balanced stress levels.")
    else:
        print("💪 Remember: Stress management is a skill that improves with practice.")

# ================== MAIN ==================
def main():
    print("\n🧠 THERAPEUTIC STRESS MANAGER")
    print("="*50)
    print("This experience adapts to your stress levels using AI and")
    print("reinforcement learning to provide personalized scenarios.\n")
    
    initial_stress = get_initial_stress_level()
    difficulty = calculate_difficulty(initial_stress)
    
    # Initial scenario based on stress level
    initial_scenario = {
        "scenario": "You're preparing for an important meeting when your computer crashes.",
        "emotion": "stressed",
        "difficulty": difficulty,
        "responses": [
            {"option": "Panic and give up on the meeting", "reward": -2},
            {"option": "Frantically try to fix it while stressed", "reward": -1},
            {"option": "Take deep breaths and find an alternative", "reward": 2},
            {"option": "Ask a colleague for help calmly", "reward": 1}
        ],
        "best_choice_index": 2
    }
    
    terminal_gameplay(initial_scenario, initial_stress)

if __name__ == "__main__":
    main()