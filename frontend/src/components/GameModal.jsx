import { useEffect, useState } from "react";
import { CheckCircle, AlertCircle, Info } from "lucide-react";

export function GameModal({ onClose }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState(Array(10).fill(null));
  const [showResults, setShowResults] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const questions = [
    "In the last month, how often have you been upset because of something that happened unexpectedly?",
    "In the last month, how often have you felt that you were unable to control the important things in your life?",
    "In the last month, how often have you felt nervous and stressed?",
    "In the last month, how often have you felt confident about your ability to handle your personal problems?",
    "In the last month, how often have you felt that things were going your way?",
    "In the last month, how often have you found that you could not cope with all the things that you had to do?",
    "In the last month, how often have you been able to control irritations in your life?",
    "In the last month, how often have you felt that you were on top of things?",
    "In the last month, how often have you been angered because of things that happened that were outside of your control?",
    "In the last month, how often have you felt difficulties were piling up so high that you could not overcome them?"
  ];

  const options = [
    "0 - Never",
    "1 - Almost never",
    "2 - Sometimes",
    "3 - Fairly often",
    "4 - Very often"
  ];

  const reverseScoreItems = [3, 4, 6, 7];

  const handleAnswerSelect = (answerIndex) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedAnswers(Array(10).fill(null));
    setShowResults(false);
  };

  const calculateScore = () => {
    return selectedAnswers.reduce((score, selected, index) => {
      if (selected === null) return score;
      return score + (reverseScoreItems.includes(index) ? 4 - selected : selected);
    }, 0);
  };

  const getStressLevel = (score) => {
    if (score <= 13) return "Low stress";
    if (score <= 26) return "Moderate stress";
    return "High stress";
  };

  const getStressColor = (score) => {
    if (score <= 13) return "text-green-600";
    if (score <= 26) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-auto">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-3xl relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
        >
          ✕
        </button>

        {!showResults ? (
          <>
            <div className="bg-indigo-600 px-6 py-4 text-white rounded-md">
              <div className="flex justify-between items-center">
                <h1 className="text-xl font-bold">Perceived Stress Scale</h1>
                <div className="flex items-center">
                  <button
                    onClick={() => setShowInfo(!showInfo)}
                    className="mr-3 bg-indigo-500 hover:bg-indigo-400 p-2 rounded-full"
                  >
                    <Info size={18} />
                  </button>
                  <span className="bg-white text-indigo-600 font-semibold px-3 py-1 rounded-full text-sm">
                    {currentQuestion + 1}/{questions.length}
                  </span>
                </div>
              </div>
              <div className="w-full bg-indigo-400 rounded-full h-2 mt-4">
                <div
                  className="bg-white h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                />
              </div>
            </div>

            {showInfo && (
              <div className="p-4 bg-indigo-50 border-b border-indigo-100">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-medium text-indigo-800">About this questionnaire</h3>
                  <button onClick={() => setShowInfo(false)} className="text-indigo-500 hover:text-indigo-700">
                    ✕
                  </button>
                </div>
                <p className="mt-2 text-sm text-indigo-700">
                  The PSS measures your perceived stress over the past month. Higher scores suggest greater stress.
                </p>
              </div>
            )}

            <div className="p-6">
              <h2 className="text-xl font-medium text-gray-800 mb-4">
                {currentQuestion + 1}. {questions[currentQuestion]}
              </h2>
              <div className="space-y-3 mb-8">
                {options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                      selectedAnswers[currentQuestion] === index
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                        : 'border-gray-200 hover:border-indigo-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center">
                      <div className={`w-6 h-6 flex items-center justify-center rounded-full mr-3 ${
                        selectedAnswers[currentQuestion] === index
                          ? 'bg-indigo-500 text-white'
                          : 'bg-gray-200 text-gray-700'
                      }`}>
                        {index}
                      </div>
                      <span>{option}</span>
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex justify-between">
                <button
                  onClick={handlePrevious}
                  disabled={currentQuestion === 0}
                  className={`px-5 py-2.5 rounded-md ${
                    currentQuestion === 0 
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Previous
                </button>
                <button
                  onClick={handleNext}
                  disabled={selectedAnswers[currentQuestion] === null}
                  className={`px-5 py-2.5 rounded-md ${
                    selectedAnswers[currentQuestion] === null
                      ? 'bg-indigo-300 text-white cursor-not-allowed'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  }`}
                >
                  {currentQuestion === questions.length - 1 ? 'Submit' : 'Next'}
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="p-6">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 mb-4">
                <CheckCircle size={32} className="text-indigo-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Assessment Complete</h2>
              <div className="bg-indigo-50 rounded-lg p-6 mt-4 text-center">
                <p className="text-gray-700 mb-3">Your Perceived Stress Score:</p>
                <p className={`text-3xl font-bold ${getStressColor(calculateScore())}`}>
                  {calculateScore()} / 40
                </p>
                <p className={`mt-2 font-medium ${getStressColor(calculateScore())}`}>
                  {getStressLevel(calculateScore())}
                </p>
                <div className="mt-4 pt-4 border-t border-indigo-100 text-left">
                  <div className="flex items-start">
                    <AlertCircle size={18} className="text-indigo-500 mt-0.5 mr-2" />
                    <p className="text-sm text-gray-600">
                      Items 4, 5, 7, and 8 are scored in reverse. This score reflects how stressful your month has been perceived.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="font-medium text-gray-700 mb-4">Your Responses:</h3>
              <div className="space-y-3">
                {questions.map((question, index) => (
                  <div key={index} className="bg-white p-3 rounded-md border border-gray-200">
                    <p className="text-sm font-medium text-gray-800">{index + 1}. {question}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      Your answer: <span className="font-medium text-indigo-600">
                        {selectedAnswers[index] !== null ? options[selectedAnswers[index]] : 'Not answered'}
                      </span>
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={handleRestart}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-md"
              >
                Take Again
              </button>
              <button
                onClick={() => window.print()}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 px-4 rounded-md"
              >
                Print Results
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
