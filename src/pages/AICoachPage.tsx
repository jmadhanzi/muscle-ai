import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BottomNav from "@/components/BottomNav";
import { Brain, Send, Loader2, Trash2 } from "lucide-react";
import ReactMarkdown from "react-markdown";

type Msg = { role: "user" | "assistant"; content: string };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-coach`;

const STARTER_PROMPTS = [
  "How much protein should I eat on injection day?",
  "Best exercises for preserving muscle on GLP-1?",
  "Should I take creatine while on Ozempic?",
  "I'm losing weight fast — am I losing muscle?",
];

const ease = [0.16, 1, 0.3, 1] as const;

async function streamChat({
  messages,
  onDelta,
  onDone,
  onError,
}: {
  messages: Msg[];
  onDelta: (text: string) => void;
  onDone: () => void;
  onError: (msg: string) => void;
}) {
  const resp = await fetch(CHAT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
    },
    body: JSON.stringify({ messages }),
  });

  if (!resp.ok) {
    const body = await resp.json().catch(() => ({}));
    onError(body.error || `Error ${resp.status}`);
    return;
  }

  if (!resp.body) {
    onError("No response stream");
    return;
  }

  const reader = resp.body.getReader();
  const decoder = new TextDecoder();
  let buf = "";
  let done = false;

  while (!done) {
    const { done: readerDone, value } = await reader.read();
    if (readerDone) break;
    buf += decoder.decode(value, { stream: true });

    let idx: number;
    while ((idx = buf.indexOf("\n")) !== -1) {
      let line = buf.slice(0, idx);
      buf = buf.slice(idx + 1);
      if (line.endsWith("\r")) line = line.slice(0, -1);
      if (!line.startsWith("data: ")) continue;
      const json = line.slice(6).trim();
      if (json === "[DONE]") { done = true; break; }
      try {
        const parsed = JSON.parse(json);
        const c = parsed.choices?.[0]?.delta?.content;
        if (c) onDelta(c);
      } catch {
        buf = line + "\n" + buf;
        break;
      }
    }
  }
  onDone();
}

const AICoachPage = () => {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    });
  }, []);

  useEffect(() => { scrollToBottom(); }, [messages, scrollToBottom]);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    const userMsg: Msg = { role: "user", content: trimmed };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    let assistantSoFar = "";
    const upsert = (chunk: string) => {
      assistantSoFar += chunk;
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant") {
          return prev.map((m, i) => i === prev.length - 1 ? { ...m, content: assistantSoFar } : m);
        }
        return [...prev, { role: "assistant", content: assistantSoFar }];
      });
    };

    await streamChat({
      messages: newMessages,
      onDelta: upsert,
      onDone: () => setIsLoading(false),
      onError: (msg) => {
        setMessages((prev) => [...prev, { role: "assistant", content: `⚠️ ${msg}` }]);
        setIsLoading(false);
      },
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  };

  const isEmpty = messages.length === 0;

  return (
    <div className="flex flex-col h-[100dvh] bg-mesh">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease }}
        className="shrink-0 px-5 pt-14 pb-3 flex items-center justify-between"
      >
        <div>
          <h1 className="font-headline font-bold text-xl text-on-surface">AI Coach</h1>
          <p className="text-on-surface-variant text-xs mt-0.5">Muscle preservation expert</p>
        </div>
        {!isEmpty && (
          <button
            onClick={() => setMessages([])}
            className="p-2 rounded-lg hover:bg-surface-container transition-colors active:scale-95"
            aria-label="Clear chat"
          >
            <Trash2 className="w-4 h-4 text-on-surface-variant" />
          </button>
        )}
      </motion.header>

      {/* Messages area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 pb-4 scroll-smooth">
        {isEmpty ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease }}
            className="flex flex-col items-center justify-center h-full text-center px-4"
          >
            <div className="w-16 h-16 rounded-full gradient-hero flex items-center justify-center mb-5 shadow-[0_0_40px_hsla(160,100%,45%,0.12)]">
              <Brain className="w-8 h-8 text-on-primary" />
            </div>
            <h2 className="font-headline font-bold text-lg text-on-surface mb-1.5">
              Ask me anything
            </h2>
            <p className="text-on-surface-variant text-sm max-w-[260px] leading-relaxed mb-8">
              Trained on clinical research for GLP-1 muscle preservation protocols.
            </p>

            <div className="w-full max-w-sm space-y-2">
              {STARTER_PROMPTS.map((prompt, i) => (
                <motion.button
                  key={prompt}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.06, duration: 0.4, ease }}
                  onClick={() => send(prompt)}
                  className="w-full flex items-center gap-3 p-3.5 rounded-lg bg-surface-container-low hover:bg-surface-container transition-colors active:scale-[0.97] text-left"
                >
                  <span className="text-sm text-on-surface">{prompt}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        ) : (
          <div className="space-y-4 pt-2">
            <AnimatePresence initial={false}>
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, ease }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role === "assistant" && (
                    <div className="w-7 h-7 rounded-full gradient-hero flex items-center justify-center mr-2 mt-1 shrink-0">
                      <Brain className="w-3.5 h-3.5 text-on-primary" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground rounded-br-md"
                        : "bg-surface-container-low text-on-surface rounded-bl-md"
                    }`}
                  >
                    {msg.role === "assistant" ? (
                      <div className="prose prose-sm prose-invert max-w-none [&_p]:mb-2 [&_p:last-child]:mb-0 [&_ul]:mb-2 [&_li]:mb-0.5 [&_strong]:text-primary">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    ) : (
                      msg.content
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {isLoading && messages[messages.length - 1]?.role === "user" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2"
              >
                <div className="w-7 h-7 rounded-full gradient-hero flex items-center justify-center shrink-0">
                  <Brain className="w-3.5 h-3.5 text-on-primary" />
                </div>
                <div className="flex gap-1 px-4 py-3 rounded-2xl bg-surface-container-low rounded-bl-md">
                  <span className="w-1.5 h-1.5 rounded-full bg-on-surface-variant animate-pulse" style={{ animationDelay: "0ms" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-on-surface-variant animate-pulse" style={{ animationDelay: "150ms" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-on-surface-variant animate-pulse" style={{ animationDelay: "300ms" }} />
                </div>
              </motion.div>
            )}
          </div>
        )}
      </div>

      {/* Input bar */}
      <div className="shrink-0 px-4 pb-24 pt-2">
        <div className="flex items-end gap-2 bg-surface-container-low rounded-2xl border border-white/[0.06] p-2 focus-within:border-primary/30 transition-colors">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about muscle preservation..."
            rows={1}
            className="flex-1 bg-transparent text-sm text-on-surface placeholder:text-on-surface-variant/50 resize-none outline-none px-2 py-1.5 max-h-28 overflow-y-auto"
            style={{ minHeight: "36px" }}
          />
          <button
            onClick={() => send(input)}
            disabled={!input.trim() || isLoading}
            className="shrink-0 w-9 h-9 rounded-xl gradient-hero flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed active:scale-95 transition-transform"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 text-on-primary animate-spin" />
            ) : (
              <Send className="w-4 h-4 text-on-primary" />
            )}
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default AICoachPage;
