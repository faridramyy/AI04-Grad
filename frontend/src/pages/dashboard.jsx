import { Clock, BarChart3, MessageSquare } from "lucide-react"

export default function Dashboard() {
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
            {/* Hardcoded button instead of Button component */}
            <button className="rounded-full bg-gradient-to-r from-[#8a7cff] to-[#4cc9f0] px-4 py-2 text-white hover:opacity-90 transition-opacity">
              Start New Session
            </button>
          </div>
        </div>
      </header>

      <div className="container p-6">
        {/* Stats Cards */}
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Hardcoded card instead of Card component */}
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

        {/* Mood Tracker Section */}
        <div className="mt-8">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Weekly Mood Tracker</h2>
            {/* Hardcoded link instead of Button component */}
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
