import { useState } from "react";

// Sample history data - replace with your actual data
const historyData = [
  {
    id: 1,
    date: "2025-05-01",
    title: "Project X Kickoff",
    summary: "Initial planning meeting for Project X",
  },
  {
    id: 2,
    date: "2025-05-02",
    title: "Design Review",
    summary: "Reviewed UI mockups with the team",
  },
  {
    id: 3,
    date: "2025-05-03",
    title: "Client Meeting",
    summary: "Presented project timeline to client",
  },
  {
    id: 4,
    date: "2025-05-04",
    title: "Sprint Planning",
    summary: "Set up tasks for upcoming sprint",
  },
  {
    id: 5,
    date: "2025-05-05",
    title: "Code Review",
    summary: "Completed code review for authentication feature",
  },
  {
    id: 6,
    date: "2025-05-06",
    title: "Team Standup",
    summary: "Daily progress update with development team",
  },
  {
    id: 7,
    date: "2025-05-07",
    title: "Bug Fixes",
    summary: "Addressed critical issues reported by QA",
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
        className={`fixed top-0 left-0 h-full bg-white shadow-lg transition-transform duration-300 ease-in-out transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } z-50 flex flex-col w-64 border-r border-gray-200`}
      >
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
          <h2 className="text-lg font-semibold">History</h2>
          <button
            onClick={togglePanel}
            className="p-1 rounded-full hover:bg-gray-200"
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
              className="mb-3 p-3 bg-gray-50 rounded-md hover:bg-gray-100 cursor-pointer"
            >
              <div className="text-sm text-gray-500">{item.date}</div>
              <div className="font-medium">{item.title}</div>
              <div className="text-sm mt-1 text-gray-600">{item.summary}</div>
            </div>
          ))}
        </div>
      </div>

      {!isOpen && (
        <button
          onClick={togglePanel}
          className="fixed top-4 left-0 bg-pink-500 hover:bg-pink-600 text-white p-2 rounded-r-md shadow-md z-50 flex items-center"
          aria-label="Open history panel"
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
            <path d="M9 18l6-6-6-6" />
          </svg>
          <span className="ml-1">History</span>
        </button>
      )}
    </div>
  );
}
