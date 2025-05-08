import { useState, useEffect } from "react"
import { MessageSquare, Brain, Shield, ArrowRight, Menu, X } from "lucide-react"

export default function Index() {
  const [loginOpen, setLoginOpen] = useState(false)
  const [signupOpen, setSignupOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-[#0F172A] text-white overflow-hidden">
      {/* Background elements */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[#0F172A]"></div>
        <div className="absolute top-0 left-0 w-full h-full opacity-30 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxwYXRoIGQ9Ik0gNDAgMCBMIDAgMCAwIDQwIiBmaWxsPSJub25lIiBzdHJva2U9IiMxRTI5M0IiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')]"></div>
        <div className="absolute top-[-50%] left-[-10%] w-[70%] h-[100%] rounded-full bg-gradient-to-r from-violet-600/20 to-indigo-600/20 blur-[120px]"></div>
        <div className="absolute bottom-[-50%] right-[-10%] w-[70%] h-[100%] rounded-full bg-gradient-to-l from-cyan-500/20 to-teal-500/20 blur-[120px]"></div>
      </div>

      {/* Navigation */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-[#0F172A]/80 backdrop-blur-lg shadow-lg" : ""}`}
      >
        <div className="container mx-auto py-5 px-4 flex justify-between items-center">
          <div className="flex items-center gap-2 z-10">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-cyan-500 rounded-full blur-sm"></div>
              <div className="relative bg-[#0F172A] p-2 rounded-full">
                <Brain className="h-6 w-6 text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-cyan-500" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-cyan-500">
              MindfulAI
            </h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <button className="text-gray-300 hover:text-white hover:bg-white/10 px-4 py-2 rounded-md">
              How It Works
            </button>
            <button className="text-gray-300 hover:text-white hover:bg-white/10 px-4 py-2 rounded-md">Pricing</button>
            <button className="text-gray-300 hover:text-white hover:bg-white/10 px-4 py-2 rounded-md">About Us</button>
            <button
              onClick={() => setLoginOpen(true)}
              className="border border-gray-700 text-gray-300 hover:text-white hover:bg-white/10 hover:border-gray-600 px-4 py-2 rounded-md"
            >
              Login
            </button>
            <button
              onClick={() => setSignupOpen(true)}
              className="bg-gradient-to-r from-violet-600 to-cyan-500 hover:opacity-90 transition-opacity px-4 py-2 rounded-md"
            >
              Sign Up
            </button>
          </nav>

          {/* Mobile menu button */}
          <button className="md:hidden z-20 p-2 text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-10 bg-[#0F172A]/95 backdrop-blur-lg md:hidden">
            <div className="flex flex-col items-center justify-center h-full gap-8">
              <button className="text-xl text-gray-300 hover:text-white hover:bg-white/10 px-6 py-3 rounded-md">
                How It Works
              </button>
              <button className="text-xl text-gray-300 hover:text-white hover:bg-white/10 px-6 py-3 rounded-md">
                Pricing
              </button>
              <button className="text-xl text-gray-300 hover:text-white hover:bg-white/10 px-6 py-3 rounded-md">
                About Us
              </button>
              <button
                className="text-xl border border-gray-700 text-gray-300 hover:text-white hover:bg-white/10 px-6 py-3 rounded-md"
                onClick={() => {
                  setMobileMenuOpen(false)
                  setLoginOpen(true)
                }}
              >
                Login
              </button>
              <button
                className="text-xl bg-gradient-to-r from-violet-600 to-cyan-500 hover:opacity-90 transition-opacity px-6 py-3 rounded-md"
                onClick={() => {
                  setMobileMenuOpen(false)
                  setSignupOpen(true)
                }}
              >
                Sign Up
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 space-y-8 z-10">
              <div className="inline-block px-4 py-2 bg-white/5 backdrop-blur-sm rounded-full border border-gray-800 mb-4">
                <p className="text-sm text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">
                  AI-Powered Mental Wellness
                </p>
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                <span className="block">Therapy</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-cyan-400">
                  Reimagined
                </span>
              </h1>
              <p className="text-xl text-gray-400 max-w-xl">
                Experience personalized therapy sessions with our advanced AI. Available 24/7, confidential, and
                tailored to your unique needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  className="h-14 px-8 bg-gradient-to-r from-violet-600 to-cyan-500 hover:opacity-90 transition-opacity text-lg rounded-md flex items-center justify-center"
                  onClick={() => setSignupOpen(true)}
                >
                  Start Your Journey
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
                <button className="h-14 px-8 border border-gray-700 text-gray-300 hover:text-white hover:bg-white/10 hover:border-gray-600 text-lg rounded-md">
                  Learn More
                </button>
              </div>
            </div>
            <div className="flex-1 flex justify-center z-10">
              <div className="relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600 to-cyan-500 rounded-2xl blur-xl opacity-75"></div>
                <div className="relative bg-[#131A2B]/40 backdrop-blur-sm p-1 rounded-2xl border border-gray-800">
                  <img
                    src="https://placehold.co/600x400"
                    alt="AI Therapy Illustration"
                    className="rounded-xl max-w-md w-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="container mx-auto px-4 z-10 relative">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-cyan-400">
              Why Choose MindfulAI Therapy?
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Our cutting-edge AI platform offers unique advantages for your mental wellness journey
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <MessageSquare className="h-6 w-6 text-violet-400" />,
                title: "24/7 Availability",
                description:
                  "Access therapeutic support whenever you need it, day or night, without scheduling appointments.",
              },
              {
                icon: <Brain className="h-6 w-6 text-violet-400" />,
                title: "Personalized Approach",
                description:
                  "Our AI adapts to your unique needs, creating a customized therapy experience that evolves with you.",
              },
              {
                icon: <Shield className="h-6 w-6 text-violet-400" />,
                title: "Complete Privacy",
                description:
                  "Your conversations are encrypted and confidential, ensuring your privacy is always protected.",
              },
            ].map((feature, index) => (
              <div key={index} className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600 to-cyan-500 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
                <div className="relative h-full bg-[#131A2B]/40 backdrop-blur-sm p-8 rounded-xl border border-gray-800 group-hover:border-gray-700 transition duration-300">
                  <div className="bg-white/5 p-3 rounded-full w-fit mb-6">{feature.icon}</div>
                  <h3 className="text-xl font-semibold text-white mb-4">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative py-20 overflow-hidden">
        <div className="container mx-auto px-4 z-10 relative">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-cyan-400">
              What Our Users Say
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Real stories from people who transformed their mental wellbeing with MindfulAI
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah J.",
                role: "Anxiety Management",
                text: "MindfulAI has been a game-changer for my anxiety. Having support available whenever I need it has made all the difference.",
              },
              {
                name: "Michael T.",
                role: "Depression Recovery",
                text: "I was skeptical at first, but the personalized approach really works. It feels like talking to someone who truly understands me.",
              },
              {
                name: "Elena R.",
                role: "Stress Reduction",
                text: "As someone with a busy schedule, the 24/7 availability is perfect. I can process my thoughts whenever I need to.",
              },
            ].map((testimonial, index) => (
              <div key={index} className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600 to-cyan-500 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
                <div className="relative h-full bg-[#131A2B]/40 backdrop-blur-sm p-8 rounded-xl border border-gray-800 group-hover:border-gray-700 transition duration-300">
                  <div className="flex items-center gap-2 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-violet-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-gray-300 mb-6 italic">"{testimonial.text}"</p>
                  <div>
                    <p className="font-semibold text-white">{testimonial.name}</p>
                    <p className="text-sm text-gray-400">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-900/20 to-cyan-900/20"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Begin Your{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-cyan-400">
                Healing Journey
              </span>{" "}
              Today
            </h2>
            <p className="text-xl text-gray-300 mb-10">
              Join thousands who have transformed their mental wellbeing with MindfulAI's personalized therapy approach.
            </p>
            <button
              className="h-14 px-10 bg-gradient-to-r from-violet-600 to-cyan-500 hover:opacity-90 transition-opacity text-lg rounded-md"
              onClick={() => setSignupOpen(true)}
            >
              Start Free Trial
            </button>
            <p className="mt-6 text-gray-400">No credit card required. 7-day free trial.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-16 border-t border-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-10">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-cyan-500 rounded-full blur-sm"></div>
                  <div className="relative bg-[#0F172A] p-2 rounded-full">
                    <Brain className="h-5 w-5 text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-cyan-500" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-cyan-500">
                  MindfulAI
                </h3>
              </div>
              <p className="text-gray-400 mb-6">AI-powered therapy for a healthier mind and happier life.</p>
              <div className="flex gap-4">
                {["twitter", "facebook", "instagram", "linkedin"].map((social) => (
                  <a
                    key={social}
                    href="#"
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    <span className="sr-only">{social}</span>
                    <div className="w-5 h-5 bg-gray-400"></div>
                  </a>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-6">Company</h4>
              <ul className="space-y-4">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Our Team
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-6">Resources</h4>
              <ul className="space-y-4">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Research
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Mental Health Tips
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-6">Legal</h4>
              <ul className="space-y-4">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Cookie Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    HIPAA Compliance
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500">
            <p>© {new Date().getFullYear()} MindfulAI Therapy. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Login Modal */}
      {loginOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setLoginOpen(false)}></div>
          <div className="relative bg-[#131A2B]/80 backdrop-blur-xl border border-gray-800 text-white rounded-xl w-full max-w-md p-6">
            <div className="text-right">
              <button onClick={() => setLoginOpen(false)} className="text-gray-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mb-6">
              <h2 className="text-xl text-white font-bold">Welcome Back</h2>
              <p className="text-gray-400">Continue your journey to mental wellness</p>
            </div>
            <div className="space-y-5">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full bg-[#1E293B] border border-gray-700 text-white placeholder:text-gray-500 focus:border-violet-500 h-12 px-4 rounded-md"
                />
              </div>
              <div className="relative">
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full bg-[#1E293B] border border-gray-700 text-white placeholder:text-gray-500 focus:border-violet-500 h-12 px-4 rounded-md"
                />
              </div>
              <button className="w-full h-12 bg-gradient-to-r from-violet-600 to-cyan-500 hover:opacity-90 transition-opacity rounded-md">
                Login
              </button>
              <p className="text-center text-sm text-gray-400">
                Don&apos;t have an account?{" "}
                <button
                  className="text-violet-400 hover:text-violet-300 transition-colors"
                  onClick={() => {
                    setLoginOpen(false)
                    setSignupOpen(true)
                  }}
                >
                  Sign up
                </button>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Signup Modal */}
      {signupOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSignupOpen(false)}></div>
          <div className="relative bg-[#131A2B]/80 backdrop-blur-xl border border-gray-800 text-white rounded-xl w-full max-w-md p-6">
            <div className="text-right">
              <button onClick={() => setSignupOpen(false)} className="text-gray-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mb-6">
              <h2 className="text-xl text-white font-bold">Start Your Journey</h2>
              <p className="text-gray-400">Create your account to begin healing</p>
            </div>
            <div className="space-y-5">
              <div className="relative">
                <input
                  placeholder="Full Name"
                  className="w-full bg-[#1E293B] border border-gray-700 text-white placeholder:text-gray-500 focus:border-violet-500 h-12 px-4 rounded-md"
                />
              </div>
              <div className="relative">
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full bg-[#1E293B] border border-gray-700 text-white placeholder:text-gray-500 focus:border-violet-500 h-12 px-4 rounded-md"
                />
              </div>
              <div className="relative">
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full bg-[#1E293B] border border-gray-700 text-white placeholder:text-gray-500 focus:border-violet-500 h-12 px-4 rounded-md"
                />
              </div>
              <button className="w-full h-12 bg-gradient-to-r from-violet-600 to-cyan-500 hover:opacity-90 transition-opacity rounded-md">
                Create Account
              </button>
              <p className="text-center text-sm text-gray-400">
                Already have an account?{" "}
                <button
                  className="text-violet-400 hover:text-violet-300 transition-colors"
                  onClick={() => {
                    setSignupOpen(false)
                    setLoginOpen(true)
                  }}
                >
                  Login
                </button>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
