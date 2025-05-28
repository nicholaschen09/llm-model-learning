"use client";
import React, { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const newMessages = [...messages, { role: "user" as const, content: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: input }),
      });
      const data = await res.json();
      const geminiReply = data.response || data.error || "No response from Gemini.";
      setMessages([...newMessages, { role: "assistant", content: geminiReply }]);
    } catch (err) {
      setMessages([...newMessages, { role: "assistant", content: "Error contacting Gemini API." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#343541] text-white">
      {/* Top Bar */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-[#2a2b32] bg-[#343541] sticky top-0 z-10">
        <div className="text-lg font-semibold tracking-tight">ThinkAI</div>
        <select className="bg-[#444654] text-white rounded px-3 py-1 text-sm border-none outline-none">
          <option>GPT-4o</option>
          <option>GPT-4</option>
          <option>GPT-3.5</option>
        </select>
      </header>
      {/* Chat Area */}
      <main className="flex-1 flex flex-col items-center justify-center">
        <div ref={chatRef} className="w-full flex-1 flex flex-col items-center justify-center px-2 md:px-0 py-6">
          <div className="w-full max-w-2xl space-y-4">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-[60vh] text-[#ececf1] opacity-80 select-none">
                <h1 className="text-2xl md:text-3xl font-medium mb-4">What can I help you with today?</h1>
                <p className="text-base opacity-70">Start a conversation or pick a recent chat.</p>
              </div>
            )}
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`rounded-xl px-5 py-3 max-w-[80%] whitespace-pre-line shadow-sm text-base ${msg.role === "user"
                    ? "bg-[#0fa47f] text-white"
                    : "bg-[#444654] text-[#ececf1]"
                    }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="rounded-xl px-5 py-3 max-w-[80%] shadow-sm text-base bg-[#444654] text-[#ececf1] opacity-70 animate-pulse">
                  Gemini is typing…
                </div>
              </div>
            )}
          </div>
        </div>
        {/* Input Area */}
        <form
          onSubmit={handleSubmit}
          className="w-full bg-[#343541] border-t border-[#2a2b32] px-2 md:px-0 py-6 flex justify-center sticky bottom-0 z-10"
          autoComplete="off"
        >
          <div className="relative w-full max-w-2xl">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Message ThinkAI…"
              className="w-full bg-[#40414f] text-white rounded-2xl py-4 pl-5 pr-14 text-base border border-[#444654] focus:outline-none focus:ring-2 focus:ring-[#0fa47f] transition shadow-md"
              disabled={loading}
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-[#0fa47f] hover:bg-[#10b981] transition-colors disabled:opacity-50"
              aria-label="Send"
              disabled={loading || !input.trim()}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5 text-white"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 12h14M12 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
