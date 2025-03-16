import { useState, useRef, useEffect } from "react";
// import { ReactMic } from "react-mic";
import { useChat } from "../hooks/useChat";

export const UI = ({ hidden, ...props }) => {
  const [recording, setRecording] = useState(false);
  const [micAvailable, setMicAvailable] = useState(null);
  const input = useRef();
  const { chat, loading, cameraZoomed, setCameraZoomed, message } = useChat();

  useEffect(() => {
    navigator.mediaDevices
      .enumerateDevices()
      .then((devices) => {
        const hasMicrophone = devices.some(
          (device) => device.kind === "audioinput"
        );
        setMicAvailable(hasMicrophone);
        if (!hasMicrophone) {
          alert(
            "⚠️ No microphone detected! Please connect one or check your device settings."
          );
        }
      })
      .catch((err) => {
        console.error("Error checking microphone:", err);
        alert("❌ Error accessing microphone. Check permissions!");
        setMicAvailable(false);
      });
  }, []);

  useEffect(() => {
    navigator.permissions
      .query({ name: "microphone" })
      .then((result) => {
        console.log("Microphone permission:", result.state);
        if (result.state === "denied") {
          alert(
            "⚠️ Microphone access is blocked! Enable it in browser settings."
          );
        }
      })
      .catch((err) =>
        console.error("Error checking microphone permissions:", err)
      );
  }, []);

  const sendMessage = () => {
    const text = input.current.value;
    if (!loading && !message) {
      chat(text);
      input.current.value = "";
    }
  };

  const startRecording = () => {
    if (!micAvailable) {
      alert("❌ No microphone available! Please connect one.");
      return;
    }
    console.log("🎤 Start Recording");
    setRecording(true);
  };

  const stopRecording = () => {
    console.log("🛑 Stop Recording");
    setRecording(false);
  };

  const onData = (recordedBlob) => {
    console.log("Recording in progress...", recordedBlob);
  };

  const onStop = (recordedBlob) => {
    console.log("Final recorded audio:", recordedBlob);
  };

  if (hidden) {
    return null;
  }

  return (
    <>
      <div className="fixed top-0 left-0 right-0 bottom-0 z-10 flex justify-between p-4 flex-col pointer-events-none">
        <div className="w-full flex flex-col items-end justify-center gap-4">
          {micAvailable === null ? (
            <p className="text-gray-500">Checking mic...</p>
          ) : micAvailable ? (
            <p className="text-green-500">🎙️ Mic Available</p>
          ) : (
            <p className="text-red-500">❌ No Mic detected</p>
          )}
          <button
            onClick={() => setCameraZoomed(!cameraZoomed)}
            className="button"
          >
            {cameraZoomed ? (
              <i className="fa-solid fa-magnifying-glass-plus"></i>
            ) : (
              <i className="fa-solid fa-magnifying-glass-minus"></i>
            )}
          </button>
        </div>

        <div className="flex items-center gap-2 pointer-events-auto max-w-screen-lg w-full mx-auto justify-center">
          {!recording ? (
            <input
              className="flex-grow h-16 placeholder:text-gray-800 placeholder:italic p-4 rounded-md bg-opacity-50 bg-white backdrop-blur-md"
              placeholder="Type a message..."
              ref={input}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  sendMessage();
                }
              }}
            />
          ) : (
            <ReactMic
              record={recording}
              onStop={onStop}
              onData={onData}
              strokeColor="#000000"
              backgroundColor="#FFF"
              mimeType="audio/webm"
              className="flex-grow h-16 rounded-md bg-opacity-50 bg-white backdrop-blur-md"
            />
          )}

          <button
            disabled={loading || message}
            onClick={sendMessage}
            className="button2"
          >
            Send
          </button>

          <button
            onMouseDown={startRecording}
            onMouseUp={stopRecording}
            onTouchStart={startRecording}
            onTouchEnd={stopRecording}
            className={` ${recording ? "bg-red-500 p-4 rounded-md" : "button"}`}
          >
            <i className="fa-solid fa-microphone-lines"></i>
          </button>
        </div>
      </div>
    </>
  );
};
