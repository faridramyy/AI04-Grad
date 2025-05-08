import { useChat } from "../hooks/useChat";
import { GameModal } from "./GameModal";
import { MusicModal } from "./MusicModal";
import { useRef, useState, useEffect } from "react";
import {
  Mic,
  Video,
  Send,
  X,
  ZoomIn,
  ZoomOut,
  Gamepad2,
  Music,
  Camera,
} from "lucide-react";

export const UI = ({ hidden, ...props }) => {
  const input = useRef();
  const videoPreviewRef = useRef(null);
  const {
    chatText,
    chatAudio,
    chatVideo,
    loading,
    cameraZoomed,
    setCameraZoomed,
    message,
    isRecording,
    startRecording,
    stopRecording,
    isVideoRecording,
    startVideoRecording,
    stopVideoRecording,
  } = useChat();

  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef(null);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [videoStream, setVideoStream] = useState(null);

  const [isGameOpen, setIsGameOpen] = useState(false);
  const [isMusicOpen, setIsMusicOpen] = useState(false);
  const [showGreenScreen, setShowGreenScreen] = useState(false);

  // Format seconds into MM:SS display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  // Timer effect for recording duration (both audio and video)
  useEffect(() => {
    let interval;

    if (isRecording || isVideoRecording) {
      setRecordingTime(0);

      interval = setInterval(() => {
        setRecordingTime((prevTime) => prevTime + 1);
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isRecording, isVideoRecording]);

  // Effect to handle video stream
  useEffect(() => {
    if (videoStream && videoPreviewRef.current) {
      videoPreviewRef.current.srcObject = videoStream;
    }

    // Cleanup
    return () => {
      if (videoStream) {
        videoStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [videoStream]);

  const inputsDisabled = loading || message;

  const sendMessage = () => {
    const text = input.current.value;
    if (text.trim() === "") {
      alert("Message can't be empty");
      return;
    }
    if (!inputsDisabled && text.trim()) {
      chatText(text);
      input.current.value = "";
    }
  };

  const toggleRecording = async () => {
    if (inputsDisabled) return;

    if (isRecording) {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
      }
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        const localAudioChunks = [];

        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            localAudioChunks.push(event.data);
          }
        };

        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(localAudioChunks, { type: "audio/webm" });
          handleAudioMessage(audioBlob);

          stream.getTracks().forEach((track) => track.stop());
          stopRecording();
        };

        mediaRecorder.start();
        startRecording();
      } catch (error) {
        console.error("Error accessing microphone:", error);
        alert(
          "Could not access microphone. Please ensure you've granted permission."
        );
      }
    }
  };

  const handleAudioMessage = (audioBlob) => {
    if (!inputsDisabled) {
      chatAudio(audioBlob, recordingTime);
    }
  };

  const openVideoRecorder = async () => {
    if (inputsDisabled) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      setVideoStream(stream);
      setShowVideoModal(true);
    } catch (error) {
      console.error("Error accessing camera:", error);
      alert(
        "Could not access camera. Please ensure you've granted permission."
      );
    }
  };

  const startVideoRecordingHandler = () => {
    if (!videoStream) return;

    const videoChunks = [];
    const mediaRecorder = new MediaRecorder(videoStream);
    mediaRecorderRef.current = mediaRecorder;

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        videoChunks.push(event.data);
      }
    };

    mediaRecorder.onstop = () => {
      const videoBlob = new Blob(videoChunks, { type: "video/webm" });
      handleVideoMessage(videoBlob);
      stopVideoRecording();
    };

    mediaRecorder.start();
    startVideoRecording();
  };

  const stopVideoRecordingHandler = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
  };

  const handleVideoMessage = (videoBlob) => {
    if (!inputsDisabled) {
      chatVideo(videoBlob, recordingTime);
      closeVideoModal();
    }
  };

  const closeVideoModal = () => {
    if (isVideoRecording && mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }

    if (videoStream) {
      videoStream.getTracks().forEach((track) => track.stop());
      setVideoStream(null);
    }

    setShowVideoModal(false);
    stopVideoRecording();
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-white">
      {/* Background elements */}
      <div className="fixed inset-0 z-0">
        <div
          className={`absolute top-0 left-0 w-full h-full ${
            showGreenScreen ? "bg-[#00FF00]" : "bg-[#0F172A]"
          }`}
        ></div>
        {!showGreenScreen && (
          <>
            <div className="absolute top-0 left-0 w-full h-full opacity-30 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxwYXRoIGQ9Ik0gNDAgMCBMIDAgMCAwIDQwIiBmaWxsPSJub25lIiBzdHJva2U9IiMxRTI5M0IiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')]"></div>
            <div className="absolute top-[-50%] left-[-10%] w-[70%] h-[100%] rounded-full bg-gradient-to-r from-violet-600/20 to-indigo-600/20 blur-[120px]"></div>
            <div className="absolute bottom-[-50%] right-[-10%] w-[70%] h-[100%] rounded-full bg-gradient-to-l from-cyan-500/20 to-teal-500/20 blur-[120px]"></div>
          </>
        )}
      </div>

      {/* Main Chat Interface */}
      <div className="fixed top-0 left-0 right-0 bottom-0 z-10 flex justify-between p-4 flex-col">
        {/* Top Section */}
        <div className="self-start backdrop-blur-md bg-[#131A2B]/60 p-4 rounded-lg border border-gray-800"></div>

        {/* Middle Buttons */}
        <div className="w-full flex flex-col items-end justify-center gap-4">
          <button
            onClick={() => setCameraZoomed(!cameraZoomed)}
            className="bg-gradient-to-r from-violet-600 to-cyan-500 hover:opacity-90 transition-opacity text-white p-4 rounded-full shadow-lg"
          >
            {cameraZoomed ? (
              <ZoomOut className="w-6 h-6" />
            ) : (
              <ZoomIn className="w-6 h-6" />
            )}
          </button>

          <button
            onClick={() => setShowGreenScreen(!showGreenScreen)}
            className="bg-gradient-to-r from-violet-600 to-cyan-500 hover:opacity-90 transition-opacity text-white p-4 rounded-full shadow-lg"
          >
            <Camera className="w-6 h-6" />
          </button>

          <button
            onClick={() => setIsGameOpen(true)}
            className="bg-gradient-to-r from-violet-600 to-cyan-500 hover:opacity-90 transition-opacity text-white p-4 rounded-full shadow-lg"
          >
            <Gamepad2 className="w-6 h-6" />
          </button>

          <button
            onClick={() => setIsMusicOpen(true)}
            className="bg-gradient-to-r from-violet-600 to-cyan-500 hover:opacity-90 transition-opacity text-white p-4 rounded-full shadow-lg"
          >
            <Music className="w-6 h-6" />
          </button>
        </div>

        {/* Bottom Input and Controls */}
        <div className="flex items-center gap-2 max-w-screen-sm w-full mx-auto">
          <div className="flex items-center w-full relative">
            {isRecording ? (
              <div className="w-full flex items-center justify-between bg-[#131A2B]/80 backdrop-blur-md rounded-md p-4 border border-gray-800">
                <div className="flex items-center">
                  <div className="animate-pulse mr-2">
                    <div className="w-3 h-3 rounded-full bg-gradient-to-r from-violet-600 to-cyan-500"></div>
                  </div>
                  <span className="font-medium">Recording Audio</span>
                </div>
                <div className="font-mono text-lg font-bold mr-20">
                  {formatTime(recordingTime)}
                </div>
              </div>
            ) : (
              <input
                className="w-full placeholder:text-gray-500 pr-24 p-4 rounded-md bg-[#131A2B]/80 backdrop-blur-md border border-gray-800 focus:border-violet-500 focus:outline-none"
                placeholder="Type a message..."
                ref={input}
                disabled={inputsDisabled}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    sendMessage();
                  }
                }}
              />
            )}

            {/* Audio Recording Button */}
            <button
              onClick={toggleRecording}
              disabled={inputsDisabled || isVideoRecording}
              className={`absolute right-14 ${
                isRecording
                  ? "bg-gradient-to-r from-red-600 to-red-500"
                  : "bg-gradient-to-r from-violet-600 to-cyan-500 hover:opacity-90"
              } ${
                inputsDisabled || isVideoRecording
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              } text-white p-2 rounded-full transition-all duration-300`}
            >
              {isRecording ? (
                <X className="w-5 h-5" />
              ) : (
                <Mic className="w-5 h-5" />
              )}
            </button>

            {/* Video Recording Button */}
            <button
              onClick={openVideoRecorder}
              disabled={inputsDisabled || isRecording}
              className={`absolute right-3 ${
                inputsDisabled || isRecording
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              } bg-gradient-to-r from-violet-600 to-cyan-500 hover:opacity-90 text-white p-2 rounded-full transition-opacity`}
            >
              <Video className="w-5 h-5" />
            </button>
          </div>

          <button
            disabled={inputsDisabled || isRecording || isVideoRecording}
            onClick={sendMessage}
            className={`bg-gradient-to-r from-violet-600 to-cyan-500 hover:opacity-90 transition-opacity text-white p-4 px-10 font-semibold rounded-md flex items-center justify-center ${
              inputsDisabled || isRecording || isVideoRecording
                ? "cursor-not-allowed opacity-50"
                : ""
            }`}
          >
            <Send className="w-5 h-5 mr-2" />
            Send
          </button>
        </div>
      </div>

      {/* Video Modal */}
      {showVideoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeVideoModal}
          ></div>
          <div className="relative bg-[#131A2B]/90 backdrop-blur-xl border border-gray-800 text-white rounded-xl w-full max-w-md p-6">
            <div className="text-right">
              <button
                onClick={closeVideoModal}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mb-6">
              <h2 className="text-xl text-white font-bold">Video Message</h2>
              <p className="text-gray-400">
                Record a video message for your therapy session
              </p>
            </div>

            <div className="relative bg-black rounded-lg overflow-hidden aspect-video mb-6">
              <video
                ref={videoPreviewRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover"
              ></video>

              {isVideoRecording && (
                <div className="absolute top-2 left-2 flex items-center bg-black/60 text-white px-2 py-1 rounded-lg">
                  <div className="animate-pulse mr-2">
                    <div className="w-3 h-3 rounded-full bg-gradient-to-r from-violet-600 to-cyan-500"></div>
                  </div>
                  <span className="font-medium text-sm">
                    {formatTime(recordingTime)}
                  </span>
                </div>
              )}
            </div>

            <div className="flex justify-center">
              {!isVideoRecording ? (
                <button
                  onClick={startVideoRecordingHandler}
                  className="bg-gradient-to-r from-violet-600 to-cyan-500 hover:opacity-90 transition-opacity text-white font-medium py-2 px-4 rounded-lg flex items-center"
                >
                  <div className="w-5 h-5 mr-2 rounded-full bg-red-500"></div>
                  Start Recording
                </button>
              ) : (
                <button
                  onClick={stopVideoRecordingHandler}
                  className="bg-gradient-to-r from-red-600 to-red-500 hover:opacity-90 transition-opacity text-white font-medium py-2 px-4 rounded-lg flex items-center"
                >
                  <X className="w-5 h-5 mr-2" />
                  Stop Recording
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Game Modal */}
      {isGameOpen && <GameModal onClose={() => setIsGameOpen(false)} />}

      {/* Music Modal */}
      {isMusicOpen && <MusicModal onClose={() => setIsMusicOpen(false)} />}
    </div>
  );
};
