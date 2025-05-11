import { useEffect, useState } from "react";
import { CheckCircle, Info, X } from "lucide-react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export function GameModal({ onClose }) {
  const [currentScenario, setCurrentScenario] = useState(null);
  const [stressScore, setStressScore] = useState(0.5);
  const [initialStressScore, setInitialStressScore] = useState(0.5);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [finished, setFinished] = useState(false);
  const [history, setHistory] = useState([]);
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState(null); // New: error state

  useEffect(() => {
    setInitialStressScore(stressScore);
    fetchScenario();
  }, []);

  const fetchScenario = async (
    prevScenario = null,
    chosenOption = null,
    score = stressScore
  ) => {
    setIsLoading(true);
    setError(null); // Clear previous error
    try {
      const res = await fetch(`${BACKEND_URL}/api/game-sessions/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prev_scenario: prevScenario || {
            scenario: "You missed a deadline.",
            emotion: "stressed",
            difficulty: "medium",
            responses: [
              { option: "Panic", reward: -2 },
              { option: "Explain and apologize", reward: 2 },
              { option: "Ignore it", reward: -1 },
              { option: "Ask for an extension", reward: 1 },
            ],
            best_choice_index: 1,
          },
          chosen_option: chosenOption || "Explain and apologize",
          stress_score: score,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to fetch scenario");
      }

      const data = await res.json();
      setSelectedOptionIndex(null);
      setCurrentScenario(data);
    } catch (err) {
      console.error("❌ Error loading scenario:", err.message);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectOption = (index) => {
    if (!isLoading) setSelectedOptionIndex(index);
  };

  const handleNext = () => {
    if (selectedOptionIndex === null || isLoading) return;
    const selected = currentScenario.responses[selectedOptionIndex];
    const reward = selected.reward;
    const updatedStress = Math.max(0, Math.min(1, stressScore - reward * 0.07));

    setHistory((prev) => [
      ...prev,
      {
        scenario: currentScenario.scenario,
        choices: currentScenario.responses.map((r) => r.option),
        answer_index: currentScenario.best_choice_index ?? 0,
        selectedOption: selected.option,
        stressAfter: updatedStress,
        difficulty: currentScenario.difficulty || "medium",
      },
    ]);

    setStressScore(updatedStress);
    fetchScenario(currentScenario, selected.option, updatedStress);
  };

  const handleFinish = () => {
    const scenarios = history.map((entry) => ({
      question: entry.scenario,
      choices: entry.choices,
      answer_index: entry.answer_index,
      difficulty: entry.difficulty,
    }));

    const user_answers = history.map((entry) =>
      entry.choices.findIndex((c) => c === entry.selectedOption)
    );

    const report = {
      scenarios,
      user_answers,
      stress_score_before: (initialStressScore * 40).toFixed(1),
    };

    setSummary(report);
    setFinished(true);
    console.log("✅ Final Report:", report);
  };

  const getStressLevel = () => {
    const score = stressScore * 40;
    if (score <= 13) return "Low stress";
    if (score <= 26) return "Moderate stress";
    return "High stress";
  };

  const getStressColor = () => {
    const score = stressScore * 40;
    if (score <= 13) return "text-green-400";
    if (score <= 26) return "text-yellow-400";
    return "text-red-400";
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 overflow-auto">
      <div className="relative">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600/30 to-cyan-500/30 rounded-xl blur-sm opacity-70"></div>
        <div className="relative bg-[#131A2B]/90 backdrop-blur-xl rounded-xl shadow-lg p-6 w-full max-w-3xl border border-gray-800">
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors">
            <X size={20} />
          </button>

          {error && (
            <div className="mb-4 p-3 rounded-md bg-red-500/10 border border-red-500 text-red-300 text-sm">
              ⚠️ {error}
            </div>
          )}

          {!finished ? (
            currentScenario ? (
              <>
                <div className="bg-gradient-to-r from-violet-600/20 to-cyan-500/20 border border-white/10 px-6 py-4 text-white rounded-md">
                  <div className="flex justify-between items-center">
                    <h1 className="text-xl font-bold">Stress Scenario Game</h1>
                    <button onClick={() => setShowInfo(!showInfo)} className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors">
                      <Info size={18} />
                    </button>
                  </div>
                </div>

                {showInfo && (
                  <div className="p-4 bg-[#1E293B]/50 border border-gray-700 mt-4 rounded-md text-sm text-gray-300">
                    This AI-driven game adapts based on your stress level. Choose wisely — your decisions impact the next scenario.
                  </div>
                )}

                <div className="p-6">
                  <h2 className="text-xl font-medium text-white mb-4">{currentScenario.scenario}</h2>

                  <div className="space-y-3 mb-8">
                    {currentScenario.responses.map((response, index) => (
                      <button
                        key={index}
                        disabled={isLoading}
                        onClick={() => handleSelectOption(index)}
                        className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                          selectedOptionIndex === index
                            ? "border-violet-500 bg-violet-500/10 text-white"
                            : "border-gray-700 hover:border-violet-500/50 hover:bg-gray-800/50 text-gray-300"
                        } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                      >
                        <div className="flex items-center">
                          <div className={`w-6 h-6 flex items-center justify-center rounded-full mr-3 ${
                            selectedOptionIndex === index
                              ? "bg-gradient-to-r from-violet-600 to-cyan-500 text-white"
                              : "bg-gray-700 text-gray-300"
                          }`}>{index + 1}</div>
                          <span>{response.option}</span>
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="flex justify-between space-x-4">
                    <button onClick={handleFinish} className="px-5 py-2.5 rounded-md bg-gray-800 text-white hover:bg-gray-700">Finish</button>
                    <button
                      onClick={handleNext}
                      disabled={selectedOptionIndex === null || isLoading}
                      className={`px-5 py-2.5 rounded-md ${
                        selectedOptionIndex === null || isLoading
                          ? "bg-violet-500/50 text-white/70 cursor-not-allowed"
                          : "bg-gradient-to-r from-violet-600 to-cyan-500 text-white hover:opacity-90"
                      }`}
                    >
                      {isLoading ? "Loading..." : "Next"}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-white text-center p-10">Loading scenario...</div>
            )
          ) : (
            <div className="p-6 text-white">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-violet-600/20 to-cyan-500/20 mb-4">
                  <CheckCircle size={32} className="text-cyan-400" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Session Complete</h2>
                <p className="text-gray-300">Your final stress level:</p>
                <p className={`text-3xl font-bold ${getStressColor()}`}>{(stressScore * 40).toFixed(1)} / 40</p>
                <p className={`mt-2 font-medium ${getStressColor()}`}>{getStressLevel()}</p>
              </div>

              <div className="bg-[#1E293B]/40 border border-gray-700 rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-4">Your Journey:</h3>
                {history.map((entry, index) => (
                  <div key={index} className="mb-3">
                    <p className="font-medium">{index + 1}. {entry.scenario}</p>
                    <p className="text-sm text-cyan-400 mt-1">You chose: {entry.selectedOption}</p>
                    <p className="text-sm text-gray-400">Stress after: {(entry.stressAfter * 40).toFixed(1)} / 40</p>
                  </div>
                ))}
              </div>

              {summary && (
                <pre className="mt-6 text-sm bg-[#1E293B]/60 p-4 rounded-lg text-gray-300 overflow-x-auto">
                  {JSON.stringify(summary, null, 2)}
                </pre>
              )}

              <button onClick={onClose} className="mt-6 w-full py-3 rounded-md bg-gradient-to-r from-violet-600 to-cyan-500 hover:opacity-90 text-white">
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
