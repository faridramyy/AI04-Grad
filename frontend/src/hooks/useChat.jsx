import { createContext, useContext, useEffect, useState } from "react";

const backendUrl = "http://localhost:3000";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState();
  const [loading, setLoading] = useState(false);
  const [cameraZoomed, setCameraZoomed] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [isVideoRecording, setIsVideoRecording] = useState(false);

  // Function to send text messages
  const chatText = async (message) => {
    if (loading || messages.length > 0) return; // Prevent sending if already loading or there are pending messages

    setLoading(true);
    try {
      const data = await fetch(`${backendUrl}/api/therapy-reply/text`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });
      const resp = (await data.json()).messages;
      setMessages((messages) => [...messages, ...resp]);
    } catch (error) {
      console.error("Error sending text message:", error);
    } finally {
      setLoading(false);
    }
  };

  // Function to send audio messages
  const chatAudio = async (audioBlob, audioDuration) => {
    if (loading || messages.length > 0) return; // Prevent sending if already loading

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("audio", audioBlob, "recording.webm");
      formData.append("duration", audioDuration);

      const response = await fetch(`${backendUrl}/api/therapy-reply/audio`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json(); // Get full response

      console.log(data)

      if (!response.ok) {
        // If backend returns error (400, 500), throw it
        throw new Error(data.error || "Unknown error from server");
      }

      if (!Array.isArray(data.messages)) {
        throw new Error("Invalid response format: messages not found");
      }

      setMessages((messages) => [...messages, ...data.messages]); // <-- Use data.messages safely now
    } catch (error) {
      alert("Error sending audio message:", error.message || error);
    } finally {
      setLoading(false);
    }
  };

  // Function to send video messages
  const chatVideo = async (videoBlob, videoDuration) => {
    if (loading || messages.length > 0) return; // Prevent sending if already loading

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("video", videoBlob, "recording.webm");
      formData.append("duration", videoDuration);

      const response = await fetch(`${backendUrl}/api/therapy-reply/video`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      console.log(data);

      if (!response.ok) {
        throw new Error(data.error || "Unknown error from server");
      }

      if (!Array.isArray(data.messages)) {
        throw new Error("Invalid response format: messages not found");
      }

      setMessages((messages) => [...messages, ...data.messages]);
    } catch (error) {
      alert("Error sending video message: " + (error.message || error));
    } finally {
      setLoading(false);
    }
  };

  // For direct recording state management
  const startRecording = () => {
    if (loading || messages.length > 0) return; // Don't start recording if busy
    setIsRecording(true);
  };

  const stopRecording = () => {
    setIsRecording(false);
  };

  const startVideoRecording = () => {
    if (loading || messages.length > 0) return; // Don't start recording if busy
    setIsVideoRecording(true);
  };

  const stopVideoRecording = () => {
    setIsVideoRecording(false);
  };

  const onMessagePlayed = () => {
    setMessages((messages) => messages.slice(1));
  };

  useEffect(() => {
    if (messages.length > 0) {
      setMessage(messages[0]);
    } else {
      setMessage(null);
    }
  }, [messages]);

  return (
    <ChatContext.Provider
      value={{
        chatText,
        chatAudio,
        chatVideo,
        message,
        onMessagePlayed,
        loading,
        cameraZoomed,
        setCameraZoomed,
        isRecording,
        startRecording,
        stopRecording,
        isVideoRecording,
        startVideoRecording,
        stopVideoRecording,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};