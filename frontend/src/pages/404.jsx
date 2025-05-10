import { useState } from "react";
import { Brain, Home, Search, ArrowLeft, HelpCircle } from "lucide-react";
import { Link } from "react-router-dom";

export default function NotFound() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-[#0F172A] text-white overflow-hidden flex flex-col">
      {/* Background elements */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[#0F172A]"></div>
        <div className="absolute top-0 left-0 w-full h-full opacity-30 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxwYXRoIGQ9Ik0gNDAgMCBMIDAgMCAwIDQwIiBmaWxsPSJub25lIiBzdHJva2U9IiMxRTI5M0IiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')]"></div>
        <div className="absolute top-[-50%] left-[-10%] w-[70%] h-[100%] rounded-full bg-gradient-to-r from-violet-600/20 to-indigo-600/20 blur-[120px]"></div>
        <div className="absolute bottom-[-50%] right-[-10%] w-[70%] h-[100%] rounded-full bg-gradient-to-l from-cyan-500/20 to-teal-500/20 blur-[120px]"></div>
      </div>

      <main className="relative z-10 flex-grow flex flex-col items-center justify-center px-4">
        <div className="max-w-md w-full mx-auto text-center">
          {/* Logo */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-cyan-500 rounded-full blur-sm"></div>
              <div className="relative bg-[#0F172A] p-2 rounded-full">
                <Brain className="h-8 w-8 text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-cyan-500" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-cyan-500">
              MindfulAI
            </h1>
          </div>

          {/* 404 Text */}
          <div className="relative mb-8">
            <div className="text-[120px] font-bold leading-none text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-cyan-500 opacity-20">
              404
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-4xl font-bold text-white">
                Page Not Found
              </div>
            </div>
          </div>

          {/* Error Card */}
          <div className="relative mb-8">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600/30 to-cyan-500/30 rounded-xl blur-sm opacity-70"></div>
            <div className="relative bg-[#131A2B]/60 backdrop-blur-sm p-6 rounded-xl border border-gray-800">
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 bg-[#1E293B]/50 rounded-full flex items-center justify-center mb-4">
                  <HelpCircle className="h-10 w-10 text-violet-400" />
                </div>
                <p className="text-gray-300 mb-6">
                  The page you're looking for doesn't exist or has been moved.
                  Let's help you find your way back.
                </p>

                {/* Navigation Options */}
                <div className="flex justify-center">
                  <Link to="/" className="group block w-full max-w-xs">
                    <div className="relative">
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600/50 to-cyan-500/50 rounded-lg opacity-0 group-hover:opacity-100 transition duration-300 blur"></div>
                      <div className="relative bg-[#1E293B]/40 p-4 rounded-lg border border-gray-800 group-hover:border-gray-700 transition duration-300 flex items-center justify-center">
                        <Home className="h-5 w-5 text-violet-400 mr-3" />
                        <span>Home Page</span>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Back Button */}
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center text-violet-400 hover:text-violet-300 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-6 text-center text-gray-500">
        <p>
          © {new Date().getFullYear()} MindfulAI Therapy. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
