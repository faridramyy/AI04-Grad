import { useState, useEffect } from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import Footer from "../components/Footer";
import Navigation from "../components/Navigation";
import rina from '../images/marinaimg.jpg'
import fery from '../images/farid.jpg'
import bass from '../images/bassem.jpg'
import mouf from '../images/moufid.jpg'


export default function AboutUs() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const team = [
    {
      name: "Farid Ramy",
      role: "Team Leader",
      bio: "Leads the team with strategic vision and oversees all project components.",
      image: fery,
    },
    {
      name: "Marina",
      role: "Audio & Multimodal Specialist",
      bio: "Focuses on audio emotion models and integrates audio+text for real-time mental analysis.",
      image: rina,
    },
    {
      name: "Bassem",
      role: "EEG & Brainwave Analyst",
      bio: "Works with the SEED IV dataset and EEG signals to map emotional brain patterns.",
      image: bass,
    },
    {
      name: "Moufid",
      role: "Video & Music Therapy Developer",
      bio: "Builds video-based emotion systems and designs music therapy experiences.",
      image: mouf,
    }
  ];
  const milestones = [
    {
      year: 2024,
      title: "Project Kickoff",
      description:
        "The Emotional and Mental Support AI System project officially began in August 2024 with a shared vision among the team.",
    },
    {
      year: 2024,
      title: "System Architecture & Design",
      description:
        "Completed requirements gathering, initial design of system architecture, and planned multimodal emotion recognition workflows.",
    },
    {
      year: 2024,
      title: "Model Development",
      description:
        "Developed and integrated text, audio, and video emotion recognition modules using deep learning and transformer-based approaches.",
    },
    {
      year: 2025,
      title: "Prototype & Testing",
      description:
        "Assembled the full prototype including the AI therapist, stress management game, and music recommendation system for internal testing.",
    },
    {
      year: 2025,
      title: "Thesis Submission",
      description:
        "Finalized documentation, completed evaluation, and submitted the graduation thesis for the AI-powered mental health support platform.",
    },
    {
      year: 2025,
      title: "Future Vision",
      description:
        "Exploring real-world deployment, mobile integration, and collaborations with mental health professionals for broader impact.",
    }
  ];
  

  const values = [
    {
      title: "Accessibility",
      description:
        "Making mental healthcare available to everyone, regardless of location or resources.",
    },
    {
      title: "Scientific Rigor",
      description:
        "Grounding our approach in evidence-based practices and continuous research.",
    },
    {
      title: "Privacy First",
      description:
        "Maintaining the highest standards of data protection and client confidentiality.",
    },
    {
      title: "Human-Centered",
      description:
        "Designing technology that enhances human connection rather than replacing it.",
    },
  ];

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
      <Navigation />

      {/* Page Content */}
      <main className="relative pt-32 pb-20 z-10">
        {/* Hero Section */}
        <section className="container mx-auto px-4 mb-20">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-white/5 backdrop-blur-sm rounded-full border border-gray-800 mb-4">
              <p className="text-sm text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">
                Our Story
              </p>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Reimagining{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-cyan-400">
                Mental Healthcare
              </span>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              We're on a mission to make mental healthcare accessible,
              personalized, and effective for everyone through the power of AI.
            </p>
          </div>

          <div className="relative max-w-5xl mx-auto mb-20">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600/30 to-cyan-500/30 rounded-2xl blur-sm opacity-70"></div>
            <div className="relative bg-[#131A2B]/40 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-800">
              <img
                src="https://placehold.co/600x400"
                alt="MindfulAI Team"
                className="w-full h-auto"
              />
            </div>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-cyan-400">
                  Our Mission
                </h2>
                <p className="text-gray-300 mb-6">
                  At MindfulAI, we believe that everyone deserves access to
                  high-quality mental healthcare. Our mission is to leverage the
                  power of artificial intelligence to create personalized
                  therapeutic experiences that are accessible anytime, anywhere.
                </p>
                <p className="text-gray-300">
                  We're committed to breaking down barriers to mental
                  healthcare, whether they're financial, geographical, or
                  social. By combining cutting-edge AI technology with
                  evidence-based therapeutic approaches, we're creating a new
                  paradigm for mental wellness.
                </p>
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-cyan-400">
                  Our Vision
                </h2>
                <p className="text-gray-300 mb-6">
                  We envision a world where mental healthcare is as routine and
                  stigma-free as physical healthcare. A world where everyone has
                  a personal AI therapist in their pocket, ready to provide
                  support whenever and wherever they need it.
                </p>
                <p className="text-gray-300">
                  Our goal is not to replace human therapists, but to complement
                  and extend their reach. By handling routine therapeutic
                  interactions, MindfulAI frees human therapists to focus on
                  complex cases and deeper human connections.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="container mx-auto px-4 mb-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-cyan-400">
              Our Core Values
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              The principles that guide everything we do at MindfulAI
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {values.map((value, index) => (
              <div key={index} className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600/50 to-cyan-500/50 rounded-xl opacity-0 group-hover:opacity-100 transition duration-300 blur"></div>
                <div className="relative h-full bg-[#131A2B]/40 backdrop-blur-sm p-8 rounded-lg border border-gray-800 group-hover:border-gray-700 transition duration-300">
                  <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mb-6">
                    <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">
                      {index + 1}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-4">
                    {value.title}
                  </h3>
                  <p className="text-gray-400">{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Team Section */}
        <section className="container mx-auto px-4 mb-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-cyan-400">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              The passionate experts behind MindfulAI's innovation
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {team.map((member, index) => (
              <div key={index} className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600/50 to-cyan-500/50 rounded-xl opacity-0 group-hover:opacity-100 transition duration-300 blur"></div>
                <div className="relative bg-[#131A2B]/40 backdrop-blur-sm rounded-lg overflow-hidden border border-gray-800 group-hover:border-gray-700 transition duration-300">
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={member.image || "https://placehold.co/600x400"}
                      alt={member.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-white mb-1">
                      {member.name}
                    </h3>
                    <p className="text-violet-400 mb-4">{member.role}</p>
                    <p className="text-gray-400">{member.bio}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Timeline Section */}
        <section className="container mx-auto px-4 mb-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-cyan-400">
              Our Journey
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              The key milestones that have shaped MindfulAI
            </p>
          </div>

          <div className="max-w-4xl mx-auto relative">
            {/* Timeline line */}
            <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-violet-600/50 via-cyan-500/50 to-violet-600/50 transform md:translate-x-[-0.5px]"></div>

            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div
                  key={index}
                  className={`relative flex flex-col md:flex-row gap-8 ${
                    index % 2 === 0 ? "md:flex-row-reverse" : ""
                  }`}
                >
                  <div className="md:w-1/2"></div>
                  <div className="absolute left-0 md:left-1/2 top-0 w-8 h-8 bg-[#131A2B] border-2 border-violet-500 rounded-full transform translate-x-[-14px] md:translate-x-[-16px]">
                    <div className="absolute inset-1 bg-gradient-to-r from-violet-500 to-cyan-500 rounded-full"></div>
                  </div>
                  <div className="md:w-1/2 relative group pl-12 md:pl-0 md:px-8">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600/30 to-cyan-500/30 rounded-xl opacity-0 group-hover:opacity-100 transition duration-300 blur"></div>
                    <div className="relative bg-[#131A2B]/40 backdrop-blur-sm p-6 rounded-lg border border-gray-800 group-hover:border-gray-700 transition duration-300">
                      <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400 mb-2">
                        {milestone.year}
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-3">
                        {milestone.title}
                      </h3>
                      <p className="text-gray-400">{milestone.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="container mx-auto px-4">
          <div className="relative max-w-5xl mx-auto">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600/30 to-cyan-500/30 rounded-2xl blur-sm opacity-70"></div>
            <div className="relative bg-[#131A2B]/60 backdrop-blur-sm p-10 md:p-16 rounded-xl border border-gray-800">
              <div className="grid md:grid-cols-2 gap-12">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-6">
                    Get In{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-cyan-400">
                      Touch
                    </span>
                  </h2>
                  <p className="text-gray-300 mb-8">
                    Have questions about MindfulAI? We'd love to hear from you.
                    Reach out to our team using any of the methods below.
                  </p>
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="bg-white/5 p-3 rounded-full">
                        <Mail className="h-6 w-6 text-violet-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-1">
                          Email Us
                        </h3>
                        <p className="text-gray-400">hello@mindfulai.com</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="bg-white/5 p-3 rounded-full">
                        <Phone className="h-6 w-6 text-violet-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-1">
                          Call Us
                        </h3>
                        <p className="text-gray-400">+1 (555) 123-4567</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="bg-white/5 p-3 rounded-full">
                        <MapPin className="h-6 w-6 text-violet-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-1">
                          Visit Us
                        </h3>
                        <p className="text-gray-400">
                          123 Innovation Way
                          <br />
                          San Francisco, CA 94107
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <form className="space-y-6">
                    <div>
                      <input
                        placeholder="Your Name"
                        className="w-full bg-[#1E293B] border border-gray-700 text-white placeholder:text-gray-500 focus:border-violet-500 h-12 px-4 rounded-md"
                      />
                    </div>
                    <div>
                      <input
                        type="email"
                        placeholder="Your Email"
                        className="w-full bg-[#1E293B] border border-gray-700 text-white placeholder:text-gray-500 focus:border-violet-500 h-12 px-4 rounded-md"
                      />
                    </div>
                    <div>
                      <input
                        placeholder="Subject"
                        className="w-full bg-[#1E293B] border border-gray-700 text-white placeholder:text-gray-500 focus:border-violet-500 h-12 px-4 rounded-md"
                      />
                    </div>
                    <div>
                      <textarea
                        placeholder="Your Message"
                        rows={5}
                        className="w-full bg-[#1E293B] border border-gray-700 text-white placeholder:text-gray-500 focus:border-violet-500 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-violet-500"
                      ></textarea>
                    </div>
                    <button className="w-full h-12 bg-gradient-to-r from-violet-600 to-cyan-500 hover:opacity-90 transition-opacity rounded-md">
                      Send Message
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
