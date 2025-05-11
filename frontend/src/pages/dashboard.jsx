"use client"

import { useEffect, useState } from "react"
import { Clock, BarChart3, MessageSquare, ChevronDown, Loader2 } from "lucide-react"
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Cell, Pie, PieChart, Legend } from "recharts"

// Sample data from the user
const sampleData = {
  rows: [
    {
      sessionName: "Session 1",
      endDate: "2024-04-01T11:00:00.000Z",
      value: 5,
    },
    {
      sessionName: "Session 1",
      endDate: "2024-04-01T11:00:00.000Z",
      value: 6.2,
    },
    {
      sessionName: "Session 1",
      endDate: "2024-04-01T11:00:00.000Z",
      value: 6.1000000000000005,
    },
    {
      sessionName: "Session 1",
      endDate: "2024-04-01T11:00:00.000Z",
      value: 5,
    },
    {
      sessionName: "Session 1",
      endDate: "2024-04-01T11:00:00.000Z",
      value: 4.9,
    },
    {
      sessionName: "Session 2",
      endDate: "2025-05-11T12:35:01.827Z",
      value: 7,
    },
    {
      sessionName: "Session 2",
      endDate: "2025-05-11T12:35:01.827Z",
      value: 6.2,
    },
    {
      sessionName: "Session 2",
      endDate: "2025-05-11T12:35:01.827Z",
      value: 6.1,
    },
    {
      sessionName: "Session 2",
      endDate: "2025-05-11T12:35:01.827Z",
      value: 6.2,
    },
    {
      sessionName: "Session 2",
      endDate: "2025-05-11T12:35:01.827Z",
      value: 6.9,
    },
    {
      sessionName: "Session 3",
      endDate: "2024-04-01T11:00:00.000Z",
      value: 0,
    },
  ],
}

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
  if (!data || data.length === 0) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <p className="text-gray-400">No stress data available</p>
      </div>
    )
  }

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
  if (!data || data.length === 0) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <p className="text-gray-400">No game data available</p>
      </div>
    )
  }

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

  if (!data || data.length === 0) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <p className="text-gray-400">No emotion data available</p>
      </div>
    )
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

// Empty state component
function EmptyState({ message }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center p-8">
      <div className="rounded-full bg-[#1e2642] p-4">
        <BarChart3 className="h-8 w-8 text-[#8a7cff]" />
      </div>
      <h3 className="mt-4 text-xl font-semibold text-white">{message}</h3>
      <p className="mt-2 text-center text-gray-400">Start a new session to see your data here.</p>
      <button className="mt-6 rounded-full bg-gradient-to-r from-[#8a7cff] to-[#4cc9f0] px-6 py-2 text-white hover:opacity-90 transition-opacity">
        Start New Session
      </button>
    </div>
  )
}

// Loading state component
function LoadingState() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-[#8a7cff]" />
      <span className="ml-2 text-white">Loading data...</span>
    </div>
  )
}

// Main Dashboard component
export default function Dashboard() {
  const [selectedSession, setSelectedSession] = useState("all")
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [stressData, setStressData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [sessions, setSessions] = useState([])

  // Process data on component mount
  useEffect(() => {
    // Simulate loading
    setIsLoading(true)

    try {
      // Process the sample data directly instead of fetching from API
      const processedData = processStressData(sampleData.rows)
      setStressData(processedData)

      // Extract unique sessions
      const uniqueSessions = extractSessions(sampleData.rows)
      setSessions(uniqueSessions)

      setIsLoading(false)
    } catch (err) {
      console.error("Error processing data:", err)
      setError("Failed to process data. Please try again later.")
      setIsLoading(false)
    }
  }, [])

  // Process the raw stress data for the chart
  const processStressData = (rawData) => {
    if (!rawData || rawData.length === 0) return []

    return rawData.map((item) => {
      const date = new Date(item.endDate)
      return {
        date: `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`,
        score: item.value,
        session: item.sessionName,
      }
    })
  }

  // Extract unique sessions from the data
  const extractSessions = (rawData) => {
    if (!rawData || rawData.length === 0) return []

    const uniqueSessions = new Map()

    rawData.forEach((item) => {
      if (item.sessionName) {
        uniqueSessions.set(item.sessionName, item.sessionName)
      }
    })

    return Array.from(uniqueSessions).map(([id, name]) => ({ id, name }))
  }

  // Filter data based on selected session
  const filteredStressData =
    selectedSession === "all" ? stressData : stressData.filter((item) => item.session === selectedSession)

  // Get the selected session name for display
  const getSessionName = () => {
    if (selectedSession === "all") return "All Sessions"
    const session = sessions.find((s) => s.id === selectedSession)
    return session ? session.name : "Select Session"
  }

  // Calculate stats from the data
  const calculateStats = () => {
    if (!stressData || stressData.length === 0) {
      return {
        totalSessions: 0,
        averageScore: 0,
        totalHours: 0,
      }
    }

    const uniqueSessions = new Set(stressData.map((item) => item.session))
    const totalSessions = uniqueSessions.size

    const scores = stressData.map((item) => item.score)
    const averageScore = scores.reduce((sum, score) => sum + score, 0) / scores.length

    // Assuming each session is 45 minutes
    const totalHours = (totalSessions * 45) / 60

    return {
      totalSessions,
      averageScore: averageScore.toFixed(1),
      totalHours: totalHours.toFixed(1),
    }
  }

  const stats = calculateStats()

  // Handle error state
  if (error) {
    return (
      <div className="min-h-screen w-full bg-[#0f1424] text-white overflow-x-hidden">
        <header className="border-b border-[#1e2642] bg-[#131836]">
          <div className="flex h-16 items-center px-4 md:px-6 max-w-full">
            <h1 className="text-xl font-bold text-[#8a7cff]">MindfulAI</h1>
          </div>
        </header>
        <div className="px-4 md:px-6 max-w-full">
          <div className="mt-12 flex flex-col items-center justify-center rounded-lg border border-[#1e2642] bg-[#1a1f38] p-8">
            <h2 className="text-xl font-semibold text-white">Error Loading Dashboard</h2>
            <p className="mt-2 text-gray-400">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-6 rounded-full bg-gradient-to-r from-[#8a7cff] to-[#4cc9f0] px-6 py-2 text-white hover:opacity-90 transition-opacity"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full bg-[#0f1424] text-white overflow-x-hidden">
      {/* Header */}
      <header className="border-b border-[#1e2642] bg-[#131836]">
        <div className="flex h-16 items-center justify-between px-4 md:px-6 max-w-full">
          <h1 className="text-xl font-bold text-[#8a7cff]">MindfulAI</h1>
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
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

      <div className="px-4 pb-24 md:px-6 max-w-full">
        {/* Stats Cards */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:gap-6">
          <div className="rounded-lg bg-[#1a1f38] border border-[#1e2642] text-white overflow-hidden">
            <div className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div className="rounded-lg bg-[#2a2d4a] p-3">
                  <MessageSquare className="h-5 w-5 md:h-6 md:w-6 text-[#8a7cff]" />
                </div>
                <span className="text-xs text-green-400">+3 from last week</span>
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-400">Total Sessions</p>
                <h3 className="text-2xl md:text-3xl font-bold">{isLoading ? "-" : stats.totalSessions}</h3>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-[#1a1f38] border border-[#1e2642] text-white overflow-hidden">
            <div className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div className="rounded-lg bg-[#2a2d4a] p-3">
                  <BarChart3 className="h-5 w-5 md:h-6 md:w-6 text-[#4cc9f0]" />
                </div>
                <span className="text-xs text-green-400">+5% from last month</span>
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-400">Average Stress Score</p>
                <h3 className="text-2xl md:text-3xl font-bold">{isLoading ? "-" : stats.averageScore}</h3>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-[#1a1f38] border border-[#1e2642] text-white overflow-hidden">
            <div className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div className="rounded-lg bg-[#2a2d4a] p-3">
                  <Clock className="h-5 w-5 md:h-6 md:w-6 text-[#8a7cff]" />
                </div>
                <span className="text-xs text-green-400">+2.5 from last month</span>
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-400">Therapy Hours</p>
                <h3 className="text-2xl md:text-3xl font-bold">{isLoading ? "-" : stats.totalHours}</h3>
              </div>
            </div>
          </div>
        </div>

        {/* Session Selector - Custom Dropdown */}
        <div className="mt-6 md:mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-lg md:text-xl font-semibold">Analytics Dashboard</h2>
          <div className="relative w-full sm:w-64">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex w-full items-center justify-between rounded-md border border-[#1e2642] bg-[#1a1f38] px-4 py-2 text-white"
              disabled={isLoading || sessions.length === 0}
            >
              <span>{isLoading ? "Loading sessions..." : getSessionName()}</span>
              <ChevronDown className="h-4 w-4" />
            </button>
            {isDropdownOpen && sessions.length > 0 && (
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
                {sessions.map((session) => (
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
        {isLoading ? (
          <div className="mt-6 h-80 rounded-lg border border-[#1e2642] bg-[#1a1f38]">
            <LoadingState />
          </div>
        ) : stressData.length === 0 ? (
          <div className="mt-6 h-80 rounded-lg border border-[#1e2642] bg-[#1a1f38]">
            <EmptyState message="No stress data available" />
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6">
            {/* Stress Score Chart */}
            <div className="rounded-lg border border-[#1e2642] bg-[#1a1f38] text-white overflow-hidden">
              <div className="p-4 border-b border-[#1e2642]">
                <h3 className="text-lg font-semibold">Stress Score Tracker</h3>
                <p className="text-sm text-gray-400">Stress levels on a scale of 0-10</p>
              </div>
              <div className="p-4">
                <div className="h-64 md:h-80">
                  <StressScoreChart data={filteredStressData} />
                </div>
              </div>
            </div>

            {/* Game Score Chart - Placeholder with empty state */}
            <div className="rounded-lg border border-[#1e2642] bg-[#1a1f38] text-white overflow-hidden">
              <div className="p-4 border-b border-[#1e2642]">
                <h3 className="text-lg font-semibold">Game Performance</h3>
                <p className="text-sm text-gray-400">Final scores from mindfulness games</p>
              </div>
              <div className="p-4">
                <div className="h-64 md:h-80">
                  <div className="flex h-full w-full items-center justify-center">
                    <p className="text-gray-400">No game data available yet</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Emotion Frequency Chart - Placeholder with empty state */}
            <div className="col-span-1 lg:col-span-2 rounded-lg border border-[#1e2642] bg-[#1a1f38] text-white overflow-hidden">
              <div className="p-4 border-b border-[#1e2642]">
                <h3 className="text-lg font-semibold">Emotion Frequency</h3>
                <p className="text-sm text-gray-400">How often each emotion has been recorded</p>
              </div>
              <div className="p-4">
                <div className="h-64 md:h-80">
                  <div className="flex h-full w-full items-center justify-center">
                    <p className="text-gray-400">No emotion data available yet</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Recent Sessions Section */}
        <div className="mt-6 md:mt-8">
          <div className="flex items-center justify-between">
            <h2 className="text-lg md:text-xl font-semibold">Recent Sessions</h2>
            <a href="#" className="text-[#8a7cff] hover:underline text-sm">
              View All
            </a>
          </div>
          <div className="mt-4 overflow-hidden rounded-lg border border-[#1e2642] bg-[#1a1f38]">
            {isLoading ? (
              <div className="h-48 flex items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-[#8a7cff]" />
              </div>
            ) : sessions.length === 0 ? (
              <div className="p-6 text-center">
                <p className="text-gray-400">No recent sessions found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#1e2642]">
                      <th className="p-4 text-left text-sm font-medium text-gray-400">Session</th>
                      <th className="p-4 text-left text-sm font-medium text-gray-400">Date</th>
                      <th className="p-4 text-left text-sm font-medium text-gray-400">Avg. Stress</th>
                      <th className="p-4 text-left text-sm font-medium text-gray-400">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sessions.slice(0, 3).map((session, index) => {
                      // Calculate average stress for this session
                      const sessionData = stressData.filter((item) => item.session === session.id)
                      const avgStress =
                        sessionData.length > 0
                          ? (sessionData.reduce((sum, item) => sum + item.score, 0) / sessionData.length).toFixed(1)
                          : "N/A"

                      // Get the date from the first data point
                      const date =
                        sessionData.length > 0 ? new Date(sessionData[0].date).toLocaleDateString() : "Unknown"

                      return (
                        <tr key={index} className="border-b border-[#1e2642]">
                          <td className="p-4 font-medium">{session.name}</td>
                          <td className="p-4 text-gray-300">{date}</td>
                          <td className="p-4 text-gray-300">{avgStress}</td>
                          <td className="p-4">
                            <span className="rounded-full bg-green-500/20 px-2 py-1 text-xs font-medium text-green-400">
                              Completed
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* User Profile Footer */}
      <div className="fixed bottom-0 left-0 w-full border-t border-[#1e2642] bg-[#131836] p-4">
        <div className="flex items-center justify-between px-0 max-w-full">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-full bg-[#8a7cff]">
              <span className="text-xs md:text-sm font-medium">SJ</span>
            </div>
            <div>
              <p className="text-sm md:text-base font-medium">Premium Plan</p>
            </div>
          </div>
          <button className="rounded-md bg-[#2a2d4a] px-3 py-1 text-sm text-white hover:bg-[#3a3d5a] transition-colors">
            Settings
          </button>
        </div>
      </div>
    </div>
  )
}
