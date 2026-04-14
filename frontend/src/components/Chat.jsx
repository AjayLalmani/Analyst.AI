import { useState } from "react";
import axios from "axios";

export default function Chat({ csvData }) {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await axios.post("http://localhost:3000/api/analysis/chat", {
      prompt: prompt,
      csvData: csvData,
    });
    setResponse(res.data.message);
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white/[0.06] border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-lg backdrop-blur-md">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            className="flex-1 rounded-xl border border-white/15 bg-white/[0.05] px-4 py-2 text-white placeholder:text-white/30 outline-none focus:ring-2 focus:ring-blue-500/60 text-sm transition-colors"
            type="text"
            placeholder="Ask about your data..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <button
            type="submit"
            className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition-colors cursor-pointer shrink-0"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_upward</span>
          </button>
        </form>
        {response && (
          <p className="mt-4 text-sm text-white/80 bg-white/[0.04] border border-white/10 rounded-xl p-3 leading-relaxed">
            {response}
          </p>
        )}
      </div>
    </div>
  );
}
