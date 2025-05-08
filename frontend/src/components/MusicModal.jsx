import { useEffect } from "react";
import { X, Music } from "lucide-react";

export function MusicModal({ onClose }) {
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      <div className="relative bg-[#131A2B]/90 backdrop-blur-xl border border-gray-800 text-white rounded-xl w-full max-w-md p-6">
        <div className="text-right">
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="mb-6">
          <h2 className="text-xl text-white font-bold">Therapy Music</h2>
          <p className="text-gray-400">
            Calming sounds to enhance your mental wellness
          </p>
        </div>
        <div className="space-y-4">
          {[
            { title: "Calm Meditation", duration: "10:30" },
            { title: "Forest Ambience", duration: "15:45" },
            { title: "Ocean Waves", duration: "12:20" },
            { title: "Gentle Rain", duration: "20:15" },
          ].map((track, index) => (
            <div key={index} className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600/50 to-cyan-500/50 rounded-lg opacity-0 group-hover:opacity-100 transition duration-300 blur"></div>
              <div className="relative bg-[#1E293B] p-4 rounded-lg border border-gray-800 group-hover:border-gray-700 transition duration-300">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-violet-600/20 to-cyan-500/20 rounded-full flex items-center justify-center">
                      <Music className="h-5 w-5 text-violet-400" />
                    </div>
                    <div>
                      <h3 className="font-medium">{track.title}</h3>
                      <p className="text-sm text-gray-400">{track.duration}</p>
                    </div>
                  </div>
                  <button className="w-8 h-8 bg-gradient-to-r from-violet-600 to-cyan-500 rounded-full flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-4 h-4"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
