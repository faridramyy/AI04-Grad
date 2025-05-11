// GameModal.jsx
import { useEffect, useState } from "react";
import { CheckCircle, Info, X } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const oldQuestionsSet = [
  {
    question: "In the last month, how often have you been upset because of something that happened unexpectedly?",
    options: ["Never", "Almost Never", "Sometimes", "Fairly Often", "Very Often"],
  },
  {
    question: "In the last month, how often have you felt that you were unable to control the important things in your life?",
    options: ["Never", "Almost Never", "Sometimes", "Fairly Often", "Very Often"],
  },
  {
    question: "In the last month, how often have you felt nervous and stressed?",
    options: ["Never", "Almost Never", "Sometimes", "Fairly Often", "Very Often"],
  },
  {
    question: "In the last month, how often have you felt confident about your ability to handle personal problems?",
    options: ["Very Often", "Fairly Often", "Sometimes", "Almost Never", "Never"], // reverse
  },
  {
    question: "In the last month, how often have you felt that things were going your way?",
    options: ["Very Often", "Fairly Often", "Sometimes", "Almost Never", "Never"], // reverse
  },
  {
    question: "In the last month, how often have you found that you could not cope with all the things you had to do?",
    options: ["Never", "Almost Never", "Sometimes", "Fairly Often", "Very Often"],
  },
  {
    question: "In the last month, how often have you been able to control irritations in your life?",
    options: ["Very Often", "Fairly Often", "Sometimes", "Almost Never", "Never"], // reverse
  },
  {
    question: "In the last month, how often have you felt that you were on top of things?",
    options: ["Very Often", "Fairly Often", "Sometimes", "Almost Never", "Never"], // reverse
  },
  {
    question: "In the last month, how often have you been angered because of things that were outside of your control?",
    options: ["Never", "Almost Never", "Sometimes", "Fairly Often", "Very Often"],
  },
  {
    question: "In the last month, how often have you felt difficulties were piling up so high that you could not overcome them?",
    options: ["Never", "Almost Never", "Sometimes", "Fairly Often", "Very Often"],
  },
];

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
  const [error, setError] = useState(null);

  const [showOldQuestions, setShowOldQuestions] = useState(false);
  const [oldAnswers, setOldAnswers] = useState(Array(10).fill(null));
  const [oldCurrentIndex, setOldCurrentIndex] = useState(0);

  useEffect(() => {
    const validScore = parseFloat(getCookie("initial_stress_score") || "0");
    if (validScore === 0) {
      setShowOldQuestions(true);
    } else {
      setInitialStressScore(validScore);
      setStressScore(validScore);
      fetchScenario();
    }
  }, []);

  const getCookie = (name) => {
    const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
    if (match) return decodeURIComponent(match[2]);
    return null;
  };

  const handleOldSelect = (index) => {
    const updated = [...oldAnswers];
    updated[oldCurrentIndex] = index;
    setOldAnswers(updated);
  };

  const handleOldNext = () => {
    if (oldAnswers[oldCurrentIndex] === null) return;
    if (oldCurrentIndex + 1 < oldQuestionsSet.length) {
      setOldCurrentIndex(oldCurrentIndex + 1);
    } else {
      finishOldQuestions();
    }
  };

  const finishOldQuestions = async () => {
    setShowOldQuestions(false);
    try {
      const res = await fetch(`${BACKEND_URL}/api/game-sessions/stress-score`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ answers: oldAnswers }), // raw values: 0-4
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to save initial stress score");
      }

      const data = await res.json();
      setInitialStressScore(data.stressScore / 10); // normalize to 0-1
      setStressScore(data.stressScore / 10);
      toast.success("✅ Stress score saved!");
      fetchScenario();
    } catch (err) {
      console.error("❌ Failed to save stress score:", err.message);
      toast.error("❌ Failed to save stress score: " + err.message);
    }
  };

  const fetchScenario = async (
    prevScenario = null,
    chosenOption = null,
    score = stressScore
  ) => {
    setIsLoading(true);
    setError(null);
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

  const handleFinish = async () => {
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
      stress_score_before: initialStressScore,
    };

    try {
      const res = await fetch(`${BACKEND_URL}/api/game-sessions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(report),
        credentials: "include",
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to save session");
      }

      const result = await res.json();
      toast.success("✅ Session successfully saved!");
      setSummary({ final_score: result.final_score });
      setFinished(true);
    } catch (err) {
      console.error("❌ Save session error:", err.message);
      toast.error("❌ Failed to save session: " + err.message);
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 overflow-auto">
        <div className="relative w-full max-w-3xl bg-[#131A2B]/90 rounded-xl border border-gray-800 shadow-lg p-6">
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
            <X size={20} />
          </button>

          {showOldQuestions ? (
            <div className="text-white">
              <h2 className="text-xl font-bold mb-4">Initial Stress Assessment</h2>
              <p className="mb-2">{oldQuestionsSet[oldCurrentIndex].question}</p>
              <div className="space-y-2">
                {oldQuestionsSet[oldCurrentIndex].options.map((opt, index) => (
                  <button
                    key={index}
                    onClick={() => handleOldSelect(index)}
                    className={`block w-full text-left px-4 py-2 rounded-md border ${
                      oldAnswers[oldCurrentIndex] === index
                        ? "bg-violet-600/20 border-violet-500 text-white"
                        : "bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
              <button
                onClick={handleOldNext}
                className="mt-4 px-6 py-2 rounded-md bg-gradient-to-r from-violet-600 to-cyan-500 text-white disabled:opacity-50"
                disabled={oldAnswers[oldCurrentIndex] === null}
              >
                {oldCurrentIndex === oldQuestionsSet.length - 1 ? "Submit" : "Next"}
              </button>
            </div>
          ) : !finished ? (
            currentScenario ? (
              <div className="text-white">
                <h1 className="text-xl font-bold mb-4">Stress Scenario Game</h1>
                <p className="mb-3">{currentScenario.scenario}</p>
                {currentScenario.responses.map((response, index) => (
                  <button
                    key={index}
                    disabled={isLoading}
                    onClick={() => handleSelectOption(index)}
                    className={`block w-full text-left p-4 rounded-lg border mb-2 ${
                      selectedOptionIndex === index
                        ? "border-violet-500 bg-violet-500/10 text-white"
                        : "border-gray-700 hover:border-violet-500/50 hover:bg-gray-800/50 text-gray-300"
                    }`}
                  >
                    {response.option}
                  </button>
                ))}
                <div className="flex justify-between mt-4">
                  <button onClick={handleFinish} className="px-4 py-2 bg-gray-700 text-white rounded-md">
                    Finish
                  </button>
                  <button
                    onClick={handleNext}
                    disabled={selectedOptionIndex === null || isLoading}
                    className={`px-4 py-2 rounded-md ${
                      selectedOptionIndex === null || isLoading
                        ? "bg-gray-500 text-white/60"
                        : "bg-gradient-to-r from-violet-600 to-cyan-500 text-white"
                    }`}
                  >
                    {isLoading ? "Loading..." : "Next"}
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-white text-center">Loading scenario...</p>
            )
          ) : (
            <div className="text-white text-center">
              <CheckCircle size={32} className="text-cyan-400 mx-auto mb-3" />
              <h2 className="text-2xl font-bold mb-2">Session Complete</h2>
              <p className="mb-4">Your final score:</p>
              {summary?.final_score != null ? (
                <p className="text-4xl font-bold text-cyan-400">{summary.final_score} / 10</p>
              ) : (
                <p className="text-gray-400">Score not available.</p>
              )}
              <button
                onClick={onClose}
                className="mt-6 w-full py-3 rounded-md bg-gradient-to-r from-violet-600 to-cyan-500 hover:opacity-90 text-white"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
