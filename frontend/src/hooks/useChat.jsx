import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState();
  const [loading, setLoading] = useState(false);
  const [cameraZoomed, setCameraZoomed] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [isVideoRecording, setIsVideoRecording] = useState(false);

  const chatText = async (message) => {
    if (loading || messages.length > 0) return;

    setLoading(true);
    try {
      const data = await fetch(`${BACKEND_URL}/api/therapy-reply/text`, {
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
      toast.error("Error sending text message.");
    } finally {
      setLoading(false);
    }
  };

  const chatAudio = async (audioBlob, audioDuration) => {
    if (loading || messages.length > 0) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("audio", audioBlob, "recording.webm");
      formData.append("duration", audioDuration);

      const response = await fetch(`${BACKEND_URL}/api/therapy-reply/audio`, {
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
      toast.error(`Audio error: ${error.message || "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };

  const chatVideo = async (videoBlob, videoDuration) => {
    if (loading || messages.length > 0) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("video", videoBlob, "recording.webm");
      formData.append("duration", videoDuration);

      const response = await fetch(`${BACKEND_URL}/api/therapy-reply/video`, {
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
      toast.error(`Video error: ${error.message || "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };

  const startRecording = () => {
    if (loading || messages.length > 0) return;
    setIsRecording(true);
  };

  const stopRecording = () => setIsRecording(false);
  const startVideoRecording = () => {
    if (loading || messages.length > 0) return;
    setIsVideoRecording(true);
  };
  const stopVideoRecording = () => setIsVideoRecording(false);

  const onMessagePlayed = () => {
    setMessages((messages) => messages.slice(1));
  };

  useEffect(() => {
    setMessage(messages.length > 0 ? messages[0] : null);
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
