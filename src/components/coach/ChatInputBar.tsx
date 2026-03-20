import { useRef } from "react";
import { Send, Loader2 } from "lucide-react";

interface ChatInputBarProps {
  input: string;
  setInput: (v: string) => void;
  isLoading: boolean;
  isLimitReached: boolean;
  onSend: () => void;
  onPaywall: () => void;
}

const ChatInputBar = ({
  input, setInput, isLoading, isLimitReached, onSend, onPaywall,
}: ChatInputBarProps) => {
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (isLimitReached) onPaywall();
      else onSend();
    }
  };

  return (
    <div className="shrink-0 px-4 pb-24 pt-2">
      <div
        className={`flex items-end gap-2 bg-[hsl(var(--surface-container-low))] rounded-2xl border p-2 transition-colors ${
          isLimitReached
            ? "border-[hsl(var(--accent-danger)/0.2)] opacity-60"
            : "border-[hsl(var(--border))] focus-within:border-[hsl(var(--primary)/0.3)]"
        }`}
      >
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isLimitReached ? "Upgrade to continue chatting…" : "Ask about muscle preservation…"}
          rows={1}
          disabled={isLimitReached}
          className="flex-1 bg-transparent text-sm text-[hsl(var(--on-surface))] placeholder:text-[hsl(var(--on-surface-variant)/0.5)] resize-none outline-none px-2 py-1.5 max-h-28 overflow-y-auto disabled:cursor-not-allowed"
          style={{ minHeight: "36px" }}
        />
        <button
          onClick={() => (isLimitReached ? onPaywall() : onSend())}
          disabled={(!input.trim() && !isLimitReached) || isLoading}
          className="shrink-0 w-9 h-9 rounded-xl gradient-hero flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed active:scale-95 transition-transform"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 text-[hsl(var(--on-primary))] animate-spin" />
          ) : (
            <Send className="w-4 h-4 text-[hsl(var(--on-primary))]" />
          )}
        </button>
      </div>
    </div>
  );
};

export default ChatInputBar;
