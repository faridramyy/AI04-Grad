import { useRef, useState, useEffect } from "react";
import { useChat } from "../hooks/useChat";

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

  if (hidden) return null;

  return (
    <>
      <div className="fixed top-0 left-0 right-0 bottom-0 z-10 flex justify-between p-4 flex-col pointer-events-none">
        {/* Top Section */}
        <div className="self-start backdrop-blur-md bg-white bg-opacity-50 p-4 rounded-lg">
          {/* <h1 className="font-black text-xl">My Virtual GF</h1>
          <p>I will always love you ❤️</p> */}
        </div>

        {/* Middle Buttons */}
        <div className="w-full flex flex-col items-end justify-center gap-4">
          <button
            onClick={() => setCameraZoomed(!cameraZoomed)}
            className="pointer-events-auto bg-pink-500 hover:bg-pink-600 text-white p-4 rounded-md"
          >
            {cameraZoomed ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM13.5 10.5h-6"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6"
                />
              </svg>
            )}
          </button>

          <button
            onClick={() => {
              const body = document.querySelector("body");
              if (body.classList.contains("greenScreen")) {
                body.classList.remove("greenScreen");
              } else {
                body.classList.add("greenScreen");
              }
            }}
            className="pointer-events-auto bg-pink-500 hover:bg-pink-600 text-white p-4 rounded-md"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z"
              />
            </svg>
          </button>
      
      
        </div>

        {/* Bottom Input and Controls */}
        <div className="flex items-center gap-2 pointer-events-auto max-w-screen-sm w-full mx-auto">
          <div className="flex items-center w-full relative">
            {isRecording ? (
              <div className="w-full flex items-center justify-between bg-opacity-50 bg-white backdrop-blur-md rounded-md p-4">
                <div className="flex items-center">
                  <div className="animate-pulse mr-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-5 h-5 text-red-500"
                    >
                      <circle cx="12" cy="12" r="8" />
                    </svg>
                  </div>
                  <span className="font-medium">Recording Audio</span>
                </div>
                <div className="font-mono text-lg font-bold mr-20">
                  {formatTime(recordingTime)}
                </div>
              </div>
            ) : (
              <input
                className="w-full placeholder:text-gray-800 placeholder:italic pr-24 p-4 rounded-md bg-opacity-50 bg-white backdrop-blur-md"
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
                isRecording ? "bg-red-500" : "bg-pink-500 hover:bg-pink-600"
              } ${
                inputsDisabled || isVideoRecording
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              } text-white p-2 rounded-full`}
            >
              {isRecording ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5.25 7.5A2.25 2.25 0 017.5 5.25h9a2.25 2.25 0 012.25 2.25v9a2.25 2.25 0 01-2.25 2.25h-9a2.25 2.25 0 01-2.25-2.25v-9z"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z"
                  />
                </svg>
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
              } bg-pink-500 hover:bg-pink-600 text-white p-2 rounded-full`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M12 18.75H4.5a2.25 2.25 0 01-2.25-2.25V9a2.25 2.25 0 012.25-2.25H12a2.25 2.25 0 012.25 2.25v9a2.25 2.25 0 01-2.25 2.25z"
                />
              </svg>
            </button>
          </div>

          <button
            disabled={inputsDisabled || isRecording || isVideoRecording}
            onClick={sendMessage}
            className={`bg-pink-500 hover:bg-pink-600 text-white p-4 px-10 font-semibold uppercase rounded-md flex items-center justify-center ${
              inputsDisabled || isRecording || isVideoRecording
                ? "cursor-not-allowed opacity-30"
                : ""
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5 mr-2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
              />
            </svg>
            Send
          </button>
        </div>
      </div>

      {/* Video Recording Modal */}
      {showVideoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 pointer-events-auto">
          <div className="bg-white rounded-lg p-4 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Video Message</h3>
              <button
                onClick={closeVideoModal}
                className="p-1 rounded-full hover:bg-gray-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="relative bg-black rounded-lg overflow-hidden aspect-video mb-4">
              <video
                ref={videoPreviewRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover"
              ></video>

              {isVideoRecording && (
                <div className="absolute top-2 left-2 flex items-center bg-black bg-opacity-60 text-white px-2 py-1 rounded-lg">
                  <div className="animate-pulse mr-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-4 h-4 text-red-500"
                    >
                      <circle cx="12" cy="12" r="8" />
                    </svg>
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
                  className="bg-pink-500 hover:bg-pink-600 text-white font-medium py-2 px-4 rounded-lg flex items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5 mr-2"
                  >
                    <circle cx="12" cy="12" r="8" fill="currentColor" />
                  </svg>
                  Start Recording
                </button>
              ) : (
                <button
                  onClick={stopVideoRecordingHandler}
                  className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg flex items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5 mr-2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5.25 7.5A2.25 2.25 0 017.5 5.25h9a2.25 2.25 0 012.25 2.25v9a2.25 2.25 0 01-2.25 2.25h-9a2.25 2.25 0 01-2.25-2.25v-9z"
                    />
                  </svg>
                  Stop Recording
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
