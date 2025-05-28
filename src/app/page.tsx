import { useState, useRef, useEffect } from "react";
import styles from "./page.module.css";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    try {
      // Placeholder: Replace with real API call
      const res = await fetch("/api/hint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: input }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.hint || "(No hint received)" },
      ]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Error fetching hint." },
      ]);
    }
    setLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !loading) {
      sendMessage();
    }
  };

  return (
    <div className={styles.page}>
      <main className={styles.main} style={{ width: "100%", maxWidth: 480 }}>
        <h1 style={{ textAlign: "center" }}>Gemini Hint Chat</h1>
        <div
          style={{
            background: "var(--gray-alpha-100)",
            borderRadius: 12,
            padding: 16,
            minHeight: 320,
            maxHeight: 400,
            overflowY: "auto",
            marginBottom: 16,
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
          }}
        >
          {messages.length === 0 && (
            <div style={{ color: "#888", textAlign: "center" }}>
              Ask a question to get a hint!
            </div>
          )}
          {messages.map((msg, i) => (
            <div
              key={i}
              style={{
                margin: "12px 0",
                textAlign: msg.role === "user" ? "right" : "left",
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  background: msg.role === "user" ? "#d1eaff" : "#f3f3f3",
                  color: "#222",
                  borderRadius: 8,
                  padding: "8px 12px",
                  maxWidth: "80%",
                  wordBreak: "break-word",
                }}
              >
                {msg.content}
              </span>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            type="text"
            className={styles.input}
            placeholder="Type your question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
            style={{ flex: 1 }}
          />
          <button
            className={styles.primary}
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            style={{ minWidth: 80 }}
          >
            {loading ? "..." : "Send"}
          </button>
        </div>
      </main>
    </div>
  );
}
