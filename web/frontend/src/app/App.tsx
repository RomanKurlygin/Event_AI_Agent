import { useState } from "react";
import { MessageSquare, CalendarDays, FolderOpen, Settings } from "lucide-react";
import { ChatTab } from "./components/ChatTab";
import { EventTab } from "./components/EventTab";
import { ResultsTab } from "./components/ResultsTab";
import { SettingsTab } from "./components/SettingsTab";
import { useApp } from "../context/AppContext";

type TabId = "chat" | "event" | "results" | "settings";

function TabPanel({ active, children }: { active: boolean; children: React.ReactNode }) {
  return (
    <div
      className="flex flex-col flex-1 min-h-0 min-w-0 overflow-hidden"
      style={{ display: active ? "flex" : "none" }}
      aria-hidden={!active}
    >
      {children}
    </div>
  );
}

const TABS: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: "chat", label: "Чат", icon: <MessageSquare size={19} /> },
  { id: "event", label: "Событие", icon: <CalendarDays size={19} /> },
  { id: "results", label: "Результаты", icon: <FolderOpen size={19} /> },
  { id: "settings", label: "Настройки", icon: <Settings size={19} /> },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>("chat");
  const { gatewayOnline } = useApp();

  return (
    <div
      className="flex h-screen w-screen overflow-hidden"
      style={{ background: "#0F1117" }}
    >
      <aside
        className="flex flex-col w-60 flex-shrink-0 h-full sidebar-desktop"
        style={{ background: "var(--sidebar)" }}
      >
        <div className="px-5 pt-7 pb-6">
          <div className="flex items-center gap-3 mb-1">
            <span style={{ fontSize: "1.375rem" }}>🎉</span>
            <span
              style={{
                fontFamily: "'Instrument Serif', serif",
                fontSize: "1.1875rem",
                color: "#ffffff",
                fontWeight: 400,
              }}
            >
              EventGenie
            </span>
          </div>
          <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.35)", paddingLeft: "38px" }}>
            AI Event Planner
          </p>
        </div>

        <div style={{ height: "1px", background: "var(--sidebar-border)", margin: "0 20px" }} />

        <nav className="flex-1 px-3 py-4 space-y-1">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="w-full flex items-center gap-3 px-3 py-2.5 transition-all text-left"
                style={{
                  borderRadius: "10px",
                  background: isActive ? "rgba(109,94,252,0.15)" : "transparent",
                  color: isActive ? "#ffffff" : "rgba(255,255,255,0.5)",
                  fontSize: "0.9375rem",
                  border: "none",
                  cursor: "pointer",
                  position: "relative",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.06)";
                    (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.8)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                    (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.5)";
                  }
                }}
              >
                {isActive && (
                  <span
                    style={{
                      position: "absolute",
                      left: 0,
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: "3px",
                      height: "18px",
                      background: "#6D5EFC",
                      borderRadius: "0 3px 3px 0",
                    }}
                  />
                )}
                <span style={{ color: isActive ? "#6D5EFC" : "inherit" }}>{tab.icon}</span>
                {tab.label}
              </button>
            );
          })}
        </nav>

        <div className="px-5 pb-6">
          <div style={{ height: "1px", background: "var(--sidebar-border)", marginBottom: "16px" }} />
          <div className="flex items-center gap-2">
            <span
              style={{
                display: "inline-block",
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: gatewayOnline ? "#22C55E" : "#EF4444",
                boxShadow: gatewayOnline ? "0 0 6px #22C55E" : "0 0 6px #EF4444",
                flexShrink: 0,
              }}
            />
            <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.35)" }}>
              {gatewayOnline ? "Gateway онлайн" : "Gateway выключен"}
            </p>
          </div>
        </div>
      </aside>

      <main
        className="flex-1 flex flex-col min-w-0 h-full overflow-hidden"
        style={{ background: "var(--background)" }}
      >
        <TabPanel active={activeTab === "chat"}>
          <ChatTab />
        </TabPanel>
        <TabPanel active={activeTab === "event"}>
          <EventTab />
        </TabPanel>
        <TabPanel active={activeTab === "results"}>
          <ResultsTab active={activeTab === "results"} />
        </TabPanel>
        <TabPanel active={activeTab === "settings"}>
          <SettingsTab />
        </TabPanel>
      </main>

      <nav
        className="mobile-nav fixed bottom-0 left-0 right-0 border-t z-50"
        style={{
          display: "none",
          background: "var(--sidebar)",
          borderColor: "var(--sidebar-border)",
          padding: "8px 0 12px",
        }}
      >
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex-1 flex flex-col items-center gap-1 py-1"
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                color: isActive ? "#6D5EFC" : "rgba(255,255,255,0.4)",
                fontSize: "0.6875rem",
              }}
            >
              {tab.icon}
              {tab.label}
            </button>
          );
        })}
      </nav>

      <style>{`
        @media (max-width: 768px) {
          .sidebar-desktop { display: none !important; }
          .mobile-nav { display: flex !important; }
          main { padding-bottom: 72px; }
        }
      `}</style>
    </div>
  );
}
