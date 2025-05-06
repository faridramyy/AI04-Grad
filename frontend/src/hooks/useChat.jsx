import { createContext, useContext, useEffect, useState } from "react";

const backendUrl = "http://localhost:3000";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState();
  const [loading, setLoading] = useState(false);
  const [cameraZoomed, setCameraZoomed] = useState(true);
  const [isRecording, setIsRecording] = useState(false);

  // Function to send text messages
  const chat = async (message) => {
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
    if (loading || messages.length > 0) return; // Prevent sending if already loading or there are pending messages
    
    setLoading(true);
    try {
      // Create a FormData object to send the audio file
      const formData = new FormData();
      formData.append("audio", audioBlob, "recording.wav");
      
      // If you want to include metadata like duration
      formData.append("duration", audioDuration);

      const data = await fetch(`${backendUrl}/api/therapy-reply/audio`, {
        method: "POST",
        body: formData,
      });
      
      const resp = (await data.json()).messages;
      setMessages((messages) => [...messages, ...resp]);
    } catch (error) {
      console.error("Error sending audio message:", error);
      // Don't add fallback message if already loading/processing
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
        chat,
        chatAudio,
        message,
        onMessagePlayed,
        loading,
        cameraZoomed,
        setCameraZoomed,
        isRecording,
        startRecording,
        stopRecording
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