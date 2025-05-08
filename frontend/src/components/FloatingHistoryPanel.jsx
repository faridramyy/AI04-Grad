import { useState } from "react";

// Sample history data - replace with your actual data
const historyData = [
  {
    id: 1,
    date: "2025-05-01",
    title: "First Therapy Session",
    summary: "Initial assessment and goal setting",
  },
  {
    id: 2,
    date: "2025-05-02",
    title: "Anxiety Management",
    summary: "Discussed techniques for managing anxiety",
  },
  {
    id: 3,
    date: "2025-05-03",
    title: "Mindfulness Practice",
    summary: "Guided meditation and mindfulness exercises",
  },
  {
    id: 4,
    date: "2025-05-04",
    title: "Stress Reduction",
    summary: "Strategies for reducing workplace stress",
  },
  {
    id: 5,
    date: "2025-05-05",
    title: "Sleep Improvement",
    summary: "Techniques for better sleep quality",
  },
  {
    id: 6,
    date: "2025-05-06",
    title: "Relationship Counseling",
    summary: "Communication strategies for relationships",
  },
  {
    id: 7,
    date: "2025-05-07",
    title: "Self-Care Planning",
    summary: "Developing a personalized self-care routine",
  },
];

export default function FloatingHistoryPanel() {
  const [isOpen, setIsOpen] = useState(false);

  const togglePanel = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative">
      {/* History Panel */}
      <div
        className={`fixed top-0 left-0 h-full bg-gray-900/80 backdrop-blur-lg shadow-lg transition-transform duration-300 ease-in-out transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } z-50 flex flex-col w-64 border-r border-white/10`}
      >
        <div className="p-4 border-b border-gray-700 bg-gray-800/50 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-white">Chat History</h2>
          <button
            onClick={togglePanel}
            className="p-1 rounded-full hover:bg-gray-700/50 text-gray-300"
            aria-label="Close panel"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-2">
          {historyData.map((item) => (
            <div
              key={item.id}
              className="mb-3 p-3 bg-gray-800/50 rounded-md hover:bg-gray-700/50 cursor-pointer border border-white/5"
            >
              <div className="text-sm text-gray-400">{item.date}</div>
              <div className="font-medium text-white">{item.title}</div>
              <div className="text-sm mt-1 text-gray-300">{item.summary}</div>
            </div>
          ))}
        </div>
      </div>

      {!isOpen && (
        <button
          onClick={togglePanel}
          className="bg-gradient-to-r from-violet-600 to-cyan-500 hover:opacity-90 transition-opacity text-white p-4 rounded-full shadow-lg fixed top-4 left-4 z-50"
          aria-label="Open history panel"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            className="w-6 h-6"
            fill="currentColor"
          >
            <path d="M256 448c141.4 0 256-93.1 256-208S397.4 32 256 32S0 125.1 0 240c0 45.1 17.7 86.8 47.7 120.9c-1.9 24.5-11.4 46.3-21.4 62.9c-5.5 9.2-11.1 16.6-15.2 21.6c-2.1 2.5-3.7 4.4-4.9 5.7c-.6 .6-1 1.1-1.3 1.4l-.3 .3c0 0 0 0 0 0c0 0 0 0 0 0s0 0 0 0s0 0 0 0c-4.6 4.6-5.9 11.4-3.4 17.4c2.5 6 8.3 9.9 14.8 9.9c28.7 0 57.6-8.9 81.6-19.3c22.9-10 42.4-21.9 54.3-30.6c31.8 11.5 67 17.9 104.1 17.9zM128 208a32 32 0 1 1 0 64 32 32 0 1 1 0-64zm128 0a32 32 0 1 1 0 64 32 32 0 1 1 0-64zm96 32a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z" />
          </svg>
        </button>
      )}
    </div>
  );
}
