"use client";
import { useState, useRef, useEffect } from "react";
import { nanoid } from "nanoid";
import { Button } from "./Button";
import { Input } from "./Input";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ChatWidget({ businessId }: { businessId: string }) {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hi! How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId] = useState(() => nanoid());
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg, sessionId, businessId }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            data.reply ?? "Sorry, something went wrong. Please try again.",
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I couldn't connect. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[520px] w-[380px] border border-gray-200 rounded-2xl shadow-2xl shadow-black/10 bg-white overflow-hidden">
      {/* Header */}
      <div className="bg-blue-600 px-4 py-3.5 flex items-center gap-3">
        <div className="relative">
          <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center text-white text-[13px] font-semibold">
            S
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-blue-600" />
        </div>
        <div>
          <p className="text-white text-[14px] font-semibold leading-none">
            Sales Assistant
          </p>
          <p className="text-blue-100 text-[11px] mt-1">
            Online · Replies instantly
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-[13px] leading-relaxed ${
                msg.role === "user"
                  ? "bg-blue-600 text-white rounded-br-sm"
                  : "bg-white text-gray-800 border border-gray-200 rounded-bl-sm shadow-sm"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 px-3.5 py-3 rounded-2xl rounded-bl-sm shadow-sm flex items-center gap-1">
              {[0, 150, 300].map((delay) => (
                <span
                  key={delay}
                  className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: `${delay}ms` }}
                />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 p-3 flex gap-2 bg-white">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Ask me anything…"
          className="text-[13px]"
        />
        <Button onClick={send} disabled={loading || !input.trim()} size="sm">
          Send
        </Button>
      </div>
    </div>
  );
}
