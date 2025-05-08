// components/Footer.jsx
import { Brain } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative py-16 border-t border-gray-800">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-10">
          {/* Logo Section */}
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
            <p className="text-gray-400 mb-6">
              AI-powered therapy for a healthier mind and happier life.
            </p>
          </div>

          {/* Links */}
          {[
            {
              title: "Company",
              items: ["About Us", "Our Team", "Careers", "Contact"],
            },
            {
              title: "Resources",
              items: ["Blog", "Research", "Mental Health Tips", "FAQ"],
            },
            {
              title: "Legal",
              items: [
                "Privacy Policy",
                "Terms of Service",
                "Cookie Policy",
                "HIPAA Compliance",
              ],
            },
          ].map((section, index) => (
            <div key={index}>
              <h4 className="font-semibold text-white mb-6">{section.title}</h4>
              <ul className="space-y-4">
                {section.items.map((item, idx) => (
                  <li key={idx}>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500">
          <p>
            © {new Date().getFullYear()} MindfulAI Therapy. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
