import React from "react";
import { FiSend } from "react-icons/fi";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaVideo } from "react-icons/fa";

function ChatUI() {
  const dummyData = {
    contacts: [
      {
        id: 1,
        name: "John Doe",
        message: "Hey there!",
        avatar:
          "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OTh8fHVzZXIlMjBwcm9maWxlfGVufDB8fDB8fHww",
        isOnline: true,
      },
      {
        id: 2,
        name: "Jane Smith",
        message: "How are you?",
        avatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fHVzZXIlMjBwcm9maWxlfGVufDB8fDB8fHww",
        isOnline: false,
      },
      {
        id: 3,
        name: "Morne Taylor",
        message: "Bye, Good night",
        avatar:
          "https://images.unsplash.com/photo-1502323777036-f29e3972d82f?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fHVzZXIlMjBwcm9maWxlfGVufDB8fDB8fHww",
        isOnline: false,
      },
      {
        id: 4,
        name: "Natasha Engineer",
        message: "Let's catch up ",
        avatar:
          "https://images.unsplash.com/photo-1519648023493-d82b5f8d7b8a?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjZ8fHVzZXIlMjBwcm9maWxlfGVufDB8fDB8fHww",
        isOnline: false,
      },
      {
        id: 5,
        name: "Meloni Victor",
        message: "Completed.",
        avatar:
          "https://images.unsplash.com/photo-1520295187453-cd239786490c?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjh8fHVzZXIlMjBwcm9maWxlfGVufDB8fDB8fHww",
        isOnline: false,
      },
    ],
    chats: [
      { id: 1, message: "Hello!", timestamp: "10:00 AM", type: "received" },
      {
        id: 2,
        message: "Hi, how are you?",
        timestamp: "10:02 AM",
        type: "sent",
      },
      {
        id: 3,
        message: "I'm fine. What about you?",
        timestamp: "10:03 AM",
        type: "received",
      },
      { id: 4, message: "I'm also fine", timestamp: "10:04 AM", type: "sent" },
      {
        id: 5,
        message: "I'm getting error in my code",
        timestamp: "10:05 AM",
        type: "received",
      },
      {
        id: 6,
        message: "Send me the code, I will look it into it",
        timestamp: "10:02 AM",
        type: "sent",
      },
    ],
  };

  return (
    <div className="flex bg-white h-screen">
      <div className="w-1/4 bg-gray-800 text-white overflow-auto">
        <div className="flex items-center bg-gray-700 p-2 mb-2">
          <h1 className="text-3xl p-2">Chat history</h1>
        </div>
        {dummyData.contacts.map((contact) => (
          <div
            key={contact.id}
            className="flex items-center p-4 hover:bg-gray-700 cursor-pointer border-b border-b-gray-600"
          >
            <div className="ml-4">
              <p>{contact.name}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="flex-1 flex flex-col">
        <div className="p-4 flex items-center border-b border-gray-300">
          <span className="ml-4">Chat with Ai Therapy</span>
          <button className="ml-auto hover:text-red-500 dark:text-black dark:hover:text-red-500">
            <FaVideo size={24} />
          </button>
        </div>
        <div className="flex-1 p-4 overflow-auto">
          {dummyData.chats.map((chat) => (
            <div
              key={chat.id}
              className={`flex ${
                chat.type === "sent" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`rounded-lg px-6 py-2 ${
                  chat.type === "sent"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200"
                } my-1`}
              >
                <p>{chat.message}</p>
                <span className="text-[12px]"> {chat.timestamp}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="p-4 flex">
          <input
            className="flex-1 border p-2 rounded-lg"
            type="text"
            placeholder="Type a message..."
          />
          <button className="ml-2 bg-blue-500 px-4 rounded-lg text-white">
            <FiSend />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatUI;
