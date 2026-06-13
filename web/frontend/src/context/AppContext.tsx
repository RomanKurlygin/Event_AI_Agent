import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { fetchHealth, type EventContext } from "../lib/api";

export interface EventData {
  name: string;
  type: string;
  date: string;
  time: string;
  location: string;
  guests: string;
  budget: string;
  format: string;
}

const DEFAULT_EVENT: EventData = {
  name: "Свадьба Ивана и Марии",
  type: "wedding",
  date: "2026-08-20",
  time: "16:00",
  location: "Москва, ресторан Панорама",
  guests: "100",
  budget: "1500000",
  format: "offline",
};

function loadEvent(): EventData {
  try {
    const raw = localStorage.getItem("eventgenie-event");
    if (raw) return { ...DEFAULT_EVENT, ...JSON.parse(raw) };
  } catch { /* ignore */ }
  return DEFAULT_EVENT;
}

function newSessionKey() {
  return `agent:main:web-ui-${Date.now()}`;
}

export function toEventContext(event: EventData): EventContext {
  const event_date =
    event.date && event.time
      ? new Date(`${event.date}T${event.time}`).toISOString()
      : event.date || undefined;
  return {
    event_name: event.name.trim(),
    event_type: event.type,
    event_date,
    location: event.location.trim(),
    expected_guests: Number(event.guests) || undefined,
    budget_limit: Number(event.budget) || undefined,
  };
}

interface AppContextValue {
  event: EventData;
  setEvent: (event: EventData) => void;
  saveEvent: (event: EventData) => void;
  eventContext: EventContext;
  sessionKey: string;
  newChat: () => void;
  gatewayOnline: boolean;
  gatewayUrl: string;
  checkHealth: () => Promise<boolean>;
  resultsRefreshKey: number;
  refreshResults: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [event, setEventState] = useState<EventData>(loadEvent);
  const [sessionKey, setSessionKey] = useState(() => {
    return localStorage.getItem("eventgenie-session-key") || newSessionKey();
  });
  const [gatewayOnline, setGatewayOnline] = useState(false);
  const [gatewayUrl, setGatewayUrl] = useState("http://127.0.0.1:18789");
  const [resultsRefreshKey, setResultsRefreshKey] = useState(0);

  const refreshResults = useCallback(() => {
    setResultsRefreshKey((k) => k + 1);
  }, []);

  const eventContext = useMemo(() => toEventContext(event), [event]);

  const saveEvent = useCallback((next: EventData) => {
    setEventState(next);
    localStorage.setItem("eventgenie-event", JSON.stringify(next));
  }, []);

  const checkHealth = useCallback(async () => {
    try {
      const data = await fetchHealth();
      setGatewayOnline(data.ok);
      setGatewayUrl(data.gateway);
      return data.ok;
    } catch {
      setGatewayOnline(false);
      return false;
    }
  }, []);

  const newChat = useCallback(() => {
    const key = newSessionKey();
    setSessionKey(key);
    localStorage.setItem("eventgenie-session-key", key);
  }, []);

  useEffect(() => {
    checkHealth();
    const id = setInterval(checkHealth, 15000);
    return () => clearInterval(id);
  }, [checkHealth]);

  const value = useMemo(
    () => ({
      event,
      setEvent: setEventState,
      saveEvent,
      eventContext,
      sessionKey,
      newChat,
      gatewayOnline,
      gatewayUrl,
      checkHealth,
      resultsRefreshKey,
      refreshResults,
    }),
    [event, saveEvent, eventContext, sessionKey, newChat, gatewayOnline, gatewayUrl, checkHealth, resultsRefreshKey, refreshResults]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
