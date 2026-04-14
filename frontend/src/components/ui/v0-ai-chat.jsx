"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { cn } from "@/lib/utils";
import { ArrowUpIcon } from "lucide-react";

function useAutoResizeTextarea({ minHeight, maxHeight }) {
  const textareaRef = useRef(null);

  const adjustHeight = useCallback(
    (reset) => {
      const textarea = textareaRef.current;
      if (!textarea) return;
      if (reset) {
        textarea.style.height = `${minHeight}px`;
        return;
      }
      textarea.style.height = `${minHeight}px`;
      const newHeight = Math.max(
        minHeight,
        Math.min(textarea.scrollHeight, maxHeight ?? Number.POSITIVE_INFINITY)
      );
      textarea.style.height = `${newHeight}px`;
    },
    [minHeight, maxHeight]
  );

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) textarea.style.height = `${minHeight}px`;
  }, [minHeight]);

  useEffect(() => {
    const handleResize = () => adjustHeight();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [adjustHeight]);

  return { textareaRef, adjustHeight };
}

export function VercelV0Chat() {
  const [value, setValue] = useState("");
  const { textareaRef, adjustHeight } = useAutoResizeTextarea({
    minHeight: 36,
    maxHeight: 180,
  });

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (value.trim()) {
        setValue("");
        adjustHeight(true);
      }
    }
  };

  const handleSend = () => {
    if (value.trim()) {
      setValue("");
      adjustHeight(true);
    }
  };

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-end pointer-events-none"
      style={{ paddingBottom: "2.5rem", paddingLeft: "1.5rem", paddingRight: "1.5rem" }}
    >
      <div className="w-full max-w-2xl pointer-events-auto">

        {/* ── Single-row input card ── */}
        <div
          className={cn(
            "flex flex-row items-center gap-3 rounded-2xl border px-4 py-3",
            "bg-[#1a1a1a] border-neutral-700",
            "focus-within:border-neutral-500 focus-within:shadow-[0_0_0_3px_rgba(255,255,255,0.04)]",
            "shadow-xl shadow-black/50 transition-all duration-200"
          )}
        >
          {/* Textarea — grows but stays centered */}
          <textarea
            ref={textareaRef}
            value={value}
            rows={1}
            onChange={(e) => {
              setValue(e.target.value);
              adjustHeight();
            }}
            onKeyDown={handleKeyDown}
            placeholder="Ask a question..."
            className={cn(
              "flex-1 bg-transparent resize-none outline-none border-none",
              "text-white text-sm leading-6",
              "placeholder:text-neutral-500 scrollbar-none",
              "py-1 px-1"
            )}
            style={{ overflow: "hidden", minHeight: "36px" }}
          />

          {/* Send button — vertically centered with textarea */}
          <button
            type="button"
            onClick={handleSend}
            disabled={!value.trim()}
            className={cn(
              "flex-shrink-0 flex items-center justify-center",
              "w-9 h-9 rounded-xl transition-all duration-200",
              value.trim()
                ? "bg-white hover:bg-neutral-100 shadow-md cursor-pointer"
                : "bg-neutral-800 cursor-not-allowed"
            )}
          >
            <ArrowUpIcon
              className={cn(
                "w-[18px] h-[18px]",
                value.trim() ? "text-black" : "text-neutral-600"
              )}
            />
            <span className="sr-only">Send</span>
          </button>
        </div>

        {/* Hint */}
        <p className="text-center text-[11px] text-neutral-600 mt-2.5 tracking-wide">
          <kbd className="px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-500 text-[10px] font-mono">Enter</kbd>
          {" "}to send &nbsp;·&nbsp;{" "}
          <kbd className="px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-500 text-[10px] font-mono">Shift+Enter</kbd>
          {" "}for new line
        </p>
      </div>
    </div>
  );
}
