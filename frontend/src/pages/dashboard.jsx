"use client"

import { useState } from "react"
import { Clock, BarChart3, MessageSquare, ChevronDown } from "lucide-react"
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Cell, Pie, PieChart, Legend } from "recharts"

// Mock data
const mockSessions = [
  { id: "session1", name: "Morning Meditation" },
  { id: "session2", name: "Evening Reflection" },
  { id: "session3", name: "Stress Relief" },
]

const mockStressData = [
  { date: "Jan 1", score: 4, session: "session1" },
  { date: "Jan 2", score: 6, session: "session1" },
  { date: "Jan 3", score: 3, session: "session2" },
  { date: "Jan 4", score: 5, session: "session3" },
  { date: "Jan 5", score: 2, session: "session2" },
]

const mockGameScores = [
  { game: "Breathing", score: 85, session: "session1" },
  { game: "Focus", score: 72, session: "session1" },
  { game: "Memory", score: 68, session: "session2" },
  { game: "Breathing", score: 90, session: "session3" },
  { game: "Focus", score: 78, session: "session2" },
]

const mockEmotionData = [
  { emotion: "Happy", count: 12, session: "session1" },
  { emotion: "Calm", count: 8, session: "session1" },
  { emotion: "Anxious", count: 5, session: "session2" },
  { emotion: "Happy", count: 10, session: "session3" },
  { emotion: "Neutral", count: 7, session: "session2" },
]

// Custom tooltip for StressScoreChart
const StressTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-md border border-[#1e2642] bg-[#131836] p-2 shadow-md">
        <p className="text-sm font-medium text-white">{label}</p>
        <p className="text-sm text-[#8a7cff]">Stress Score: {payload[0].value}</p>
      </div>
    )
  }
  return null
}

// StressScoreChart component
function StressScoreChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={data}
        margin={{
          top: 10,
          right: 10,
          left: 0,
          bottom: 0,
        }}
      >
        <defs>
          <linearGradient id="stressGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8a7cff" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#8a7cff" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#1e2642" />
        <XAxis dataKey="date" stroke="#4a5568" tick={{ fill: "#a0aec0" }} tickLine={{ stroke: "#4a5568" }} />
        <YAxis domain={[0, 10]} stroke="#4a5568" tick={{ fill: "#a0aec0" }} tickLine={{ stroke: "#4a5568" }} />
        <Tooltip content={<StressTooltip />} />
        <Area type="monotone" dataKey="score" stroke="#8a7cff" fillOpacity={1} fill="url(#stressGradient)" />
      </AreaChart>
    </ResponsiveContainer>
  )
}

// Custom tooltip for GameScoreChart
const GameTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-md border border-[#1e2642] bg-[#131836] p-2 shadow-md">
        <p className="text-sm font-medium text-white">{label}</p>
        <p className="text-sm text-[#4cc9f0]">Score: {payload[0].value}</p>
      </div>
    )
  }
  return null
}

// GameScoreChart component
function GameScoreChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{
          top: 10,
          right: 10,
          left: 0,
          bottom: 0,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#1e2642" />
        <XAxis dataKey="game" stroke="#4a5568" tick={{ fill: "#a0aec0" }} tickLine={{ stroke: "#4a5568" }} />
        <YAxis stroke="#4a5568" tick={{ fill: "#a0aec0" }} tickLine={{ stroke: "#4a5568" }} />
        <Tooltip content={<GameTooltip />} />
        <Bar dataKey="score" fill="#4cc9f0" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

// EmotionFrequencyChart component
function EmotionFrequencyChart({ data }) {
  // Colors for different emotions
  const EMOTION_COLORS = {
    Happy: "#4cc9f0",
    Sad: "#8a7cff",
    Anxious: "#f72585",
    Calm: "#4ade80",
    Angry: "#ef4444",
    Neutral: "#a78bfa",
    Excited: "#fb923c",
    Tired: "#64748b",
  }

  // Custom tooltip component
  const EmotionTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const { emotion, count } = payload[0].payload
      return (
        <div className="rounded-md border border-[#1e2642] bg-[#131836] p-2 shadow-md">
          <p className="text-sm font-medium text-white">{emotion}</p>
          <p className="text-sm">Frequency: {count} times</p>
        </div>
      )
    }
    return null
  }

  // Custom legend renderer
  const renderCustomizedLegend = (props) => {
    const { payload } = props

    return (
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {payload.map((entry, index) => (
          <div key={`item-${index}`} className="flex items-center">
            <div className="mr-2 h-3 w-3 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-sm text-white">{entry.value}</span>
          </div>
        ))}
      </div>
    )
  }

  // Aggregate emotion data
  const aggregatedData = data.reduce((acc, item) => {
    const existingEmotion = acc.find((e) => e.emotion === item.emotion)
    if (existingEmotion) {
      existingEmotion.count += item.count
    } else {
      acc.push({ ...item })
    }
    return acc
  }, [])

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={aggregatedData}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={120}
          innerRadius={60}
          dataKey="count"
          nameKey="emotion"
          label={({ emotion, percent }) => `${emotion} (${(percent * 100).toFixed(0)}%)`}
        >
          {aggregatedData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={EMOTION_COLORS[entry.emotion] || "#8884d8"} />
          ))}
        </Pie>
        <Tooltip content={<EmotionTooltip />} />
        <Legend content={renderCustomizedLegend} />
      </PieChart>
    </ResponsiveContainer>
  )
}

// Main Dashboard component
export default function Dashboard() {
  const [selectedSession, setSelectedSession] = useState("all")
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  // Filter data based on selected session
  const filteredStressData =
    selectedSession === "all" ? mockStressData : mockStressData.filter((item) => item.session === selectedSession)

  const filteredGameScores =
    selectedSession === "all" ? mockGameScores : mockGameScores.filter((item) => item.session === selectedSession)

  const filteredEmotionData =
    selectedSession === "all" ? mockEmotionData : mockEmotionData.filter((item) => item.session === selectedSession)

  // Get the selected session name for display
  const getSessionName = () => {
    if (selectedSession === "all") return "All Sessions"
    const session = mockSessions.find((s) => s.id === selectedSession)
    return session ? session.name : "Select Session"
  }

  return (
    <div className="min-h-screen bg-[#0f1424] text-white">
      {/* Header */}
      <header className="border-b border-[#1e2642] bg-[#131836]">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <h1 className="text-xl font-bold text-[#8a7cff]">MindfulAI</h1>
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="flex h-10 w-full items-center rounded-md border border-[#1e2642] bg-[#131836] px-3 py-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Search..."
                  className="ml-2 w-full bg-transparent outline-none placeholder:text-gray-400"
                />
              </div>
            </div>
            <button className="rounded-full bg-gradient-to-r from-[#8a7cff] to-[#4cc9f0] px-4 py-2 text-white hover:opacity-90 transition-opacity">
              Start New Session
            </button>
          </div>
        </div>
      </header>

      <div className="container p-6 pb-24">
        {/* Stats Cards */}
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-lg bg-[#1a1f38] border border-[#1e2642] text-white overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="rounded-lg bg-[#2a2d4a] p-3">
                  <MessageSquare className="h-6 w-6 text-[#8a7cff]" />
                </div>
                <span className="text-xs text-green-400">+3 from last week</span>
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-400">Total Sessions</p>
                <h3 className="text-3xl font-bold">24</h3>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-[#1a1f38] border border-[#1e2642] text-white overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="rounded-lg bg-[#2a2d4a] p-3">
                  <BarChart3 className="h-6 w-6 text-[#4cc9f0]" />
                </div>
                <span className="text-xs text-green-400">+5% from last month</span>
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-400">Goals Progress</p>
                <h3 className="text-3xl font-bold">62%</h3>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-[#1a1f38] border border-[#1e2642] text-white overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="rounded-lg bg-[#2a2d4a] p-3">
                  <Clock className="h-6 w-6 text-[#8a7cff]" />
                </div>
                <span className="text-xs text-green-400">+2.5 from last month</span>
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-400">Therapy Hours</p>
                <h3 className="text-3xl font-bold">18.5</h3>
              </div>
            </div>
          </div>
        </div>

        {/* Session Selector - Custom Dropdown */}
        <div className="mt-8 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Analytics Dashboard</h2>
          <div className="relative w-64">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex w-full items-center justify-between rounded-md border border-[#1e2642] bg-[#1a1f38] px-4 py-2 text-white"
            >
              <span>{getSessionName()}</span>
              <ChevronDown className="h-4 w-4" />
            </button>
            {isDropdownOpen && (
              <div className="absolute z-10 mt-1 w-full rounded-md border border-[#1e2642] bg-[#1a1f38] py-1 shadow-lg">
                <div
                  className="cursor-pointer px-4 py-2 hover:bg-[#2a2d4a]"
                  onClick={() => {
                    setSelectedSession("all")
                    setIsDropdownOpen(false)
                  }}
                >
                  All Sessions
                </div>
                {mockSessions.map((session) => (
                  <div
                    key={session.id}
                    className="cursor-pointer px-4 py-2 hover:bg-[#2a2d4a]"
                    onClick={() => {
                      setSelectedSession(session.id)
                      setIsDropdownOpen(false)
                    }}
                  >
                    {session.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Charts Grid */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Stress Score Chart */}
          <div className="rounded-lg border border-[#1e2642] bg-[#1a1f38] text-white overflow-hidden">
            <div className="p-4 border-b border-[#1e2642]">
              <h3 className="text-lg font-semibold">Stress Score Tracker</h3>
              <p className="text-sm text-gray-400">Stress levels on a scale of 0-10</p>
            </div>
            <div className="p-4">
              <div className="h-80">
                <StressScoreChart data={filteredStressData} />
              </div>
            </div>
          </div>

          {/* Game Score Chart */}
          <div className="rounded-lg border border-[#1e2642] bg-[#1a1f38] text-white overflow-hidden">
            <div className="p-4 border-b border-[#1e2642]">
              <h3 className="text-lg font-semibold">Game Performance</h3>
              <p className="text-sm text-gray-400">Final scores from mindfulness games</p>
            </div>
            <div className="p-4">
              <div className="h-80">
                <GameScoreChart data={filteredGameScores} />
              </div>
            </div>
          </div>

          {/* Emotion Frequency Chart */}
          <div className="col-span-1 lg:col-span-2 rounded-lg border border-[#1e2642] bg-[#1a1f38] text-white overflow-hidden">
            <div className="p-4 border-b border-[#1e2642]">
              <h3 className="text-lg font-semibold">Emotion Frequency</h3>
              <p className="text-sm text-gray-400">How often each emotion has been recorded</p>
            </div>
            <div className="p-4">
              <div className="h-80">
                <EmotionFrequencyChart data={filteredEmotionData} />
              </div>
            </div>
          </div>
        </div>

        {/* Mood Tracker Section */}
        <div className="mt-8">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Weekly Mood Tracker</h2>
            <a href="#" className="text-[#8a7cff] hover:underline">
              View Details
            </a>
          </div>
          <div className="mt-4 h-64 rounded-lg bg-[#1a1f38] border border-[#1e2642] text-white">
            <div className="flex h-full items-center justify-center">
              <p className="text-gray-400">Mood tracking visualization would go here</p>
            </div>
          </div>
        </div>
      </div>

      {/* User Profile Footer */}
      <div className="fixed bottom-0 left-0 w-full border-t border-[#1e2642] bg-[#131836] p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#8a7cff]">
            <span className="text-sm font-medium">SJ</span>
          </div>
          <div>
            <p className="font-medium">Premium Plan</p>
          </div>
        </div>
      </div>
    </div>
  )
}
