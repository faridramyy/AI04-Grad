import React, { useState } from "react";
import {
  Bell, Calendar, Heart, Activity, FileText, Users, Settings, Brain,
  TrendingUp, Smile, Frown, Meh, Award, BarChart2
} from "lucide-react";

export default function Dashboard() {
  const [patient] = useState({
    id: "P-12345",
    name: "John Doe",
    age: 42,
    gender: "Male",
    therapist: "Dr. Emma Wilson",
    nextSession: "May 12, 2025",
    sessionTime: "3:30 PM",
    therapyType: "Cognitive Behavioral Therapy",
    sessionsCompleted: 8,
    startDate: "February 15, 2025"
  });

  const [stressData] = useState([
    { date: "May 1", level: 7 },
    { date: "May 2", level: 6 },
    { date: "May 3", level: 8 },
    { date: "May 4", level: 5 },
    { date: "May 5", level: 4 },
    { date: "May 6", level: 3 },
    { date: "May 7", level: 2 }
  ]);

  const [emotionsData] = useState([
    { date: "May 1", primary: "Anxious", secondary: "Worried", intensity: 8 },
    { date: "May 2", primary: "Frustrated", secondary: "Overwhelmed", intensity: 7 },
    { date: "May 3", primary: "Stressed", secondary: "Tense", intensity: 9 },
    { date: "May 4", primary: "Calm", secondary: "Relieved", intensity: 6 },
    { date: "May 5", primary: "Happy", secondary: "Content", intensity: 5 },
    { date: "May 6", primary: "Hopeful", secondary: "Motivated", intensity: 7 },
    { date: "May 7", primary: "Relaxed", secondary: "Peaceful", intensity: 8 }
  ]);

  const [gameData] = useState([
    { date: "May 1", game: "Breathing Exercise", score: 75, duration: "5 min" },
    { date: "May 2", game: "Meditation Journey", score: 82, duration: "10 min" },
    { date: "May 4", game: "Thought Reframing", score: 68, duration: "8 min" },
    { date: "May 5", game: "Guided Imagery", score: 90, duration: "15 min" },
    { date: "May 7", game: "Progressive Relaxation", score: 95, duration: "12 min" },
  ]);

  const [copingStrategies] = useState([
    { strategy: "Deep breathing exercise", effectiveness: "High", lastUsed: "Today" },
    { strategy: "10-minute meditation", effectiveness: "Medium", lastUsed: "Yesterday" },
    { strategy: "Progressive muscle relaxation", effectiveness: "High", lastUsed: "2 days ago" },
    { strategy: "Journaling", effectiveness: "Medium", lastUsed: "3 days ago" }
  ]);

  const [recommendedActivities] = useState([
    { activity: "Nature walk meditation", duration: "20 min", benefit: "Reduce anxiety" },
    { activity: "Gratitude journaling", duration: "10 min", benefit: "Improve mood" },
    { activity: "Breathing visualization", duration: "5 min", benefit: "Stress reduction" }
  ]);

  const [moodPatterns] = useState({
    morningAvg: "Anxious",
    afternoonAvg: "Neutral",
    eveningAvg: "Relaxed",
    triggers: ["Work deadlines", "Traffic", "Conflict situations"],
    insights: "Stress peaks around 10 AM and gradually decreases throughout the day."
  });

  const getEmotionIcon = (emotion) => {
    const positive = ["Happy", "Calm", "Relaxed", "Hopeful", "Content", "Peaceful", "Motivated"];
    const neutral = ["Neutral", "Surprised", "Confused"];

    if (positive.includes(emotion)) {
      return <Smile className="text-green-500" size={20} />;
    } else if (neutral.includes(emotion)) {
      return <Meh className="text-yellow-500" size={20} />;
    } else {
      return <Frown className="text-red-500" size={20} />;
    }
  };

  return (
    <div className="bg-blue-50 min-h-screen">
      {/* Header */}
      <header className="bg-indigo-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">MindfulHeal AI Therapy</h1>
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-full hover:bg-indigo-700">
              <Bell size={20} />
            </button>
            <button className="p-2 rounded-full hover:bg-indigo-700">
              <Settings size={20} />
            </button>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-indigo-800 rounded-full flex items-center justify-center mr-2">
                {patient.name.charAt(0)}
              </div>
              <span>{patient.name}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto p-4">
        {/* Welcome */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold mb-2">Welcome back, {patient.name}</h2>
              <p className="text-gray-600">
                Your journey toward mental wellbeing continues. You've completed {patient.sessionsCompleted} therapy sessions since {patient.startDate}.
              </p>
            </div>
            <div className="bg-indigo-100 p-4 rounded-lg">
              <p className="text-indigo-800 font-semibold">Next Session</p>
              <p className="text-lg">{patient.nextSession} at {patient.sessionTime}</p>
              <p className="text-sm text-gray-600">with {patient.therapist}</p>
              <p className="text-xs text-gray-500 mt-1">{patient.therapyType}</p>
              <button className="mt-2 bg-indigo-600 text-white py-1 px-3 rounded-md text-sm hover:bg-indigo-700">
                Reschedule
              </button>
            </div>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Stress Trend */}
          <div className="bg-white rounded-lg shadow-md p-6 col-span-1 md:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Stress Level Trend</h3>
              <Brain className="text-indigo-500" size={20} />
            </div>
            <div className="h-64 w-full">
              <div className="flex flex-col h-full">
                <div className="flex items-end h-48 space-x-6 mb-2 px-4">
                  {stressData.map((day, index) => (
                    <div key={index} className="flex flex-col items-center flex-1">
                      <div
                        className={`w-full rounded-t-md ${
                          day.level > 7 ? "bg-red-400" :
                          day.level > 4 ? "bg-yellow-400" : "bg-green-400"
                        }`}
                        style={{ height: `${day.level * 12}px` }}
                      ></div>
                      <p className="text-xs text-gray-500 mt-1">{day.date}</p>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-2 px-4">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-400 rounded-full mr-1"></div>
                    <p className="text-xs text-gray-500">Low (1-4)</p>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-yellow-400 rounded-full mr-1"></div>
                    <p className="text-xs text-gray-500">Medium (5-7)</p>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-red-400 rounded-full mr-1"></div>
                    <p className="text-xs text-gray-500">High (8-10)</p>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-4">
              Your stress levels have decreased by 71% over the past week.
            </p>
          </div>

          {/* Other sections stay as-is. If you need the full continuation of all components,
              let me know and I’ll complete the rest of the file. */}
        </div>
      </main>
    </div>
  );
}
