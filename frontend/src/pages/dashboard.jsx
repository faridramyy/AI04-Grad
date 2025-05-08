import { useState } from "react";
import {
  Brain,
  Menu,
  X,
  MessageSquare,
  BarChart,
  Settings,
  Calendar,
  User,
  Bell,
  Search,
  TrendingUp,
  Target,
  Clock,
  ChevronRight,
  LogOut,
} from "lucide-react";

export default function Dashboard() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSidebarItem, setActiveSidebarItem] = useState("overview");
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Therapy session reminder",
      message: "Your scheduled session starts in 30 minutes",
      time: "30m",
      read: false,
    },
    {
      id: 2,
      title: "New exercise available",
      message: "Check out the new mindfulness exercise",
      time: "2h",
      read: false,
    },
    {
      id: 3,
      title: "Weekly progress report",
      message: "Your weekly progress report is ready to view",
      time: "1d",
      read: true,
    },
  ]);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const moodData = [
    { day: "Mon", value: 7 },
    { day: "Tue", value: 5 },
    { day: "Wed", value: 6 },
    { day: "Thu", value: 8 },
    { day: "Fri", value: 7 },
    { day: "Sat", value: 9 },
    { day: "Sun", value: 8 },
  ];

  const recentConversations = [
    {
      id: 1,
      title: "Anxiety Management",
      preview: "We discussed techniques for managing work-related anxiety...",
      date: "Today, 2:30 PM",
      unread: true,
    },
    {
      id: 2,
      title: "Sleep Improvement",
      preview:
        "Strategies for improving sleep quality and establishing a routine...",
      date: "Yesterday, 7:15 PM",
      unread: false,
    },
    {
      id: 3,
      title: "Stress Reduction",
      preview: "Exploring mindfulness practices for daily stress management...",
      date: "May 15, 4:45 PM",
      unread: false,
    },
  ];

  const upcomingExercises = [
    {
      id: 1,
      title: "Morning Mindfulness",
      description: "10-minute guided meditation to start your day",
      time: "Tomorrow, 8:00 AM",
      completed: false,
    },
    {
      id: 2,
      title: "Thought Reframing",
      description: "Practice identifying and reframing negative thoughts",
      time: "Today, 6:00 PM",
      completed: false,
    },
    {
      id: 3,
      title: "Gratitude Journal",
      description: "Write down three things you're grateful for today",
      time: "Daily",
      completed: true,
    },
  ];

  const goals = [
    {
      id: 1,
      title: "Reduce anxiety levels",
      progress: 65,
      target: "Reduce anxiety score by 30%",
    },
    {
      id: 2,
      title: "Improve sleep quality",
      progress: 40,
      target: "7+ hours of quality sleep per night",
    },
    {
      id: 3,
      title: "Daily mindfulness practice",
      progress: 80,
      target: "10 minutes of mindfulness daily",
    },
  ];

  const markAllNotificationsAsRead = () => {
    setNotifications(
      notifications.map((notification) => ({
        ...notification,
        read: true,
      }))
    );
  };

  const unreadNotificationsCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  return (
    <div className="min-h-screen bg-[#0F172A] text-white">
      {/* Background elements */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[#0F172A]"></div>
        <div className="absolute top-0 left-0 w-full h-full opacity-30 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxwYXRoIGQ9Ik0gNDAgMCBMIDAgMCAwIDQwIiBmaWxsPSJub25lIiBzdHJva2U9IiMxRTI5M0IiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')]"></div>
        <div className="absolute top-[-50%] left-[-10%] w-[70%] h-[100%] rounded-full bg-gradient-to-r from-violet-600/10 to-indigo-600/10 blur-[120px]"></div>
        <div className="absolute bottom-[-50%] right-[-10%] w-[70%] h-[100%] rounded-full bg-gradient-to-l from-cyan-500/10 to-teal-500/10 blur-[120px]"></div>
      </div>

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-[#0F172A]/80 backdrop-blur-lg border-b border-gray-800">
        <div className="flex justify-between items-center p-4">
          <div className="flex items-center gap-2">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-cyan-500 rounded-full blur-sm"></div>
              <div className="relative bg-[#0F172A] p-2 rounded-full">
                <Brain className="h-6 w-6 text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-cyan-500" />
              </div>
            </div>
            <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-cyan-500">
              MindfulAI
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              className="relative p-2 text-gray-400 hover:text-white"
              onClick={() => setNotificationsOpen(!notificationsOpen)}
            >
              <Bell className="h-6 w-6" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-gradient-to-r from-violet-600 to-cyan-500 rounded-full flex items-center justify-center text-[10px]">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>
            <button
              className="p-2 text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-30 lg:hidden pt-16">
          <div
            className="absolute inset-0 bg-[#0F172A]/95 backdrop-blur-lg"
            onClick={() => setMobileMenuOpen(false)}
          ></div>
          <div className="relative h-full w-64 bg-[#131A2B]/90 backdrop-blur-xl border-r border-gray-800 p-4 overflow-y-auto">
            <nav className="space-y-1 mb-8">
              <button
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeSidebarItem === "overview"
                    ? "bg-gradient-to-r from-violet-600/20 to-cyan-500/20 text-white"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
                onClick={() => {
                  setActiveSidebarItem("overview");
                  setMobileMenuOpen(false);
                }}
              >
                <BarChart className="h-5 w-5" />
                <span>Overview</span>
              </button>
              <button
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeSidebarItem === "conversations"
                    ? "bg-gradient-to-r from-violet-600/20 to-cyan-500/20 text-white"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
                onClick={() => {
                  setActiveSidebarItem("conversations");
                  setMobileMenuOpen(false);
                }}
              >
                <MessageSquare className="h-5 w-5" />
                <span>Conversations</span>
              </button>
              <button
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeSidebarItem === "exercises"
                    ? "bg-gradient-to-r from-violet-600/20 to-cyan-500/20 text-white"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
                onClick={() => {
                  setActiveSidebarItem("exercises");
                  setMobileMenuOpen(false);
                }}
              >
                <Target className="h-5 w-5" />
                <span>Exercises & Goals</span>
              </button>
              <button
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeSidebarItem === "calendar"
                    ? "bg-gradient-to-r from-violet-600/20 to-cyan-500/20 text-white"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
                onClick={() => {
                  setActiveSidebarItem("calendar");
                  setMobileMenuOpen(false);
                }}
              >
                <Calendar className="h-5 w-5" />
                <span>Calendar</span>
              </button>
              <button
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeSidebarItem === "settings"
                    ? "bg-gradient-to-r from-violet-600/20 to-cyan-500/20 text-white"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
                onClick={() => {
                  setActiveSidebarItem("settings");
                  setMobileMenuOpen(false);
                }}
              >
                <Settings className="h-5 w-5" />
                <span>Settings</span>
              </button>
            </nav>

            <div className="pt-6 mt-6 border-t border-gray-800">
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden lg:block fixed inset-y-0 left-0 z-30 w-64 bg-[#131A2B]/60 backdrop-blur-xl border-r border-gray-800">
        <div className="flex flex-col h-full">
          <div className="flex items-center gap-2 p-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-cyan-500 rounded-full blur-sm"></div>
              <div className="relative bg-[#0F172A] p-2 rounded-full">
                <Brain className="h-6 w-6 text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-cyan-500" />
              </div>
            </div>
            <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-cyan-500">
              MindfulAI
            </h1>
          </div>

          <nav className="flex-1 px-3 py-4 space-y-1">
            <button
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeSidebarItem === "overview"
                  ? "bg-gradient-to-r from-violet-600/20 to-cyan-500/20 text-white"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
              onClick={() => setActiveSidebarItem("overview")}
            >
              <BarChart className="h-5 w-5" />
              <span>Overview</span>
            </button>
            <button
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeSidebarItem === "conversations"
                  ? "bg-gradient-to-r from-violet-600/20 to-cyan-500/20 text-white"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
              onClick={() => setActiveSidebarItem("conversations")}
            >
              <MessageSquare className="h-5 w-5" />
              <span>Conversations</span>
            </button>
            <button
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeSidebarItem === "exercises"
                  ? "bg-gradient-to-r from-violet-600/20 to-cyan-500/20 text-white"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
              onClick={() => setActiveSidebarItem("exercises")}
            >
              <Target className="h-5 w-5" />
              <span>Exercises & Goals</span>
            </button>
            <button
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeSidebarItem === "calendar"
                  ? "bg-gradient-to-r from-violet-600/20 to-cyan-500/20 text-white"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
              onClick={() => setActiveSidebarItem("calendar")}
            >
              <Calendar className="h-5 w-5" />
              <span>Calendar</span>
            </button>
            <button
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeSidebarItem === "settings"
                  ? "bg-gradient-to-r from-violet-600/20 to-cyan-500/20 text-white"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
              onClick={() => setActiveSidebarItem("settings")}
            >
              <Settings className="h-5 w-5" />
              <span>Settings</span>
            </button>
          </nav>

          <div className="p-4 border-t border-gray-800">
            <div className="flex items-center gap-3 p-2">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 flex items-center justify-center">
                  <User className="h-5 w-5 text-white" />
                </div>
              </div>
              <div>
                <div className="font-medium">Sarah Johnson</div>
                <div className="text-sm text-gray-400">Premium Plan</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:pl-64 pt-16 lg:pt-0 min-h-screen">
        {/* Desktop Header */}
        <header className="hidden lg:flex sticky top-0 z-20 bg-[#0F172A]/80 backdrop-blur-lg border-b border-gray-800 h-16">
          <div className="flex-1 flex items-center justify-between px-6">
            <div className="flex-1">
              <h2 className="text-xl font-semibold">
                {activeSidebarItem === "overview" && "Dashboard Overview"}
                {activeSidebarItem === "conversations" &&
                  "Therapy Conversations"}
                {activeSidebarItem === "exercises" && "Exercises & Goals"}
                {activeSidebarItem === "calendar" && "Calendar"}
                {activeSidebarItem === "settings" && "Account Settings"}
              </h2>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="bg-[#1E293B] border border-gray-700 text-white placeholder:text-gray-500 focus:border-violet-500 h-10 pl-10 pr-4 rounded-md w-64"
                />
              </div>

              <div className="relative">
                <button
                  className="relative p-2 text-gray-400 hover:text-white"
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                >
                  <Bell className="h-6 w-6" />
                  {unreadNotificationsCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-gradient-to-r from-violet-600 to-cyan-500 rounded-full flex items-center justify-center text-[10px]">
                      {unreadNotificationsCount}
                    </span>
                  )}
                </button>

                {notificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-[#131A2B]/90 backdrop-blur-xl border border-gray-800 rounded-lg shadow-lg z-50 overflow-hidden">
                    <div className="p-3 border-b border-gray-800 flex justify-between items-center">
                      <h3 className="font-medium">Notifications</h3>
                      <button
                        className="text-xs text-violet-400 hover:text-violet-300"
                        onClick={markAllNotificationsAsRead}
                      >
                        Mark all as read
                      </button>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-4 text-center text-gray-400">
                          No notifications
                        </div>
                      ) : (
                        notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`p-3 border-b border-gray-800 hover:bg-white/5 transition-colors ${
                              notification.read ? "opacity-70" : ""
                            }`}
                          >
                            <div className="flex justify-between">
                              <h4 className="font-medium text-sm">
                                {notification.title}
                              </h4>
                              <span className="text-xs text-gray-400">
                                {notification.time}
                              </span>
                            </div>
                            <p className="text-sm text-gray-400 mt-1">
                              {notification.message}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                    <div className="p-2 border-t border-gray-800">
                      <button className="w-full text-center text-sm text-violet-400 hover:text-violet-300 p-2">
                        View all notifications
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Mobile Notifications Dropdown */}
        {notificationsOpen && (
          <div className="lg:hidden fixed inset-x-0 top-16 z-30 bg-[#131A2B]/90 backdrop-blur-xl border-b border-gray-800 shadow-lg">
            <div className="p-3 border-b border-gray-800 flex justify-between items-center">
              <h3 className="font-medium">Notifications</h3>
              <button
                className="text-xs text-violet-400 hover:text-violet-300"
                onClick={markAllNotificationsAsRead}
              >
                Mark all as read
              </button>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-gray-400">
                  No notifications
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 border-b border-gray-800 hover:bg-white/5 transition-colors ${
                      notification.read ? "opacity-70" : ""
                    }`}
                  >
                    <div className="flex justify-between">
                      <h4 className="font-medium text-sm">
                        {notification.title}
                      </h4>
                      <span className="text-xs text-gray-400">
                        {notification.time}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 mt-1">
                      {notification.message}
                    </p>
                  </div>
                ))
              )}
            </div>
            <div className="p-2 border-t border-gray-800">
              <button className="w-full text-center text-sm text-violet-400 hover:text-violet-300 p-2">
                View all notifications
              </button>
            </div>
          </div>
        )}

        {/* Dashboard Content */}
        <div className="p-6 relative z-10">
          {activeSidebarItem === "overview" && (
            <div className="space-y-6">
              {/* Welcome Card */}
              <div className="relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600/30 to-cyan-500/30 rounded-xl blur-sm opacity-70"></div>
                <div className="relative bg-[#131A2B]/60 backdrop-blur-sm p-6 rounded-xl border border-gray-800">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-bold mb-2">
                        Welcome back, Sarah!
                      </h2>
                      <p className="text-gray-300">
                        Your journey to better mental wellness continues. Here's
                        your progress so far.
                      </p>
                    </div>
                    <button className="bg-gradient-to-r from-violet-600 to-cyan-500 hover:opacity-90 transition-opacity px-6 py-3 rounded-lg text-white font-medium">
                      Start New Session
                    </button>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#131A2B]/40 backdrop-blur-sm p-6 rounded-xl border border-gray-800">
                  <div className="flex items-center gap-4">
                    <div className="bg-violet-500/20 p-3 rounded-lg">
                      <MessageSquare className="h-6 w-6 text-violet-400" />
                    </div>
                    <div>
                      <div className="text-gray-400 text-sm">
                        Total Sessions
                      </div>
                      <div className="text-2xl font-bold">24</div>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-sm">
                    <TrendingUp className="h-4 w-4 text-green-400 mr-1" />
                    <span className="text-green-400">+3</span>
                    <span className="text-gray-400 ml-1">from last week</span>
                  </div>
                </div>

                <div className="bg-[#131A2B]/40 backdrop-blur-sm p-6 rounded-xl border border-gray-800">
                  <div className="flex items-center gap-4">
                    <div className="bg-cyan-500/20 p-3 rounded-lg">
                      <Target className="h-6 w-6 text-cyan-400" />
                    </div>
                    <div>
                      <div className="text-gray-400 text-sm">
                        Goals Progress
                      </div>
                      <div className="text-2xl font-bold">62%</div>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-sm">
                    <TrendingUp className="h-4 w-4 text-green-400 mr-1" />
                    <span className="text-green-400">+5%</span>
                    <span className="text-gray-400 ml-1">from last month</span>
                  </div>
                </div>

                <div className="bg-[#131A2B]/40 backdrop-blur-sm p-6 rounded-xl border border-gray-800">
                  <div className="flex items-center gap-4">
                    <div className="bg-violet-500/20 p-3 rounded-lg">
                      <Clock className="h-6 w-6 text-violet-400" />
                    </div>
                    <div>
                      <div className="text-gray-400 text-sm">Therapy Hours</div>
                      <div className="text-2xl font-bold">18.5</div>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-sm">
                    <TrendingUp className="h-4 w-4 text-green-400 mr-1" />
                    <span className="text-green-400">+2.5</span>
                    <span className="text-gray-400 ml-1">from last month</span>
                  </div>
                </div>
              </div>

              {/* Mood Tracker */}
              <div className="bg-[#131A2B]/40 backdrop-blur-sm p-6 rounded-xl border border-gray-800">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold">Weekly Mood Tracker</h3>
                  <button className="text-sm text-violet-400 hover:text-violet-300">
                    View Details
                  </button>
                </div>
                <div className="h-64">
                  <div className="flex h-full items-end">
                    {moodData.map((item, index) => (
                      <div
                        key={index}
                        className="flex-1 flex flex-col items-center"
                      >
                        <div
                          className="w-full max-w-[40px] rounded-t-md bg-gradient-to-t from-violet-600 to-cyan-500 transition-all duration-500 hover:opacity-90"
                          style={{ height: `${(item.value / 10) * 100}%` }}
                        ></div>
                        <div className="mt-2 text-xs text-gray-400">
                          {item.day}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-4 flex justify-between text-sm text-gray-400">
                  <div>Low</div>
                  <div>Mood Level</div>
                  <div>High</div>
                </div>
              </div>

              {/* Recent Conversations and Upcoming Exercises */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-[#131A2B]/40 backdrop-blur-sm p-6 rounded-xl border border-gray-800">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold">
                      Recent Conversations
                    </h3>
                    <button className="text-sm text-violet-400 hover:text-violet-300">
                      View All
                    </button>
                  </div>
                  <div className="space-y-4">
                    {recentConversations.map((conversation) => (
                      <div key={conversation.id} className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600/20 to-cyan-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition duration-300 blur"></div>
                        <div className="relative bg-[#1E293B]/40 p-4 rounded-lg border border-gray-800 group-hover:border-gray-700 transition duration-300">
                          <div className="flex justify-between mb-2">
                            <h4 className="font-medium">
                              {conversation.title}
                            </h4>
                            <span className="text-xs text-gray-400">
                              {conversation.date}
                            </span>
                          </div>
                          <p className="text-sm text-gray-400 mb-3">
                            {conversation.preview}
                          </p>
                          <button className="text-sm text-violet-400 hover:text-violet-300 flex items-center">
                            Continue Conversation
                            <ChevronRight className="h-4 w-4 ml-1" />
                          </button>
                          {conversation.unread && (
                            <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-gradient-to-r from-violet-600 to-cyan-500"></div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-[#131A2B]/40 backdrop-blur-sm p-6 rounded-xl border border-gray-800">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold">
                      Upcoming Exercises
                    </h3>
                    <button className="text-sm text-violet-400 hover:text-violet-300">
                      View All
                    </button>
                  </div>
                  <div className="space-y-4">
                    {upcomingExercises.map((exercise) => (
                      <div key={exercise.id} className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600/20 to-cyan-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition duration-300 blur"></div>
                        <div className="relative bg-[#1E293B]/40 p-4 rounded-lg border border-gray-800 group-hover:border-gray-700 transition duration-300">
                          <div className="flex justify-between mb-2">
                            <h4 className="font-medium">{exercise.title}</h4>
                            <span className="text-xs text-gray-400">
                              {exercise.time}
                            </span>
                          </div>
                          <p className="text-sm text-gray-400 mb-3">
                            {exercise.description}
                          </p>
                          {exercise.completed ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/20 text-green-400">
                              Completed
                            </span>
                          ) : (
                            <button className="text-sm text-violet-400 hover:text-violet-300 flex items-center">
                              Start Exercise
                              <ChevronRight className="h-4 w-4 ml-1" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Goals Progress */}
              <div className="bg-[#131A2B]/40 backdrop-blur-sm p-6 rounded-xl border border-gray-800">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold">Goals Progress</h3>
                  <button className="text-sm text-violet-400 hover:text-violet-300">
                    Manage Goals
                  </button>
                </div>
                <div className="space-y-6">
                  {goals.map((goal) => (
                    <div key={goal.id}>
                      <div className="flex justify-between mb-2">
                        <h4 className="font-medium">{goal.title}</h4>
                        <span className="text-sm text-gray-400">
                          {goal.progress}%
                        </span>
                      </div>
                      <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-violet-600 to-cyan-500 rounded-full transition-all duration-500"
                          style={{ width: `${goal.progress}%` }}
                        ></div>
                      </div>
                      <p className="text-sm text-gray-400 mt-2">
                        Target: {goal.target}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeSidebarItem === "conversations" && (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold mb-2">Conversations Page</h3>
              <p className="text-gray-400">
                This section would display all your therapy conversations.
              </p>
            </div>
          )}

          {activeSidebarItem === "exercises" && (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold mb-2">
                Exercises & Goals Page
              </h3>
              <p className="text-gray-400">
                This section would display all your exercises and goals.
              </p>
            </div>
          )}

          {activeSidebarItem === "calendar" && (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold mb-2">Calendar Page</h3>
              <p className="text-gray-400">
                This section would display your therapy calendar and scheduled
                sessions.
              </p>
            </div>
          )}

          {activeSidebarItem === "settings" && (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold mb-2">Settings Page</h3>
              <p className="text-gray-400">
                This section would allow you to manage your account settings.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
