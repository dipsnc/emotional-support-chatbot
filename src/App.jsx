import React, { useState, useEffect, useRef } from "react";
import Layout from "./components/layout/Layout";
import Header from "./components/layout/Header";
import { getResponse, getGroundingExercise } from "./services/mindEaseService";

function App() {
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem("mindEase_messages");
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 1,
            text: "Hi there. How are you feeling today?",
            sender: "bot",
            timestamp: new Date(),
          },
        ];
  });
  const [input, setInput] = useState("");
  const [tone, setTone] = useState("gentle");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("mindEase_messages", JSON.stringify(messages));
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = {
      id: Date.now(),
      text: input,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      // Small artificial delay for "thinking" feel if response is too fast
      const [response] = await Promise.all([
        getResponse(userMsg.text, tone, messages),
        new Promise((resolve) => setTimeout(resolve, 800)),
      ]);

      const botMsg = {
        id: Date.now() + 1,
        text: response.text,
        sender: "bot",
        timestamp: new Date(),
        isCrisis: response.isCrisis,
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      const botMsg = {
        id: Date.now() + 1,
        text: "I'm having trouble connecting right now, but I'm here.",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleGrounding = () => {
    const groundingText = getGroundingExercise();
    const botMsg = {
      id: Date.now(),
      text: groundingText,
      sender: "bot",
      timestamp: new Date(),
      type: "grounding",
    };
    setMessages((prev) => [...prev, botMsg]);
  };

  const handleMood = async (mood) => {
    const moodMsg = {
      id: Date.now(),
      text: `I'm feeling ${mood}`,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, moodMsg]);
    setIsTyping(true);

    try {
      const response = await getResponse(
        `I am feeling ${mood}`,
        tone,
        messages,
      );
      const botMsg = {
        id: Date.now() + 1,
        text: response.text,
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg text-text font-body flex flex-col selection:bg-primary/20">
      <Header tone={tone} setTone={setTone} />

      <main className="flex-1 max-w-4xl mx-auto px-4 w-full py-8 flex flex-col h-[calc(100vh-80px)]">
        {/* Chat Window */}
        <div className="flex-1 overflow-y-auto space-y-8 pr-3 mb-6 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} animate-slide-in`}
            >
              <div
                className={`max-w-[85%] md:max-w-[75%] rounded-3xl px-6 py-4 shadow-sm text-[15px] leading-relaxed whitespace-pre-wrap transition-all duration-300 transform hover:scale-[1.01] ${
                  msg.sender === "user"
                    ? "bg-gradient-to-br from-primary to-indigo-600 text-white rounded-br-none shadow-indigo-100"
                    : msg.isCrisis
                      ? "bg-rose-50 border-2 border-rose-100 text-rose-900 rounded-bl-none shadow-rose-50"
                      : "bg-surface text-slate-700 rounded-bl-none border border-slate-100 shadow-slate-100"
                }`}
              >
                <div className="font-medium">{msg.text}</div>
                <span
                  className={`text-[10px] block mt-2 font-bold tracking-tight uppercase opacity-50 ${msg.sender === "user" ? "text-indigo-50" : "text-slate-400"}`}
                >
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start animate-pulse">
              <div className="bg-surface border border-slate-100 rounded-2xl px-5 py-3 text-sm text-slate-400 font-medium flex items-center gap-2 shadow-sm">
                <span
                  className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"
                  style={{ animationDelay: "0ms" }}
                ></span>
                <span
                  className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"
                  style={{ animationDelay: "150ms" }}
                ></span>
                <span
                  className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"
                  style={{ animationDelay: "300ms" }}
                ></span>
                MindEase is thinking...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input & Controls */}
        <div className="bg-white/70 backdrop-blur-xl border border-white rounded-[32px] p-2 shadow-2xl shadow-indigo-100/50 transition-all duration-300 focus-within:shadow-indigo-200/50">
          <div className="p-4">
            {/* Support Row */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-50">
              <button
                onClick={handleGrounding}
                className="group flex items-center gap-2 bg-slate-50 hover:bg-secondary/10 text-slate-600 hover:text-secondary border border-transparent hover:border-secondary/20 px-5 py-2 rounded-2xl text-sm font-bold transition-all duration-300"
              >
                <span className="group-hover:rotate-12 transition-transform">
                  🌿
                </span>{" "}
                Ground Me
              </button>

              <div className="flex items-center gap-3 bg-slate-50/50 p-1.5 rounded-2xl border border-slate-100">
                {["😔", "😰", "😡", "😐", "🙂"].map((mood) => (
                  <button
                    key={mood}
                    onClick={() => handleMood(mood)}
                    className="hover:scale-125 hover:-translate-y-1 transition-all duration-300 text-2xl p-1.5 grayscale-[0.5] hover:grayscale-0"
                  >
                    {mood}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSend} className="flex gap-4 items-end">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend(e);
                  }
                }}
                placeholder="Share what's on your mind..."
                className="flex-1 bg-slate-50/50 border border-slate-100 rounded-[24px] px-6 py-4 text-[15px] text-text placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/20 focus:bg-white transition-all resize-none h-[64px]"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="bg-primary hover:bg-primary/95 disabled:opacity-30 disabled:grayscale disabled:cursor-not-allowed text-white font-bold px-8 py-4 rounded-[24px] transition-all h-[64px] shadow-lg shadow-primary/20 active:scale-95"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
