import React from "react";
import { useState } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");

    // Simulate assistant response
    setTimeout(() => {
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content: "This is a simulated response. In a real application, this would be connected to an AI model.",
        },
      ]);
    }, 1000);
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white p-4 hidden md:block">
        <button className="w-full bg-white/10 hover:bg-white/20 rounded-lg p-3 text-sm mb-4">
          + New Chat
        </button>
        <div className="space-y-2">
          <div className="text-sm text-gray-400">Recent Chats</div>
          {/* Add recent chats here */}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-screen">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"
                }`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-4 ${message.role === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 dark:bg-gray-700"
                  }`}
              >
                {message.content}
              </div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-4">
          <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
            <div className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="w-full p-4 pr-12 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-blue-500 hover:text-blue-600"
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
                    d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                  />
                </svg>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
