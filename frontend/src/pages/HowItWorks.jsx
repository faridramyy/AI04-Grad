import { useState, useEffect } from "react"
import { Brain, Menu, X, MessageSquare, Sparkles, Shield, Zap, Clock, BarChart, ArrowRight } from "lucide-react"
import { Link } from "react-router-dom";

export default function HowItWorks() {
  const [loginOpen, setLoginOpen] = useState(false)
  const [signupOpen, setSignupOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeStep, setActiveStep] = useState(1)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const steps = [
    {
      number: 1,
      title: "Sign Up",
      description: "Create your account in less than a minute. No credit card required for the free trial.",
      icon: <MessageSquare className="h-6 w-6 text-violet-400" />,
    },
    {
      number: 2,
      title: "Complete Assessment",
      description: "Answer a few questions to help our AI understand your needs and personalize your experience.",
      icon: <BarChart className="h-6 w-6 text-violet-400" />,
    },
    {
      number: 3,
      title: "Meet Your AI Therapist",
      description: "Get introduced to your personalized AI therapist, designed to match your communication style.",
      icon: <Brain className="h-6 w-6 text-violet-400" />,
    },
    {
      number: 4,
      title: "Start Conversations",
      description: "Begin your therapy sessions anytime, anywhere. Text or voice, whatever feels comfortable.",
      icon: <MessageSquare className="h-6 w-6 text-violet-400" />,
    },
    {
      number: 5,
      title: "Track Progress",
      description: "Monitor your mental wellness journey with insights, patterns, and personalized recommendations.",
      icon: <BarChart className="h-6 w-6 text-violet-400" />,
    },
  ]

  const features = [
    {
      title: "AI-Powered Conversations",
      description:
        "Our advanced natural language processing understands context, emotions, and nuance to provide meaningful responses.",
      icon: <Sparkles className="h-6 w-6 text-violet-400" />,
    },
    {
      title: "Complete Privacy",
      description:
        "End-to-end encryption ensures your conversations remain confidential. Your data is never sold or shared.",
      icon: <Shield className="h-6 w-6 text-violet-400" />,
    },
    {
      title: "24/7 Availability",
      description: "Access therapeutic support whenever you need it, day or night, without scheduling appointments.",
      icon: <Clock className="h-6 w-6 text-violet-400" />,
    },
    {
      title: "Personalized Approach",
      description:
        "Our AI adapts to your unique needs, creating a customized therapy experience that evolves with you.",
      icon: <Zap className="h-6 w-6 text-violet-400" />,
    },
  ]

  const faqs = [
    {
      question: "Is AI therapy as effective as traditional therapy?",
      answer:
        "AI therapy can be highly effective for many issues, particularly for ongoing support and skill-building. Research shows it's especially helpful for anxiety, stress management, and mild to moderate depression. For severe conditions, we recommend using MindfulAI as a complement to traditional therapy.",
    },
    {
      question: "How does the AI know what to say?",
      answer:
        "Our AI is trained on evidence-based therapeutic approaches including CBT, ACT, and mindfulness practices. It analyzes your conversations to understand your needs and responds with appropriate therapeutic techniques. The more you interact, the better it becomes at personalizing responses to your specific situation.",
    },
    {
      question: "Is my information really private?",
      answer:
        "Absolutely. We use end-to-end encryption for all conversations, and your personal data is never sold or shared with third parties. You can delete your data at any time, and we comply with all major privacy regulations including HIPAA, GDPR, and CCPA.",
    },
    {
      question: "Can I switch between text and voice conversations?",
      answer:
        "Yes, you can seamlessly switch between text and voice interactions based on your preference. Some users find voice more natural for expressing emotions, while others prefer text for privacy or convenience.",
    },
  ]

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
            <a href="/" className="flex items-center gap-2">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-cyan-500 rounded-full blur-sm"></div>
                <div className="relative bg-[#0F172A] p-2 rounded-full">
                  <Brain className="h-6 w-6 text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-cyan-500" />
                </div>
              </div>
              <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-cyan-500">
                MindfulAI
              </h1>
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              className="text-gray-300 hover:text-white hover:bg-white/10 px-4 py-2 rounded-md"
              to="/how-it-works"
            >
              How It Works
            </Link>
            <Link
              className="text-gray-300 hover:text-white hover:bg-white/10 px-4 py-2 rounded-md"
              to="/about-us"
            >
              About Us
            </Link>
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
              <a
                href="/"
                className="text-xl text-gray-300 hover:text-white hover:bg-white/10 px-6 py-3 rounded-md transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </a>
              <a
                href="/how-it-works"
                className="text-xl text-white bg-white/10 px-6 py-3 rounded-md transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                How It Works
              </a>
              <a
                href="/pricing"
                className="text-xl text-gray-300 hover:text-white hover:bg-white/10 px-6 py-3 rounded-md transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Pricing
              </a>
              <a
                href="/about"
                className="text-xl text-gray-300 hover:text-white hover:bg-white/10 px-6 py-3 rounded-md transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                About Us
              </a>
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

      {/* Page Content */}
      <main className="relative pt-32 pb-20 z-10">
        {/* Hero Section */}
        <section className="container mx-auto px-4 mb-20">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-white/5 backdrop-blur-sm rounded-full border border-gray-800 mb-4">
              <p className="text-sm text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">
                Your AI Therapy Journey
              </p>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              How{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-cyan-400">
                MindfulAI
              </span>{" "}
              Works
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Experience the future of mental wellness with our AI-powered therapy platform. Here's how we help you on
              your journey.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto mb-20">
            <div className="relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600 to-cyan-500 rounded-2xl blur-sm opacity-75"></div>
              <div className="relative bg-[#131A2B]/40 backdrop-blur-sm p-1 rounded-2xl border border-gray-800">
                <img src="https://placehold.co/600x400" alt="AI Therapy Conversation" className="rounded-xl w-full" />
              </div>
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-cyan-400">
                AI-Powered Therapy, Reimagined
              </h2>
              <p className="text-gray-300 mb-6">
                MindfulAI combines advanced artificial intelligence with evidence-based therapeutic approaches to
                provide personalized mental wellness support. Our platform learns from your interactions to deliver
                increasingly tailored guidance and insights.
              </p>
              <p className="text-gray-300 mb-8">
                Unlike traditional therapy, MindfulAI is available 24/7, completely private, and adapts to your unique
                needs and communication style. It's therapy that fits into your life, not the other way around.
              </p>
              <button
                onClick={() => setSignupOpen(true)}
                className="h-12 px-6 bg-gradient-to-r from-violet-600 to-cyan-500 hover:opacity-90 transition-opacity rounded-md flex items-center"
              >
                Start Your Journey
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
            </div>
          </div>
        </section>

        {/* Process Steps Section */}
        <section className="container mx-auto px-4 mb-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-cyan-400">
              Your Therapy Journey
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Getting started with MindfulAI is simple. Here's what to expect.
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="relative">
              {/* Progress line */}
              <div className="absolute left-[28px] md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-violet-600/50 via-cyan-500/50 to-violet-600/50 transform md:translate-x-[-0.5px] hidden md:block"></div>

              {steps.map((step, index) => (
                <div
                  key={index}
                  className={`relative mb-12 md:mb-24 ${index % 2 === 0 ? "md:flex-row-reverse" : ""}`}
                  onMouseEnter={() => setActiveStep(step.number)}
                >
                  <div className="flex flex-col md:flex-row items-start gap-6">
                    <div
                      className={`flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center z-10 transition-all duration-300 ${
                        activeStep === step.number
                          ? "bg-gradient-to-r from-violet-600 to-cyan-500"
                          : "bg-[#1E293B] border border-gray-700"
                      }`}
                    >
                      <span className="text-xl font-bold">{step.number}</span>
                    </div>
                    <div className="relative group flex-grow">
                      <div
                        className={`absolute -inset-0.5 bg-gradient-to-r from-violet-600/30 to-cyan-500/30 rounded-xl ${
                          activeStep === step.number ? "opacity-100" : "opacity-0"
                        } group-hover:opacity-100 transition duration-300 blur`}
                      ></div>
                      <div className="relative bg-[#131A2B]/40 backdrop-blur-sm p-6 rounded-lg border border-gray-800 group-hover:border-gray-700 transition duration-300">
                        <h3 className="text-xl font-semibold text-white mb-3">{step.title}</h3>
                        <p className="text-gray-400">{step.description}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-4 mb-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-cyan-400">
              Key Features
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              What makes MindfulAI different from other mental wellness solutions
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {features.map((feature, index) => (
              <div key={index} className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600/50 to-cyan-500/50 rounded-xl opacity-0 group-hover:opacity-100 transition duration-300 blur"></div>
                <div className="relative h-full bg-[#131A2B]/40 backdrop-blur-sm p-8 rounded-lg border border-gray-800 group-hover:border-gray-700 transition duration-300">
                  <div className="bg-white/5 p-3 rounded-full w-fit mb-6">{feature.icon}</div>
                  <h3 className="text-xl font-semibold text-white mb-4">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Technology Section */}
        <section className="container mx-auto px-4 mb-20">
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-cyan-400">
                The Technology Behind MindfulAI
              </h2>
              <p className="text-gray-300 mb-6">
                Our platform is built on advanced natural language processing and machine learning algorithms that
                understand the nuances of human communication and emotional expression.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <div className="mt-1 text-cyan-400">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 flex items-center justify-center">
                      <span className="text-xs">✓</span>
                    </div>
                  </div>
                  <p className="text-gray-300">
                    <span className="font-semibold text-white">Natural Language Understanding</span> - Comprehends
                    context, emotions, and intent in your messages
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 text-cyan-400">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 flex items-center justify-center">
                      <span className="text-xs">✓</span>
                    </div>
                  </div>
                  <p className="text-gray-300">
                    <span className="font-semibold text-white">Adaptive Learning</span> - Personalizes responses based
                    on your history and preferences
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 text-cyan-400">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 flex items-center justify-center">
                      <span className="text-xs">✓</span>
                    </div>
                  </div>
                  <p className="text-gray-300">
                    <span className="font-semibold text-white">Evidence-Based Approaches</span> - Incorporates CBT, ACT,
                    mindfulness, and other proven techniques
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 text-cyan-400">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 flex items-center justify-center">
                      <span className="text-xs">✓</span>
                    </div>
                  </div>
                  <p className="text-gray-300">
                    <span className="font-semibold text-white">Pattern Recognition</span> - Identifies trends in your
                    mental wellness to provide actionable insights
                  </p>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600 to-cyan-500 rounded-2xl blur-sm opacity-75"></div>
              <div className="relative bg-[#131A2B]/40 backdrop-blur-sm p-1 rounded-2xl border border-gray-800">
                <img
                  src="https://placehold.co/600x400"
                  alt="AI Technology Visualization"
                  className="rounded-xl w-full"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Demo Section */}
        <section className="container mx-auto px-4 mb-20">
          <div className="relative max-w-5xl mx-auto">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600/30 to-cyan-500/30 rounded-2xl blur-sm opacity-70"></div>
            <div className="relative bg-[#131A2B]/60 backdrop-blur-sm p-10 md:p-12 rounded-xl border border-gray-800">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold mb-6">See MindfulAI in Action</h2>
                  <p className="text-gray-300 mb-8">
                    Experience a sample conversation with our AI therapist to see how it works. This demo showcases the
                    natural, empathetic interactions you can expect.
                  </p>
                  <button
                    onClick={() => setSignupOpen(true)}
                    className="h-12 px-6 bg-gradient-to-r from-violet-600 to-cyan-500 hover:opacity-90 transition-opacity rounded-md"
                  >
                    Try It Yourself
                  </button>
                </div>
                <div className="bg-[#0F172A] rounded-lg p-4 border border-gray-800">
                  <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-800">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 flex items-center justify-center">
                      <Brain className="h-4 w-4 text-white" />
                    </div>
                    <div className="font-medium">MindfulAI Assistant</div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-700 flex-shrink-0"></div>
                      <div className="bg-[#1E293B] p-3 rounded-lg rounded-tl-none max-w-[80%]">
                        <p className="text-gray-300">I've been feeling really anxious about work lately.</p>
                      </div>
                    </div>
                    <div className="flex gap-3 justify-end">
                      <div className="bg-gradient-to-r from-violet-600/20 to-cyan-500/20 p-3 rounded-lg rounded-tr-none max-w-[80%]">
                        <p className="text-white">
                          I understand that work anxiety can be challenging. Could you tell me more about what specific
                          situations are triggering this feeling?
                        </p>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 flex-shrink-0 flex items-center justify-center">
                        <Brain className="h-4 w-4 text-white" />
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-700 flex-shrink-0"></div>
                      <div className="bg-[#1E293B] p-3 rounded-lg rounded-tl-none max-w-[80%]">
                        <p className="text-gray-300">
                          Mostly deadlines and presentations. I feel like I can't keep up sometimes.
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3 justify-end">
                      <div className="bg-gradient-to-r from-violet-600/20 to-cyan-500/20 p-3 rounded-lg rounded-tr-none max-w-[80%]">
                        <p className="text-white">
                          That's a common experience. Let's explore some strategies to manage these pressures. Have you
                          tried breaking down your tasks into smaller steps?
                        </p>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 flex-shrink-0 flex items-center justify-center">
                        <Brain className="h-4 w-4 text-white" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="container mx-auto px-4 mb-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-cyan-400">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">Common questions about our AI therapy approach</p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="grid gap-6">
              {faqs.map((faq, index) => (
                <div key={index} className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600/50 to-cyan-500/50 rounded-xl opacity-0 group-hover:opacity-100 transition duration-300 blur"></div>
                  <div className="relative bg-[#131A2B]/40 backdrop-blur-sm p-6 rounded-lg border border-gray-800 group-hover:border-gray-700 transition duration-300">
                    <h3 className="text-xl font-semibold text-white mb-3">{faq.question}</h3>
                    <p className="text-gray-400">{faq.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4">
          <div className="relative max-w-4xl mx-auto text-center">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600/30 to-cyan-500/30 rounded-2xl blur-xl opacity-70"></div>
            <div className="relative bg-[#131A2B]/60 backdrop-blur-sm p-10 md:p-16 rounded-xl border border-gray-800">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Start Your{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-cyan-400">
                  Healing Journey
                </span>{" "}
                Today
              </h2>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Experience the future of mental wellness with MindfulAI. Begin your personalized therapy journey with
                our 7-day free trial.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  className="h-14 px-8 bg-gradient-to-r from-violet-600 to-cyan-500 hover:opacity-90 transition-opacity text-lg rounded-md"
                  onClick={() => setSignupOpen(true)}
                >
                  Start Free Trial
                </button>
                <a
                  href="/pricing"
                  className="h-14 px-8 border border-gray-700 text-gray-300 hover:text-white hover:bg-white/10 hover:border-gray-600 text-lg rounded-md flex items-center justify-center"
                >
                  View Pricing
                </a>
              </div>
              <p className="mt-6 text-gray-400">No credit card required. 7-day free trial.</p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative py-16 border-t border-gray-800 z-10">
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
                  <a href="/about" className="text-gray-400 hover:text-white transition-colors">
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
