export interface EventContext {
  event_name: string;
  event_type: string;
  event_date?: string;
  location: string;
  expected_guests?: number;
  budget_limit?: number;
}

export interface HealthResponse {
  ok: boolean;
  gateway: string;
  ui: string;
}

export interface ChatHistoryItem {
  role: "user" | "bot";
  content: string;
}

export interface ChatResponse {
  reply: string;
  sessionKey: string;
}

export interface SaveResultResponse {
  savedPath: string;
  type: "text" | "image";
}

export interface Artifact {
  id: string;
  path: string;
  type: "text" | "html" | "image";
  title: string;
  createdAt: string;
  url: string;
  preview?: string;
}

export async function fetchHealth(): Promise<HealthResponse> {
  const res = await fetch("/api/health");
  return res.json();
}

export async function sendChat(
  message: string,
  eventContext: EventContext | null,
  sessionKey: string,
  chatHistory: ChatHistoryItem[] = []
): Promise<ChatResponse> {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, eventContext, sessionKey, chatHistory }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Ошибка запроса");
  return data;
}

export async function fetchResults(): Promise<Artifact[]> {
  const res = await fetch("/api/results");
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Не удалось загрузить результаты");
  return data.items || [];
}

async function parseJsonResponse<T>(res: Response): Promise<T> {
  const text = await res.text();
  const isJson = res.headers.get("content-type")?.includes("application/json");
  if (!isJson) {
    throw new Error(
      "Сервер вернул не JSON. Перезапустите UI: .\\scripts\\start-ui.ps1"
    );
  }
  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error("Некорректный ответ сервера");
  }
}

export async function deleteResult(path: string): Promise<void> {
  const res = await fetch("/api/results/delete", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ path }),
  });
  const data = await parseJsonResponse<{ ok?: boolean; error?: string }>(res);
  if (!res.ok) throw new Error(data.error || "Не удалось удалить");
}

export async function saveResult(payload: {
  content: string;
  title?: string;
  userMessage?: string;
  eventContext: EventContext | null;
}): Promise<SaveResultResponse> {
  const res = await fetch("/api/results/save", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await parseJsonResponse<SaveResultResponse & { error?: string }>(res);
  if (!res.ok) throw new Error(data.error || "Не удалось сохранить");
  return data;
}
