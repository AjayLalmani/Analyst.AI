import { useState, useRef, useEffect } from "react";
import axios from "axios";

// ── Lightweight Markdown Renderer ─────────────────────────────────────────────
function renderInline(text) {
  // Split on **bold** markers and render bold spans
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <span key={i} className="font-semibold text-white">
          {part.slice(2, -2)}
        </span>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

function renderMarkdown(text) {
  const lines = text.split("\n");
  const elements = [];
  let listBuffer = [];

  const flushList = () => {
    if (listBuffer.length === 0) return;
    elements.push(
      <ul key={`ul-${elements.length}`} className="mt-2 mb-1 flex flex-col gap-1.5 pl-1">
        {listBuffer.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-white/80">
            <span className="mt-[5px] w-1.5 h-1.5 rounded-full bg-blue-400/70 shrink-0" />
            <span>{renderInline(item)}</span>
          </li>
        ))}
      </ul>
    );
    listBuffer = [];
  };

  lines.forEach((line, i) => {
    const trimmed = line.trim();
    if (!trimmed) {
      flushList();
      return;
    }
    // Bullet list line
    if (/^[-•*]\s/.test(trimmed)) {
      listBuffer.push(trimmed.replace(/^[-•*]\s/, ""));
      return;
    }
    flushList();
    // Heading (## or #)
    if (/^#{1,3}\s/.test(trimmed)) {
      const content = trimmed.replace(/^#{1,3}\s/, "");
      elements.push(
        <p key={i} className="font-bold text-white text-sm mt-3 mb-0.5">
          {renderInline(content)}
        </p>
      );
      return;
    }
    // Regular paragraph
    elements.push(
      <p key={i} className="text-white/85 leading-relaxed">
        {renderInline(trimmed)}
      </p>
    );
  });

  flushList();
  return elements;
}

export default function Chat({ csvData }) {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async () => {
    if (!prompt.trim() || loading) return;

    const userMsg = { role: "user", text: prompt };
    setMessages((prev) => [...prev, userMsg]);
    setPrompt("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:3000/api/analysis/chat", {
        prompt,
        csvData,
      });
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: res.data.message },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "Something went wrong. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#0a0a0a]">

      {/* Header */}
      <div className="flex items-center justify-center px-4 py-3 border-b border-white/10 bg-black/40 backdrop-blur-md">
        <h1 className="text-[15px] font-semibold text-white m-0">Analyst.AI</h1>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 flex flex-col gap-4">

        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center flex-1 text-white/30 gap-2">
            <svg
              width="40"
              height="40"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              viewBox="0 0 24 24"
              className="opacity-40"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
              />
            </svg>
            <p className="text-[13px] m-0">Ask anything about your CSV data</p>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex items-start gap-2 ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {msg.role === "assistant" && (
              <div className="w-7 h-7 rounded-full bg-blue-900/50 border border-blue-500/30 flex items-center justify-center shrink-0 mt-[2px]">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#60a5fa">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                </svg>
              </div>
            )}

            <div
              className={[
                "text-sm",
                msg.role === "user"
                  ? "max-w-[70%] px-[14px] py-[10px] leading-relaxed bg-blue-600 text-white rounded-[18px_18px_4px_18px]"
                  : "max-w-[80%] px-4 py-3 flex flex-col gap-1 bg-white/[0.06] text-white/90 border border-white/10 rounded-[18px_18px_18px_4px]",
              ].join(" ")}
            >
              {msg.role === "assistant" ? renderMarkdown(msg.text) : msg.text}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-start gap-2">
            <div className="w-7 h-7 rounded-full bg-blue-900/50 border border-blue-500/30 flex items-center justify-center shrink-0">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#60a5fa">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
              </svg>
            </div>
            <div className="bg-white/[0.06] border border-white/10 rounded-[18px_18px_18px_4px] px-4 py-3 flex gap-1 items-center">
              {[0, 150, 300].map((delay) => (
                <span
                  key={delay}
                  className="w-[6px] h-[6px] rounded-full bg-white/40 inline-block animate-bounce"
                  style={{ animationDelay: `${delay}ms` }}
                />
              ))}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input bar */}
      <div className="px-4 pb-4 pt-3 bg-black/30 border-t border-white/10 backdrop-blur-md">
        <div className="max-w-[680px] mx-auto">
          <div
            className="flex items-end gap-2 bg-white/[0.05] border border-white/10 rounded-3xl pl-4 pr-2 py-2 shadow-sm transition-colors duration-150 focus-within:border-blue-500/60"
          >
            <textarea
              ref={textareaRef}
              rows={1}
              placeholder="Ask about your data..."
              value={prompt}
              onChange={(e) => {
                setPrompt(e.target.value);
                e.target.style.height = "auto";
                e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
              }}
              onKeyDown={handleKeyDown}
              className="flex-1 border-none outline-none resize-none text-sm leading-relaxed text-white/90 bg-transparent py-1 font-[inherit] max-h-[120px] overflow-y-auto placeholder:text-white/30"
            />
            <button
              onClick={handleSubmit}
              disabled={!prompt.trim() || loading}
              className={[
                "w-8 h-8 rounded-full border-none flex items-center justify-center shrink-0 transition-colors duration-150",
                prompt.trim() && !loading
                  ? "bg-blue-600 cursor-pointer hover:bg-blue-500"
                  : "bg-white/10 cursor-not-allowed",
              ].join(" ")}
            >
              <svg
                width="14"
                height="14"
                fill="none"
                stroke={prompt.trim() && !loading ? "#fff" : "rgba(255,255,255,0.3)"}
                strokeWidth={2.5}
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
              </svg>
            </button>
          </div>
          <p className="text-center text-[11px] text-white/25 mt-[6px]">
            Press Enter to send · Shift+Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
}