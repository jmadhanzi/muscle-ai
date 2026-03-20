import { useState, useRef, useEffect, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import BottomNav from "@/components/BottomNav";
import PaywallModal from "@/components/PaywallModal";
import { usePaywall } from "@/hooks/usePaywall";
import { useAuth } from "@/contexts/AuthContext";
import { useCoachProfile } from "@/hooks/useCoachProfile";
import { AI_COACH_FREE_LIMIT } from "@/config/features";

import ChatHeader from "@/components/coach/ChatHeader";
import ChatBubble from "@/components/coach/ChatBubble";
import TypingIndicator from "@/components/coach/TypingIndicator";
import StarterPrompts from "@/components/coach/StarterPrompts";
import ChatInputBar from "@/components/coach/ChatInputBar";
import PaywallBanner from "@/components/coach/PaywallBanner";
import { ChatDisclaimerBanner, OnboardingDisclaimer, useDisclaimer } from "@/components/DisclaimerBanner";

type Msg = { role: "user" | "assistant"; content: string; time: string };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-coach`;

function now() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

async function streamChat({
  messages, userProfile, onDelta, onDone, onError,
}: {
  messages: Msg[];
  userProfile?: ReturnType<typeof useCoachProfile>;
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
    body: JSON.stringify({
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
      userProfile,
    }),
  });

  if (!resp.ok) {
    const body = await resp.json().catch(() => ({}));
    onError(body.error || `Error ${resp.status}`);
    return;
  }
  if (!resp.body) { onError("No response stream"); return; }

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
  const paywall = usePaywall();
  const { isPro, user } = useAuth();
  const disclaimer = useDisclaimer();
  const userProfile = useCoachProfile(user?.id);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const userMessageCount = messages.filter((m) => m.role === "user").length;
  const isLimitReached = !isPro && userMessageCount >= AI_COACH_FREE_LIMIT;

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    });
  }, []);

  useEffect(() => { scrollToBottom(); }, [messages, scrollToBottom]);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    if (isLimitReached) {
      paywall.fire("ai_message_4");
      return;
    }

    const userMsg: Msg = { role: "user", content: trimmed, time: now() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    let assistantSoFar = "";
    const assistantTime = now();
    const upsert = (chunk: string) => {
      assistantSoFar += chunk;
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant") {
          return prev.map((m, i) => i === prev.length - 1 ? { ...m, content: assistantSoFar } : m);
        }
        return [...prev, { role: "assistant", content: assistantSoFar, time: assistantTime }];
      });
    };

    await streamChat({
      messages: newMessages,
      userProfile,
      onDelta: upsert,
      onDone: () => setIsLoading(false),
      onError: (msg) => {
        setMessages((prev) => [...prev, { role: "assistant", content: `⚠️ ${msg}`, time: now() }]);
        setIsLoading(false);
      },
    });
  };

  const isEmpty = messages.length === 0;

  return (
    <div className="flex flex-col h-[100dvh] bg-mesh">
      <ChatHeader
        isPro={isPro}
        isLimitReached={isLimitReached}
        userMessageCount={userMessageCount}
        freeLimit={AI_COACH_FREE_LIMIT}
        hasMessages={!isEmpty}
        medication={userProfile?.medication ?? undefined}
        onClear={() => setMessages([])}
      />

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 pb-4 scroll-smooth">
        {isEmpty ? (
          <StarterPrompts
            userProfile={userProfile}
            isPro={isPro}
            freeLimit={AI_COACH_FREE_LIMIT}
            onSend={send}
          />
        ) : (
          <div className="space-y-4 pt-2">
            <AnimatePresence initial={false}>
              {messages.map((msg, i) => (
                <ChatBubble key={i} role={msg.role} content={msg.content} timestamp={msg.time} />
              ))}
            </AnimatePresence>

            {isLoading && messages[messages.length - 1]?.role === "user" && (
              <TypingIndicator />
            )}

            {isLimitReached && !isLoading && <PaywallBanner />}
          </div>
        )}
      </div>

      <ChatInputBar
        input={input}
        setInput={setInput}
        isLoading={isLoading}
        isLimitReached={isLimitReached}
        onSend={() => send(input)}
        onPaywall={() => paywall.fire("ai_message_4")}
      />

      <PaywallModal
        open={paywall.open}
        onClose={paywall.close}
        feature={paywall.copy.feature}
        headline={paywall.copy.headline}
        body={paywall.copy.body}
      />
      <BottomNav />
    </div>
  );
};

export default AICoachPage;
