import { useState, useRef, useEffect } from "react";
import { Send, Plus, AlertCircle, Bookmark, Check } from "lucide-react";
import { sendChat, saveResult } from "../../lib/api";
import { useApp } from "../../context/AppContext";

interface Message {
  id: string;
  role: "user" | "bot" | "system" | "error";
  content: string;
  savedPath?: string;
}

function resolveImageUrl(src: string) {
  if (/^https?:\/\//i.test(src) || src.startsWith("data:image/")) return src;
  if (src.startsWith("/output/")) return src;
  return `/output/${src.replace(/^output[\\/]/, "")}`;
}

function hasImage(content: string) {
  return /!\[[^\]]*\]\([^)]+\)/.test(content);
}

function BotContent({ content }: { content: string }) {
  const parts = content.split(/(!\[[^\]]*\]\([^)]+\))/g);
  return (
    <>
      {parts.map((part, i) => {
        const img = part.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
        if (img) {
          return (
            <img
              key={i}
              src={resolveImageUrl(img[2])}
              alt={img[1]}
              style={{ display: "block", maxWidth: "100%", borderRadius: 8, marginTop: 8 }}
            />
          );
        }
        if (!part) return null;
        return (
          <span key={i} style={{ whiteSpace: "pre-wrap" }}>
            {part}
          </span>
        );
      })}
    </>
  );
}

const QUICK_CHIPS = [
  { emoji: "📅", label: "План", message: "Составь план подготовки: таймлайн и чек-лист задач с приоритетами и дедлайнами." },
  { emoji: "💰", label: "Бюджет", message: "Посчитай смету по категориям, резерв 10%, рекомендации по оптимизации." },
  { emoji: "📦", label: "Всё", message: "Нужен полный пакет: план подготовки и бюджет (смета)." },
  { emoji: "🎬", label: "Программа", message: "Сделай run-of-show на день события: программа по минутам с ответственными и plan B." },
  { emoji: "👥", label: "Гости", message: "Составь список гостей: шаблон RSVP и план рассадки." },
  { emoji: "✉️", label: "Приглашение", message: "Напиши текст приглашения: короткий для мессенджера и развёрнутый для email." },
  { emoji: "🌐", label: "HTML", message: "Сделай HTML-карточку приглашения." },
  { emoji: "📱", label: "VK пост", message: "Напиши посты для VK: анонс, countdown за 7 и 1 день. Хештеги и график публикаций." },
  { emoji: "⚠️", label: "Риски", message: "Какие риски на мероприятии и plan B? Чек-лист рисков с приоритетами." },
  { emoji: "🎨", label: "Баннер", message: "Сгенерируй баннер для VK, формат 16:9, стиль по типу события, без текста на картинке." },
  { emoji: "📋", label: "Опрос", message: "Составь опрос гостей после события: 10–12 вопросов, шкалы и открытые." },
  { emoji: "💌", label: "Спасибо", message: "Напиши благодарность гостям: короткий пост для VK и тёплый развёрнутый вариант." },
];

function welcomeMessage(eventName: string): Message {
  return {
    id: "welcome",
    role: "system",
    content: `Привет! Я EventGenie. Заполни вкладку «Событие» или опиши мероприятие в чате — затем выбери действие.`,
  };
}

export function ChatTab() {
  const { event, eventContext, sessionKey, newChat, gatewayOnline, refreshResults } = useApp();
  const [messages, setMessages] = useState<Message[]>(() => [welcomeMessage(event.name)]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [savingId, setSavingId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSend = async (text?: string) => {
    const message = (text ?? input).trim();
    if (!message || isLoading) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: message,
    };

    const chatHistory = messages
      .filter((m): m is Message & { role: "user" | "bot" } => m.role === "user" || m.role === "bot")
      .slice(-8)
      .map((m) => ({ role: m.role, content: m.content }));

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const data = await sendChat(message, eventContext, sessionKey, chatHistory);
      setMessages((prev) => [
        ...prev,
        { id: `bot-${Date.now()}`, role: "bot", content: data.reply || "(пустой ответ)" },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: "error",
          content: err instanceof Error ? err.message : String(err),
        },
      ]);
    } finally {
      setIsLoading(false);
      textareaRef.current?.focus();
    }
  };

  const handleChip = (chip: (typeof QUICK_CHIPS)[number]) => {
    setInput(chip.message);
    textareaRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleNewChat = () => {
    newChat();
    setMessages([welcomeMessage(event.name)]);
    setInput("");
  };

  const handleSave = async (botMsgId: string) => {
    const idx = messages.findIndex((m) => m.id === botMsgId);
    const botMsg = messages[idx];
    if (!botMsg || botMsg.role !== "bot" || botMsg.savedPath) return;

    const userMsg = [...messages.slice(0, idx)].reverse().find((m) => m.role === "user");

    setSavingId(botMsgId);
    try {
      const data = await saveResult({
        content: botMsg.content,
        userMessage: userMsg?.content,
        eventContext,
      });
      setMessages((prev) =>
        prev.map((m) => (m.id === botMsgId ? { ...m, savedPath: data.savedPath } : m))
      );
      refreshResults();
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: "error",
          content: err instanceof Error ? err.message : String(err),
        },
      ]);
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div
        className="flex items-center justify-between px-8 py-5 border-b"
        style={{ borderColor: "var(--border)", background: "var(--card)" }}
      >
        <div>
          <h1 style={{ fontFamily: "'Instrument Serif', serif", color: "var(--foreground)", fontSize: "1.5rem", fontWeight: 400 }}>
            Чат с EventGenie
          </h1>
          <p style={{ color: "var(--muted-foreground)", fontSize: "0.875rem", marginTop: "2px" }}>
            Запросы уходят в OpenClaw → Maestro
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span
              className="inline-block w-2 h-2 rounded-full"
              style={{
                background: gatewayOnline ? "var(--success)" : "var(--error)",
                boxShadow: gatewayOnline ? "0 0 6px var(--success)" : "0 0 6px var(--error)",
              }}
            />
            <span style={{ fontSize: "0.8125rem", color: "var(--muted-foreground)" }}>
              {gatewayOnline ? "Gateway онлайн" : "Gateway выключен"}
            </span>
          </div>
          <button
            onClick={handleNewChat}
            className="flex items-center gap-2 px-4 py-2 transition-all"
            style={{
              border: "1px solid var(--border)",
              borderRadius: "var(--radius)",
              color: "var(--foreground)",
              fontSize: "0.875rem",
              background: "transparent",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "var(--muted)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "transparent";
            }}
          >
            <Plus size={15} />
            Новый чат
          </button>
        </div>
      </div>

      {!gatewayOnline && (
        <div
          className="flex items-center gap-3 mx-8 mt-4 px-4 py-3 rounded-xl"
          style={{ background: "rgba(239, 68, 68, 0.08)", border: "1px solid rgba(239, 68, 68, 0.2)" }}
        >
          <AlertCircle size={16} color="var(--error)" />
          <p style={{ fontSize: "0.875rem", color: "var(--error)" }}>
            Gateway недоступен. Запустите start-gateway.ps1
          </p>
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-8 py-6 space-y-4" style={{ scrollbarWidth: "none" }}>
        {messages.map((msg) => {
          if (msg.role === "system") {
            return (
              <div key={msg.id} className="flex justify-center">
                <span
                  className="px-3 py-1 rounded-full"
                  style={{ fontSize: "0.75rem", color: "var(--muted-foreground)", background: "var(--muted)" }}
                >
                  {msg.content}
                </span>
              </div>
            );
          }

          if (msg.role === "user") {
            return (
              <div key={msg.id} className="flex justify-end">
                <div
                  className="max-w-lg px-4 py-3"
                  style={{
                    background: "var(--primary)",
                    color: "var(--primary-foreground)",
                    borderRadius: "14px 14px 4px 14px",
                    fontSize: "0.9375rem",
                    lineHeight: 1.55,
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {msg.content}
                </div>
              </div>
            );
          }

          if (msg.role === "bot") {
            const isSaving = savingId === msg.id;
            const isSaved = Boolean(msg.savedPath);
            const saveLabel = hasImage(msg.content) ? "Сохранить изображение" : "Сохранить текст";

            return (
              <div key={msg.id} className="flex flex-col items-start gap-2">
                <div
                  className="max-w-2xl px-5 py-4"
                  style={{
                    background: "var(--card)",
                    borderRadius: "4px 14px 14px 14px",
                    boxShadow: "0 2px 16px rgba(15,17,23,0.06)",
                    fontSize: "0.9375rem",
                    lineHeight: 1.65,
                    color: "var(--foreground)",
                  }}
                >
                  <BotContent content={msg.content} />
                </div>
                <button
                  onClick={() => handleSave(msg.id)}
                  disabled={isSaving || isSaved}
                  className="flex items-center gap-1.5 px-3 py-1.5 transition-all"
                  style={{
                    borderRadius: "999px",
                    border: `1px solid ${isSaved ? "rgba(34,197,94,0.35)" : "var(--border)"}`,
                    background: isSaved ? "rgba(34,197,94,0.08)" : "var(--card)",
                    color: isSaved ? "var(--success)" : "var(--muted-foreground)",
                    fontSize: "0.8125rem",
                    cursor: isSaving || isSaved ? "default" : "pointer",
                    opacity: isSaving ? 0.7 : 1,
                  }}
                >
                  {isSaved ? <Check size={14} /> : <Bookmark size={14} />}
                  {isSaving ? "Сохранение…" : isSaved ? "Сохранено в Результаты" : saveLabel}
                </button>
              </div>
            );
          }

          return (
            <div key={msg.id} className="flex justify-start">
              <div
                className="max-w-lg px-4 py-3"
                style={{
                  background: "rgba(239, 68, 68, 0.08)",
                  border: "1px solid rgba(239,68,68,0.2)",
                  borderRadius: "4px 14px 14px 14px",
                  color: "var(--error)",
                  fontSize: "0.9375rem",
                  whiteSpace: "pre-wrap",
                }}
              >
                {msg.content}
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex justify-start">
            <div
              className="px-5 py-3"
              style={{
                background: "var(--card)",
                borderRadius: "4px 14px 14px 14px",
                boxShadow: "0 2px 16px rgba(15,17,23,0.06)",
              }}
            >
              <span style={{ fontStyle: "italic", color: "var(--muted-foreground)", fontSize: "0.9375rem" }}>
                EventGenie думает…
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="px-8 py-3 border-t" style={{ borderColor: "var(--border)", background: "var(--card)" }}>
        <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
          {QUICK_CHIPS.map((chip, i) => (
            <button
              key={i}
              onClick={() => handleChip(chip)}
              className="flex items-center gap-1.5 px-3 py-1.5 whitespace-nowrap transition-all flex-shrink-0"
              style={{
                borderRadius: "999px",
                border: "1px solid var(--border)",
                background: "var(--background)",
                color: "var(--foreground)",
                fontSize: "0.8125rem",
              }}
            >
              <span>{chip.emoji}</span>
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-8 py-4" style={{ background: "var(--card)", borderTop: "1px solid var(--border)" }}>
        <div
          className="flex items-end gap-3 p-3"
          style={{
            border: "1.5px solid var(--border)",
            borderRadius: "var(--radius)",
            background: "var(--input-background)",
          }}
        >
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Например: составь план подготовки и смету…"
            rows={1}
            className="flex-1 resize-none bg-transparent outline-none"
            style={{ color: "var(--foreground)", fontSize: "0.9375rem", lineHeight: 1.55, maxHeight: "120px" }}
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isLoading || !gatewayOnline}
            className="flex items-center justify-center w-9 h-9 rounded-xl flex-shrink-0"
            style={{
              background: !input.trim() || isLoading || !gatewayOnline ? "var(--muted)" : "var(--primary)",
              color: !input.trim() || isLoading || !gatewayOnline ? "var(--muted-foreground)" : "#ffffff",
              cursor: !input.trim() || isLoading || !gatewayOnline ? "not-allowed" : "pointer",
              border: "none",
            }}
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
