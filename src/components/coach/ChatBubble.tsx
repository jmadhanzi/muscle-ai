import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";

interface ChatBubbleProps {
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
}

const ChatBubble = ({ role, content, timestamp }: ChatBubbleProps) => {
  const isUser = role === "user";

  return (
    <motion.div
      initial={
        isUser
          ? { opacity: 0, y: 10, scale: 0.97 }
          : { opacity: 0, y: 14, scale: 0.95, x: -8 }
      }
      animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
      transition={{
        type: "spring",
        stiffness: 320,
        damping: 22,
      }}
      style={{ transformOrigin: isUser ? "bottom right" : "bottom left" }}
      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
    >
      {!isUser && (
        <div className="w-7 h-7 rounded-full gradient-hero flex items-center justify-center mr-2 mt-1 shrink-0">
          <span className="material-symbols-outlined text-[hsl(var(--on-primary))] text-sm">psychology</span>
        </div>
      )}
      <div className="flex flex-col gap-0.5">
        <div
          className={`max-w-[80vw] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
            isUser
              ? "bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] rounded-br-md"
              : "bg-[hsl(var(--surface-container-low))] text-[hsl(var(--on-surface))] rounded-bl-md border-l-2 border-[hsl(var(--accent-purple))]"
          }`}
        >
          {isUser ? (
            content
          ) : (
            <div className="prose prose-sm prose-invert max-w-none [&_p]:mb-2 [&_p:last-child]:mb-0 [&_ul]:mb-2 [&_li]:mb-0.5 [&_strong]:text-[hsl(var(--primary))]">
              <ReactMarkdown>{content}</ReactMarkdown>
            </div>
          )}
        </div>
        {timestamp && (
          <span className={`text-[10px] text-[hsl(var(--on-surface-variant)/0.5)] font-mono ${isUser ? "text-right" : "text-left ml-9"}`}>
            {timestamp}
          </span>
        )}
      </div>
    </motion.div>
  );
};

export default ChatBubble;
