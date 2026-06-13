import { useState } from "react";
import { Server, Trash2, Info, CheckCircle, AlertCircle, RefreshCw } from "lucide-react";
import { useApp } from "../../context/AppContext";

export function SettingsTab() {
  const { gatewayOnline, gatewayUrl, sessionKey, checkHealth, newChat } = useApp();
  const [cleared, setCleared] = useState(false);
  const [checking, setChecking] = useState(false);

  const handleClearHistory = () => {
    newChat();
    setCleared(true);
    setTimeout(() => setCleared(false), 2000);
  };

  const handleCheck = async () => {
    setChecking(true);
    await checkHealth();
    setChecking(false);
  };

  const cardStyle: React.CSSProperties = {
    background: "var(--card)",
    borderRadius: "var(--radius)",
    boxShadow: "0 2px 16px rgba(15,17,23,0.06)",
    border: "1px solid var(--border)",
    padding: "24px",
    marginBottom: "16px",
  };

  const labelStyle: React.CSSProperties = {
    fontSize: "0.75rem",
    color: "var(--muted-foreground)",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    marginBottom: "16px",
    display: "block",
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto" style={{ scrollbarWidth: "none" }}>
      <div className="px-8 py-5 border-b" style={{ borderColor: "var(--border)", background: "var(--card)" }}>
        <h1 style={{ fontFamily: "'Instrument Serif', serif", color: "var(--foreground)", fontSize: "1.5rem", fontWeight: 400 }}>
          Настройки
        </h1>
        <p style={{ color: "var(--muted-foreground)", fontSize: "0.875rem", marginTop: "2px" }}>
          Конфигурация подключения и сессии
        </p>
      </div>

      <div className="flex-1 px-8 py-6 max-w-2xl">
        <div style={cardStyle}>
          <span style={labelStyle}>OpenClaw Gateway</span>
          <div className="flex items-start justify-between mb-5">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 flex items-center justify-center rounded-xl"
                style={{ background: gatewayOnline ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)" }}
              >
                <Server size={18} color={gatewayOnline ? "var(--success)" : "var(--error)"} />
              </div>
              <div>
                <p style={{ fontWeight: 500, color: "var(--foreground)", fontSize: "0.9375rem" }}>
                  Gateway сервер
                </p>
                <p style={{ fontSize: "0.8125rem", color: "var(--muted-foreground)", marginTop: "2px" }}>
                  {gatewayUrl}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span
                className="inline-block w-2 h-2 rounded-full"
                style={{
                  background: gatewayOnline ? "var(--success)" : "var(--error)",
                  boxShadow: gatewayOnline ? "0 0 6px var(--success)" : "0 0 6px var(--error)",
                }}
              />
              <span style={{ fontSize: "0.875rem", color: gatewayOnline ? "var(--success)" : "var(--error)" }}>
                {gatewayOnline ? "Онлайн" : "Выключен"}
              </span>
            </div>
          </div>

          <div
            className="px-4 py-3 rounded-xl mb-5 flex items-center gap-3"
            style={{
              background: gatewayOnline ? "rgba(34,197,94,0.06)" : "rgba(239,68,68,0.06)",
              border: `1px solid ${gatewayOnline ? "rgba(34,197,94,0.16)" : "rgba(239,68,68,0.16)"}`,
            }}
          >
            {gatewayOnline ? (
              <CheckCircle size={15} color="var(--success)" />
            ) : (
              <AlertCircle size={15} color="var(--error)" />
            )}
            <p style={{ fontSize: "0.875rem", color: gatewayOnline ? "var(--success)" : "var(--error)" }}>
              {gatewayOnline
                ? "Соединение установлено. AI-агент готов к работе."
                : "Gateway недоступен. Запустите start-gateway.ps1"}
            </p>
          </div>

          <button
            onClick={handleCheck}
            disabled={checking}
            className="flex items-center gap-2 px-4 py-2"
            style={{
              border: "1px solid var(--border)",
              borderRadius: "calc(var(--radius) - 4px)",
              background: "transparent",
              color: "var(--foreground)",
              fontSize: "0.875rem",
              cursor: checking ? "wait" : "pointer",
            }}
          >
            <RefreshCw size={14} style={{ animation: checking ? "spin 0.8s linear infinite" : "none" }} />
            {checking ? "Проверяю…" : "Проверить соединение"}
          </button>
        </div>

        <div style={cardStyle}>
          <span style={labelStyle}>Сессия</span>
          <div className="mb-5">
            <p style={{ fontSize: "0.8125rem", color: "var(--muted-foreground)", marginBottom: "4px" }}>
              ID сессии OpenClaw
            </p>
            <code
              style={{
                fontSize: "0.75rem",
                color: "var(--foreground)",
                background: "var(--input-background)",
                padding: "4px 10px",
                borderRadius: "6px",
                fontFamily: "monospace",
                wordBreak: "break-all",
              }}
            >
              {sessionKey}
            </code>
          </div>

          <button
            onClick={handleClearHistory}
            className="flex items-center gap-2 px-4 py-2"
            style={{
              border: `1px solid ${cleared ? "rgba(239,68,68,0.4)" : "var(--border)"}`,
              borderRadius: "calc(var(--radius) - 4px)",
              background: cleared ? "rgba(239,68,68,0.06)" : "transparent",
              color: cleared ? "var(--error)" : "var(--muted-foreground)",
              fontSize: "0.875rem",
              cursor: "pointer",
            }}
          >
            {cleared ? <CheckCircle size={14} /> : <Trash2 size={14} />}
            {cleared ? "Сессия OpenClaw обновлена" : "Новая сессия OpenClaw"}
          </button>
        </div>

        <div style={cardStyle}>
          <span style={labelStyle}>О приложении</span>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 flex items-center justify-center rounded-2xl" style={{ background: "rgba(109,94,252,0.1)", fontSize: "1.5rem" }}>
              🎉
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <p style={{ fontFamily: "'Instrument Serif', serif", fontSize: "1.125rem", color: "var(--foreground)" }}>
                  EventGenie
                </p>
                <span className="px-2 py-0.5 rounded-full" style={{ background: "rgba(109,94,252,0.12)", color: "var(--primary)", fontSize: "0.6875rem" }}>
                  v1.0
                </span>
              </div>
              <p style={{ fontSize: "0.875rem", color: "var(--muted-foreground)" }}>
                AI Event Planner · Powered by OpenClaw Gateway
              </p>
            </div>
          </div>
          <div className="mt-5 pt-5 flex items-center gap-2" style={{ borderTop: "1px solid var(--border)" }}>
            <Info size={14} color="var(--muted-foreground)" />
            <p style={{ fontSize: "0.8125rem", color: "var(--muted-foreground)" }}>
              Данные события — в браузере. История OpenClaw — локально в ~/.openclaw/
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
